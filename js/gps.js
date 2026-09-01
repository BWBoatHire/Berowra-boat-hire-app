// ===== GPS tracking: follow mode, heading line, live stats, zone alerts =====
let userMarker = null;
let userCircle = null;
let hasCenteredOnUser = false;
let watchId = null;

let showingLocation = false;
let trackingRoute = false;
let breadcrumbTrail = null;
let breadcrumbPoints = [];

let headingLine = null;
let headingArrow = null;
let currentHeading = null;
let lastPosition = null;

let trackStartTime = null;
let trackTotalDistanceKm = 0;
let trackSpeedSamples = [];
let durationInterval = null;

const LOCATION_COLOR = "#ff6600";
const HEADING_LINE_COLOR = "#000000";

// ===== Geometry helpers =====
function toRad(deg) { return deg * Math.PI / 180; }
function toDeg(rad) { return rad * 180 / Math.PI; }

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function calcBearing(lat1, lon1, lat2, lon2) {
  const y = Math.sin(toRad(lon2-lon1)) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2-lon1));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function destinationPoint(lat, lon, bearingDeg, distanceM) {
  const R = 6371000;
  const brng = toRad(bearingDeg);
  const lat1 = toRad(lat), lon1 = toRad(lon);
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceM/R) + Math.cos(lat1) * Math.sin(distanceM/R) * Math.cos(brng));
  const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(distanceM/R) * Math.cos(lat1), Math.cos(distanceM/R) - Math.sin(lat1) * Math.sin(lat2));
  return [toDeg(lat2), toDeg(lon2)];
}

function degToCompass(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

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

  if (trackingRoute) {
    trackStartTime = Date.now();
    trackTotalDistanceKm = 0;
    trackSpeedSamples = [];
    document.getElementById("app-banner").classList.add("tracking");
    durationInterval = setInterval(updateDurationDisplay, 1000);
  } else {
    const pointsBeforeClear = breadcrumbPoints.slice();
    const avgSpeed = trackTotalDistanceKm > 0 && trackStartTime
      ? (trackTotalDistanceKm / ((Date.now() - trackStartTime) / 3600000)).toFixed(1)
      : "0.0";
    const topSpeed = trackSpeedSamples.length > 0
      ? Math.max(...trackSpeedSamples).toFixed(1)
      : "0.0";
    const durationSeconds = trackStartTime ? Math.round((Date.now() - trackStartTime) / 1000) : 0;

    if (breadcrumbTrail) { map.removeLayer(breadcrumbTrail); breadcrumbTrail = null; breadcrumbPoints = []; }
    if (headingLine) { map.removeLayer(headingLine); headingLine = null; }
    if (headingArrow) { map.removeLayer(headingArrow); headingArrow = null; }
    if (map.hasLayer(livePinsLayer)) { map.removeLayer(livePinsLayer); }
    livePinsLayer = L.layerGroup();
    document.getElementById("app-banner").classList.remove("tracking");
    document.getElementById("zone-signs-container").innerHTML = "";
    clearInterval(durationInterval);

    maybeSaveTrack(pointsBeforeClear, {
      distanceKm: trackTotalDistanceKm.toFixed(2),
      avgSpeedKn: (avgSpeed * 0.539957).toFixed(1),
      topSpeedKn: (topSpeed * 0.539957).toFixed(1),
      durationSeconds: durationSeconds
    });
  }

  ensureWatchRunning();
}

function updateDurationDisplay() {
  if (!trackStartTime) return;
  const seconds = Math.floor((Date.now() - trackStartTime) / 1000);
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  const el = document.getElementById("stat-duration");
  if (el) el.textContent = `${mins}:${secs}`;
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
    lastPosition = null;
    currentHeading = null;
  }
}

function updateHeadingLine(lat, lng) {
  if (currentHeading === null) return;

  const dest = destinationPoint(lat, lng, currentHeading, 300);

  if (!headingLine) {
    headingLine = L.polyline([[lat, lng], dest], {
      color: HEADING_LINE_COLOR, weight: 2, dashArray: "3, 7", opacity: 0.85
    }).addTo(map);
  } else {
    headingLine.setLatLngs([[lat, lng], dest]);
  }

  const arrowIcon = L.divIcon({
    className: "heading-arrow-icon",
    html: `<div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:13px solid ${HEADING_LINE_COLOR};transform:rotate(${currentHeading}deg);"></div>`,
    iconSize: [13, 13],
    iconAnchor: [6, 6]
  });

  if (!headingArrow) {
    headingArrow = L.marker(dest, { icon: arrowIcon, interactive: false }).addTo(map);
  } else {
    headingArrow.setLatLng(dest);
    headingArrow.setIcon(arrowIcon);
  }
}

function handlePosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  const accuracy = position.coords.accuracy;
  let heading = position.coords.heading;
  const speedMs = position.coords.speed;

  if ((heading === null || isNaN(heading)) && lastPosition) {
    const distKm = haversineDistance(lastPosition.lat, lastPosition.lng, lat, lng);
    if (distKm > 0.003) {
      heading = calcBearing(lastPosition.lat, lastPosition.lng, lat, lng);
    }
  }
  if (heading !== null && !isNaN(heading)) currentHeading = heading;

  if (trackingRoute) {
    if (lastPosition) {
      const segmentKm = haversineDistance(lastPosition.lat, lastPosition.lng, lat, lng);
      trackTotalDistanceKm += segmentKm;
    }

    const knots = (speedMs !== null && !isNaN(speedMs)) ? (speedMs * 1.94384) : 0;
    if (knots > 0) trackSpeedSamples.push(knots);

    breadcrumbPoints.push([lat, lng]);
    if (!breadcrumbTrail) {
      breadcrumbTrail = L.polyline(breadcrumbPoints, {
        color: LOCATION_COLOR, weight: 3, opacity: 0.7, dashArray: "6, 8"
      }).addTo(map);
    } else {
      breadcrumbTrail.setLatLngs(breadcrumbPoints);
    }

    updateHeadingLine(lat, lng);

    const dirText = currentHeading !== null ? degToCompass(currentHeading) : "--";
    const speedEl = document.getElementById("stat-speed");
    const dirEl = document.getElementById("stat-direction");
    const distEl = document.getElementById("stat-distance");
    if (speedEl) speedEl.textContent = knots.toFixed(1);
    if (dirEl) dirEl.textContent = dirText;
    if (distEl) distEl.textContent = trackTotalDistanceKm.toFixed(1);

    checkZoneAlerts(lat, lng);
  }

  if (showingLocation) {
    if (!userMarker) {
      userMarker = L.circleMarker([lat, lng], {
        radius: 8, fillColor: LOCATION_COLOR, fillOpacity: 1, color: "#ffffff", weight: 2
      }).addTo(map).bindPopup("You are here");

      userCircle = L.circle([lat, lng], {
        radius: accuracy, color: LOCATION_COLOR, fillColor: LOCATION_COLOR, fillOpacity: 0.1, weight: 1
      }).addTo(map);
    } else {
      userMarker.setLatLng([lat, lng]);
      userCircle.setLatLng([lat, lng]);
      userCircle.setRadius(accuracy);
    }

    if (!hasCenteredOnUser) {
      map.setView([lat, lng], 16);
      hasCenteredOnUser = true;
    } else {
      map.panTo([lat, lng], { animate: true });
    }
  }

  lastPosition = { lat, lng };
}

// ===== Zone crossing detection =====
function pointInPolygon(lat, lng, geoJsonGeometry) {
  // Simple point-in-polygon check (ray casting), works for Polygon/MultiPolygon
  function inRing(lat, lng, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      const intersect = ((yi > lat) !== (yj > lat)) &&
        (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  const coords = geoJsonGeometry.coordinates;
  if (geoJsonGeometry.type === "Polygon") {
    return inRing(lat, lng, coords[0]);
  } else if (geoJsonGeometry.type === "MultiPolygon") {
    return coords.some(poly => inRing(lat, lng, poly[0]));
  }
  return false;
}

function checkZoneAlerts(lat, lng) {
  const container = document.getElementById("zone-signs-container");
  let signsHtml = "";

  // Speed zones - show the actual limit for whichever zone you're in
  if (typeof speedZoneData !== "undefined") {
    const match = speedZoneData.features.find(f => pointInPolygon(lat, lng, f.geometry));
    if (match && match.properties.SPEED_LIMIT_KNOTS) {
      signsHtml += `<div class="zone-sign"><div class="zone-sign-number">${match.properties.SPEED_LIMIT_KNOTS}</div><div class="zone-sign-small">KNOTS</div></div>`;
    }
  }

  // No wash zones
  if (typeof washRestrictionData !== "undefined") {
    const inWash = washRestrictionData.features.some(f => pointInPolygon(lat, lng, f.geometry));
    if (inWash) {
      signsHtml += `<div class="zone-sign"><div class="zone-sign-small">NO<br>WASH</div></div>`;
    }
  }
// Shallow water
  if (typeof shallowWaterData !== "undefined") {
    const inShallow = shallowWaterData.features.some(f => pointInPolygon(lat, lng, f.geometry));
    if (inShallow) {
      signsHtml += `<div class="zone-sign"><div class="zone-sign-icon">〰️</div><div class="zone-sign-small">SHALLOW</div></div>`;
    }
  }

  container.innerHTML = signsHtml;
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