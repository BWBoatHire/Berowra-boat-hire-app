// ===== Custom Marine Weather Dashboard =====
// Uses OpenWeatherMap free tier (commercial use permitted, 1000 calls/day)

const OWM_API_KEY = "79216372c34f4c5bf55142fdd18fdd8c";
let lastForecastData = null;

function degToCompassShort(deg) {
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

function msToKnots(ms) {
  return (ms * 1.94384).toFixed(0);
}

function weatherIconEmoji(iconCode) {
  const map = {
    "01d": "☀️", "01n": "🌙",
    "02d": "🌤️", "02n": "☁️",
    "03d": "☁️", "03n": "☁️",
    "04d": "☁️", "04n": "☁️",
    "09d": "🌧️", "09n": "🌧️",
    "10d": "🌦️", "10n": "🌧️",
    "11d": "⛈️", "11n": "⛈️",
    "13d": "❄️", "13n": "❄️",
    "50d": "🌫️", "50n": "🌫️"
  };
  return map[iconCode] || "🌡️";
}



async function loadWeatherDashboardAt(lat, lon, containerId, locationLabel) {
  containerId = containerId || "weather-dashboard";
  const container = document.getElementById(containerId);
  container.innerHTML = "<p class='weather-loading'>Loading current conditions...</p>";
  window.currentLocationLabel = locationLabel || "Berowra Waters";

  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OWM_API_KEY}`;

    const [currentRes, forecastRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)]);
    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    if (current.cod !== 200) {
      container.innerHTML = `<p class='weather-error'>Couldn't load weather right now. Please try again shortly.</p>`;
      return;
    }

    lastForecastData = forecast;
    renderWeatherDashboard(current, forecast, containerId);
  } catch (err) {
    container.innerHTML = `<p class='weather-error'>Couldn't load weather right now. Check your connection and try again.</p>`;
  }
}

function renderWeatherDashboard(current, forecast, containerId) {
  containerId = containerId || "weather-dashboard";
  const container = document.getElementById(containerId);
  const isGeneralTab = containerId === "weather-dashboard-general";
  const locationLabel = window.currentLocationLabel || "Berowra Waters";
  const moon = getMoonPhase(new Date());

  const icon = weatherIconEmoji(current.weather[0].icon);
  const desc = current.weather[0].description;
  const descCapitalized = desc.charAt(0).toUpperCase() + desc.slice(1);
  const temp = Math.round(current.main.temp);
  const windKnots = msToKnots(current.wind.speed);
  const windDir = degToCompassShort(current.wind.deg);
  const pressure = current.main.pressure;
  const visibilityNm = (current.visibility / 1852).toFixed(1);
  const rainChance = forecast.list && forecast.list[0] && forecast.list[0].pop ? Math.round(forecast.list[0].pop * 100) : 0;

  const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
  const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

  const feelsLike = Math.round(current.main.feels_like);
  const moonShadowSide = moon.icon === "🌑" || moon.icon.includes("🌘") || moon.icon.includes("🌗") || moon.icon.includes("🌖") ? "left: 0; border-radius: 0 32px 32px 0;" : "right: 0; border-radius: 32px 0 0 32px;";
  const moonNameParts = moon.name.split(" ");
  const searchIconHtml = isGeneralTab ? `<div id="weather-search-icon-btn" onclick="toggleLocationSearch()"><i class="ti ti-search"></i></div>` : "";

  let html = `
    <div id="weather-hero">
            <div id="weather-hero-header">
        <div id="weather-location-line"><i class="ti ti-map-pin"></i><span>${locationLabel}</span></div>
        ${searchIconHtml}
      </div>

      <div id="weather-search-box">
        <input type="text" id="weather-search-input" placeholder="Search a location...">
        <button onclick="searchWeatherLocation()">Go</button>
      </div>


      <div id="weather-hero-top">
        <div>
          <div id="weather-desc">${descCapitalized}</div>
          <div id="weather-temp-big">${temp}°</div>
          <div id="weather-feels-like">Feels like ${feelsLike}°</div>
        </div>
        <div id="weather-icon-big">${icon}</div>
      </div>

      <div id="weather-compass-row">
        <div class="weather-mini-card">
          <div class="wind-compass">
            <span class="compass-n">N</span><span class="compass-s">S</span>
            <span class="compass-w">W</span><span class="compass-e">E</span>
            <div class="compass-needle" style="transform: translate(-50%,-100%) rotate(${current.wind.deg}deg)"></div>
          </div>
          <div class="mini-card-value">${windKnots} kts</div>
          <div class="mini-card-label">${windDir}</div>
        </div>
        <div class="weather-mini-card">
          <div class="moon-graphic"><div class="moon-shadow" style="${moonShadowSide}"></div></div>
          <div class="mini-card-value">${moonNameParts[0]}</div>
          <div class="mini-card-label">${moonNameParts.slice(1).join(" ")}</div>
        </div>
      </div>

      <div id="weather-hero-stats">
        <div class="weather-stat"><span class="weather-stat-label">Pressure</span><span class="weather-stat-value">${pressure} <small>mBar</small></span></div>
        <div class="weather-stat"><span class="weather-stat-label">Visibility</span><span class="weather-stat-value">${visibilityNm} <small>NM</small></span></div>
        <div class="weather-stat"><span class="weather-stat-label">Rain</span><span class="weather-stat-value">${rainChance} <small>%</small></span></div>
      </div>
    </div>

    <div id="weather-official-links">
      <button onclick="openOfficialWeatherTab('sheltered')">Sheltered Waters</button>
      <button onclick="openOfficialWeatherTab('open')">Open Waters</button>
    </div>

       <div id="weather-sun-row">
      <div class="weather-sun-item"><span>☀️</span><div><div>${sunrise}</div><div class="weather-sun-label">Sunrise</div></div></div>
      <div class="weather-sun-item"><span>🌇</span><div><div>${sunset}</div><div class="weather-sun-label">Sunset</div></div></div>
    </div>
 

    <h4 class="weather-section-title">Next 24 Hours</h4>
    <div id="weather-hourly-strip">
  `;


  forecast.list.slice(0, 8).forEach(entry => {
    const time = new Date(entry.dt * 1000).toLocaleTimeString('en-AU', { hour: 'numeric', hour12: true });
    const hIcon = weatherIconEmoji(entry.weather[0].icon);
    const hTemp = Math.round(entry.main.temp);
    const hWindKnots = msToKnots(entry.wind.speed);
    html += `
      <div class="weather-hour-col">
        <div class="weather-hour-time">${time}</div>
        <div class="weather-hour-icon">${hIcon}</div>
        <div class="weather-hour-temp">${hTemp}°</div>
        <div class="weather-hour-wind"><span style="display:inline-block; transform: rotate(${entry.wind.deg}deg)">↑</span> ${hWindKnots}kn</div>
      </div>
    `;
  });

  html += `</div>

    <h4 class="weather-section-title">5-Day Outlook <span class="weather-tap-hint">tap for detail</span></h4>
    <div id="weather-daily-strip">
  `;

  const dailyMap = {};
  forecast.list.forEach(entry => {
    const dateKey = new Date(entry.dt * 1000).toLocaleDateString('en-AU');
    if (!dailyMap[dateKey]) dailyMap[dateKey] = { temps: [], icons: [], dt: entry.dt, entries: [] };
    dailyMap[dateKey].temps.push(entry.main.temp);
    dailyMap[dateKey].icons.push(entry.weather[0].icon);
    dailyMap[dateKey].entries.push(entry);
  });

  const dailyKeys = Object.keys(dailyMap).slice(0, 5);
  dailyKeys.forEach((dateKey, index) => {
    const day = dailyMap[dateKey];
    const dayName = new Date(day.dt * 1000).toLocaleDateString('en-AU', { weekday: 'short' });
    const high = Math.round(Math.max(...day.temps));
    const low = Math.round(Math.min(...day.temps));
    const dIcon = weatherIconEmoji(day.icons[Math.floor(day.icons.length / 2)]);
    html += `
      <div class="weather-day-col" onclick="openDayDetail(${index})">
        <div class="weather-day-name">${dayName}</div>
        <div class="weather-day-icon">${dIcon}</div>
        <div class="weather-day-temps"><strong>${high}°</strong> <span>${low}°</span></div>
      </div>
    `;
  });

  html += `</div>
    <p class="weather-attribution">Weather data by <a href="https://openweathermap.org" target="_blank">OpenWeatherMap</a></p>
  `;

  container.innerHTML = html;
  window.currentDailyMap = dailyMap;
  window.currentDailyKeys = dailyKeys;
}

