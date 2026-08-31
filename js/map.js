// Initialize the map, centered on Berowra Waters, NSW
const map = L.map('map').setView([-33.5988, 151.1207], 15);

// ===== Base map layers =====
const defaultBaseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 19
});

const satelliteBaseLayer = L.tileLayer('https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Imagery © NSW Department of Customer Service (Spatial Services), Creative Commons Attribution 4.0',
  maxZoom: 21
});


// Default view starts active
defaultBaseLayer.addTo(map);
let currentBaseLayer = defaultBaseLayer;

// OpenSeaMap nautical symbol layer - OFF by default (we use official NSW Maritime data instead)
const seaMarks = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
  attribution: '© OpenSeaMap contributors',
  maxZoom: 19
});

// Navigation markers layer is ON by default - core safety information
nswNavMarkersLayer.addTo(map);

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

// ===== Placeholder Fishing Spots layer (empty for now, content coming later) =====
const fishingSpotsLayer = L.layerGroup();

// ===== Map Type switching (Default / Satellite / Fishing) =====
function setMapType(type) {
  // Remove current base layer first
  map.removeLayer(currentBaseLayer);

  if (type === 'default' || type === 'fishing') {
    currentBaseLayer = defaultBaseLayer;
  } else if (type === 'satellite') {
    currentBaseLayer = satelliteBaseLayer;
  }
  currentBaseLayer.addTo(map);

  if (type === 'fishing') {
    // Turn off every overlay layer except fishing spots
    [nswNavMarkersLayer, wharfRampLayer, seaMarks, publicMooringsLayer, nswWharvesLayer,
     nswBoatRampsLayer, shallowWaterLayer, speedZoneLayer, washRestrictionLayer, towingRestrictionLayer]
      .forEach(layer => { if (map.hasLayer(layer)) map.removeLayer(layer); });

    // Uncheck their checkboxes to keep the UI in sync
    ["layer-nsw-nav","layer-wharf-ramp","layer-seamarks","layer-moorings","layer-nsw-wharves",
     "layer-nsw-ramps","layer-shallow","layer-speed","layer-wash","layer-towing"].forEach(id => {
      const cb = document.getElementById(id);
      if (cb) cb.checked = false;
    });

    fishingSpotsLayer.addTo(map);
  } else {
    // Leaving fishing view - remove the fishing layer again
    if (map.hasLayer(fishingSpotsLayer)) map.removeLayer(fishingSpotsLayer);
  }
}
// ===== Dynamic marker sizing based on zoom level =====
function updateMarkerZoomClass() {
  const z = map.getZoom();

  const mapEl = document.getElementById("map");
  mapEl.classList.remove("zoom-far", "zoom-mid");
  if (z <= 13) {
    mapEl.classList.add("zoom-far");
  } else if (z <= 15) {
    mapEl.classList.add("zoom-mid");
  }
}

map.on('zoomend', updateMarkerZoomClass);
map.whenReady(updateMarkerZoomClass);

// ===== Legend placeholder (rebuilt properly when Map Key feature is added) =====
const legend = document.getElementById("legend");
