// Main functionality for DriveThru Thailand Index

// Fetch and display content
async function fetchContent() {
    try {
        // Fetch episodes
        const episodesResponse = await fetch('episodes/index.json');
        const episodesData = await episodesResponse.json();
        displayFeatured(episodesData.episodes[0]);
        displayEpisodes(episodesData.episodes);
        document.getElementById('episode-count').textContent = episodesData.episodes.length;
        document.getElementById('province-count').textContent = episodesData.metadata.regions.length;

        // Fetch shorts
        const shortsResponse = await fetch('shorts/index.json');
        const shortsData = await shortsResponse.json();
        displayShorts(shortsData.shorts);
        document.getElementById('shorts-count').textContent = shortsData.shorts.length;
    } catch (error) {
        console.error('Error fetching content:', error);
    }
}

// Display featured episode
function displayFeatured(episode) {
    const featured = document.getElementById('featured');
    if (!episode) return;

    featured.innerHTML = `
        <div class="p-6">
            <div class="flex items-center mb-4">
                <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm mr-3">
                    EP.${episode.episodeNumber}
                </span>
                <h3 class="text-2xl font-bold">${episode.title || ''}</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    ${episode.route ? `
                    <p class="text-gray-600 mb-4">
                        <i class="fas fa-route mr-2"></i>
                        ${episode.route.start} → ${episode.route.end}
                    </p>` : ''}
                    <div class="space-y-2">
                        <div class="flex items-center">
                            <i class="fas fa-calendar-alt w-6 text-gray-400"></i>
                            <span>${episode.date || ''}</span>
                        </div>
                        ${episode.quality ? `
                        <div class="flex items-center">
                            <i class="fas fa-video w-6 text-gray-400"></i>
                            <span>${episode.quality}</span>
                        </div>` : ''}
                        ${episode.weather ? `
                        <div class="flex items-center">
                            <i class="fas fa-sun w-6 text-gray-400"></i>
                            <span>${episode.weather}</span>
                        </div>` : ''}
                    </div>
                    <a href="${episode.url}" target="_blank" rel="noopener noreferrer" 
                       class="inline-block mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <i class="fab fa-youtube mr-2"></i>Watch Episode
                    </a>
                </div>
                ${episode.pointsOfInterest ? `
                <div class="bg-gray-100 rounded-lg p-4">
                    <h4 class="font-bold mb-2">Route Highlights</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        ${episode.pointsOfInterest.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>` : ''}
            </div>
        </div>
    `;
}
