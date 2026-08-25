// ===== GPS tracking: independent "Show Location" and "Track Route" toggles =====
let userMarker = null;
let userCircle = null;
let hasCenteredOnUser = false;
let watchId = null;

let showingLocation = false;
let trackingRoute = false;
let breadcrumbTrail = null;
let breadcrumbPoints = [];

const LOCATION_COLOR = "#ff6600"; // orange - high visibility over blue water

function toggleShowLocation() {
  showingLocation = !showingLocation;
  document.getElementById("locate-btn").classList.toggle("active", showingLocation);

  if (!showingLocation && userMarker) {
    map.removeLayer(userMarker);
    map.removeLayer(userCircle);
    userMarker = null;
    userCircle = null;
    hasCenteredOnUser = false;
  }

  ensureWatchRunning();
}

function toggleTrackRoute() {
  trackingRoute = !trackingRoute;
  document.getElementById("track-btn").classList.toggle("active", trackingRoute);

  if (!trackingRoute && breadcrumbTrail) {
    map.removeLayer(breadcrumbTrail);
    breadcrumbTrail = null;
    breadcrumbPoints = [];
  }

  ensureWatchRunning();
}

function ensureWatchRunning() {
  if ((showingLocation || trackingRoute) && watchId === null) {
    if (!navigator.geolocation) {
      alert("This browser doesn't support location tracking. Please try a different browser, like Safari or Chrome.");
      showingLocation = false;
      trackingRoute = false;
      document.getElementById("locate-btn").classList.remove("active");
      document.getElementById("track-btn").classList.remove("active");
      return;
    }
    watchId = navigator.geolocation.watchPosition(handlePosition, showLocationError, { enableHighAccuracy: true });
  } else if (!showingLocation && !trackingRoute && watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    hasCenteredOnUser = false;
  }
}

function handlePosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  if (trackingRoute) {
    breadcrumbPoints.push([lat, lng]);
    if (!breadcrumbTrail) {
      breadcrumbTrail = L.polyline(breadcrumbPoints, {
        color: LOCATION_COLOR,
        weight: 3,
        opacity: 0.7,
        dashArray: "6, 8"
      }).addTo(map);
    } else {
      breadcrumbTrail.setLatLngs(breadcrumbPoints);
    }
  }

  if (showingLocation) {
    if (!userMarker) {
      userMarker = L.circleMarker([lat, lng], {
        radius: 8,
        fillColor: LOCATION_COLOR,
        fillOpacity: 1,
        color: "#ffffff",
        weight: 2
      }).addTo(map).bindPopup("You are here");

      userCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: LOCATION_COLOR,
        fillColor: LOCATION_COLOR,
        fillOpacity: 0.1,
        weight: 1
      }).addTo(map);
    } else {
      userMarker.setLatLng([lat, lng]);
      userCircle.setLatLng([lat, lng]);
      userCircle.setRadius(accuracy);
    }

    if (!hasCenteredOnUser) {
      map.setView([lat, lng], 16);
      hasCenteredOnUser = true;
    }
  }
}

// ===== Friendly, actionable error messages =====
function showLocationError(error) {
  let message = "";

  if (error.code === error.PERMISSION_DENIED) {
    message =
      "Location access is turned off for this app.\n\n" +
      "On iPhone/iPad:\n" +
      "1. Open Settings → Privacy & Security → Location Services → make sure it's ON\n" +
      "2. Scroll down to Safari Websites → set to 'While Using the App'\n" +
      "3. Come back here and tap the button again\n\n" +
      "On Android:\n" +
      "1. Open Settings → Location → make sure it's ON\n" +
      "2. Open Chrome → Settings → Site Settings → Location → allow for this site\n\n" +
      "You can still use the map and view all markers without this — location just adds your position and route on top.";
  } else if (error.code === error.POSITION_UNAVAILABLE) {
    message = "Your device couldn't determine your location right now. This can happen with a weak GPS signal — try moving to an open area and try again.";
  } else if (error.code === error.TIMEOUT) {
    message = "Finding your location took too long. Please check your signal and try again.";
  } else {
    message = "Something went wrong getting your location. You can still use the map normally without it.";
  }

  alert(message);
}
