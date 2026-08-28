// ===== MARKER TYPE DEFINITIONS =====
// Edit colors/shapes here — changes apply to every marker of that type.
const markerTypes = {
  port_marker: {
    color: "#cc0000",       // red
    shape: "square",
    label: "Port-hand marker"
  },
  starboard_marker: {
    color: "#2e8b2e",       // green
    shape: "triangle",
    label: "Starboard-hand marker"
  },
  private_buoy: {
    color: "#9b30ff",       // purple
    shape: "circle",
    label: "Private mooring buoy (Motor Yacht Club)"
  },
  special_marker: {
    color: "#1e5fbf",       // blue
    shape: "triangle",
    label: "Special / day marker"
  },
  water_quality_buoy: {
    color: "#e6c200",       // yellow
    shape: "diamond",
    label: "Water quality monitoring buoy"
  },
  restriction_zone: {
    color: "#555555",
    shape: "flag",
    label: "Restriction / caution area"
  }
};

// ===== INDIVIDUAL MARKERS =====
// Add, remove, or edit entries here. "type" must match a key above.
const localMarkers = [
  { id: "727", type: "port_marker", lat: -33.58880, lng: 151.11905, description: "Port-hand marker near Camp Point" },
  { id: "729", type: "starboard_marker", lat: -33.59100, lng: 151.11950, description: "Starboard-hand marker, Berowra Creek" },
  { id: "730", type: "port_marker", lat: -33.59542, lng: 151.12315, description: "Port-hand marker near Commuter Wharf" },
  { id: "741", type: "special_marker", lat: -33.59300, lng: 151.12050, description: "Special marker, known seaplane operating area" },

  { id: "735", type: "private_buoy", lat: -33.58700, lng: 151.12080, description: "Private mooring buoy — Motor Yacht Club" },
  { id: "736", type: "private_buoy", lat: -33.58730, lng: 151.12110, description: "Private mooring buoy — Motor Yacht Club" },
  { id: "737", type: "private_buoy", lat: -33.58760, lng: 151.12090, description: "Private mooring buoy — Motor Yacht Club" },
  { id: "738", type: "private_buoy", lat: -33.58680, lng: 151.12050, description: "Private mooring buoy — Motor Yacht Club" },

  { id: "water-monitor-1", type: "water_quality_buoy", lat: -33.58830, lng: 151.11850, description: "Water quality monitoring buoy" }
];

