const LAUNCHES_API_URL = 'https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10';

const launchesCountEl = document.getElementById('launches-count');
const launchesCountMobileEl = document.getElementById('launches-count-mobile');
const featuredLaunchEl = document.getElementById('featured-launch');
const launchesGridEl = document.getElementById('launches-grid');

async function fetchLaunches() {
  try {
    const response = await fetch(LAUNCHES_API_URL);
    const data = await response.json();
    
    const launches = data.results;
    if (!launches || launches.length === 0) return;
    const totalLaunches = data.count || launches.length;
    if (launchesCountEl) launchesCountEl.textContent = `${totalLaunches} Launches`;
    if (launchesCountMobileEl) launchesCountMobileEl.textContent = `${totalLaunches}`;
    renderFeaturedLaunch(launches[0]);
    renderLaunchesGrid(launches.slice(1));
  } catch (error) {
    console.error('Error fetching launches:', error);
  }
}
function renderFeaturedLaunch(launch) {
  if (!featuredLaunchEl) return;
  const missionName = launch.name || 'Unknown Mission';
  const providerName = launch.launch_service_provider?.name || 'Unknown Agency';
  const launchDate = launch.net ? new Date(launch.net).toLocaleDateString() : 'TBD';
  const launchImage = launch.image || 'images/placeholder-space.jpg';
  const padName = launch.pad?.location?.name || 'Launch Site TBD';
  featuredLaunchEl.innerHTML = `
    <div class="bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
      <div class="relative h-64 lg:h-80 rounded-2xl overflow-hidden">
        <img src="${launchImage}" alt="${missionName}" class="w-full h-full object-cover">
      </div>
      <div>
        <span class="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-full">Featured Mission</span>
        <h3 class="text-2xl font-bold text-white mt-3 mb-2">${missionName}</h3>
        <p class="text-slate-400 text-sm mb-4">Agency: <span class="text-slate-200 font-medium">${providerName}</span></p>
        <p class="text-slate-400 text-sm mb-4">Location: <span class="text-slate-200 font-medium">${padName}</span></p>
        <div class="flex items-center space-x-4 text-xs text-slate-300">
          <span>📅 Date: ${launchDate}</span>
        </div>
      </div>
    </div>
  `;
}
function renderLaunchesGrid(launchesList) {
  if (!launchesGridEl) return;
  launchesGridEl.innerHTML = '';
  launchesList.forEach(launch => {
    const missionName = launch.name || 'Unknown Mission';
    const providerName = launch.launch_service_provider?.name || 'Unknown Agency';
    const launchDate = launch.net ? new Date(launch.net).toLocaleDateString() : 'TBD';
    const launchImage = launch.image || 'https://images.unsplash.com/photo-1517976487537-5f512762a481?w=800';

    const card = document.createElement('div');
    card.className = "bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-500 transition-all";
    
    card.innerHTML = `
      <div class="relative h-48 bg-slate-900/50">
        <img src="${launchImage}" alt="${missionName}" class="w-full h-full object-cover">
        <div class="absolute top-3 right-3">
          <span class="px-3 py-1 bg-green-500/90 text-white text-xs backdrop-blur-sm rounded-full font-medium">Upcoming</span>
        </div>
      </div>
      <div class="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h4 class="text-lg font-bold text-white mb-1 line-clamp-1">${missionName}</h4>
          <p class="text-slate-400 text-xs mb-3">Provider: <span class="text-slate-200">${providerName}</span></p>
        </div>
        <div class="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <span>📅 ${launchDate}</span>
          <span class="text-purple-400 font-medium">Details &rarr;</span>
        </div>
      </div>
    `;
    launchesGridEl.appendChild(card);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  fetchLaunches();
});
const navLinks = document.querySelectorAll('aside nav a[data-section]');
const allSections = document.querySelectorAll('section[id]');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); 
    navLinks.forEach(l => {
      l.classList.remove('bg-blue-500/10', 'text-blue-500');
      l.classList.add('text-slate-300', 'hover:bg-slate-800');
    });
    link.classList.remove('text-slate-300', 'hover:bg-slate-800');
    link.classList.add('bg-blue-500/10', 'text-blue-500');
    const targetSectionId = link.getAttribute('data-section');
    allSections.forEach(sec => {
      if (sec.id === targetSectionId) {
        sec.classList.remove('hidden'); 
      } else {
        if (['today-in-space', 'launches', 'planets'].includes(sec.id)) {
          sec.classList.add('hidden');
        }
      }
    });
  });
});
