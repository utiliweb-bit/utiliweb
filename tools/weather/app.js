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

let particles = [];

window.addEventListener("load", () => startApp());

// 🚀 START SEGURO
function startApp() {
  if (!navigator.geolocation) return fallback();

  navigator.geolocation.getCurrentPosition(
    (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude, "Sua localização"),
    () => fallback(),
    { timeout: 8000 }
  );
}

function fallback() {
  loadWeather(35.6762, 139.6503, "Tóquio");
}

// 🌦️ CLIMA
async function loadWeather(lat, lon, label) {
  try {

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code` +
      `&hourly=temperature_2m,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
      `&timezone=auto`;

    const res = await fetch(url);
    const data = await res.json();

    const c = data.current;

    document.getElementById("location").innerText = label;
    document.getElementById("temp").innerText = Math.round(c.temperature_2m) + "°";
    document.getElementById("wind").innerText = c.wind_speed_10m;
    document.getElementById("humidity").innerText = c.relative_humidity_2m;
    document.getElementById("icon").innerText = icons[c.weather_code] || "🌡️";
    document.getElementById("desc").innerText = "Atualizado agora";

    setBackground(c.weather_code);
    renderForecast(data.daily);
    renderHourly(data.hourly);
    setFX(c.weather_code);

  } catch (e) {
    console.error(e);
  }
}

// 🎨 BACKGROUND ULTRA
function setBackground(code) {
  const bg = document.getElementById("bg");

  const map = {
    clear: "linear-gradient(180deg,#0b3d91,#1e6091,#52b69a)",
    cloud: "linear-gradient(180deg,#2b2d42,#5c677d,#7d8597)",
    rain: "linear-gradient(180deg,#0f172a,#1e293b,#334155)",
    storm: "linear-gradient(180deg,#020617,#0f172a,#1e293b)"
  };

  if (code === 0 || code === 1) bg.style.background = map.clear;
  else if (code === 2 || code === 3) bg.style.background = map.cloud;
  else if (code >= 51 && code <= 82) bg.style.background = map.rain;
  else bg.style.background = map.storm;
}

// 📅 DAILY
function renderForecast(daily) {
  const box = document.getElementById("forecast");
  box.innerHTML = "";

  daily.time.forEach((t, i) => {
    box.innerHTML += `
      <div class="day">
        <div>${new Date(t).getDate()}</div>
        <div>${icons[daily.weather_code[i]] || "⛅"}</div>
        <div>${Math.round(daily.temperature_2m_max[i])}°</div>
      </div>
    `;
  });
}

// ⏱️ HOURLY 48H
function renderHourly(hourly) {
  const box = document.getElementById("hourly");
  box.innerHTML = "";

  for (let i = 0; i < 48; i++) {
    const h = new Date(hourly.time[i]).getHours();

    box.innerHTML += `
      <div class="hour">
        <div>${h}:00</div>
        <div>${icons[hourly.weather_code[i]] || "⛅"}</div>
        <div>${Math.round(hourly.temperature_2m[i])}°</div>
      </div>
    `;
  }
}

// 🔍 SEARCH
async function searchCity() {
  const city = document.getElementById("cityInput").value;

  const geo = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
  );

  const data = await geo.json();
  if (!data.results) return alert("Cidade não encontrada");

  const r = data.results[0];
  loadWeather(r.latitude, r.longitude, r.name);
}

// 🌧️ FX (chuva leve estilo iOS)
function setFX(code) {
  const canvas = document.getElementById("fx");
  const ctx = canvas.getContext("2d");

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  particles = [];

  if (code >= 51 && code <= 82) {
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        v: 4 + Math.random() * 4
      });
    }

    animateRain(ctx, canvas);
  }
}

function animateRain(ctx, canvas) {
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;

    particles.forEach(p => {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y + 10);
      ctx.stroke();

      p.y += p.v;
      if (p.y > canvas.height) p.y = 0;
    });

    requestAnimationFrame(loop);
  }

  loop();
}
