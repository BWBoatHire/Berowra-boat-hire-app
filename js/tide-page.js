// ===== Tide Timetable page logic =====

let tideViewDate = new Date(); // defaults to today

// ===== Moon phase calculation (pure astronomy, no data file needed) =====
// Based on a known reference new moon date and the average synodic month length.
function getMoonPhase(date) {
  const synodicMonth = 29.53058867; // average days between new moons
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14)); // 6 Jan 2000, 18:14 UTC
  const daysSince = (date.getTime() - knownNewMoon.getTime()) / 86400000;
  let phase = (daysSince % synodicMonth) / synodicMonth;
  if (phase < 0) phase += 1;

  if (phase < 0.03 || phase > 0.97) return { name: "New Moon", icon: "🌑" };
  if (phase < 0.22) return { name: "Waxing Crescent", icon: "🌒" };
  if (phase < 0.28) return { name: "First Quarter", icon: "🌓" };
  if (phase < 0.47) return { name: "Waxing Gibbous", icon: "🌔" };
  if (phase < 0.53) return { name: "Full Moon", icon: "🌕" };
  if (phase < 0.72) return { name: "Waning Gibbous", icon: "🌖" };
  if (phase < 0.78) return { name: "Last Quarter", icon: "🌗" };
  return { name: "Waning Crescent", icon: "🌘" };
}

