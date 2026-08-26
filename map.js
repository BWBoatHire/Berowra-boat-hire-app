// Initialize the map, centered on Berowra Waters, NSW
const map = L.map('map').setView([-33.5988, 151.1207], 15);

// Add the free OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

// OpenSeaMap nautical symbol layer - OFF by default (we use official NSW Maritime data instead)
const seaMarks = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
  attribution: '© OpenSeaMap contributors',
  maxZoom: 19
});

// ===== Build a simple colored icon shape for each marker type =====
function createIcon(typeKey) {
  const t = markerTypes[typeKey];
  let shapeStyle = "";

  switch (t.shape) {
    case "square":
      shapeStyle = `background:${t.color}; width:16px; height:16px;`;
      break;
    case "triangle":
      shapeStyle = `width:0; height:0; border-left:9px solid transparent; border-right:9px solid transparent; border-bottom:16px solid ${t.color};`;
      break;
    case "circle":
      shapeStyle = `background:${t.color}; width:16px; height:16px; border-radius:50%;`;
      break;
    case "diamond":
      shapeStyle = `background:${t.color}; width:14px; height:14px; transform:rotate(45deg);`;
      break;
    default:
      shapeStyle = `background:${t.color}; width:16px; height:16px;`;
  }

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="${shapeStyle}"></div>`,
    iconSize: [18, 18]
  });
}

// ===== OFFICIAL NAVIGATION MARKERS - toggleable layer =====
const officialMarkersLayer = L.layerGroup();

officialMarkers.forEach(function (m) {
  const t = officialMarkerTypes[m.type];

  const shapeStyle = t.shape === "square" ? `background:${t.color}; width:16px; height:16px;`
    : t.shape === "triangle" ? `width:0; height:0; border-left:9px solid transparent; border-right:9px solid transparent; border-bottom:16px solid ${t.color};`
    : t.shape === "cardinal_stripe" ? `background: linear-gradient(to bottom, black 30%, #f2d600 30%, #f2d600 70%, black 70%); width:16px; height:16px;`
    : t.shape === "diamond" ? `background:${t.color}; width:14px; height:14px; transform:rotate(45deg);`
    : `background:${t.color}; width:14px; height:14px; border-radius:50%;`;

  const officialIcon = L.divIcon({
    className: "custom-marker",
    html: `<div style="${shapeStyle}"></div>`,
    iconSize: [18, 18]
  });

  L.marker([m.lat, m.lng], { icon: officialIcon })
    .addTo(officialMarkersLayer)
    .bindPopup(`<strong>${m.id} — ${t.label}</strong><br>Official NSW Maritime marker (code ${m.typeCode})`);
});

// ON by default - core safety information
officialMarkersLayer.addTo(map);

// ===== Helper: build correct shape styling for legend swatches =====
function getShapeStyle(t) {
  switch (t.shape) {
    case "square":
      return `background:${t.color}; width:14px; height:14px;`;
    case "triangle":
      return `width:0; height:0; border-left:8px solid transparent; border-right:8px solid transparent; border-bottom:14px solid ${t.color}; background:none;`;
    case "circle":
      return `background:${t.color}; width:14px; height:14px; border-radius:50%;`;
    case "diamond":
      return `background:${t.color}; width:12px; height:12px; transform:rotate(45deg);`;
    case "cardinal_stripe":
      return `background: linear-gradient(to bottom, black 30%, #f2d600 30%, #f2d600 70%, black 70%); width:14px; height:14px;`;
    default:
      return `background:${t.color}; width:14px; height:14px;`;
  }
}

// ===== Auto-build the legend from officialMarkerTypes (currently hidden, ready for later) =====
const legend = document.getElementById("legend");
Object.values(officialMarkerTypes).forEach(function (t) {
  const shapeStyle = getShapeStyle(t);
  legend.innerHTML += `<div class="legend-item"><span class="legend-swatch" style="${shapeStyle}"></span>${t.label}</div>`;
});
