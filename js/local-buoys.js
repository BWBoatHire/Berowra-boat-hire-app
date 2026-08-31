// ===== Local Buoys (verified) =====
// Personally identified by the business owner - not part of the official
// TfNSW statewide public moorings dataset (which only covers Pink/Blue types).
// Red = Commercial, Blue = Emergency

const localBuoysData = [
  { id: "LB-001", type: "commercial", lat: -33.595333, lng: 151.122583, note: "Berowra Waters Inn - frequently used by seaplanes" },
  { id: "LB-002", type: "commercial", lat: -33.595778, lng: 151.122833, note: "Berowra Waters Inn - frequently used by seaplanes" },
  { id: "LB-003", type: "commercial", lat: -33.594278, lng: 151.121028, note: "Near Berowra Waters Inn" }
];

const localBuoyStyles = {
  commercial: { color: "#cc0000", label: "Commercial buoy" },
  emergency: { color: "#4169e1", label: "Emergency buoy (Police/Maritime)" }
};

const localBuoysLayer = L.layerGroup();

localBuoysData.forEach(function (b) {
  const style = localBuoyStyles[b.type];
  const icon = L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${style.color}; width:14px; height:14px; border-radius:50%; border:2px solid white;"></div>`,
    iconSize: [18, 18]
  });

  let popupContent = `<strong>${style.label}</strong>`;
  if (b.note) popupContent += `<br>${b.note}`;
  popupContent += `<br><em style="font-size:11px; color:#c07800;">Based on local knowledge, not yet cross-checked against official sources.</em>`;

  L.marker([b.lat, b.lng], { icon: icon })
    .bindPopup(popupContent)
    .addTo(localBuoysLayer);
});