// ===== Helpers =====
function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(date) {
  return date.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Cosine interpolation between two tide points - a reasonable approximation
// of the real tidal curve shape (smooth, not linear).
function interpolateHeight(t1, h1, t2, h2, t) {
  if (t2 <= t1) t2 += 1440; // handle wrap past midnight
  if (t < t1) t += 1440;
  const fraction = (t - t1) / (t2 - t1);
  const cosFraction = (1 - Math.cos(fraction * Math.PI)) / 2;
  return h1 + (h2 - h1) * cosFraction;
}

// Build a smooth series of points across a full day using this day's tides
// plus the last point of the previous day and first point of the next day,
// so the curve is continuous across midnight.
function buildDayCurve(dateKey) {
  const today = tideData[dateKey];
  if (!today) return null;

  const prevDate = new Date(dateKey);
  prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(dateKey);
  nextDate.setDate(nextDate.getDate() + 1);
  const prevData = tideData[formatDateKey(prevDate)];
  const nextData = tideData[formatDateKey(nextDate)];

  const points = [];
  if (prevData && prevData.length) {
    const last = prevData[prevData.length - 1];
    points.push({ t: timeToMinutes(last.time) - 1440, h: last.height });
  }
  today.forEach(e => points.push({ t: timeToMinutes(e.time), h: e.height }));
  if (nextData && nextData.length) {
    const first = nextData[0];
    points.push({ t: timeToMinutes(first.time) + 1440, h: first.height });
  }

  // Sample every 6 minutes for a smooth curve across the visible day (0-1440)
  const curve = [];
  for (let t = 0; t <= 1440; t += 6) {
    let seg = null;
    for (let i = 0; i < points.length - 1; i++) {
      if (t >= points[i].t && t <= points[i + 1].t) { seg = i; break; }
    }
    if (seg === null) continue;
    const h = interpolateHeight(points[seg].t, points[seg].h, points[seg + 1].t, points[seg + 1].h, t);
    curve.push({ t, h });
  }
  return curve;
}

// ===== Render the tide page for the currently selected date =====
function renderTidePage() {
  const dateKey = formatDateKey(tideViewDate);
  const dayTides = tideData[dateKey];
  const moon = getMoonPhase(tideViewDate);
  const isKingTide = kingTideDates.includes(dateKey);

  document.getElementById("tide-date-label").textContent = formatDisplayDate(tideViewDate);
  document.getElementById("tide-moon-icon").textContent = moon.icon;
  document.getElementById("tide-moon-label").textContent = moon.name;

  const kingBadge = document.getElementById("tide-king-badge");
  kingBadge.style.display = isKingTide ? "inline-block" : "none";

  const summaryEl = document.getElementById("tide-summary");
  summaryEl.innerHTML = "";
  if (dayTides) {
    dayTides.forEach(e => {
      const div = document.createElement("div");
      div.className = "tide-summary-row";
      div.innerHTML = `<span class="tide-summary-type">${e.type === 'high' ? '⬆ High' : '⬇ Low'}</span><span>${e.time}</span><span>${e.height.toFixed(2)} m</span>`;
      summaryEl.appendChild(div);
    });
  }

  const curve = buildDayCurve(dateKey);
  drawTideChart(curve, dayTides);
}

// ===== Draw the interactive SVG tide curve =====
function drawTideChart(curve, dayTides) {
  const svgContainer = document.getElementById("tide-chart-container");
  svgContainer.innerHTML = "";
  if (!curve || curve.length === 0) {
    svgContainer.innerHTML = "<p>No tide data available for this date.</p>";
    return;
  }

  const width = svgContainer.clientWidth || 350;
  const height = 220;
  const padding = { top: 20, right: 15, bottom: 30, left: 35 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const heights = curve.map(p => p.h);
  const minH = Math.min(...heights) - 0.1;
  const maxH = Math.max(...heights) + 0.1;

  function xForT(t) { return padding.left + (t / 1440) * plotWidth; }
  function yForH(h) { return padding.top + plotHeight - ((h - minH) / (maxH - minH)) * plotHeight; }

  let pathD = "M " + curve.map(p => `${xForT(p.t)},${yForH(p.h)}`).join(" L ");
  let areaD = pathD + ` L ${xForT(1440)},${padding.top + plotHeight} L ${xForT(0)},${padding.top + plotHeight} Z`;

  // Hour gridlines every 3 hours
  let gridLines = "";
  for (let h = 0; h <= 24; h += 3) {
    const x = xForT(h * 60);
    gridLines += `<line x1="${x}" y1="${padding.top}" x2="${x}" y2="${padding.top + plotHeight}" stroke="#e0e0e0" stroke-width="1"/>`;
    gridLines += `<text x="${x}" y="${height - 8}" font-size="10" text-anchor="middle" fill="#888">${h}:00</text>`;
  }

  // High/low markers
  let markers = "";
  if (dayTides) {
    dayTides.forEach(e => {
      const x = xForT(timeToMinutes(e.time));
      const y = yForH(e.height);
      markers += `<circle cx="${x}" cy="${y}" r="4" fill="${e.type === 'high' ? '#0b5394' : '#ff6600'}" stroke="white" stroke-width="1.5"/>`;
    });
  }

  svgContainer.innerHTML = `
    <svg id="tide-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${gridLines}
      <path d="${areaD}" fill="#0b5394" fill-opacity="0.15" stroke="none"/>
      <path d="${pathD}" fill="none" stroke="#0b5394" stroke-width="2"/>
      ${markers}
      <line id="tide-crosshair" x1="0" y1="${padding.top}" x2="0" y2="${padding.top + plotHeight}" stroke="#ff6600" stroke-width="1.5" style="display:none;"/>
      <circle id="tide-crosshair-dot" r="5" fill="#ff6600" stroke="white" stroke-width="1.5" style="display:none;"/>
    </svg>
    <div id="tide-readout" style="display:none;"></div>
  `;

  const svg = document.getElementById("tide-svg");
  const crosshair = document.getElementById("tide-crosshair");
  const dot = document.getElementById("tide-crosshair-dot");
  const readout = document.getElementById("tide-readout");

  function updateReadout(clientX) {
    const rect = svg.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(padding.left, Math.min(padding.left + plotWidth, x));
    const t = ((x - padding.left) / plotWidth) * 1440;

    // find nearest curve point
    let nearest = curve[0];
    let minDiff = Infinity;
    curve.forEach(p => {
      const diff = Math.abs(p.t - t);
      if (diff < minDiff) { minDiff = diff; nearest = p; }
    });

    const y = yForH(nearest.h);
    crosshair.setAttribute("x1", x); crosshair.setAttribute("x2", x);
    crosshair.style.display = "block";
    dot.setAttribute("cx", x); dot.setAttribute("cy", y);
    dot.style.display = "block";

    const hh = Math.floor(nearest.t / 60) % 24;
    const mm = Math.round(nearest.t % 60);
    readout.textContent = `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')} — ${nearest.h.toFixed(2)} m`;
    readout.style.display = "block";
    readout.style.left = Math.min(width - 120, Math.max(0, x - 50)) + "px";
  }

  svg.addEventListener("touchstart", e => { updateReadout(e.touches[0].clientX); }, { passive: true });
  svg.addEventListener("touchmove", e => { updateReadout(e.touches[0].clientX); }, { passive: true });
  svg.addEventListener("mousedown", e => { updateReadout(e.clientX); });
  svg.addEventListener("mousemove", e => { if (e.buttons === 1) updateReadout(e.clientX); });
}

// ===== Day navigation =====
function tidePrevDay() {
  tideViewDate.setDate(tideViewDate.getDate() - 1);
  renderTidePage();
}

function tideNextDay() {
  tideViewDate.setDate(tideViewDate.getDate() + 1);
  renderTidePage();
}

function tideToday() {
  tideViewDate = new Date();
  renderTidePage();
}

// ===== Open/close the full-screen tide page =====
function openTidePage() {
  tideViewDate = new Date();
  document.getElementById("tide-viewer").classList.add("open");
  toggleMenu();
  renderTidePage();
}

function closeTidePage() {
  document.getElementById("tide-viewer").classList.remove("open");
}
