// Basic provinces module
const provinces = {
    init: function() {
        console.log('Provinces module initialized');
        this.initializeProvinces();
    },
    
    initializeProvinces: async function() {
        const provincesGrid = document.getElementById('provinces-grid');
        if (!provincesGrid) return;
        
        const videos = await this.getVideoData();
        const provinces = this.groupByProvince(videos);
        this.renderProvinces(provinces);
    },

    groupByProvince: function(videos) {
        return videos.reduce((acc, video) => {
            if (video.province) {
                if (!acc[video.province]) {
                    acc[video.province] = [];
                }
                acc[video.province].push(video);
            }
            return acc;
        }, {});
    },

    getVideoData: async function() {
        try {
            const response = await fetch('data/videos.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading video data:', error);
            return [];
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    provinces.init();
});