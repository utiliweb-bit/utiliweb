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

const backgrounds = {
  clear: "linear-gradient(180deg,#0f2027,#203a43,#2c5364)",
  cloudy: "linear-gradient(180deg,#3a3a3a,#5c5c5c)",
  rain: "linear-gradient(180deg,#232526,#414345)",
  storm: "linear-gradient(180deg,#0f0c29,#302b63,#24243e)"
};

// 🌍 clima
async function loadWeather(lat, lon) {

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  const c = data.current;

  document.getElementById("temp").innerText = Math.round(c.temperature_2m) + "°";
  document.getElementById("wind").innerText = c.wind_speed_10m;
  document.getElementById("humidity").innerText = c.relative_humidity_2m;

  document.getElementById("icon").innerText = icons[c.weather_code] || "🌡️";

  setBackground(c.weather_code);

  renderForecast(data.daily);
}

// 🎨 background dinâmico estilo iOS
function setBackground(code) {
  const bg = document.getElementById("bg");

  if (code === 0 || code === 1) {
    bg.style.background = backgrounds.clear;
  } else if (code === 2 || code === 3) {
    bg.style.background = backgrounds.cloudy;
  } else if (code >= 51 && code <= 82) {
    bg.style.background = backgrounds.rain;
  } else if (code >= 95) {
    bg.style.background = backgrounds.storm;
  }
}

// 📅 previsão 7 dias
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

// 📍 auto localização (iPhone style)
navigator.geolocation.getCurrentPosition((pos) => {
  loadWeather(pos.coords.latitude, pos.coords.longitude);
});
