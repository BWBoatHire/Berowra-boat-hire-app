// ===== Bottom sheet menu control =====
function toggleMenu() {
  const sheet = document.getElementById("bottom-sheet");
  sheet.classList.toggle("open");
}

// ===== Map Layers collapsible section =====
function toggleLayersSection() {
  const list = document.getElementById("layers-list");
  const chevron = document.getElementById("layers-chevron");
  list.classList.toggle("expanded");
  chevron.classList.toggle("expanded");
}

// ===== Full-screen PDF chart viewer =====
function openChartViewer() {
  document.getElementById("chart-viewer-frame").src = "nsw-maritime-chart.pdf";
  document.getElementById("chart-viewer").classList.add("open");
  toggleMenu();
}

function closeChartViewer() {
  document.getElementById("chart-viewer").classList.remove("open");
  document.getElementById("chart-viewer-frame").src = "";
}

// ===== Map layer toggles =====
function toggleNswNavLayer() {
  const checkbox = document.getElementById("layer-nsw-nav");
  if (checkbox.checked) { nswNavMarkersLayer.addTo(map); } else { map.removeLayer(nswNavMarkersLayer); }
}

function toggleWharfRampLayer() {
  const checkbox = document.getElementById("layer-wharf-ramp");
  if (checkbox.checked) { wharfRampLayer.addTo(map); } else { map.removeLayer(wharfRampLayer); }
}

function toggleSeaMarksLayer() {
  const checkbox = document.getElementById("layer-seamarks");
  if (checkbox.checked) { seaMarks.addTo(map); } else { map.removeLayer(seaMarks); }
}

function toggleMooringsLayer() {
  const checkbox = document.getElementById("layer-moorings");
  if (checkbox.checked) { publicMooringsLayer.addTo(map); } else { map.removeLayer(publicMooringsLayer); }
}

function toggleNswWharvesLayer() {
  const checkbox = document.getElementById("layer-nsw-wharves");
  if (checkbox.checked) { nswWharvesLayer.addTo(map); } else { map.removeLayer(nswWharvesLayer); }
}

function toggleNswRampsLayer() {
  const checkbox = document.getElementById("layer-nsw-ramps");
  if (checkbox.checked) { nswBoatRampsLayer.addTo(map); } else { map.removeLayer(nswBoatRampsLayer); }
}

function toggleShallowLayer() {
  const checkbox = document.getElementById("layer-shallow");
  if (checkbox.checked) { shallowWaterLayer.addTo(map); } else { map.removeLayer(shallowWaterLayer); }
}

function toggleSpeedLayer() {
  const checkbox = document.getElementById("layer-speed");
  if (checkbox.checked) { speedZoneLayer.addTo(map); } else { map.removeLayer(speedZoneLayer); }
}

function toggleShallowLayer() {
  const checkbox = document.getElementById("layer-shallow");
  if (checkbox.checked) {
    shallowWaterLayer.addTo(map);
    ensureShallowHatchPattern();
  } else {
    map.removeLayer(shallowWaterLayer);
  }
}


function toggleTowingLayer() {
  const checkbox = document.getElementById("layer-towing");
  if (checkbox.checked) { towingRestrictionLayer.addTo(map); } else { map.removeLayer(towingRestrictionLayer); }
}

// ===== Marine Weather viewer =====
const weatherUrls = {
  general: "https://www.bom.gov.au/places/nsw/terrey-hills/forecast/",
  sheltered: "https://www.bom.gov.au/nsw/forecasts/sydneywaters.shtml",
  open: "https://www.bom.gov.au/nsw/forecasts/sydneycoast.shtml"
};

function openWeatherPage() {
  switchWeatherZone('general');
  document.getElementById("weather-viewer").classList.add("open");
  toggleMenu();
}

function closeWeatherPage() {
  document.getElementById("weather-viewer").classList.remove("open");
  document.getElementById("weather-frame").src = "";
}

function switchWeatherZone(zone) {
  document.getElementById("weather-frame").src = weatherUrls[zone];
  ["general", "sheltered", "open"].forEach(z => {
    document.getElementById("weather-tab-" + z).classList.toggle("active", z === zone);
  });
}
// ===== Disclaimer & Terms =====
function openDisclaimerPage() {
  document.getElementById("disclaimer-viewer").classList.add("open");
  toggleMenu();
}

function closeDisclaimerPage() {
  document.getElementById("disclaimer-viewer").classList.remove("open");
}

function updateAcceptButton() {
  const checkbox = document.getElementById("disclaimer-checkbox");
  const btn = document.getElementById("disclaimer-accept-btn");
  btn.disabled = !checkbox.checked;
}

function acceptDisclaimer() {
  localStorage.setItem("disclaimerAccepted", "true");
  document.getElementById("disclaimer-modal").classList.remove("open");
}

function checkDisclaimerAccepted() {
  if (!localStorage.getItem("disclaimerAccepted")) {
    document.getElementById("disclaimer-modal").classList.add("open");
  }
}

document.addEventListener("DOMContentLoaded", checkDisclaimerAccepted);
