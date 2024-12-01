// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterContent(searchTerm);
    });
}

function filterContent(searchTerm) {
    const episodes = document.querySelectorAll('#episodes-grid > div');
    const shorts = document.querySelectorAll('#shorts-grid > div');

    filterElements(episodes, searchTerm);
    filterElements(shorts, searchTerm);
}

function filterElements(elements, searchTerm) {
    elements.forEach(item => {
        const text = item.textContent.toLowerCase();
        const routeType = item.dataset.type || '';
        const currentFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

        const matchesSearch = text.includes(searchTerm);
        const matchesFilter = currentFilter === 'all' || routeType === currentFilter;

        item.style.display = matchesSearch && matchesFilter ? '' : 'none';
    });
}
