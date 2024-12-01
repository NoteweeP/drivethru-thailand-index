// Province-specific functionality
const provinces = {
    initializeProvinces: async function() {
        const provincesGrid = document.getElementById('provinces-grid');
        if (!provincesGrid) return;

        // Group videos by province
        const provinceGroups = {};
        
        // Process episodes and shorts to group by province
        const episodes = await this.getVideoData();
        episodes.forEach(video => {
            if (video.province) {
                if (!provinceGroups[video.province]) {
                    provinceGroups[video.province] = [];
                }
                provinceGroups[video.province].push(video);
            }
        });

        // Create province sections
        Object.keys(provinceGroups).sort().forEach(province => {
            const videos = provinceGroups[province];
            const section = this.createProvinceSection(province, videos);
            provincesGrid.appendChild(section);
        });

        // Update province count
        const provinceCount = document.getElementById('province-count');
        if (provinceCount) {
            provinceCount.textContent = Object.keys(provinceGroups).length;
        }
    },

    createProvinceSection: function(province, videos) {
        const section = document.createElement('div');
        section.className = 'province-section bg-white rounded-lg shadow-lg p-6';
        
        // Create province header
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-4';
        header.innerHTML = `
            <h4 class="text-xl font-bold text-gray-800">${province}</h4>
            <span class="text-sm text-gray-500">${videos.length} videos</span>
        `;
        
        // Create video grid
        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
        
        // Add video cards
        videos.forEach(video => {
            const card = this.createVideoCard(video);
            grid.appendChild(card);
        });
        
        section.appendChild(header);
        section.appendChild(grid);
        return section;
    },

    createVideoCard: function(video) {
        const card = document.createElement('div');
        card.className = 'bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200';
        
        card.innerHTML = `
            <a href="${video.url}" target="_blank" class="block">
                <div class="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img src="${video.thumbnail}" alt="${video.title}" class="object-cover w-full h-full">
                </div>
                <div class="p-4">
                    <h5 class="font-medium text-gray-900 truncate">${video.title}</h5>
                    <p class="text-sm text-gray-500 mt-1">${video.date}</p>
                </div>
            </a>
        `;
        
        return card;
    },

    getVideoData: async function() {
        // This function should be implemented to fetch video data from your data source
        // For now, returning an empty array as placeholder
        return [];
    }
};

// Initialize provinces functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    provinces.initializeProvinces();
});