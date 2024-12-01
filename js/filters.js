// Filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Apply filter
            const filterValue = this.dataset.filter;
            applyFilter(filterValue);
        });
    });
}

function applyFilter(filterValue) {
    const episodes = document.querySelectorAll('#episodes-grid > div');
    const searchTerm = document.getElementById('search')?.value.toLowerCase() || '';

    episodes.forEach(item => {
        const routeType = item.dataset.type || '';
        const text = item.textContent.toLowerCase();

        const matchesFilter = filterValue === 'all' || routeType === filterValue;
        const matchesSearch = text.includes(searchTerm);

        item.style.display = matchesFilter && matchesSearch ? '' : 'none';
    });
}
