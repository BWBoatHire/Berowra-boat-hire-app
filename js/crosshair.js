// ===== Map crosshair: shows on drag, identifies nearest marker, links to info/weather =====

let crosshairFadeTimer = null;
let crosshairNearestMarker = null;
let crosshairCurrentLatLng = null;

// ===== Show / hide with fade timer =====
function showCrosshair() {
  const el = document.getElementById("crosshair-container");
  el.classList.add("visible");
  clearTimeout(crosshairFadeTimer);
}

function scheduleCrosshairFade() {
  clearTimeout(crosshairFadeTimer);
  crosshairFadeTimer = setTimeout(() => {
    document.getElementById("crosshair-container").classList.remove("visible");
  }, 3000);
}

// ===== Find nearest visible marker to the map's exact center =====
function findNearestMarkerAtCenter() {
  const center = map.getCenter();
  crosshairCurrentLatLng = center;
  const centerPoint = map.latLngToContainerPoint(center);

  const candidateLayers = [];

  if (map.hasLayer(wharfRampLayer)) candidateLayers.push(wharfRampLayer);

  const clusterLayers = [nswNavMarkersLayer, publicMooringsLayer, nswWharvesLayer, nswBoatRampsLayer];

  let nearest = null;
  let nearestDist = 40;

  function checkMarker(marker, label, popupContent) {
    const pt = map.latLngToContainerPoint(marker.getLatLng());
    const dist = Math.hypot(pt.x - centerPoint.x, pt.y - centerPoint.y);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = { label, popupContent, marker };
    }
  }

  candidateLayers.forEach(layer => {
    layer.eachLayer(marker => {
      const popup = marker.getPopup();
      const content = popup ? popup.getContent() : "";
      const label = extractTitleFromPopup(content);
      checkMarker(marker, label, content);
    });
  });

  clusterLayers.forEach(layer => {
    if (!map.hasLayer(layer)) return;
    layer.eachLayer(marker => {
      const visibleParent = layer.getVisibleParent ? layer.getVisibleParent(marker) : marker;
      if (visibleParent !== marker) return;
      const popup = marker.getPopup();
      const content = popup ? popup.getContent() : "";
      const label = extractTitleFromPopup(content);
      checkMarker(marker, label, content);
    });
  });

  crosshairNearestMarker = nearest;

  const titleEl = document.getElementById("crosshair-title");
  if (nearest) {
    titleEl.textContent = nearest.label;
    titleEl.style.display = "block";
  } else {
    titleEl.style.display = "none";
  }
}

function extractTitleFromPopup(htmlContent) {
  const match = htmlContent.match(/<strong>(.*?)<\/strong>/);
  return match ? match[1].replace(/—.*/, '').trim() : "Marker";
}

// ===== Info button =====
function openCrosshairInfo() {
  const contentEl = document.getElementById("crosshair-info-content");
  if (crosshairNearestMarker) {
    contentEl.innerHTML = crosshairNearestMarker.popupContent;
  } else {
    contentEl.innerHTML = "<p>No marker at the crosshair right now. Pan the map so the center dot sits over a marker, then try again.</p>";
  }
  document.getElementById("crosshair-info-modal").classList.add("open");
}

function closeCrosshairInfo() {
  document.getElementById("crosshair-info-modal").classList.remove("open");
}

// ===== Weather button =====
async function openCrosshairWeather() {
  const latLng = crosshairCurrentLatLng || map.getCenter();
  document.getElementById("crosshair-weather-viewer").classList.add("open");
  const locationName = await getLocationName(latLng.lat, latLng.lng);
  loadWeatherDashboardAt(latLng.lat, latLng.lng, "weather-dashboard", locationName);
}


function closeCrosshairWeather() {
  document.getElementById("crosshair-weather-viewer").classList.remove("open");
}

async function getLocationName(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14`);
    const data = await res.json();
    return data.address ?
      (data.address.suburb || data.address.village || data.address.town || data.address.hamlet ||
       data.address.locality || data.name || "This location")
      : "This location";
  } catch (err) {
    return "This location";
  }
}


// ===== Hook into map drag events =====
map.on('movestart', function () {
  showCrosshair();
});

map.on('move', function () {
  findNearestMarkerAtCenter();
});

map.on('moveend', function () {
  findNearestMarkerAtCenter();
  scheduleCrosshairFade();
});
