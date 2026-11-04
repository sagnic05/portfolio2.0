// GitHub archive: public REST API, no token, cached in localStorage for 10 minutes.
(function () {
  const C = window.CONFIG, PER = 9, TTL = 600000;
  const el = id => document.getElementById(id);
  let repos = [], shown = PER;

  async function load() {
    const key = "gh-repos-" + C.user;
    try {
      const c = JSON.parse(localStorage.getItem(key) || "null");
      if (c && Date.now() - c.t < TTL) return c.d;
    } catch (e) {}
    let all = [];
    for (let p = 1; p <= 5; p++) {
      const r = await fetch(`https://api.github.com/users/${C.user}/repos?per_page=100&page=${p}&type=owner`);
      if (r.status === 403) throw new Error("GitHub's anonymous rate limit was reached. Try again in a few minutes.");
      if (!r.ok) throw new Error("GitHub returned an error (" + r.status + ").");
      const d = await r.json(); all = all.concat(d);
      if (d.length < 100) break;
    }
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: all })); } catch (e) {}
    return all;
  }

  function view() {
    const q = el("q").value.trim().toLowerCase(), lang = el("lang").value, sort = el("sort").value;
    let list = repos.filter(r => (!lang || r.language === lang) &&
      (!q || (r.name + " " + (r.description || "")).toLowerCase().includes(q)));
    list.sort((a, b) => sort === "stars" ? b.stargazers_count - a.stargazers_count
      : sort === "name" ? a.name.localeCompare(b.name) : new Date(b.pushed_at) - new Date(a.pushed_at));
    const box = el("repos"); box.textContent = "";
    if (!list.length) { box.innerHTML = '<p class="state">No repositories match. Clear the search or choose another language.</p>'; el("more").hidden = true; return; }
    list.slice(0, shown).forEach(r => {
      const a = document.createElement("a");
      a.className = "repo"; a.href = r.html_url; a.target = "_blank"; a.rel = "noopener";
      const b = document.createElement("b"); b.textContent = r.name;
      const d = document.createElement("p"); d.textContent = r.description || "No description yet.";
      const m = document.createElement("span");
      m.textContent = [r.language || "n/a", "★ " + r.stargazers_count, "Forks " + r.forks_count,
        "Updated " + new Date(r.pushed_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })].join("  |  ");
      a.append(b, d, m); box.append(a);
    });
    el("more").hidden = list.length <= shown;
  }

  async function init() {
    el("repos").innerHTML = '<p class="state">Loading repositories…</p>';
    try {
      repos = (await load()).filter(r => !r.fork && !C.featured.includes(r.name.toLowerCase()) && r.name.toLowerCase() !== C.user + ".github.io");
      [...new Set(repos.map(r => r.language).filter(Boolean))].sort().forEach(l => {
        const o = document.createElement("option"); o.value = o.textContent = l; el("lang").append(o);
      });
      view();
    } catch (e) {
      el("repos").innerHTML = "";
      const p = document.createElement("p"); p.className = "state";
      p.textContent = e.message + " You can browse everything directly on GitHub.";
      el("repos").append(p);
    }
  }
  ["q", "lang", "sort"].forEach(i => el(i).addEventListener("input", () => { shown = PER; view(); }));
  el("more").addEventListener("click", () => { shown += PER; view(); });
  init();
})();
