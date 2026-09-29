// Project 1111 teaser
// Launch: 11 Nov 2026, 11:11 Manila (UTC+8) / 10:11 Bangkok (UTC+7)

const LAUNCH_DATE = new Date("2026-11-11T11:11:00+08:00");

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


// Minimal YouTube-backed soundtrack controls.
// Audible playback begins only after the visitor presses Play when required by browser autoplay policy.
const MUSIC_VIDEOS = ["RHnPq3Z0A8c", "CKclkO6HHrY", "O4Aigpyt4Uc"];
const MUSIC_LABELS = ["Oom Eisaya", "Bam Saralee", "OomBam Playlist"];
let musicPlayer = null;
let musicReady = false;
let musicProgressTimer = null;

function updateMusicUI(index = 0, playing = false) {
  const title = document.getElementById("music-title");
  const status = document.getElementById("music-status");
  const track = document.getElementById("music-track");
  const toggle = document.getElementById("music-toggle");
  if (title) title.textContent = MUSIC_LABELS[index] || "OomBam Playlist";
  if (status) status.textContent = playing ? "Now playing" : "Tap play to listen";
  if (track) track.textContent = `${String(index + 1).padStart(2,"0")} / ${String(MUSIC_VIDEOS.length).padStart(2,"0")}`;
  if (toggle) { toggle.textContent = playing ? "❚❚" : "▶"; toggle.setAttribute("aria-label", playing ? "Pause soundtrack" : "Play soundtrack"); }
}

function startMusicProgress() {
  clearInterval(musicProgressTimer);
  musicProgressTimer = setInterval(() => {
    if (!musicReady || !musicPlayer?.getDuration) return;
    const duration = musicPlayer.getDuration() || 0;
    const current = musicPlayer.getCurrentTime() || 0;
    const bar = document.getElementById("music-progress-bar");
    if (bar) bar.style.width = duration ? `${Math.min(100,(current/duration)*100)}%` : "0%";
  }, 750);
}

window.onYouTubeIframeAPIReady = function () {
  musicPlayer = new YT.Player("yt-player", {
    width: 200,
    height: 200,
    videoId: MUSIC_VIDEOS[0],
    playerVars: { playsinline: 1, controls: 0, rel: 0, origin: window.location.origin },
    events: {
      onReady: (event) => {
        musicReady = true;
        event.target.cuePlaylist(MUSIC_VIDEOS, 0, 0);
        event.target.setLoop(true);
        updateMusicUI(0, false);
        startMusicProgress();
      },
      onStateChange: (event) => {
        if (!musicPlayer) return;
        const index = Math.max(0, musicPlayer.getPlaylistIndex?.() ?? 0);
        updateMusicUI(index, event.data === YT.PlayerState.PLAYING);
        if (event.data === YT.PlayerState.ENDED) musicPlayer.nextVideo();
      },
      onAutoplayBlocked: () => updateMusicUI(Math.max(0, musicPlayer?.getPlaylistIndex?.() ?? 0), false)
    }
  });
};

function loadYouTubeAPI() {
  if (window.YT?.Player) return window.onYouTubeIframeAPIReady();
  if (document.querySelector('script[data-youtube-api]')) return;
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  script.async = true;
  script.dataset.youtubeApi = "true";
  document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
  loadYouTubeAPI();
  document.getElementById("music-toggle")?.addEventListener("click", () => {
    if (!musicReady || !musicPlayer) return;
    const state = musicPlayer.getPlayerState();
    if (state === YT.PlayerState.PLAYING) musicPlayer.pauseVideo(); else musicPlayer.playVideo();
  });
  document.getElementById("music-prev")?.addEventListener("click", () => { if (musicReady) musicPlayer.previousVideo(); });
  document.getElementById("music-next")?.addEventListener("click", () => { if (musicReady) musicPlayer.nextVideo(); });
});


// Daily teaser reveal — changes every day at 11:11 AM Philippine time (UTC+8).
// The master launch countdown above remains independent and always counts to 11.11.26.
const DAILY_REVEAL_HOUR_PH = 11;
const DAILY_REVEAL_MINUTE_PH = 11;
const PH_OFFSET_MS = 8 * 60 * 60 * 1000;

