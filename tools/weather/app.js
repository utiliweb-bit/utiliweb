const weatherIcons = {
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

// 🔍 buscar cidade
async function searchCity() {
  const city = document.getElementById("cityInput").value;

  const geo = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
  );

  const geoData = await geo.json();

  if (!geoData.results) return alert("Cidade não encontrada");

  const { latitude, longitude } = geoData.results[0];

  loadWeather(latitude, longitude);
}

// 📍 clima
async function loadWeather(lat = 35.6762, lon = 139.6503) {

  const url = `
  https://api.open-meteo.com/v1/forecast
  ?latitude=${lat}
  &longitude=${lon}
  &current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code
  &daily=temperature_2m_max,temperature_2m_min,weather_code
  &timezone=auto
  `.replace(/\s/g,'');

  const res = await fetch(url);
  const data = await res.json();

  // atual
  document.getElementById("temp").innerText =
    Math.round(data.current.temperature_2m) + "°C";

  document.getElementById("wind").innerText =
    data.current.wind_speed_10m + " km/h";

  document.getElementById("humidity").innerText =
    data.current.relative_humidity_2m + "%";

  document.getElementById("icon").innerText =
    weatherIcons[data.current.weather_code] || "🌡️";

  // forecast
  const forecast = document.getElementById("forecast");
  forecast.innerHTML = "";

  data.daily.time.forEach((day, i) => {
    forecast.innerHTML += `
      <div class="day">
        <div>${new Date(day).getDate()}</div>
        <div>${weatherIcons[data.daily.weather_code[i]] || "⛅"}</div>
        <div>${Math.round(data.daily.temperature_2m_max[i])}°</div>
      </div>
    `;
  });
}

// 🚀 auto load (Tóquio)
loadWeather();
