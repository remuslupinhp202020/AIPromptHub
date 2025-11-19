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
                    // This simple split works if you don't have commas in your fields
                    const values = row.split(',');
                    
                    // Corresponds to: Timestamp, Prompt Title, AI Model, Category/Tag, The Prompt (URL)
                    if (values.length < 5) return null;
                    
                    return {
                        promptTitle: values[1],
                        aiModel: values[2],
                        category: values[3],
                        thePrompt: values[4] // This is the URL
                    };
                }).filter(data => data && data.promptTitle);

                // Initial sort by title
                sortData('promptTitle', true);
            })
            .catch(error => {
                console.error("Error fetching sheet data:", error);
                tableBody.innerHTML = `<tr><td colspan="3">Sorry, there was an error loading the prompts.</td></tr>`;
            });
    }

    function sortData(column, isAscending) {
        allPromptsData.sort((a, b) => {
            // Special handling for sorting the title since it's now a link
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
            
            // ===================================================================
            // THE KEY CHANGE IS HERE:
            // The first `<td>` now contains an `<a>` tag that combines the title and the URL.
            // ===================================================================
            row.innerHTML = `
                <td data-label="Prompt Title">
                    <a href="${promptData.thePrompt}" target="_blank" rel="noopener noreferrer">${promptData.promptTitle}</a>
                </td>
                <td data-label="AI Model">${promptData.aiModel}</td>
                <td data-label="Category/Tag">${promptData.category}</td>
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
});