const DAILY_CLUES = [
  "The wait is almost over.",
  "Tomorrow, something beautiful opens.",
  "Two hearts. One more sleep.",
  "A little closer now.",
  "Some stories arrive softly.",
  "Keep this moment.",
  "A page is waiting to turn.",
  "Blue meets pink.",
  "A quiet clue is hiding here.",
  "Follow the little signs.",
  "Eleven feels a little magical.",
  "Made of moments worth keeping.",
  "The archive is beginning to bloom.",
  "A familiar song, a new chapter.",
  "Look closely. Something is changing.",
  "For every moment that made us smile.",
  "Some memories deserve a home.",
  "Two paths. One story.",
  "A little piece of the story is waiting.",
  "Save a little room for wonder.",
  "The smallest details tell the sweetest stories.",
  "A soft glow before the reveal.",
  "Something lovely is taking shape.",
  "For the moments between the moments.",
  "A place for what we never want to forget.",
  "The petals are starting to fall.",
  "One day closer to the bloom.",
  "There is more behind the curtain.",
  "A story told in blue and pink.",
  "Somewhere between memory and magic.",
  "A little clue for those who came back.",
  "The countdown has a story of its own.",
  "Come back tomorrow. There is more.",
  "Not everything beautiful arrives all at once.",
  "The next page is getting closer.",
  "A tiny secret for today.",
  "The quiet before something special.",
  "Every story starts somewhere.",
  "Two little worlds are finding each other.",
  "A bloom begins with one small sign.",
  "Something worth keeping is coming.",
  "For OomBam, with love.",
  "Some things are worth waiting for."
];
const DAILY_SYMBOLS = ["✦","🌸","♡","☘","✧","🌸","♡","✦"];

function phWallClock(nowMs = Date.now()) {
  return new Date(nowMs + PH_OFFSET_MS);
}

function nextDailyRevealMs(nowMs = Date.now()) {
  const ph = phWallClock(nowMs);
  const y = ph.getUTCFullYear(), m = ph.getUTCMonth(), d = ph.getUTCDate();
  let targetUtcWall = Date.UTC(y, m, d, DAILY_REVEAL_HOUR_PH, DAILY_REVEAL_MINUTE_PH, 0);
  if (ph.getTime() >= targetUtcWall) targetUtcWall += 86400000;
  return targetUtcWall - PH_OFFSET_MS;
}

function daysUntilLaunchByPHDate(nowMs = Date.now()) {
  const ph = phWallClock(nowMs);
  const today = Date.UTC(ph.getUTCFullYear(), ph.getUTCMonth(), ph.getUTCDate());
  const launchDay = Date.UTC(2026, 10, 11);
  return Math.max(0, Math.ceil((launchDay - today) / 86400000));
}

function updateDailyReveal() {
  const now = Date.now();
  const panel = document.getElementById("daily-reveal");
  const dayNode = document.getElementById("daily-day");
  const titleNode = document.getElementById("daily-title");
  const symbolNode = document.getElementById("daily-symbol");
  const timerNode = document.getElementById("daily-countdown");
  if (!panel || !dayNode || !titleNode || !symbolNode || !timerNode) return;

  if (now >= LAUNCH_DATE.getTime()) {
    panel.classList.add("is-launch");
    dayNode.textContent = "11 · 11 · 26";
    titleNode.textContent = "THE WAIT IS OVER.";
    symbolNode.textContent = "🌸";
    timerNode.textContent = "00:00:00";
    return;
  }

  panel.classList.remove("is-launch");
  const daysLeft = daysUntilLaunchByPHDate(now);
  const clueIndex = Math.max(0, Math.min(DAILY_CLUES.length - 1, daysLeft));
  dayNode.textContent = `DAY ${String(daysLeft).padStart(2,"0")}`;
  titleNode.textContent = `“${DAILY_CLUES[clueIndex]}”`;
  symbolNode.textContent = DAILY_SYMBOLS[daysLeft % DAILY_SYMBOLS.length];

  const remaining = Math.max(0, nextDailyRevealMs(now) - now);
  const total = Math.floor(remaining / 1000);
  const h = Math.floor(total / 3600);
  const min = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  timerNode.textContent = `${pad(h)}:${pad(min)}:${pad(sec)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateDailyReveal();
  window.setInterval(updateDailyReveal, 1000);
});
