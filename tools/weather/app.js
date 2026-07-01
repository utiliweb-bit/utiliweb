const icons = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "❄️", 73: "❄️", 75: "🌨️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  95: "⛈️", 96: "⛈️", 99: "⛈️"
};

const nightIcons = {
  0: "⭐", 1: "🌙", 2: "🌙", 3: "☁️",
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
  clear:    "linear-gradient(135deg, #0f2f5f 0%, #1a5a9f 50%, #0d3a6f 100%)",
  clearNight: "linear-gradient(135deg, #0a1a3a 0%, #1a2a5a 50%, #0d1f4a 100%)",
  cloudy:   "linear-gradient(135deg, #1a2a3e 0%, #2d3f5a 50%, #1f2f4a 100%)",
  cloudyNight: "linear-gradient(135deg, #0f1a2a 0%, #1a2a3a 50%, #0d1a2a 100%)",
  rain:     "linear-gradient(135deg, #0d1a2a 0%, #1a2a3a 50%, #0f1f2a 100%)",
  snow:     "linear-gradient(135deg, #1a2a3a 0%, #2a3a4a 50%, #1d2a3a 100%)",
  thunder:  "linear-gradient(135deg, #0a0d1a 0%, #151a2a 50%, #0e1220 100%)",
  default:  "linear-gradient(135deg, #0f1a2f 0%, #1a2a4f 50%, #0d1a3f 100%)"
};

window.addEventListener("load", () => startApp());

function startApp() {
  // Se o usuário já salvou uma cidade manualmente, usa ela direto
  const saved = getSavedLocation();
  if (saved) {
    loadWeather(saved.lat, saved.lon, saved.label);
    return;
  }

  const timeout = setTimeout(fallback, 6000);
  if (!navigator.geolocation) { clearTimeout(timeout); fallback(); return; }
  navigator.geolocation.getCurrentPosition(
    pos => { clearTimeout(timeout); loadWeather(pos.coords.latitude, pos.coords.longitude, "Sua localização"); },
    ()  => { clearTimeout(timeout); fallback(); },
    { timeout: 5000 }
  );
}

function getSavedLocation() {
  try {
    const raw = localStorage.getItem("savedLocation");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveLocation(lat, lon, label) {
  try {
    localStorage.setItem("savedLocation", JSON.stringify({ lat, lon, label }));
  } catch { /* localStorage indisponível, ignora */ }
}

async function fallback() {
  // Tenta localizar pelo IP (funciona sem permissão do usuário)
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        const label = [data.city, data.region].filter(Boolean).join(", ") || "Sua região";
        loadWeather(data.latitude, data.longitude, label);
        return;
      }
    }
  } catch (e) {
    // segue para o fallback fixo abaixo
  }
  // Último recurso, se tudo mais falhar
  loadWeather(35.6762, 139.6503, "Tóquio");
}

function isNight(hour) {
  return hour >= 20 || hour < 6;
}

function getWeatherIcon(code, hour) {
  if (isNight(hour)) {
    return nightIcons[code] || "🌙";
  }
  return icons[code] || "🌡️";
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
    const currentHour = now.getHours();

    // Remove shimmer
    document.getElementById("temp").classList.remove("shimmer");
    document.getElementById("location").classList.remove("shimmer");

    document.getElementById("location").innerText = label;
    document.getElementById("temp").innerText = Math.round(c.temperature_2m) + "°";
    document.getElementById("wind").innerText = c.wind_speed_10m ?? "—";
    document.getElementById("humidity").innerText = (c.relative_humidity_2m ?? "—") + "%";
    document.getElementById("icon").innerText = getWeatherIcon(code, currentHour);
    document.getElementById("desc").innerText = descriptions[code] || "Atualizado";
    document.getElementById("updatedBadge").innerText = "Atualizado " + timeStr;

    setBackground(code, currentHour);
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

function setBackground(code, hour) {
  const bg = document.getElementById("bg");
  let gradient = bgGradients.default;
  
  const isNightTime = isNight(hour);
  
  if (code === 0 || code === 1) {
    gradient = isNightTime ? bgGradients.clearNight : bgGradients.clear;
  } else if (code === 2 || code === 3) {
    gradient = isNightTime ? bgGradients.cloudyNight : bgGradients.cloudy;
  } else if (code >= 51 && code <= 82) {
    gradient = bgGradients.rain;
  } else if (code >= 71 && code <= 77) {
    gradient = bgGradients.snow;
  } else if (code >= 95) {
    gradient = bgGradients.thunder;
  }
  bg.style.background = gradient;
}

function renderHourly(hourly) {
  const box = document.getElementById("hourly");
  box.innerHTML = "";
  if (!hourly) return;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Encontrar o índice da hora atual
  let startIndex = 0;
  for (let i = 0; i < hourly.time.length; i++) {
    const d = new Date(hourly.time[i]);
    if (d.getHours() === currentHour) {
      startIndex = i;
      break;
    }
  }
  
  // Renderizar as próximas 48 horas a partir da hora atual
  for (let i = 0; i < 48; i++) {
    const idx = startIndex + i;
    if (idx >= hourly.time.length) break;
    
    const d = new Date(hourly.time[idx]);
    const h = d.getHours();
    const isNow = i === 0;
    
    box.innerHTML += `
      <div class="hour${isNow ? " now" : ""}">
        <div class="h-time">${isNow ? "Agora" : h + ":00"}</div>
        <div class="h-icon">${getWeatherIcon(hourly.weather_code[idx], h)}</div>
        <div class="h-temp">${Math.round(hourly.temperature_2m[idx])}°</div>
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
    saveLocation(r.latitude, r.longitude, label);
    document.getElementById("cityInput").value = "";
  } catch { alert("Erro na busca"); }
}

function clearSavedLocation() {
  try { localStorage.removeItem("savedLocation"); } catch {}
  startApp();
}
