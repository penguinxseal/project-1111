// Project 1111 teaser
// Launch: 11 Nov 2026, 20:00 Bangkok (UTC+7) / 21:00 Manila (UTC+8)

const LAUNCH_DATE = new Date("2026-11-11T20:00:00+07:00");

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const remaining = Math.max(0, LAUNCH_DATE.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const values = { days, hours, minutes, seconds };
  Object.entries(values).forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = pad(value);
  });

  if (remaining === 0) {
    const countdown = document.getElementById("countdown");
    if (countdown) countdown.setAttribute("aria-label", "The wait is over");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("teaser-ready");
  updateCountdown();
  window.setInterval(updateCountdown, 1000);
});
