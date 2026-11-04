(function () {
  const C = window.CONFIG, $ = id => document.getElementById(id), $$ = s => [...document.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt) e.textContent = txt; return e; };

  // Original assets: local copy first, then the live copy of the existing portfolio. Never altered.
  function withFallback(img, file) { img.src = "assets/images/" + file; img.onerror = () => { img.onerror = null; img.src = REMOTE + file; }; }
  withFallback($("profile"), "profile.jpg");
  $("gh-link").href = $("gh2").href = C.github; $("li").href = C.linkedin;
  $("mail").href = "mailto:" + C.email; $("mail").textContent = C.email;
  ["resume-dl", "resume-dl2", "resume-view"].forEach(i => $(i).href = C.resume);
  $("graph").src = "https://ghchart.rshah.org/8b5cf6/" + C.user; $("graph").onerror = e => e.target.remove(); $("graph-link").href = C.github;
  if (location.protocol.startsWith("http")) fetch(C.resume, { method: "HEAD" }).then(r => { if (!r.ok) throw 0; }).then(() => { $("resume-view").onclick = e => { e.preventDefault(); openPv({ title: "Resume", live: C.resume }); }; }).catch(() => {
    ["resume-dl", "resume-dl2", "resume-view"].forEach(i => { const a = $(i); a.removeAttribute("download"); a.target = ""; a.href = "mailto:" + C.email + "?subject=Resume request"; a.textContent = "Request resume by email"; });
  });

  // Toast + copy
  function toast(m) { const t = $("toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200); }
  $("copy").onclick = async () => { try { await navigator.clipboard.writeText(C.email); toast("Email copied to clipboard"); } catch (e) { toast("Copy failed. Select the address instead."); } };

  // Theme
  const tb = $("theme"), root = document.documentElement;
  function setTheme(t) { root.dataset.theme = t; tb.textContent = t === "light" ? "Dark" : "Light"; tb.setAttribute("aria-label", "Switch to " + (t === "light" ? "dark" : "light") + " mode"); try { localStorage.setItem("theme", t); } catch (e) {} }
  setTheme(root.dataset.theme === "light" ? "light" : "dark"); tb.onclick = () => setTheme(root.dataset.theme === "light" ? "dark" : "light");

  // Hero: split name into letters, rotate titles
  let n = 0; $$("#name>span").forEach(s => { const t = s.textContent; s.textContent = ""; [...t].forEach(ch => { const l = el("span", "l", ch); l.style.setProperty("--i", n++); l.setAttribute("aria-hidden", "true"); s.append(l); }); });
  const titles = ["Creative Developer", "Software Engineer", "B.Tech CSE Student"], ty = $("typed");
  if (!reduce) { let i = 0, k = 0, del = false; (function tick() { const w = titles[i]; k += del ? -1 : 1; ty.textContent = w.slice(0, k);
    let d = del ? 35 : 75; if (!del && k === w.length) { del = true; d = 1600; } else if (del && k === 0) { del = false; i = (i + 1) % titles.length; d = 300; } setTimeout(tick, d); })(); }
  const mq = $("track"); [...Object.values(C.skills).flat(), ...Object.values(C.skills).flat()].forEach(s => mq.append(el("span", "", s)));

  // Skill constellation
  const cats = Object.keys(C.skills), box = $("const"), svg = $("lines"), nodes = [], tabs = document.querySelector(".tabs"); let active = null;
  function layout() {
    const W = box.clientWidth, H = box.clientHeight; svg.textContent = "";
    nodes.forEach(o => {
      const ci = cats.indexOf(o.cat), a = ci / cats.length * 6.283 - 1.57, cx = W / 2 + Math.cos(a) * W * .3, cy = H / 2 + Math.sin(a) * H * .3;
      if (o.hub) { o.x = cx; o.y = cy; } else { const b = a + (o.i + 1) / (C.skills[o.cat].length + 1) * 3.4 - 1.7 + 0.0, r = Math.min(W, H) * (.16 + (o.i % 2) * .08); o.x = cx + Math.cos(b) * r * 1.5; o.y = cy + Math.sin(b) * r; }
      o.x = Math.max(60, Math.min(W - 60, o.x)); o.y = Math.max(24, Math.min(H - 24, o.y)); o.e.style.left = o.x + "px"; o.e.style.top = o.y + "px";
    });
    nodes.filter(o => !o.hub).forEach(o => { const h = nodes.find(m => m.hub && m.cat === o.cat); const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("x1", h.x); l.setAttribute("y1", h.y); l.setAttribute("x2", o.x); l.setAttribute("y2", o.y); l.dataset.cat = o.cat; svg.append(l); });
    focus(active);
  }
  function focus(cat) { active = cat; $$(".tabs button").forEach(b => b.classList.toggle("on", b.textContent === cat));
    nodes.forEach(o => o.e.classList.toggle("dim", !!cat && o.cat !== cat)); $$("#lines line").forEach(l => l.classList.toggle("dim", !!cat && l.dataset.cat !== cat)); }
  cats.forEach((cat, ci) => {
    const b = el("button", "", cat); b.onclick = () => focus(active === cat ? null : cat); tabs.append(b);
    [cat, ...C.skills[cat]].forEach((s, i) => { const e = el("span", "node" + (i ? "" : " hub"), s); e.style.animationDelay = -(ci * 1.3 + i * .7) + "s";
      e.onmouseenter = () => focus(cat); e.onmouseleave = () => focus(null); box.append(e); nodes.push({ e, cat, hub: !i, i: i - 1 }); });
  });
  layout(); addEventListener("resize", layout);

  // Projects
  C.projects.forEach((p, idx) => {
    const art = el("article", "proj reveal"), pad = String(idx + 1).padStart(2, "0");
    art.innerHTML = '<span class="pnum" aria-hidden="true">' + pad + '</span><div class="frame"></div><div class="info panel"><h3></h3><p></p><ul class="tags"></ul><div class="cta"></div></div>';
    art.classList.add("l-" + (p.layout || "split"));
    const a = el("a", "shot"); a.href = p.live || p.repo; a.setAttribute("aria-label", "Preview " + p.title);
    if (p.img) { const img = el("img"); img.loading = "lazy"; img.alt = p.title + " project screenshot"; withFallback(img, p.img); a.append(img); } else { a.classList.add("none"); a.textContent = p.title; }
    a.onclick = e => { if (!p.live) return; e.preventDefault(); openPv(p); };
    if (p.layout === "browser") { const bw = el("div", "bw"); bw.innerHTML = "<div class='bar'><i></i><i></i><i></i><em></em></div>"; bw.querySelector("em").textContent = p.live; bw.append(a); art.querySelector(".frame").append(bw); } else art.querySelector(".frame").append(a);
    if (p.feats) { const f = el("ul", "feats"); p.feats.forEach(x => f.append(el("li", "", x))); art.querySelector("p").after(f); } art.querySelector("h3").textContent = p.title; art.querySelector("p").textContent = p.text;
    p.tech.forEach(t => art.querySelector(".tags").append(el("li", "", t)));
    const cta = art.querySelector(".cta");
    if (p.live) { const b = el("button", "btn primary", "Preview live"); b.onclick = () => openPv(p); cta.append(b); }
    [["Source", p.repo]].forEach(([t, h]) => { const l = el("a", "btn", t); l.href = h; l.target = "_blank"; l.rel = "noopener"; cta.append(l); });
    $("projects").append(art);
    if (!reduce && fine) a.addEventListener("pointermove", e => { const r = a.getBoundingClientRect(); a.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 8 + "deg"); a.style.setProperty("--rx", ((e.clientY - r.top) / r.height - .5) * -8 + "deg"); });
    a.addEventListener("pointerleave", () => { a.style.setProperty("--rx", "0deg"); a.style.setProperty("--ry", "0deg"); });
  });
  function openPv(p) { $("pv-title").textContent = p.title; $("pv-open").href = p.live; $("pv-frame").src = p.live; $("pv").showModal(); }
  $("pv-close").onclick = () => $("pv").close(); $("pv").addEventListener("close", () => $("pv-frame").src = "about:blank");
  $("pv").addEventListener("click", e => { if (e.target === $("pv")) $("pv").close(); });

  if (C.certImage) { const cc = $("cert-card"); cc.classList.add("link"); cc.tabIndex = 0; cc.onclick = () => { $("cert").showModal(); }; }
  // Journey
  C.journey.forEach(j => { const li = el("li", "panel reveal"); li.append(el("small", "", j.when), el("h3", "", j.title), el("p", "", j.text)); $("timeline").append(li); });
  if (C.certImage) { const d = $("cert"); d.querySelector("img").src = C.certImage; $("cert-btn").hidden = false; $("cert-btn").onclick = () => d.showModal(); $("cert-close").onclick = () => d.close(); }

  // About: words light up with scroll
  const big = $("big"), words = big.textContent.split(" "); big.textContent = ""; const ws = words.map(w => { const s = el("span", "w", w + " "); big.append(s); return s; });

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .2 });
  $$(".reveal,.sh").forEach(x => io.observe(x));

  // Scroll: progress, word scrub, timeline fill, parallax
  const bar = document.querySelector(".progress"), tl = $("timeline"); let ticking = false;
  function onScroll() {
    ticking = false; const y = scrollY; bar.style.width = y / (document.documentElement.scrollHeight - innerHeight) * 100 + "%";
    const hp = Math.min(1, y / innerHeight), ht = document.querySelector(".hero-text"); if (!reduce && hp < 1) { ht.style.opacity = 1 - hp * 1.1; ht.style.transform = "translateY(" + hp * 60 + "px)"; }
    const r = big.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (innerHeight * .55 + r.height)));
    ws.forEach((w, i) => w.classList.toggle("on", i / ws.length < p * 1.1));
    const t = tl.getBoundingClientRect(); tl.style.setProperty("--fill", Math.min(1, Math.max(0, (innerHeight * .6 - t.top) / t.height)));
    if (!reduce) $$(".shot img").forEach(i => { const q = i.getBoundingClientRect(); i.style.setProperty("--py", ((q.top + q.height / 2 - innerHeight / 2) * -.05) + "px"); });
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();

  // Nav: active section + sliding indicator, mobile menu
  const links = $$("#links a"), ind = document.querySelector(".ind"), ul = $("links"), mb = document.querySelector(".menu-btn");
  function mark(a) { links.forEach(l => l.classList.toggle("active", l === a)); if (a) { ind.style.left = a.offsetLeft + "px"; ind.style.width = a.offsetWidth + "px"; } else ind.style.width = 0; }
  $$("main section[id]").forEach(s => new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) mark(links.find(a => a.hash === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" }).observe(s));
  mb.onclick = () => mb.setAttribute("aria-expanded", ul.classList.toggle("open"));
  links.forEach(a => a.addEventListener("click", () => { ul.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); }));

  // Magnetic buttons, portrait parallax, custom cursor (desktop only)
  if (!reduce && fine) {
    $$(".magnetic").forEach(b => { b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .2}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; }); b.addEventListener("pointerleave", () => b.style.transform = ""); });
    const st = $("stage"); addEventListener("pointermove", e => { if (scrollY < innerHeight) st.style.transform = `translate(${(e.clientX / innerWidth - .5) * -22}px,${(e.clientY / innerHeight - .5) * -16}px)`; });
  }
  if (fine) {
    const dot = document.querySelector(".cur-dot"), ring = document.querySelector(".cur-ring"); let mx = -50, my = -50, rx = -50, ry = -50;
    document.body.classList.add("cur");
    addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    (function f() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(f); })();
    document.addEventListener("pointerover", e => ring.classList.toggle("big", !!e.target.closest("a,button,input,select,.node")));
  }

  // Starfield with mouse parallax and occasional shooting star
  const cv = $("stars"), cx = cv.getContext("2d"); let W, H, st = [], sh = null, px = 0, py = 0;
  function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; st = Array.from({ length: Math.min(160, W / 8) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .2, s: Math.random() * .2 + .03, z: Math.random() * .04 + .01, t: Math.random() * 6 })); }
  addEventListener("pointermove", e => { px = e.clientX / W - .5; py = e.clientY / H - .5; });
  function draw() {
    cx.clearRect(0, 0, W, H);
    st.forEach(s => { s.t += .02; cx.fillStyle = "rgba(196,181,253," + (.3 + .35 * Math.sin(s.t) * s.r / 1.6 + s.r / 4) + ")"; cx.beginPath(); cx.arc((s.x + px * s.r * -30 + W) % W, (s.y + py * s.r * -30 + H) % H, s.r, 0, 7); cx.fill(); s.y -= s.s; if (s.y < 0) s.y = H; });
    if (!sh && Math.random() < .004) sh = { x: Math.random() * W, y: Math.random() * H * .4, l: 0 };
    if (sh) { const g = cx.createLinearGradient(sh.x, sh.y, sh.x - 90, sh.y - 45); g.addColorStop(0, "rgba(248,247,255,.9)"); g.addColorStop(1, "transparent"); cx.strokeStyle = g; cx.beginPath(); cx.moveTo(sh.x, sh.y); cx.lineTo(sh.x - 90, sh.y - 45); cx.stroke(); sh.x += 14; sh.y += 7; if (++sh.l > 50) sh = null; }
    if (!document.hidden) requestAnimationFrame(draw);
  }
  size(); addEventListener("resize", size);
  if (reduce) { px = py = 0; draw = (d => () => { d(); })(draw); cx.clearRect(0, 0, W, H); st.forEach(s => { cx.fillStyle = "rgba(196,181,253,.5)"; cx.fillRect(s.x, s.y, s.r, s.r); }); }
  else { draw(); document.addEventListener("visibilitychange", () => { if (!document.hidden) draw(); }); }
})();
