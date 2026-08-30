// ===== Bottom sheet menu control =====
function toggleMenu() {
  const sheet = document.getElementById("bottom-sheet");
  sheet.classList.toggle("open");
}

// ===== Layers sheet control =====
function toggleLayersSheet() {
  const sheet = document.getElementById("layers-sheet");
  sheet.classList.toggle("open");
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
  if (checkbox.checked) {
    shallowWaterLayer.addTo(map);
    ensureShallowHatchPattern();
  } else {
    map.removeLayer(shallowWaterLayer);
  }
}

function toggleSpeedLayer() {
  const checkbox = document.getElementById("layer-speed");
  if (checkbox.checked) { speedZoneLayer.addTo(map); } else { map.removeLayer(speedZoneLayer); }
}

function toggleWashLayer() {
  const checkbox = document.getElementById("layer-wash");
  if (checkbox.checked) { washRestrictionLayer.addTo(map); } else { map.removeLayer(washRestrictionLayer); }
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
  alert("switchWeatherZone called with zone=" + zone);
  alert("dashboardEl found: " + (dashboardEl !== null) + ", bomEl found: " + (bomEl !== null));

function switchWeatherZone(zone) {
  const dashboardEl = document.getElementById("weather-dashboard-general");
  const bomEl = document.getElementById("weather-bom-embed");
  const backBtn = document.getElementById("weather-back-btn");

  if (zone === "general") {
    dashboardEl.style.display = "block";
    bomEl.style.display = "none";
    backBtn.style.display = "none";
    document.getElementById("weather-frame").src = "";
    loadWeatherDashboardAt(-33.5988, 151.1207, "weather-dashboard-general", "Berowra Waters");
  } else {
    dashboardEl.style.display = "none";
    bomEl.style.display = "flex";
    backBtn.style.display = "block";
    document.getElementById("weather-frame").src = weatherUrls[zone];
  }
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

// ===== Get Help (call / text location to marina) =====
const MARINA_MOBILE = "+61408197558"; // PLACEHOLDER - replace with real marina mobile once confirmed

function openHelpModal() {
  document.getElementById("help-modal").classList.add("open");
  document.getElementById("help-status").textContent = "";
}

function closeHelpModal() {
  document.getElementById("help-modal").classList.remove("open");
}

function callMarina() {
  window.location.href = "tel:" + MARINA_MOBILE;
}

function textLocation() {
  const statusEl = document.getElementById("help-status");
  statusEl.textContent = "Getting your location...";

  if (!navigator.geolocation) {
    statusEl.textContent = "Location isn't available on this device.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);
      const mapLink = `https://maps.google.com/?q=${lat},${lng}`;
      const body = encodeURIComponent(`I need help. My location: ${mapLink}`);
      window.location.href = `sms:${MARINA_MOBILE}&body=${body}`;
      statusEl.textContent = "";
    },
    function () {
      statusEl.textContent = "Couldn't get your location. Please call instead.";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}
