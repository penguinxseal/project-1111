// Project 1111 — v7
// Master launch: 11 Nov 2026, 11:11 PM Philippine time (UTC+8) / 10:11 PM Thailand time (UTC+7).
// Daily teaser rollover: every day at 11:11 PM Philippine time.

const LAUNCH_DATE = new Date("2026-11-11T23:11:00+08:00");
const PH_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 86400000;
const DAILY_REVEAL_HOUR_PH = 23;
const DAILY_REVEAL_MINUTE_PH = 11;

const DAILY_TEASERS = {
  43: { message: "Some things are worth waiting for.", icons: ["☘", "🩵"] },
  42: { message: "Every story starts somewhere.", icons: ["✦", "☁️"] },
  41: { message: "Two paths. One story.", icons: ["🐧", "🦭"] },
  40: { message: "A little closer than yesterday.", icons: ["🩵", "🩷"] },
  39: { message: "It started with a moment.", icons: ["⭐", "🤍"] },
  38: { message: "Then came another.", icons: ["🌸", "✦"] },
  37: { message: "And somehow, we kept them all.", icons: ["🤍", "⭐"] },
  36: { message: "Some memories deserve a home.", icons: ["☁️", "🤍"] },
  35: { message: "A little blue. A little pink.", icons: ["🩵", "🩷"] },
  34: { message: "And perhaps a little magic.", icons: ["⭐", "🌸"] },
  33: { message: "Look closely. There are clues everywhere.", icons: ["☘", "✦"] },
  32: { message: "Not everything beautiful needs explaining.", icons: ["☁️", "🌸"] },
  31: { message: "One month closer.", icons: ["☀️", "🤍"] },
  30: { message: "The archive is stirring.", icons: ["⭐", "☘"] },
  29: { message: "Every chapter has a beginning.", icons: ["🌸", "🤍"] },
  28: { message: "Every moment leaves something behind.", icons: ["☁️", "⭐"] },
  27: { message: "We decided to keep those pieces.", icons: ["🩵", "🤍"] },
  26: { message: "For the moments we replay.", icons: ["✦", "🩷"] },
  25: { message: "For the words we remember.", icons: ["🤍", "☘"] },
  24: { message: "For the smiles that started everything.", icons: ["☀️", "🌸"] },
  23: { message: "Two names. Countless moments.", icons: ["🐧", "🦭"] },
  22: { message: "Oom × Bam.", icons: ["🐧", "🩵", "🩷", "🦭"] },
  21: { message: "Now you know who. Not yet what.", icons: ["✦", "🤍"] },
  20: { message: "Twenty days until the doors open.", icons: ["☀️", "⭐"] },
  19: { message: "Built from moments.", icons: ["☘", "🩵"] },
  18: { message: "Curated with care.", icons: ["🤍", "🌸"] },
  17: { message: "Preserved with love.", icons: ["🩷", "🤍"] },
  16: { message: "Made by fans, for fans.", icons: ["🩵", "🩷"] },
  15: { message: "There’s more behind the bloom.", icons: ["🌸", "✦"] },
  14: { message: "Two weeks. Shall we show you a little more?", icons: ["☁️", "⭐"] },
  13: { message: "Stories. Moments. Memories.", icons: ["🤍", "🌸"] },
  12: { message: "All finding their way home.", icons: ["🐧", "🦭"] },
  11: { message: "11 days. Of course it had to be eleven.", icons: ["⭐", "⭐"] },
  10: { message: "The final ten begins.", icons: ["☀️", "✦"] },
   9: { message: "Nine nights until the doors open.", icons: ["☁️", "⭐"] },
   8: { message: "The pieces are falling into place.", icons: ["☘", "🌸"] },
   7: { message: "One week.", icons: ["🩵", "🩷"] },
   6: { message: "Something beautiful is almost ready.", icons: ["🌸", "🤍"] },
   5: { message: "Five nights. Keep your eyes here.", icons: ["⭐", "✦"] },
   4: { message: "The wait is getting shorter.", icons: ["☀️", "🌸"] },
   3: { message: "Three.", icons: ["🐧", "🤍", "🦭"] },
   2: { message: "Two.", icons: ["🩵", "🩷"] },
   1: { message: "One more sleep.", icons: ["🌸", "🤍", "🌸"] },
   0: { message: "Tonight, something beautiful blooms.", icons: ["🐧", "🌸", "🦭"] }
};

