// ===== Wharves & Boat Ramps - toggleable layer =====
// Source: Transport for NSW Open Data (Maritime NSW Public Wharf, Boating Ramps)
// Creative Commons Attribution licence - data (c) Transport for NSW

const wharfRampTypes = {
  wharf: {
    color: "#8B4513",
    label: "Public Wharf, Jetty or Landing"
  },
  ramp: {
    color: "#006400",
    label: "Boat Ramp"
  }
};

const wharfRampMarkers = [
  { id: "WHARF-1", type: "wharf", lat: -33.5988535296, lng: 151.1252434928, description: "Public Wharf, Jetty or Landing - Berowra Waters" },
  { id: "WHARF-2", type: "wharf", lat: -33.5255507948, lng: 151.1534978723, description: "Public Wharf, Jetty or Landing" },
  { id: "WHARF-3", type: "wharf", lat: -33.5144231869, lng: 151.1655482957, description: "Public Wharf, Jetty or Landing" },

  {
    id: "RAMP-704",
    type: "ramp",
    lat: -33.5987799301,
    lng: 151.1200227661,
    description: "Berowra Waters Boat Ramp — 2 lanes, 70-100 trailer spaces. Facilities: BBQ, toilets, fuel, kiosk, lighting, fish cleaning table, pontoon/jetty nearby. Owned by Hornsby Shire Council."
  }
];

const wharfRampLayer = L.layerGroup();

wharfRampMarkers.forEach(function (m) {
  const t = wharfRampTypes[m.type];

  const icon = L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${t.color}; width:14px; height:14px; border-radius:50%; border:2px solid white;"></div>`,
    iconSize: [18, 18]
  });

  L.marker([m.lat, m.lng], { icon: icon })
    .addTo(wharfRampLayer)
    .bindPopup(`<strong>${t.label}</strong><br>${m.description}`);
});

// OFF by default - keeps the map clean until the customer wants this info
