// Cinematic opening: self-contained, vanilla JS + canvas. Plays once per session; replay from the footer.
(function () {
  const body = document.body, root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seen = () => { try { return !!sessionStorage.getItem("introSeen"); } catch (e) { return false; } };
  const mark = () => { try { sessionStorage.setItem("introSeen", "1"); } catch (e) {} };
  const rb = document.getElementById("replay");
  const $$ = s => [...document.querySelectorAll(s)];
  let busy = false;

  function restartHero() { // let the hero choreography start from frame one, exactly once
    const els = $$(".name .l,.hero-text>*,.stage"); els.forEach(e => e.style.animation = "none"); void document.body.offsetWidth; els.forEach(e => e.style.animation = "");
  }
  function lock(on) { root.classList.toggle("intro-open", on); ["main", ".nav", ".foot"].forEach(s => { const e = document.querySelector(s); if (e) on ? e.setAttribute("inert", "") : e.removeAttribute("inert"); }); }

  function play(first) {
    if (busy) return; busy = true;
    if (!first) { scrollTo(0, 0); body.classList.remove("ready"); restartHero(); }
    const o = document.createElement("div"); o.id = "cine"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Portfolio introduction");
    const word = t => '<span class="w">' + [...t].map(ch => '<span class="c" aria-hidden="true">' + ch + "</span>").join("") + "</span>";
    let n = 0; const name = "Sagnic Bhattacharyya".split(" ").map(w => word(w)).join("");
    o.innerHTML = '<canvas aria-hidden="true"></canvas><div class="cglow"></div><i class="ring r2"></i><i class="ring r1"></i><div class="grain"></div>' +
      '<div class="id"><h2 aria-label="Sagnic Bhattacharyya">' + name + '</h2><p class="sub">Creative Developer | Building Digital Experiences</p></div>' +
      '<div class="sweep"></div><div class="stage2"><p class="wel">Welcome to my digital world</p><button class="enter" type="button">ENTER EXPERIENCE →</button></div>' +
      '<div class="burst"></div><i class="ld" aria-hidden="true"></i><button class="skip" type="button">Skip intro</button>';
    o.querySelectorAll(".c").forEach(c => c.style.setProperty("--i", n++));
    body.append(o); lock(true); root.classList.remove("intro-pending");

    // Particles: drift -> converge (sweep) -> burst outward (enter)
    const cv = o.querySelector("canvas"), cx = cv.getContext("2d"); let W, H, ps = [], mode = "idle", alive = true;
    const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
    size(); addEventListener("resize", size);
    const N = Math.min(110, Math.round(innerWidth / 11)); for (let i = 0; i < N; i++) ps.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, z: Math.random() * .8 + .2, t: Math.random() * 6 });
    (function frame() {
      if (!alive) return; cx.clearRect(0, 0, W, H); const mx = W / 2, my = H / 2;
      ps.forEach(p => { p.t += .03; const dx = mx - p.x, dy = my - p.y;
        if (mode === "idle") { p.y -= p.z * .25; if (p.y < 0) p.y = H; } else if (mode === "in") { p.x += dx * .02 * p.z; p.y += dy * .02 * p.z; } else { p.x -= dx * .05 * p.z; p.y -= dy * .05 * p.z; }
        const a = (.25 + .35 * Math.sin(p.t)) * p.z; cx.fillStyle = "rgba(196,181,253," + Math.max(.05, a) + ")"; cx.beginPath(); cx.arc(p.x, p.y, p.z * 1.7, 0, 7); cx.fill(); });
      requestAnimationFrame(frame);
    })();

    // Loading: no artificial wait. Only show a dot if fonts are not ready quickly.
    const ld = o.querySelector(".ld"), tLd = setTimeout(() => ld.classList.add("on"), 300);
    const ready = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2500))]);
    const timers = []; const at = (ms, f) => timers.push(setTimeout(f, ms));
    ready.then(() => {
      clearTimeout(tLd); ld.classList.remove("on"); if (!alive) return;
      requestAnimationFrame(() => o.classList.add("t0"));
      at(350, () => o.classList.add("t1")); at(1500, () => o.classList.add("t2"));
      at(2300, () => { o.classList.add("t3"); mode = "in"; }); at(2900, () => { o.classList.add("t4"); mode = "idle"; }); at(3900, () => o.classList.add("t5"));
    });

    const enter = o.querySelector(".enter"), skip = o.querySelector(".skip");
    skip.focus({ preventScroll: true });
    if (matchMedia("(hover:hover) and (pointer:fine)").matches) { enter.addEventListener("pointermove", e => { const r = enter.getBoundingClientRect(); enter.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; }); enter.addEventListener("pointerleave", () => enter.style.transform = ""); }

    function finish(fast) {
      if (!alive || o.dataset.done) return; o.dataset.done = 1; timers.forEach(clearTimeout); clearTimeout(tLd); mark(); removeEventListener("keydown", key);
      const done = () => { alive = false; removeEventListener("resize", size); o.remove(); lock(false); busy = false; };
      lock(false); // page becomes interactive as it is revealed
      if (fast) { body.classList.add("ready"); done(); return; }
      o.classList.add("go"); mode = "out"; o.style.pointerEvents = "none";
      const t0 = performance.now(), D = 1100; let started = false;
      (function grow(t) { const p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 3), r = e * 80;
        const m = "radial-gradient(circle at 50% 50%, transparent " + r + "%, #000 " + (r + 6) + "%)"; o.style.webkitMaskImage = o.style.maskImage = m;
        if (!started && p > .25) { started = true; body.classList.add("ready"); } // hero emerges as the circle opens
        p < 1 ? requestAnimationFrame(grow) : done(); })(t0);
    }
    function key(e) { if (e.key === "Escape") finish(true); }
    addEventListener("keydown", key);
    enter.onclick = () => finish(false); skip.onclick = () => finish(true);
    setTimeout(() => { if (!document.getElementById("cine")) return; }, 0);
  }

  if (reduce) { body.classList.add("ready"); root.classList.remove("intro-pending"); if (rb) rb.hidden = true; }
  else if (seen()) { body.classList.add("ready"); root.classList.remove("intro-pending"); }
  else play(true);
  if (rb) rb.onclick = () => { if (!reduce) play(false); };
})();