function pad(value) { return String(value).padStart(2, "0"); }
function phWallClock(nowMs = Date.now()) { return new Date(nowMs + PH_OFFSET_MS); }
function phMinutesOfDay(nowMs = Date.now()) {
  const ph = phWallClock(nowMs);
  return ph.getUTCHours() * 60 + ph.getUTCMinutes() + ph.getUTCSeconds() / 60;
}

function updateCountdown() {
  const remaining = Math.max(0, LAUNCH_DATE.getTime() - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const values = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
  Object.entries(values).forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = pad(value);
  });
  if (remaining === 0) document.getElementById("countdown")?.setAttribute("aria-label", "The wait is over");
}

function nextDailyRevealMs(nowMs = Date.now()) {
  const ph = phWallClock(nowMs);
  const y = ph.getUTCFullYear(), m = ph.getUTCMonth(), d = ph.getUTCDate();
  let targetWall = Date.UTC(y, m, d, DAILY_REVEAL_HOUR_PH, DAILY_REVEAL_MINUTE_PH, 0);
  if (ph.getTime() >= targetWall) targetWall += DAY_MS;
  return targetWall - PH_OFFSET_MS;
}

function campaignDay(nowMs = Date.now()) {
  const ph = phWallClock(nowMs);
  const today = Date.UTC(ph.getUTCFullYear(), ph.getUTCMonth(), ph.getUTCDate());
  const launchDay = Date.UTC(2026, 10, 11);
  let day = Math.round((launchDay - today) / DAY_MS);
  const revealMinute = DAILY_REVEAL_HOUR_PH * 60 + DAILY_REVEAL_MINUTE_PH;
  if (phMinutesOfDay(nowMs) >= revealMinute) day -= 1;
  return Math.max(0, Math.min(43, day));
}

