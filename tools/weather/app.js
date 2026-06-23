const icons = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "❄️", 73: "❄️", 75: "🌨️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️"
};

const descriptions = {
  0: "Céu limpo", 1: "Principalmente limpo", 2: "Parcialmente nublado", 3: "Nublado",
  45: "Neblina", 48: "Neblina com geada",
  51: "Garoa leve", 53: "Garoa moderada", 55: "Garoa intensa",
  61: "Chuva leve", 63: "Chuva moderada", 65: "Chuva forte",
  71: "Neve leve", 73: "Neve moderada", 75: "Neve intensa",
  80: "Pancadas de chuva", 81: "Chuva forte", 82: "Tempestade",
  95: "Trovoada", 96: "Trovoada com granizo", 99: "Trovoada intensa"
};

const bgGradients = {
  clear:    "linear-gradient(160deg, #0b1d3a 0%, #1a4070 50%, #0e2a50 100%)",
  cloudy:   "linear-gradient(160deg, #1a1d2e 0%, #2c3050 50%, #1f2540 100%)",
  rain:     "linear-gradient(160deg, #0d1520 0%, #162035 50%, #0f1c30 100%)",
  snow:     "linear-gradient(160deg, #1a2030 0%, #2a3550 50%, #1d2a45 100%)",
  thunder:  "linear-gradient(160deg, #0a0d18 0%, #141828 50%, #0e1220 100%)",
  default:  "linear-gradient(160deg, #0b1220 0%, #0f1f3d 50%, #0d2a1f 100%)"
};

window.addEventListener("load", () => startApp());

function startApp() {
  const timeout = setTimeout(fallback, 6000);
  if (!navigator.geolocation) { clearTimeout(timeout); fallback(); return; }
  navigator.geolocation.getCurrentPosition(
    pos => { clearTimeout(timeout); loadWeather(pos.coords.latitude, pos.coords.longitude, "Sua localização"); },
    ()  => { clearTimeout(timeout); fallback(); },
    { timeout: 5000 }
  );
}

function fallback() {
  loadWeather(35.6762, 139.6503, "Tóquio");
}

async function loadWeather(lat, lon, label) {
  document.getElementById("location").innerText = "Carregando...";
  document.getElementById("desc").innerText = "Atualizando...";

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code` +
      `&hourly=temperature_2m,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
      `&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    if (!data.current) throw new Error("Invalid data");

    const c = data.current;
    const code = c.weather_code;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    // Remove shimmer
    document.getElementById("temp").classList.remove("shimmer");
    document.getElementById("location").classList.remove("shimmer");

    document.getElementById("location").innerText = label;
    document.getElementById("temp").innerText = Math.round(c.temperature_2m) + "°";
    document.getElementById("wind").innerText = c.wind_speed_10m ?? "—";
    document.getElementById("humidity").innerText = (c.relative_humidity_2m ?? "—") + "%";
    document.getElementById("icon").innerText = icons[code] || "🌡️";
    document.getElementById("desc").innerText = descriptions[code] || "Atualizado";
    document.getElementById("updatedBadge").innerText = "Atualizado " + timeStr;

    setBackground(code);
    renderHourly(data.hourly);
    renderForecast(data.daily);

  } catch (err) {
    console.error("Weather error:", err);
    document.getElementById("location").innerText = label;
    document.getElementById("desc").innerText = "Falha ao carregar";
    document.getElementById("temp").innerText = "—";
    document.getElementById("wind").innerText = "—";
    document.getElementById("humidity").innerText = "—";
    document.getElementById("icon").innerText = "⚠️";
    setTimeout(fallback, 5000);
  }
}

function setBackground(code) {
  const bg = document.getElementById("bg");
  let gradient = bgGradients.default;
  if (code === 0 || code === 1) gradient = bgGradients.clear;
  else if (code === 2 || code === 3) gradient = bgGradients.cloudy;
  else if (code >= 51 && code <= 82) gradient = bgGradients.rain;
  else if (code >= 71 && code <= 77) gradient = bgGradients.snow;
  else if (code >= 95) gradient = bgGradients.thunder;
  bg.style.background = gradient;
}

function renderHourly(hourly) {
  const box = document.getElementById("hourly");
  box.innerHTML = "";
  if (!hourly) return;
  const nowH = new Date().getHours();
  for (let i = 0; i < 48; i++) {
    const d = new Date(hourly.time[i]);
    const h = d.getHours();
    const isNow = i === 0 || (i < 3 && h === nowH);
    box.innerHTML += `
      <div class="hour${isNow ? " now" : ""}">
        <div class="h-time">${isNow ? "Agora" : h + ":00"}</div>
        <div class="h-icon">${icons[hourly.weather_code[i]] || "⛅"}</div>
        <div class="h-temp">${Math.round(hourly.temperature_2m[i])}°</div>
      </div>`;
  }
}

function renderForecast(daily) {
  const box = document.getElementById("forecast");
  box.innerHTML = "";
  if (!daily) return;
  const days = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  for (let i = 0; i < daily.time.length; i++) {
    const d = new Date(daily.time[i]);
    const label = i === 0 ? "Hoje" : i === 1 ? "Amanhã" : days[d.getDay()];
    box.innerHTML += `
      <div class="day">
        <div class="d-date">${label}</div>
        <div class="d-icon">${icons[daily.weather_code[i]] || "⛅"}</div>
        <div class="d-max">${Math.round(daily.temperature_2m_max[i])}°</div>
        <div class="d-min">${Math.round(daily.temperature_2m_min[i])}°</div>
      </div>`;
  }
}

async function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const data = await res.json();
    if (!data.results?.length) { alert("Cidade não encontrada"); return; }
    const r = data.results[0];
    const label = [r.name, r.admin1, r.country].filter(Boolean).join(", ");
    loadWeather(r.latitude, r.longitude, label);
    document.getElementById("cityInput").value = "";
  } catch { alert("Erro na busca"); }
}
