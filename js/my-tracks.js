// ===== Saved Tracks: save, view, delete GPS routes (stored locally on this device) =====

const TRACKS_STORAGE_KEY = "savedTracks";
let savedTrackDisplayLayer = null;
let savedPinsDisplayLayer = null;
let currentTripPins = [];

function getSavedTracks() {
  try {
    return JSON.parse(localStorage.getItem(TRACKS_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function setSavedTracks(tracks) {
  localStorage.setItem(TRACKS_STORAGE_KEY, JSON.stringify(tracks));
}

// ===== Drop a pin at the current GPS position while tracking =====
function dropPin() {
  if (!lastPosition) {
    alert("Still finding your location — try again in a moment.");
    return;
  }
  const label = prompt("What's here? (e.g. 'Caught a bream', 'Nice picnic spot')");
  if (!label) return;

  currentTripPins.push({
    lat: lastPosition.lat,
    lng: lastPosition.lng,
    label: label,
    time: new Date().toISOString()
  });

  // Show it on the map immediately
  const icon = L.divIcon({
    className: "trip-pin-icon",
    html: `<div class="trip-pin-marker"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22]
  });
  L.marker([lastPosition.lat, lastPosition.lng], { icon: icon })
    .addTo(map)
    .bindPopup(`<strong>${label}</strong>`);
}

function maybeSaveTrack(points, stats) {
  if (!points || points.length < 2) {
    currentTripPins = [];
    return;
  }

  const wantsToSave = confirm("Would you like to save this route?");
  if (!wantsToSave) {
    currentTripPins = [];
    return;
  }

  const defaultName = "Track " + new Date().toLocaleDateString('en-AU');
  const name = prompt("Name this route:", defaultName);
  if (!name) {
    currentTripPins = [];
    return;
  }

  const tracks = getSavedTracks();
  tracks.push({
    id: Date.now(),
    name: name,
    date: new Date().toISOString(),
    points: points,
    pins: currentTripPins,
    distanceKm: stats ? stats.distanceKm : null,
    avgSpeedKn: stats ? stats.avgSpeedKn : null,
    topSpeedKn: stats ? stats.topSpeedKn : null,
    durationSeconds: stats ? stats.durationSeconds : null
  });
  setSavedTracks(tracks);
  currentTripPins = [];
}

function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function openMyTracksPage() {
  renderMyTracksList();
  document.getElementById("my-tracks-viewer").classList.add("open");
  toggleMenu();
}

function closeMyTracksPage() {
  document.getElementById("my-tracks-viewer").classList.remove("open");
}

function renderMyTracksList() {
  const listEl = document.getElementById("my-tracks-list");
  const tracks = getSavedTracks();

  if (tracks.length === 0) {
    listEl.innerHTML = "<p class='my-tracks-empty'>No saved routes yet. Turn on Track My Route, take a trip, then save it when you turn tracking off.</p>";
    return;
  }

  listEl.innerHTML = "";
  tracks.slice().reverse().forEach(track => {
    const dateStr = new Date(track.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
    const distanceText = track.distanceKm ? `${track.distanceKm} km` : "0.0 km";
    const pinCount = track.pins ? track.pins.length : 0;
    const pinText = pinCount > 0 ? ` · ${pinCount} pin${pinCount > 1 ? 's' : ''}` : "";
    const row = document.createElement("div");
    row.className = "my-track-row";
    row.innerHTML = `
      <div class="my-track-info">
        <div class="my-track-name">${track.name}</div>
        <div class="my-track-date">${dateStr} — ${distanceText}${pinText}</div>
      </div>
      <div class="my-track-actions">
        <button onclick="viewSavedTrack(${track.id})">View</button>
        <button onclick="deleteSavedTrack(${track.id})" class="my-track-delete">Delete</button>
      </div>
    `;
    listEl.appendChild(row);
  });
}

function viewSavedTrack(id) {
  const tracks = getSavedTracks();
  const track = tracks.find(t => t.id === id);
  if (!track) return;

  clearSavedTrackFromMap();

  savedTrackDisplayLayer = L.polyline(track.points, {
    color: "#8e44ad", weight: 4, opacity: 0.8
  }).addTo(map);

  savedPinsDisplayLayer = L.layerGroup();
  (track.pins || []).forEach(pin => {
    const icon = L.divIcon({
      className: "trip-pin-icon",
      html: `<div class="trip-pin-marker"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 22]
    });
    L.marker([pin.lat, pin.lng], { icon: icon })
      .addTo(savedPinsDisplayLayer)
      .bindPopup(`<strong>${pin.label}</strong>`);
  });
  savedPinsDisplayLayer.addTo(map);

  map.fitBounds(savedTrackDisplayLayer.getBounds(), { padding: [30, 30] });
  document.getElementById("clear-track-btn").style.display = "block";
  closeMyTracksPage();
}

function clearSavedTrackFromMap() {
  if (savedTrackDisplayLayer) {
    map.removeLayer(savedTrackDisplayLayer);
    savedTrackDisplayLayer = null;
  }
  if (savedPinsDisplayLayer) {
    map.removeLayer(savedPinsDisplayLayer);
    savedPinsDisplayLayer = null;
  }
  document.getElementById("clear-track-btn").style.display = "none";
}

function deleteSavedTrack(id) {
  const confirmed = confirm("Delete this saved route? This can't be undone.");
  if (!confirmed) return;

  let tracks = getSavedTracks();
  tracks = tracks.filter(t => t.id !== id);
  setSavedTracks(tracks);
  renderMyTracksList();
}
