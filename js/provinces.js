// provinces.js
const provinces = {
    init: async function() {
        console.log('Initializing provinces module...');
        await this.loadProvinces();
        this.setupFilters();
    },

    loadProvinces: async function() {
        try {
            const episodes = await this.getVideoData();
            console.log('Loaded episodes:', episodes);
            const groupedVideos = this.groupByProvince(episodes);
            console.log('Grouped videos:', groupedVideos);
            this.renderProvinces(groupedVideos);
            this.updateStats(groupedVideos);
            this.createProvinceFilters(Object.keys(groupedVideos));
        } catch (error) {
            console.error('Error loading provinces:', error);
        }
    },

    groupByProvince: function(episodes) {
        return episodes.reduce((acc, video) => {
            // Handle both single province and multiple provinces
            const provinces = video.provinces || [video.province];
            provinces.forEach(province => {
                if (province) {
                    if (!acc[province]) {
                        acc[province] = [];
                    }
                    acc[province].push(video);
                }
            });
            return acc;
        }, {});
    },

    renderProvinces: function(groupedVideos) {
        const grid = document.getElementById('provinces-grid');
        if (!grid) {
            console.error('Provinces grid not found');
            return;
        }

        grid.innerHTML = ''; // Clear existing content
        
        // Sort provinces alphabetically
        Object.entries(groupedVideos)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([province, videos]) => {
                const section = this.createProvinceSection(province, videos);
                grid.appendChild(section);
            });
    },

    createProvinceSection: function(province, videos) {
        const template = document.getElementById('province-section-template');
        if (!template) {
            console.error('Province section template not found');
            return document.createElement('div');
        }

        const section = template.content.cloneNode(true);
        
        const title = section.querySelector('h4');
        title.textContent = province;
        
        const count = section.querySelector('span');
        count.textContent = `${videos.length} videos`;
        
        const grid = section.querySelector('.videos-grid');
        videos.forEach(video => {
            const card = this.createVideoCard(video);
            grid.appendChild(card);
        });
        
        return section.firstElementChild;
    },

    createVideoCard: function(video) {
        const template = document.getElementById('video-card-template');
        if (!template) {
            console.error('Video card template not found');
            return document.createElement('div');
        }

        const card = template.content.cloneNode(true);
        
        const link = card.querySelector('a');
        link.href = video.url;
        
        // Create thumbnail URL based on video URL
        const videoId = this.getVideoId(video.url);
        const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
        
        const img = card.querySelector('img');
        img.src = thumbnail;
        img.alt = video.title;
        
        const title = card.querySelector('h5');
        title.textContent = video.title;
        
        const dateElem = card.querySelector('p');
        if (video.date) {
            dateElem.textContent = new Date(video.date).toLocaleDateString();
        }
        
        return card.firstElementChild;
    },

    getVideoId: function(url) {
        if (!url) return null;
        const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/;
        const matches = url.match(regex);
        return matches && matches[1];
    },

    createProvinceFilters: function(provinces) {
        const filterContainer = document.getElementById('province-filters');
        if (!filterContainer) return;

        filterContainer.innerHTML = '<button class="px-4 py-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 filter-btn active" data-province="all">All Provinces</button>';
        
        provinces.sort().forEach(province => {
            const button = document.createElement('button');
            button.className = 'px-4 py-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 filter-btn';
            button.dataset.province = province;
            button.textContent = province;
            button.addEventListener('click', () => this.filterByProvince(province));
            filterContainer.appendChild(button);
        });
    },

    filterByProvince: function(province) {
        const buttons = document.querySelectorAll('#province-filters .filter-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.province === province);
        });

        const sections = document.querySelectorAll('.province-section');
        sections.forEach(section => {
            const sectionProvince = section.querySelector('h4').textContent;
            section.style.display = (province === 'all' || sectionProvince === province) ? 'block' : 'none';
        });
    },

    setupFilters: function() {
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                this.filterContent(searchTerm);
            });
        }
    },

    filterContent: function(searchTerm) {
        const sections = document.querySelectorAll('.province-section');
        sections.forEach(section => {
            const cards = section.querySelectorAll('.video-card');
            let visibleCards = 0;
            
            cards.forEach(card => {
                const title = card.querySelector('h5').textContent.toLowerCase();
                const isVisible = title.includes(searchTerm);
                card.style.display = isVisible ? 'block' : 'none';
                if (isVisible) visibleCards++;
            });
            
            section.style.display = visibleCards > 0 ? 'block' : 'none';
        });
    },

    updateStats: function(groupedVideos) {
        const provinceCount = document.getElementById('province-count');
        if (provinceCount) {
            provinceCount.textContent = Object.keys(groupedVideos).length;
        }
    },

    getVideoData: async function() {
        try {
            // Use the correct path for GitHub Pages
            const response = await fetch('/drivethru-thailand-index/episodes/index.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.episodes;
        } catch (error) {
            console.error('Error loading video data:', error);
            // Return empty array if file not found or other error
            return [];
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing provinces module...');
    provinces.init();
});