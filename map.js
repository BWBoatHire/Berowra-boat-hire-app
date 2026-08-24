// Initialize the map, centered on Berowra Waters, NSW
const map = L.map('map').setView([-33.5988, 151.1207], 15);

// Add the free OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);