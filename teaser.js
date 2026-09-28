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
