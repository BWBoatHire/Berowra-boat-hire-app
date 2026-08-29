// ===== Saved Tracks: save, view, delete GPS routes (stored locally on this device) =====

const TRACKS_STORAGE_KEY = "savedTracks";
let savedTrackDisplayLayer = null;

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

function maybeSaveTrack(points, stats) {
  if (!points || points.length < 2) return;

  const wantsToSave = confirm("Would you like to save this route?");
  if (!wantsToSave) return;

  const defaultName = "Track " + new Date().toLocaleDateString('en-AU');
  const name = prompt("Name this route:", defaultName);
  if (!name) return;

  const tracks = getSavedTracks();
  tracks.push({
    id: Date.now(),
    name: name,
    date: new Date().toISOString(),
    points: points,
    distanceKm: stats ? stats.distanceKm : null,
    avgSpeedKn: stats ? stats.avgSpeedKn : null,
    topSpeedKn: stats ? stats.topSpeedKn : null,
    durationSeconds: stats ? stats.durationSeconds : null
  });
  setSavedTracks(tracks);
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
    const row = document.createElement("div");
    row.className = "my-track-row";
    row.innerHTML = `
      <div class="my-track-info">
        <div class="my-track-name">${track.name}</div>
        <div class="my-track-date">${dateStr} — ${distanceText}</div>
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

  if (savedTrackDisplayLayer) {
    map.removeLayer(savedTrackDisplayLayer);
  }

  savedTrackDisplayLayer = L.polyline(track.points, {
    color: "#8e44ad", weight: 4, opacity: 0.8
  }).addTo(map);

  map.fitBounds(savedTrackDisplayLayer.getBounds(), { padding: [30, 30] });
  closeMyTracksPage();
}

function clearSavedTrackFromMap() {
  if (savedTrackDisplayLayer) {
    map.removeLayer(savedTrackDisplayLayer);
    savedTrackDisplayLayer = null;
  }
}

function deleteSavedTrack(id) {
  const confirmed = confirm("Delete this saved route? This can't be undone.");
  if (!confirmed) return;

  let tracks = getSavedTracks();
  tracks = tracks.filter(t => t.id !== id);
  setSavedTracks(tracks);
  renderMyTracksList();
}
