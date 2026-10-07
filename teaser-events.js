/* Project 1111 — automatic weekly teaser surprises
   Schedule is evaluated in Asia/Manila (UTC+8), regardless of visitor timezone.
   This file is intentionally isolated from teaser.js so the master countdown and
   daily clue system remain untouched. */
(() => {
  "use strict";

  const PH_TZ = "Asia/Manila";
  const TH_TZ = "Asia/Bangkok";
  const STORAGE = "project1111.pakulo.";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Weekly handoff happens every Saturday at 11:11 AM Philippine time.
  // `start` uses an explicit +08:00 offset so the switch is identical worldwide.
  const EVENTS = [
    { id: "easter",  start: "2026-09-29T00:00:00+08:00" },
    { id: "visitor", start: "2026-10-04T11:11:00+08:00" },
    { id: "1111",    start: "2026-10-11T11:11:00+08:00" },
    { id: "bloom",   start: "2026-10-18T11:11:00+08:00" },
    { id: "glitch",  start: "2026-10-25T11:11:00+08:00" },
    { id: "whisper", start: "2026-11-01T11:11:00+08:00" },
    { id: "final",   start: "2026-11-08T11:11:00+08:00" }
  ];

  function phParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: PH_TZ, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
    }).formatToParts(date).reduce((o, p) => (o[p.type] = p.value, o), {});
    return {
      date: `${parts.year}-${parts.month}-${parts.day}`,
      hour: Number(parts.hour), minute: Number(parts.minute), second: Number(parts.second)
    };
  }

  // BAM BIRTHDAY — one-day Thailand-time override.
  // Starts 2026-10-08 00:00 in Bangkok and ends exactly at 2026-10-09 00:00.
  const BAM_BDAY_START = Date.parse("2026-10-08T00:00:00+07:00");
  const BAM_BDAY_END   = Date.parse("2026-10-09T00:00:00+07:00");

  function isBamBirthday(now = new Date()) {
    const ms = now.getTime();
    return ms >= BAM_BDAY_START && ms < BAM_BDAY_END;
  }

  function activeEvent(now = new Date()) {
    const nowMs = now.getTime();
    let active = null;
    for (const event of EVENTS) {
      if (nowMs >= Date.parse(event.start)) active = event;
      else break;
    }
    return active;
  }

  function once(key) {
    try {
      const k = STORAGE + key;
      if (localStorage.getItem(k)) return false;
      localStorage.setItem(k, "1");
      return true;
    } catch (_) { return true; }
  }

  function stage() { return $("#weekly-pakulo-stage"); }

  function toast(title, copy, icons = "✦") {
    const root = stage();
    if (!root) return;
    const el = document.createElement("div");
    el.className = "pakulo-toast";
    el.innerHTML = `<span class="pakulo-toast-icons" aria-hidden="true">${icons}</span><strong>${title}</strong><span>${copy}</span>`;
    root.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => el.classList.remove("show"), 5200);
    setTimeout(() => el.remove(), 5700);
  }

  // WEEK 2 — a tiny visitor appears after a random delay and can be caught.
  function secretVisitor() {
    const root = stage();
    if (!root) return;
    const delay = 5000 + Math.floor(Math.random() * 9000);
    setTimeout(() => {
      const seal = Math.random() > .5;
      const visitor = document.createElement("button");
      visitor.type = "button";
      visitor.className = `pakulo-visitor ${Math.random() > .5 ? "from-left" : "from-right"}`;
      visitor.setAttribute("aria-label", `Catch the secret ${seal ? "seal" : "penguin"}`);
      visitor.innerHTML = `<span>${seal ? "🦭" : "🐧"}</span><small>peek!</small>`;
      root.appendChild(visitor);
      requestAnimationFrame(() => visitor.classList.add("peek"));
      const escape = setTimeout(() => { visitor.classList.remove("peek"); setTimeout(() => visitor.remove(), 700); }, 8500);
      visitor.addEventListener("click", () => {
        clearTimeout(escape);
        visitor.classList.add("caught");
        try { localStorage.setItem(STORAGE + "visitor-found", "1"); } catch (_) {}
        toast("You caught me! ♡", "We were just checking if you’re still waiting.", "☘ 🐧 ♡ 🦭 🌸");
        setTimeout(() => visitor.remove(), 650);
      }, { once: true });
    }, delay);
  }

  // OCT 8 — BAM BIRTHDAY TAKEOVER (Thailand time).
  function bamBirthday() {
    const root = stage();
    if (!root) return;
    document.body.classList.add("bam-birthday-takeover");

    const badge = document.createElement("button");
    badge.type = "button";
    badge.className = "bam-birthday-badge";
    badge.setAttribute("aria-label", "Open the Happy Bam Day surprise");
    badge.innerHTML = `<span aria-hidden="true">🌸</span><small>10.08</small>`;
    document.body.appendChild(badge); // Escape the teaser stacking context so the button stays above the soundtrack.

    const card = document.createElement("div");
    card.className = "bam-birthday-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-label", "Happy Bam Day");
    card.innerHTML = `
      <div class="bam-birthday-card-inner">
        <button class="bam-birthday-close" type="button" aria-label="Close birthday card">×</button>
        <div class="bam-birthday-seal" role="button" tabindex="0" aria-label="Birthday seal">🦭<i>🌸</i></div>
        <span class="bam-birthday-kicker">10 · 08</span>
        <h2>Happy Bam Day <span>♡</span></h2>
        <p>Today, the archive blooms a little brighter. 🌸</p>
        <p>For the smiles, the laughter,<br>and all the little moments worth keeping—<br><strong>Happy Birthday, Bam. 🩷</strong></p>
        <p>May this chapter bring you<br>even more reasons to smile.</p>
        <div class="bam-birthday-pair">🐧 <b>♡</b> 🦭</div>
        <button class="bam-bloom-btn" type="button">Send a little birthday bloom 🌸</button>
        <small class="bam-bloom-count" aria-live="polite">0 blooms sent 🌸</small>
        <div class="bam-eight-secret" aria-live="polite"><strong>8 taps on 10.08?</strong><br>You understood the assignment. 😂🦭🌸<br><b>HAPPY BAM DAY ♡</b></div>
      </div>`;
    document.body.appendChild(card); // Keep the birthday dialog above the page and the floating button.

    let blooms = 0;
    try { blooms = Number(localStorage.getItem(STORAGE + "bam-blooms") || 0); } catch (_) {}
    const count = $(".bam-bloom-count", card);
    count.textContent = `${blooms} bloom${blooms === 1 ? "" : "s"} sent 🌸`;

    const openCard = () => card.classList.add("show");
    const closeCard = () => card.classList.remove("show");
    badge.addEventListener("click", openCard);
    $(".bam-birthday-close", card).addEventListener("click", closeCard);
    card.addEventListener("click", e => { if (e.target === card) closeCard(); });

    $(".bam-bloom-btn", card).addEventListener("click", () => {
      blooms += 1;
      try { localStorage.setItem(STORAGE + "bam-blooms", String(blooms)); } catch (_) {}
      count.textContent = `${blooms} bloom${blooms === 1 ? "" : "s"} sent 🌸`;
      birthdayBloomBurst();
    });

    let sealTaps = 0;
    const seal = $(".bam-birthday-seal", card);
    const tapSeal = () => {
      sealTaps += 1;
      seal.classList.remove("tap"); void seal.offsetWidth; seal.classList.add("tap");
      if (sealTaps >= 8) {
        $(".bam-eight-secret", card).classList.add("show");
        birthdayBloomBurst(true);
        sealTaps = 0;
      }
    };
    seal.addEventListener("click", tapSeal);
    seal.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tapSeal(); } });

    // Quiet automatic welcome once per browser on Oct 8 Bangkok time.
    if (once("bam-birthday-2026")) {
      setTimeout(() => {
        toast("A little more pink today. 🌸", "It’s 10.08 in Thailand. Happy Bam Day. ♡", "🩷 🦭 🌸");
        birthdayBloomBurst();
      }, 2600);
    }
  }

  function birthdayBloomBurst(big = false) {
    const root = stage(); if (!root) return;
    const box = document.createElement("div");
    box.className = "bam-birthday-blooms";
    const glyphs = ["🌸","🩷","♡","🌸","✦","🩷","🌸","♡","✧","🌸","🩷","🌸"];
    const total = big ? 28 : 14;
    for (let i = 0; i < total; i++) {
      const s = document.createElement("span");
      s.textContent = glyphs[i % glyphs.length];
      s.style.setProperty("--x", `${4 + ((i * 37) % 92)}%`);
      s.style.setProperty("--d", `${(i % 7) * .09}s`);
      s.style.setProperty("--r", `${-35 + ((i * 19) % 70)}deg`);
      box.appendChild(s);
    }
    // Attach to body, outside the teaser stacking context and above the modal.
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 5600);
  }

  // WEEK 3 — only comes alive during the 11:11 minute in Philippine time.
  function elevenEleven() {
    let shownKey = "";
    const check = () => {
      const p = phParts();
      const isMagicMinute = p.minute === 11 && (p.hour === 11 || p.hour === 23);
      const key = `${p.date}-${p.hour}`;
      if (!isMagicMinute || shownKey === key) return;
      shownKey = key;
      document.body.classList.add("pakulo-1111-active");
      toast("11:11 — Right place. Right time.", "Some moments are meant to be found.", "✦ 11:11 🌸");
      burstSky();
      setTimeout(() => document.body.classList.remove("pakulo-1111-active"), 55000);
    };
    check();
    setInterval(check, 1000);
  }

  function burstSky() {
    const root = stage();
    if (!root) return;
    const box = document.createElement("div");
    box.className = "pakulo-sky";
    const glyphs = ["✦","✧","🌸","♡","☘","✦","🌸","✧","♡","✦","☘","🌸"];
    glyphs.forEach((g, i) => {
      const s = document.createElement("span"); s.textContent = g;
      s.style.setProperty("--x", `${5 + (i * 8.1) % 90}%`);
      s.style.setProperty("--d", `${(i % 5) * .18}s`);
      box.appendChild(s);
    });
    root.appendChild(box);
    setTimeout(() => box.remove(), 7000);
  }

  // WEEK 4 — nine tiny symbols are scattered around the teaser. Progress persists.
  function bloomHunt() {
    const root = stage();
    if (!root) return;
    const symbols = ["☘","🌸","☁","★","🩵","🩷","🐧","🦭","🐸"];
    let found = [];
    try { found = JSON.parse(localStorage.getItem(STORAGE + "bloom-found") || "[]"); } catch (_) {}
    const positions = [[9,24],[88,31],[17,49],[81,57],[10,73],[90,80],[27,90],[73,94],[50,64]];

    symbols.forEach((symbol, i) => {
      if (found.includes(i)) return;
      const b = document.createElement("button");
      b.type = "button"; b.className = "bloom-token"; b.textContent = symbol;
      b.style.left = positions[i][0] + "%"; b.style.top = positions[i][1] + "%";
      b.setAttribute("aria-label", `Hidden bloom ${i + 1}`);
      root.appendChild(b);
      b.addEventListener("click", () => {
        if (!found.includes(i)) found.push(i);
        try { localStorage.setItem(STORAGE + "bloom-found", JSON.stringify(found)); } catch (_) {}
        b.classList.add("found");
        setTimeout(() => b.remove(), 500);
        if (found.length === symbols.length) {
          toast("The bloom trail is complete. 🌸", "Something beautiful is almost ready to bloom.", "☘ 🌸 ☁ ★ 🩵 🩷 🐧 🦭 🐸");
        } else {
          toast(`${found.length} / ${symbols.length} found`, "Keep looking…", symbol);
        }
      });
    });
  }

  // WEEK 5 — one playful faux terminal interruption per PH day.
  function archiveGlitch() {
    const p = phParts();
    if (!once(`glitch-${p.date}`)) return;
    setTimeout(() => {
      const root = stage(); if (!root) return;
      const el = document.createElement("div");
      el.className = "archive-glitch";
      el.innerHTML = `<div><span>ARCHIVE ACCESS...</span><span>checking...</span><span>not yet.</span><i></i><strong>Nice try, Blossom. ♡</strong></div>`;
      root.appendChild(el);
      requestAnimationFrame(() => el.classList.add("show"));
      setTimeout(() => el.classList.add("answer"), 2100);
      setTimeout(() => el.classList.remove("show"), 4400);
      setTimeout(() => el.remove(), 5000);
    }, 6500);
  }

  // WEEK 6 — original teaser copy; deliberately not presented as a real quote from Oom or Bam.
  function archiveWhisper() {
    const p = phParts();
    if (!once(`whisper-${p.date}`)) return;
    const messages = [
      "A little closer now. Thank you for waiting with us. ♡",
      "Some memories wait quietly until the right moment to bloom.",
      "The doors are still closed… but the light is already getting through.",
      "Keep a little room for one more surprise. 🌸"
    ];
    const dayNum = Number(p.date.slice(-2));
    setTimeout(() => toast("A whisper from the archive…", messages[dayNum % messages.length], "💌 ✦ 🌸"), 8000);
  }

  // LAUNCH WEEK — a gentle once-per-day veil, with a stronger state after launch.
  function finalCountdown() {
    const launch = new Date("2026-11-11T23:11:00+08:00");
    const now = new Date();
    const p = phParts(now);
    if (now >= launch) {
      document.body.classList.add("pakulo-launched");
      if (once("launch-open")) {
        setTimeout(() => toast("11:11 ✦", "The wait is over. Something beautiful has bloomed.", "🐧 ♡ 🦭 🌸"), 1000);
        burstSky();
      }
      return;
    }
    if (!once(`final-${p.date}`)) return;
    setTimeout(() => toast("One more sleep… ✦", "See you at 11.11.26 — 11:11 PM PH.", "☘ 🐧 ♡ 🦭 🌸"), 6000);
  }

  function init() {
    // Birthday takes priority for exactly one Bangkok calendar day.
    // The Oct 4 Secret Visitor week resumes automatically after midnight TH time.
    if (isBamBirthday()) {
      document.documentElement.dataset.pakulo = "bam-birthday";
      bamBirthday();
      return;
    }
    const event = activeEvent();
    if (!event) return;
    document.documentElement.dataset.pakulo = event.id;
    ({ visitor: secretVisitor, "1111": elevenEleven, bloom: bloomHunt, glitch: archiveGlitch, whisper: archiveWhisper, final: finalCountdown }[event.id] || (() => {}))();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
