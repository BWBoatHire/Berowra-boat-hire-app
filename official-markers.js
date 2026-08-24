// ===== OFFICIAL MARKER TYPES =====
// Sourced from Transport for NSW Open Data (Maritime NSW Aid to Navigation)
// Creative Commons Attribution licence - data (c) Transport for NSW
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
  water_quality: {
    color: "#e6c200",
    shape: "diamond",
    label: "Water quality monitoring buoy (Hornsby Shire Council)"
  },
  east_cardinal: {
    color: "#000000",
    shape: "cardinal_stripe",
    label: "East cardinal marker (safe water to the east)"
  },
  unconfirmed: {
    color: "#777777",
    shape: "circle",
    label: "Official marker (type to be confirmed)"
  }
};

// ===== OFFICIAL MARKERS =====
// Source: TfNSW Open Data - Maritime NSW Aid to Navigation
// Covers Berowra Waters down to Bar Island, Peats Bight and Marramarra Creek
const officialMarkers = [
  { id: "CBC727", type: 511, lat: -33.5888666, lng: 151.1190164, typeCode: 511 },
  { id: "CBC730", type: 511, lat: -33.5947132, lng: 151.1229497, typeCode: 511 },
  { id: "CBC728", type: 501, lat: -33.5726999, lng: 151.1308164, typeCode: 501 },
  { id: "CBC729", type: 501, lat: -33.5911666, lng: 151.1172997, typeCode: 501 },
  { id: "CBC724", type: 511, lat: -33.5707999, lng: 151.1338998, typeCode: 311 },
  { id: "CBC725", type: 501, lat: -33.5780666, lng: 151.1315497, typeCode: 302 },
  { id: "CBC726", type: 501, lat: -33.5824999, lng: 151.1249664, typeCode: 301 },
  { id: "OFFICIAL-572A", type: "water_quality", lat: -33.5868655, lng: 151.1192334, typeCode: 572 },
  { id: "OFFICIAL-572B", type: "water_quality", lat: -33.5287993, lng: 151.1436992, typeCode: 572 },

  { id: "CHR714", type: 501, lat: -33.5157831, lng: 151.1630164, typeCode: 301 },
  { id: "CBC719", type: 511, lat: -33.5374665, lng: 151.1479331, typeCode: 312 },
  { id: "CBC715", type: "east_cardinal", lat: -33.5265164, lng: 151.1553998, typeCode: 323 },
  { id: "CBC718", type: 501, lat: -33.5314148, lng: 151.1468647, typeCode: 301 },
  { id: "CBC717", type: 501, lat: -33.5293998, lng: 151.1493331, typeCode: 102 },
  { id: "CBC720", type: "east_cardinal", lat: -33.5405665, lng: 151.1445997, typeCode: 323 },
  { id: "CBC716", type: "east_cardinal", lat: -33.5249165, lng: 151.1541164, typeCode: 123 },
  { id: "CBC721", type: 501, lat: -33.5478498, lng: 151.1488997, typeCode: 301 },
  { id: "CBC723", type: 501, lat: -33.5677165, lng: 151.1494998, typeCode: 301 },
  { id: "CBC722", type: 511, lat: -33.5672332, lng: 151.1530831, typeCode: 311 }
];
