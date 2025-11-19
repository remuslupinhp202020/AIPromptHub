document.addEventListener('DOMContentLoaded', () => {
    // --- PASTE YOUR PUBLISHED GOOGLE SHEET CSV URL HERE ---
    const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR_h2WFYYulfZrGrg7Jc3mCeQr-nNFE6LIdptxV1FxGa3u7E7X4BjazB8flYsOxJEMyVssWb7gOoqh5/pub?output=csv';
    // ----------------------------------------------------

    const tableBody = document.getElementById('prompts-tbody');
    const tableHeaders = document.querySelectorAll('.prompts-table th');
    let allPromptsData = [];
    let currentSort = { column: null, isAscending: true };

    function loadPromptsFromSheet() {
        fetch(googleSheetURL)
            .then(response => response.text())
            .then(csvText => {
                const rows = csvText.trim().split('\n').slice(1);
                allPromptsData = rows.map(row => {
                    const values = row.split(',');
                    // Corresponds to: Timestamp, Prompt Title, AI Model, Category/Tag, The Prompt
                    return {
                        promptTitle: values[1],
                        aiModel: values[2],
                        category: values[3],
                        thePrompt: values.slice(4).join(',') // Join remaining parts for prompts with commas
                    };
                }).filter(data => data.promptTitle);

                // Initial sort by title
                sortData('promptTitle', true);
            })
            .catch(error => {
                console.error("Error fetching sheet data:", error);
                tableBody.innerHTML = `<tr><td colspan="4">Sorry, there was an error loading the prompts.</td></tr>`;
            });
    }

    function sortData(column, isAscending) {
        allPromptsData.sort((a, b) => {
            const valA = a[column] ? a[column].toLowerCase() : '';
            const valB = b[column] ? b[column].toLowerCase() : '';
            if (valA < valB) return isAscending ? -1 : 1;
            if (valA > valB) return isAscending ? 1 : -1;
            return 0;
        });
        updateHeaderStyles(column, isAscending);
        renderTable();
    }
    
    function updateHeaderStyles(column, isAscending) {
        tableHeaders.forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
            if (header.dataset.column === column) {
                header.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');
            }
        });
    }

    function renderTable() {
        tableBody.innerHTML = '';
        allPromptsData.forEach(promptData => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Prompt Title">${promptData.promptTitle}</td>
                <td data-label="AI Model">${promptData.aiModel}</td>
                <td data-label="Category/Tag">${promptData.category}</td>
                <td data-label="The Prompt"><pre class="prompt-cell">${promptData.thePrompt}</pre></td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            const isAscending = (currentSort.column === column) ? !currentSort.isAscending : true;
            currentSort = { column, isAscending };
            sortData(column, isAscending);
        });
    });

    loadPromptsFromSheet();
});```

---

### **Step 3: Deploy Your Application**

1.  **Replace the Placeholders:**
    *   In `index.html`, replace `YOUR_GOOGLE_FORM_URL_HERE` and `YOUR_GOOGLE_DOC_URL_HERE`.
    *   In `script.js`, replace `YOUR_GOOGLE_SHEET_CSV_URL_HERE`.

2.  **Upload to GitHub:**
    *   Create a new repository on GitHub (e.g., "ai-prompt-hub").
    *   Upload your three finished files (`index.html`, `style.css`, `script.js`) to this repository.

3.  **Deploy on Netlify:**
    *   Log in to your Netlify account.
    *   Click "Add new site" > "Import an existing project".
    *   Connect to GitHub and select your "ai-prompt-hub" repository.
    *   Click "Deploy site".

Your AI Prompt Hub is now live and ready to use
