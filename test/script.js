
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#dataTable tbody');
    const searchInput = document.querySelector('#searchInput');
    const entriesSelect = document.querySelector('#entriesSelect');
    const columnToggles = document.getElementById('columnToggles');
  
    let data = [];
    let filteredData = [];
    let currentPage = 1;
    let entriesPerPage = 5;
  
    const columns = ['id', 'name', 'age', 'city'];
  
    // Fetch data (emulate async)
    function fetchData() {
      return new Promise(resolve => {
        setTimeout(() => {
          fetch('data.json')
            .then(response => response.json())
            .then(json => resolve(json));
        }, Math.random() * 1000);
      });
    }
  
    // Render Table
    function renderTable() {
      tableBody.innerHTML = '';
      const start = (currentPage - 1) * entriesPerPage;
      const end = start + entriesPerPage;
      const pageData = filteredData.slice(start, end);
  
      pageData.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
          const td = document.createElement('td');
          td.textContent = row[col];
          td.dataset.key = col;
          tr.appendChild(td);
        });
        tableBody.appendChild(tr);
      });
  
      updatePaginationInfo();
    }
  
    // Filtering
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      filteredData = data.filter(row =>
        columns.some(col => String(row[col]).toLowerCase().includes(query))
      );
      currentPage = 1;
      renderTable();
    });
  
    // Pagination
    entriesSelect.addEventListener('change', () => {
      entriesPerPage = parseInt(entriesSelect.value, 10);
      currentPage = 1;
      renderTable();
    });
  
    document.getElementById('prevPage').addEventListener('click', () => {
      if (currentPage > 1) currentPage--;
      renderTable();
    });
  
    document.getElementById('nextPage').addEventListener('click', () => {
      if (currentPage * entriesPerPage < filteredData.length) currentPage++;
      renderTable();
    });
  
    function updatePaginationInfo() {
      const pageInfo = document.getElementById('pageInfo');
      pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredData.length / entriesPerPage)}`;
      document.getElementById('prevPage').disabled = currentPage === 1;
      document.getElementById('nextPage').disabled = currentPage * entriesPerPage >= filteredData.length;
    }
  
    // Column Toggles
    function renderColumnToggles() {
      columns.forEach(col => {
        const button = document.createElement('button');
        button.textContent = `Toggle ${col}`;
        button.addEventListener('click', () => toggleColumn(col));
        columnToggles.appendChild(button);
      });
    }
  
    function toggleColumn(column) {
      document.querySelectorAll(`[data-key="${column}"]`).forEach(cell => {
        cell.style.display = cell.style.display === 'none' ? '' : 'none';
      });
    }
  
    // Initialize
    async function init() {
      data = await fetchData();
      filteredData = [...data];
      renderColumnToggles();
      renderTable();
    }
  
    init();
  });