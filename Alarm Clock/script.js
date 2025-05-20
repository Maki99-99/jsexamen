// ------------------ Storage ------------------
const storage = {
  get: key => JSON.parse(localStorage.getItem(key)) || null,
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  clear: key => localStorage.removeItem(key)
};

// ------------------ Time & Background ------------------
const updateCurrentTime = () =>
  document.getElementById("currentTime").innerText = new Date().toLocaleTimeString();
setInterval(updateCurrentTime, 1000);

const updateBackground = () => {
  const hour = new Date().getHours();
  const body = document.body;
  body.className = '';
  if (hour < 5 || hour >= 20) {
    body.classList.add("night");
    createStars();
  } else if (hour < 12) body.classList.add("morning");
  else if (hour < 17) body.classList.add("afternoon");
  else body.classList.add("evening");
};

const createStars = () => {
  document.querySelectorAll('.particle').forEach(e => e.remove());
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'particle';
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    document.body.appendChild(star);
  }
};

updateBackground();
setInterval(updateBackground, 60000);

// ------------------ Weather ------------------
const fetchWeather = () => {
  navigator.geolocation?.getCurrentPosition(async ({ coords }) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true`);
      const temp = (await res.json()).current_weather.temperature;
      let el = document.getElementById("weatherDisplay") || document.body.appendChild(Object.assign(document.createElement("div"), { id: "weatherDisplay" }));
      el.innerHTML = `Your location 🌡️ ${temp}°C`;
    } catch (e) {
      console.log.error("Weather fetch failed:", e);
    }
  });
};
fetchWeather();

// ------------------ Alarm ------------------
let alarmTime = storage.get('alarmTime');
const alarmSound = document.getElementById("alarmSound");
const [alarmStatus, uploadSound, removeSound, stopBtn] = 
  ["alarmStatus", "uploadSound", "removeSound", "stopSoundBtn"].map(id => document.getElementById(id));
const defaultAlarmSrc = "alarm.mp3";
alarmSound.src = storage.get("alarmSound") || defaultAlarmSrc;

uploadSound.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  alarmSound.src = url;
  storage.set("alarmSound", url);
  removeSound.style.display = "inline-block";
};

removeSound.onclick = () => {
  alarmSound.src = defaultAlarmSrc;
  uploadSound.value = "";
  removeSound.style.display = "none";
  storage.clear("alarmSound");
};

document.getElementById("setAlarm").onclick = () => {
  alarmTime = document.getElementById("alarmTime").value;
  if (!alarmTime) return;
  storage.set("alarmTime", alarmTime);
  alarmStatus.innerText = `⏰ Alarm set for ${alarmTime}`;
};

document.getElementById("clearAlarm").onclick = () => {
  alarmTime = null;
  storage.clear("alarmTime");
  alarmStatus.innerText = "Alarm cleared.";
  document.getElementById("alarmRemaining").innerText = "";
};

setInterval(() => {
  const now = new Date();
  const current = now.toTimeString().slice(0, 5);
  if (!alarmTime) return;

  const [h, m] = alarmTime.split(':').map(Number);
  const alarm = new Date(now);
  alarm.setHours(h, m, 0, 0);
  if (alarm < now) alarm.setDate(alarm.getDate() + 1);
  const diff = alarm - now;

  if (current === alarmTime) {
    alarmSound.play();
    alarmStatus.innerText = "⏰ Alarm ringing!";
    document.getElementById("alarmRemaining").innerText = "";
    stopBtn.style.display = "inline-block";
    removeSound.style.display = "none";
    alarmTime = null;
    storage.clear("alarmTime");
  } else {
    const hrs = String(Math.floor(diff / 3600000));
    const mins = String(Math.floor((diff % 3600000) / 60000));
    const secs = String(Math.floor((diff % 60000) / 1000));
    document.getElementById("alarmRemaining").innerText = `⏳ ${hrs}h ${mins}m ${secs}s remaining`;
  }
}, 1000);

// ------------------ Stopwatch ------------------
let stopwatchInterval, stopwatchTime = 0, stopwatchStart = 0, isRunning = false;
let lapCount = storage.get('lapCount') || 0;
const stopwatchDisplay = document.getElementById("stopwatch");
const lapsContainer = document.getElementById("lapsContainer");

(storage.get('stopwatchLaps') || []).forEach(lap => {
  const lapItem = document.createElement("div");
  lapItem.className = "lap-item";
  lapItem.innerHTML = `<span class="lap-number">${lap.number}</span><span class="lap-time">${lap.time}</span>`;
  lapsContainer.appendChild(lapItem);
});

const formatTime = ms => {
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const ms10 = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
  return `${h}:${m}:${s}.${ms10}`;
};

document.getElementById("startStopwatch").onclick = () => {
  if (isRunning) return;
  stopwatchStart = Date.now() - stopwatchTime;
  stopwatchInterval = setInterval(() => {
    stopwatchTime = Date.now() - stopwatchStart;
    stopwatchDisplay.innerText = formatTime(stopwatchTime);
  }, 10);
  isRunning = true;
};

document.getElementById("stopStopwatch").onclick = () => {
  clearInterval(stopwatchInterval);
  isRunning = false;
};

document.getElementById("resetStopwatch").onclick = () => {
  clearInterval(stopwatchInterval);
  stopwatchTime = 0;
  stopwatchDisplay.innerText = formatTime(0);
  isRunning = false;
  lapCount = 0;
  lapsContainer.innerHTML = "";
  storage.set('lapCount', 0);
  storage.set('stopwatchLaps', []);
};

document.getElementById("lapStopwatch").onclick = () => {
  if (!isRunning) return;
  const time = formatTime(stopwatchTime);
  lapCount++;
  const laps = storage.get('stopwatchLaps') || [];
  laps.unshift({ number: lapCount, time });
  storage.set('lapCount', lapCount);
  storage.set('stopwatchLaps', laps.slice(0, 10));
  const item = document.createElement("div");
  item.className = "lap-item";
  item.innerHTML = `<span class="lap-number">${lapCount}</span><span class="lap-time">${time}</span>`;
  lapsContainer.prepend(item);
};

// ------------------ Timer ------------------
let timerInterval;
document.getElementById("startTimer").onclick = () => {
  const h = +document.getElementById("timerHours").value || 0;
  const m = +document.getElementById("timerMinutes").value || 0;
  const s = +document.getElementById("timerSeconds").value || 0;
  const total = h * 3600 + m * 60 + s;
  if (!total) return;

  const display = document.getElementById("timerDisplay");
  const fill = document.querySelector(".progress-fill");
  let timeLeft = total;

  fill.classList.add("active");
  updateTimerDisplay(timeLeft, total);

  timerInterval = setInterval(() => {
    if (--timeLeft <= 0) {
      clearInterval(timerInterval);
      display.innerHTML = "⏰ <span class='timer-danger'>Time's up!</span>";
      fill.style.width = "0%";
      alarmSound.play();
      stopBtn.style.display = "inline-block";
    } else {
      updateTimerDisplay(timeLeft, total);
    }
  }, 1000);
};

const updateTimerDisplay = (timeLeft, total) => {
  const h = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const s = String(timeLeft % 60).padStart(2, '0');
  const percent = (timeLeft / total) * 100;
  const display = document.getElementById("timerDisplay");
  const fill = document.querySelector(".progress-fill");

  display.innerText = `${h}:${m}:${s}`;
  fill.style.width = `${percent}%`;
  display.className = "timer-active " + (percent > 30 ? "timer-safe" : percent > 10 ? "timer-warning" : "timer-danger");
  fill.style.background = percent > 30 ? "#4CAF50" : percent > 10 ? "#FFC107" : "#F44336";
};

document.getElementById("resetTimer").onclick = () => {
  clearInterval(timerInterval);
  ["timerHours", "timerMinutes", "timerSeconds"].forEach(id => document.getElementById(id).value = "");
  const display = document.getElementById("timerDisplay");
  const fill = document.querySelector(".progress-fill");
  display.innerText = "00:00:00";
  display.className = "";
  fill.classList.remove("active");
  fill.style.width = "0%";
  fill.style.background = "#4CAF50";
};

// ------------------ Presets & Stop Sound ------------------
document.querySelectorAll(".preset").forEach(btn =>
  btn.onclick = () => {
    clearInterval(timerInterval);
    const min = +btn.dataset.minutes || 0;
    document.getElementById("timerMinutes").value = min;  
    document.getElementById("timerDisplay").innerText = `00:${String(min).padStart(2, '0')}:00`;
    if (min > 0) document.getElementById("startTimer").click();
  });

stopBtn.onclick = () => {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  stopBtn.style.display = "none";
  alarmStatus.innerText = "";
  
  if (uploadSound.files[0]) removeSound.style.display = "inline-block";
};
