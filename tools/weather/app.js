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

// 🌍 clima principal
async function loadWeather(lat, lon) {

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  const c = data.current;

  animateValue("temp", Math.round(c.temperature_2m) + "°");

  document.getElementById("wind").innerText = c.wind_speed_10m;
  document.getElementById("humidity").innerText = c.relative_humidity_2m;

  document.getElementById("icon").innerText =
    icons[c.weather_code] || "🌡️";

  setBackground(c.weather_code);

  renderForecast(data.daily);
}

// ✨ animação estilo iOS (fade + swap)
function animateValue(id, value) {
  const el = document.getElementById(id);
  el.style.opacity = 0;

  setTimeout(() => {
    el.innerText = value;
    el.style.opacity = 1;
  }, 200);
}

// 🎨 fundo dinâmico Apple-like
function setBackground(code) {
  const bg = document.getElementById("bg");

  if (code === 0 || code === 1) {
    bg.style.background = "linear-gradient(180deg,#0b3d91,#1e6091,#52b69a)";
  } else if (code === 2 || code === 3) {
    bg.style.background = "linear-gradient(180deg,#2b2d42,#5c677d,#7d8597)";
  } else if (code >= 51 && code <= 82) {
    bg.style.background = "linear-gradient(180deg,#1b263b,#415a77,#778da9)";
  } else if (code >= 95) {
    bg.style.background = "linear-gradient(180deg,#0d1b2a,#1b263b,#415a77)";
  }
}

// 📅 forecast Apple style
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

// 🔍 busca cidade
async function searchCity() {
  const city = document.getElementById("city").value;

  const geo = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
  );

  const data = await geo.json();

  if (!data.results) return alert("Cidade não encontrada");

  document.getElementById("location").innerText = data.results[0].name;

  loadWeather(data.results[0].latitude, data.results[0].longitude);
}

// 📍 auto localização
navigator.geolocation.getCurrentPosition((pos) => {
  loadWeather(pos.coords.latitude, pos.coords.longitude);
});
