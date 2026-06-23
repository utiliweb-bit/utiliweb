const icons = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  61: "🌧️",
  71: "❄️",
  80: "🌧️",
  95: "⛈️"
};

window.addEventListener("load", () => {
  startApp();
});

// 🚀 START ROBUSTO (NUNCA TRAVA)
function startApp() {
  const timeout = setTimeout(() => {
    fallback();
  }, 6000);

  if (!navigator.geolocation) {
    clearTimeout(timeout);
    fallback();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      clearTimeout(timeout);
      loadWeather(pos.coords.latitude, pos.coords.longitude, "Sua localização");
    },
    () => {
      clearTimeout(timeout);
      fallback();
    },
    { timeout: 5000 }
  );
}

// 🔁 fallback garantido
function fallback() {
  loadWeather(35.6762, 139.6503, "Tóquio (padrão)");
}

// 🌦️ WEATHER CORE (BLINDADO)
async function loadWeather(lat, lon, label) {
  const locationEl = document.getElementById("location");
  const descEl = document.getElementById("desc");

  locationEl.innerText = "Carregando...";
  descEl.innerText = "Atualizando clima...";

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

    locationEl.innerText = label;

    document.getElementById("temp").innerText =
      Math.round(c.temperature_2m) + "°";

    document.getElementById("wind").innerText =
      c.wind_speed_10m ?? "--";

    document.getElementById("humidity").innerText =
      c.relative_humidity_2m ?? "--";

    document.getElementById("icon").innerText =
      icons[c.weather_code] || "🌡️";

    descEl.innerText = "Atualizado agora";

    setBackground(c.weather_code);

    renderForecast(data.daily);
    renderHourly(data.hourly);

  } catch (err) {
    console.error("Weather error:", err);

    locationEl.innerText = label;
    descEl.innerText = "Falha ao carregar clima";

    document.getElementById("temp").innerText = "--°";
    document.getElementById("wind").innerText = "--";
    document.getElementById("humidity").innerText = "--";
    document.getElementById("icon").innerText = "⚠️";

    // tenta recuperar sozinho
    setTimeout(() => {
      fallback();
    }, 4000);
  }
}

// 🎨 BACKGROUND DINÂMICO
function setBackground(code) {
  const bg = document.getElementById("bg");

  if (code === 0 || code === 1) {
    bg.style.background = "linear-gradient(180deg,#0f3d91,#1e6091,#52b69a)";
  } else if (code === 2 || code === 3) {
    bg.style.background = "linear-gradient(180deg,#2b2d42,#5c677d,#7d8597)";
  } else if (code >= 51 && code <= 82) {
    bg.style.background = "linear-gradient(180deg,#0f172a,#1e293b,#334155)";
  } else {
    bg.style.background = "linear-gradient(180deg,#020617,#0f172a,#1e293b)";
  }
}

// 📅 FORECAST (7 dias)
function renderForecast(daily) {
  const box = document.getElementById("forecast");
  box.innerHTML = "";

  if (!daily) return;

  for (let i = 0; i < daily.time.length; i++) {
    box.innerHTML += `
      <div class="day">
        <div>${new Date(daily.time[i]).getDate()}</div>
        <div>${icons[daily.weather_code[i]] || "⛅"}</div>
        <div>${Math.round(daily.temperature_2m_max[i])}°</div>
      </div>
    `;
  }
}

// ⏱️ HOURLY (48h)
function renderHourly(hourly) {
  const box = document.getElementById("hourly");
  box.innerHTML = "";

  if (!hourly) return;

  for (let i = 0; i < 48; i++) {
    const time = new Date(hourly.time[i]);
    const hour = time.getHours();

    box.innerHTML += `
      <div class="hour">
        <div>${hour}:00</div>
        <div>${icons[hourly.weather_code[i]] || "⛅"}</div>
        <div>${Math.round(hourly.temperature_2m[i])}°</div>
      </div>
    `;
  }
}

// 🔍 BUSCA CIDADE
async function searchCity() {
  const city = document.getElementById("cityInput").value;

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      alert("Cidade não encontrada");
      return;
    }

    const r = data.results[0];

    loadWeather(r.latitude, r.longitude, r.name);

  } catch (err) {
    alert("Erro na busca");
  }
}
