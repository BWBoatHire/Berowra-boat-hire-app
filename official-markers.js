// ===== OFFICIAL MARKER TYPES =====
// Sourced from Transport for NSW Open Data (Maritime NSW Aid to Navigation)
// Creative Commons Attribution licence — data © Transport for NSW
const officialMarkerTypes = {
  511: {
    color: "#cc0000",
    shape: "square",
    label: "Port-hand marker"
  },
  501: {
    color: "#2e8b2e",
    shape: "triangle",
    label: "Starboard-hand marker"
  },
  unconfirmed: {
    color: "#777777",
    shape: "circle",
    label: "Official marker (type to be confirmed)"
  }
};

// ===== OFFICIAL MARKERS =====
// Source: TfNSW Open Data - Maritime NSW Aid to Navigation
// Codes 301/302/311/572 not yet confirmed - update "type" once verified on-site
const officialMarkers = [
  { id: "CBC727", type: 511, lat: -33.5888666, lng: 151.1190164, typeCode: 511 },
  { id: "CBC730", type: 511, lat: -33.5947132, lng: 151.1229497, typeCode: 511 },
  { id: "CBC728", type: 501, lat: -33.5824999, lng: 151.1249664, typeCode: 501 },
  { id: "CBC729", type: 501, lat: -33.5911666, lng: 151.1172997, typeCode: 501 },

  { id: "CBC724", type: "unconfirmed", lat: -33.5707999, lng: 151.1338998, typeCode: 311 },
  { id: "CBC725", type: "unconfirmed", lat: -33.5780666, lng: 151.1315497, typeCode: 302 },
  { id: "CBC726", type: "unconfirmed", lat: -33.5824999, lng: 151.1249664, typeCode: 301 },
  { id: "OFFICIAL-572", type: "unconfirmed", lat: -33.5868655, lng: 151.1192334, typeCode: 572 }
];
