// ===== Bottom sheet menu control =====
function toggleMenu() {
  const sheet = document.getElementById("bottom-sheet");
  sheet.classList.toggle("open");
}

// ===== Full-screen PDF chart viewer =====
function openChartViewer() {
  document.getElementById("chart-viewer-frame").src = "nsw-maritime-chart.pdf";
  document.getElementById("chart-viewer").classList.add("open");
  toggleMenu(); // close the bottom sheet menu at the same time
}

function closeChartViewer() {
  document.getElementById("chart-viewer").classList.remove("open");
  document.getElementById("chart-viewer-frame").src = ""; // stop loading/free memory
}

// ===== Map layer toggles =====
function toggleOfficialLayer() {
  const checkbox = document.getElementById("layer-official");
  if (checkbox.checked) {
    officialMarkersLayer.addTo(map);
  } else {
    map.removeLayer(officialMarkersLayer);
  }
}
