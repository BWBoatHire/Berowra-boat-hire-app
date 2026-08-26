// Initialize the map, centered on Berowra Waters, NSW
const map = L.map('map').setView([-33.5988, 151.1207], 15);

// Add the free OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);
// Reusable function to create the shallow water hatch pattern once needed
function ensureShallowHatchPattern() {
  const svg = document.querySelector('.leaflet-overlay-pane svg') || document.querySelector('svg.leaflet-zoom-animated');
  if (svg && !svg.querySelector('#shallowHatch')) {
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.insertBefore(defs, svg.firstChild);
    }
    defs.innerHTML += `
      <pattern id="shallowHatch" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#ffffff"></rect>
        <line x1="0" y1="0" x2="0" y2="8" stroke="#1f78b4" stroke-width="2.5"></line>
      </pattern>
    `;
  }
}


// OpenSeaMap nautical symbol layer - OFF by default (we use official NSW Maritime data instead)
const seaMarks = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
  attribution: '© OpenSeaMap contributors',
  maxZoom: 19
});

// Navigation markers layer is ON by default - core safety information
nswNavMarkersLayer.addTo(map);
