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

window.addEventListener("load", start);

function start() {
  navigator.geolocation?.getCurrentPosition(
    p => loadWeather(p.coords.latitude, p.coords.longitude, "Sua localização"),
    () => loadWeather(35.6762,139.6503,"Tóquio")
  );
}

// 🌦️ WEATHER CORE
async function loadWeather(lat, lon, label) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code` +
    `&hourly=temperature_2m,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
    `&timezone=auto`;

  const res = await fetch(url);
  const d = await res.json();

  const c = d.current;

  document.getElementById("location").innerText = label;
  document.getElementById("temp").innerText = Math.round(c.temperature_2m)+"°";
  document.getElementById("wind").innerText = c.wind_speed_10m;
  document.getElementById("humidity").innerText = c.relative_humidity_2m;
  document.getElementById("icon").innerText = icons[c.weather_code]||"🌡️";

  setBackground(c.weather_code);
  renderChart(d.hourly);
  renderHourly(d.hourly);
  renderForecast(d.daily);
}

// 🎨 BACKGROUND PRO
function setBackground(code){
  const bg=document.getElementById("bg");

  if(code<=1) bg.style.background="linear-gradient(180deg,#0f3d91,#1e6091,#52b69a)";
  else if(code<=3) bg.style.background="linear-gradient(180deg,#2b2d42,#5c677d)";
  else bg.style.background="linear-gradient(180deg,#0b1320,#1b263b,#415a77)";
}

// 📊 GRAPH (Apple style line)
function renderChart(hourly){
  const c=document.getElementById("chart");
  const ctx=c.getContext("2d");

  c.width=400;
  c.height=100;

  ctx.clearRect(0,0,c.width,c.height);

  ctx.strokeStyle="white";
  ctx.beginPath();

  for(let i=0;i<24;i++){
    let x=i*16;
    let y=100-hourly.temperature_2m[i]*2;

    if(i===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  }

  ctx.stroke();
}

// ⏱️ HOURLY
function renderHourly(h){
  const box=document.getElementById("hourly");
  box.innerHTML="";

  for(let i=0;i<48;i++){
    let hr=new Date(h.time[i]).getHours();

    box.innerHTML+=`
      <div class="hour">
        <div>${hr}:00</div>
        <div>${icons[h.weather_code[i]]||"⛅"}</div>
        <div>${Math.round(h.temperature_2m[i])}°</div>
      </div>`;
  }
}

// 📅 DAILY
function renderForecast(d){
  const box=document.getElementById("forecast");
  box.innerHTML="";

  d.time.forEach((t,i)=>{
    box.innerHTML+=`
      <div class="day">
        <div>${new Date(t).getDate()}</div>
        <div>${icons[d.weather_code[i]]||"⛅"}</div>
        <div>${Math.round(d.temperature_2m_max[i])}°</div>
      </div>`;
  });
}

// 🔍 SEARCH
async function searchCity(){
  const city=document.getElementById("cityInput").value;

  const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
  const d=await r.json();

  if(!d.results) return alert("Cidade não encontrada");

  const p=d.results[0];
  loadWeather(p.latitude,p.longitude,p.name);
}