// ===== Location search (General Weather tab only) =====
function toggleLocationSearch() {
  document.getElementById("weather-search-box").classList.toggle("open");
}

async function searchWeatherLocation() {
  const query = document.getElementById("weather-search-input").value.trim();
  if (!query) return;

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=au`);
    const results = await res.json();
    if (results.length === 0) {
      alert("Couldn't find that location. Try a different search.");
      return;
    }
    const place = results[0];
    const shortName = place.display_name.split(",")[0];
    loadWeatherDashboardAt(parseFloat(place.lat), parseFloat(place.lon), "weather-dashboard-general", shortName);
  } catch (err) {
    alert("Couldn't search right now. Check your connection and try again.");
  }
}


// ===== Day detail modal =====
function openDayDetail(index) {
  const dateKey = window.currentDailyKeys[index];
  const day = window.currentDailyMap[dateKey];
  if (!day) return;

  const dayName = new Date(day.dt * 1000).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });
  const high = Math.round(Math.max(...day.temps));
  const low = Math.round(Math.min(...day.temps));

  let rows = "";
  day.entries.forEach(entry => {
    const time = new Date(entry.dt * 1000).toLocaleTimeString('en-AU', { hour: 'numeric', hour12: true });
    const icon = weatherIconEmoji(entry.weather[0].icon);
    const temp = Math.round(entry.main.temp);
    const desc = entry.weather[0].description;
    const windKnots = msToKnots(entry.wind.speed);
    const windDir = degToCompassShort(entry.wind.deg);
    rows += `
      <div class="day-detail-row">
        <span class="day-detail-time">${time}</span>
        <span class="day-detail-icon">${icon}</span>
        <span class="day-detail-temp">${temp}°</span>
        <span class="day-detail-desc">${desc}</span>
        <span class="day-detail-wind"><span style="display:inline-block; transform: rotate(${entry.wind.deg}deg)">↑</span> ${windKnots}kn ${windDir}</span>
      </div>
    `;
  });

  document.getElementById("weather-day-modal-content").innerHTML = `
    <h3>${dayName}</h3>
    <p class="day-detail-highlow"><strong>${high}°</strong> <span>${low}°</span></p>
    <div class="day-detail-list">${rows}</div>
  `;
  document.getElementById("weather-day-modal").classList.add("open");
}

function closeDayDetail() {
  document.getElementById("weather-day-modal").classList.remove("open");
}

// ===== Links to the existing official BOM tabs already in the main Menu =====
function openOfficialWeatherTab(zone) {
  // Close whichever weather view is currently open (dashboard could be in the
  // crosshair viewer or reached some other way), then open the official tab viewer.
  const crosshairViewer = document.getElementById("crosshair-weather-viewer");
  if (crosshairViewer) crosshairViewer.classList.remove("open");

  openWeatherPage();
  switchWeatherZone(zone);
}