let lastDailyDay = null;
function updateDailyReveal() {
  const now = Date.now();
  const panel = document.getElementById("daily-reveal");
  const dayNode = document.getElementById("daily-day");
  const titleNode = document.getElementById("daily-title");
  const symbolsNode = document.getElementById("daily-symbols");
  const timerNode = document.getElementById("daily-countdown");
  if (!panel || !dayNode || !titleNode || !symbolsNode || !timerNode) return;

  if (now >= LAUNCH_DATE.getTime()) {
    panel.classList.add("is-launch");
    dayNode.textContent = "11 · 11 · 26";
    titleNode.textContent = "THE WAIT IS OVER.";
    symbolsNode.textContent = "🌸  🤍  🌸";
    timerNode.textContent = "00:00:00";
    return;
  }

  panel.classList.remove("is-launch");
  const day = campaignDay(now);
  const teaser = DAILY_TEASERS[day] || DAILY_TEASERS[43];
  dayNode.textContent = day === 0 ? "FINAL 24 HOURS" : `DAY ${pad(day)}`;
  titleNode.textContent = `“${teaser.message}”`;
  symbolsNode.textContent = teaser.icons.join("  ");

  const remaining = Math.max(0, Math.min(nextDailyRevealMs(now), LAUNCH_DATE.getTime()) - now);
  const total = Math.floor(remaining / 1000);
  timerNode.textContent = `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;

  if (lastDailyDay !== null && lastDailyDay !== day) playRevealMoment();
  lastDailyDay = day;
  updateYesterday(day);
  updateBloomLevel(day);
}

function updateYesterday(day) {
  const button = document.getElementById("daily-yesterday");
  const box = document.getElementById("daily-previous");
  if (!button || !box) return;
  const yesterdayDay = Math.min(43, day + 1);
  const hasYesterday = yesterdayDay !== day && DAILY_TEASERS[yesterdayDay];
  button.hidden = !hasYesterday;
  if (!hasYesterday) box.hidden = true;
  button.dataset.day = String(yesterdayDay);
}

function updateBloomLevel(day) {
  const progress = Math.max(0, Math.min(1, (43 - day) / 43));
  document.documentElement.style.setProperty("--bloom-progress", progress.toFixed(3));
}

function playRevealMoment() {
  const flash = document.getElementById("reveal-flash");
  const panel = document.getElementById("daily-reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  flash?.classList.remove("is-active");
  panel?.classList.remove("just-bloomed");
  void flash?.offsetWidth;
  flash?.classList.add("is-active");
  panel?.classList.add("just-bloomed");
  setTimeout(() => flash?.classList.remove("is-active"), 3600);
  setTimeout(() => panel?.classList.remove("just-bloomed"), 1800);
}

// YouTube-backed custom soundtrack. We request audible autoplay; browsers may block it.
const MUSIC_VIDEOS = ["RHnPq3Z0A8c", "CKclkO6HHrY", "O4Aigpyt4Uc"];
const MUSIC_LABELS = ["Oom Eisaya", "Bam Saralee", "OomBam Playlist"];
let musicPlayer = null, musicReady = false, musicProgressTimer = null, autoplayBlocked = false;

function updateMusicUI(index = 0, playing = false) {
  const title = document.getElementById("music-title");
  const status = document.getElementById("music-status");
  const track = document.getElementById("music-track");
  const toggle = document.getElementById("music-toggle");
  if (title) title.textContent = MUSIC_LABELS[index] || "OomBam Playlist";
  if (status) status.textContent = playing ? "Playing while we wait…" : (autoplayBlocked ? "Tap anywhere to start the music" : "Tap play to listen");
  if (track) track.textContent = `${pad(index + 1)} / ${pad(MUSIC_VIDEOS.length)}`;
  if (toggle) { toggle.textContent = playing ? "❚❚" : "▶"; toggle.setAttribute("aria-label", playing ? "Pause soundtrack" : "Play soundtrack"); }
}

function startMusicProgress() {
  clearInterval(musicProgressTimer);
  musicProgressTimer = setInterval(() => {
    if (!musicReady || !musicPlayer?.getDuration) return;
    const duration = musicPlayer.getDuration() || 0;
    const current = musicPlayer.getCurrentTime() || 0;
    const bar = document.getElementById("music-progress-bar");
    if (bar) bar.style.width = duration ? `${Math.min(100, (current / duration) * 100)}%` : "0%";
  }, 750);
}

function attemptMusicStart() {
  if (!musicReady || !musicPlayer) return;
  try { musicPlayer.unMute?.(); musicPlayer.setVolume?.(55); musicPlayer.playVideo?.(); } catch (_) {}
}

window.onYouTubeIframeAPIReady = function () {
  musicPlayer = new YT.Player("yt-player", {
    width: 200, height: 200, videoId: MUSIC_VIDEOS[0],
    playerVars: { autoplay: 1, playsinline: 1, controls: 0, rel: 0, origin: window.location.origin },
    events: {
      onReady: (event) => {
        musicReady = true;
        event.target.cuePlaylist(MUSIC_VIDEOS, 0, 0);
        event.target.setLoop(true);
        event.target.setVolume(55);
        updateMusicUI(0, false);
        startMusicProgress();
        setTimeout(attemptMusicStart, 250);
      },
      onStateChange: (event) => {
        const index = Math.max(0, musicPlayer?.getPlaylistIndex?.() ?? 0);
        const playing = event.data === YT.PlayerState.PLAYING;
        if (playing) autoplayBlocked = false;
        updateMusicUI(index, playing);
        if (event.data === YT.PlayerState.ENDED) musicPlayer?.nextVideo?.();
      },
      onAutoplayBlocked: () => { autoplayBlocked = true; updateMusicUI(Math.max(0, musicPlayer?.getPlaylistIndex?.() ?? 0), false); }
    }
  });
};

function loadYouTubeAPI() {
  if (window.YT?.Player) return window.onYouTubeIframeAPIReady();
  if (document.querySelector("script[data-youtube-api]")) return;
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  script.async = true;
  script.dataset.youtubeApi = "true";
  document.head.appendChild(script);
}


let easterMessageTimer750 = null;
function showEasterMessage732(message, kind = "") {
  const slot = document.getElementById("easter-reveal-slot");
  if (!slot) return;

  if (easterMessageTimer750) clearTimeout(easterMessageTimer750);
  slot.className = `easter-reveal-slot ${kind}`.trim();
  slot.textContent = message;

  // Restart reveal animation cleanly on every click/tap.
  slot.classList.remove("show");
  void slot.offsetWidth;
  slot.classList.add("show");

  easterMessageTimer750 = window.setTimeout(() => {
    slot.classList.remove("show");
  }, 3200);
}

function showNameSecret(message, symbols, sourceEl, kind = "") {
  showEasterMessage732(message, kind);
  const stage = document.getElementById("secret-particles");
  if (!stage) return;

  stage.replaceChildren();
  const rect = sourceEl?.getBoundingClientRect?.();
  const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
  const glyphs = Array.from(symbols);

  glyphs.forEach((glyph, i) => {
    const particle = document.createElement("span");
    particle.className = "secret-particle";
    particle.textContent = glyph;
    const spread = (i - (glyphs.length - 1) / 2) * 19;
    particle.style.setProperty("--x", `${cx + spread}px`);
    particle.style.setProperty("--y", `${cy + (i % 2 ? 6 : -4)}px`);
    particle.style.setProperty("--drift", `${spread * .9}px`);
    particle.style.setProperty("--rot", `${(i % 2 ? 1 : -1) * (8 + i * 3)}deg`);
    particle.style.setProperty("--size", `${16 + (i % 3) * 3}px`);
    stage.appendChild(particle);
  });

  window.setTimeout(() => stage.replaceChildren(), 2100);
}

function bindSecretTarget(id, message, symbols, kind = "") {
  const el = document.getElementById(id);
  if (!el) return;
  const reveal = (event) => {
    event.preventDefault();
    event.stopPropagation();
    showNameSecret(message, symbols, el, kind);
  };
  if (window.PointerEvent) {
    el.addEventListener("pointerup", reveal);
  } else {
    el.addEventListener("touchend", reveal, { passive:false });
    el.addEventListener("click", reveal);
  }
}

function setupInteractions() {
  document.getElementById("music-toggle")?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!musicReady || !musicPlayer) return;
    if (musicPlayer.getPlayerState() === YT.PlayerState.PLAYING) musicPlayer.pauseVideo(); else attemptMusicStart();
  });
  document.getElementById("music-prev")?.addEventListener("click", (event) => { event.stopPropagation(); if (musicReady) musicPlayer.previousVideo(); });
  document.getElementById("music-next")?.addEventListener("click", (event) => { event.stopPropagation(); if (musicReady) musicPlayer.nextVideo(); });

  // If autoplay was blocked, the visitor's first ordinary interaction can unlock audio.
  const unlock = () => { if (autoplayBlocked) attemptMusicStart(); };
  document.addEventListener("pointerdown", unlock, { once: true, passive: true });
  document.addEventListener("keydown", unlock, { once: true });

  document.getElementById("daily-yesterday")?.addEventListener("click", () => {
    const button = document.getElementById("daily-yesterday");
    const box = document.getElementById("daily-previous");
    const day = Number(button?.dataset.day || 0);
    const teaser = DAILY_TEASERS[day];
    if (!box || !teaser) return;
    document.getElementById("previous-day").textContent = `DAY ${pad(day)}`;
    document.getElementById("previous-clue").textContent = teaser.message;
    box.hidden = !box.hidden;
    button.textContent = box.hidden ? "← YESTERDAY" : "CLOSE MEMORY ×";
  });

  const heart = document.getElementById("heart-easter");
  let heartBusy = false;
  const revealHeart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (heartBusy) return;
    heartBusy = true;
    showEasterMessage732("Hello My Blossom, Smile My OBOB! 🌸♡", "heart");

    const teaser = document.getElementById("teaser");
    teaser?.classList.remove("heart-found");
    void teaser?.offsetWidth;
    teaser?.classList.add("heart-found");

    setTimeout(() => teaser?.classList.remove("heart-found"), 1800);
    setTimeout(() => { heartBusy = false; }, 650);
  };

  if (heart) {
    if (window.PointerEvent) {
      heart.addEventListener("pointerup", revealHeart);
    } else {
      heart.addEventListener("touchend", revealHeart, { passive:false });
      heart.addEventListener("click", revealHeart);
    }
  }

  bindSecretTarget("secret-oom", "You found a little luck. ☘️🩵", "☘🩵☘✦", "oom");
  bindSecretTarget("secret-bam", "Something is blooming here. 🌸🩷", "🌸🩷🌸✦", "bam");
  bindSecretTarget("secret-pair", "Some things are better together. ♡", "🩵♡🩷✦", "pair");
  bindSecretTarget("secret-oombam-main", "And somehow, it became a story worth keeping.", "🩵☘🌸🩷🐧🦭✦", "oombam");
  bindSecretTarget("secret-oombam", "And somehow, it became a story worth keeping.", "🩵☘🌸🩷🐧🦭✦", "oombam");
}

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("teaser-ready");
  updateCountdown();
  updateDailyReveal();
  loadYouTubeAPI();
  setupInteractions();
  window.setInterval(updateCountdown, 1000);
  window.setInterval(updateDailyReveal, 1000);
});


