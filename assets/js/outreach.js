/* Outreach page: tabs for programmes, lab videos, mission videos and
   classroom resources. Media are listed in assets/outreach/manifest.json;
   videos are served from the repository's "outreach-media" release, and
   English and Hindi versions of a video are paired. */
(function () {
  "use strict";
  if (!document.getElementById("lab-grid") || !window.fetch) return;

  var KITS = [
    { id: "optics", title: "Optics", pages: ["optics"] },
    { id: "virtual-lab", title: "Virtual lab", pages: ["virtual-lab"] },
    { id: "radio", title: "Radio astronomy", pages: ["radio"] },
    { id: "robotics", title: "Robotics and IoT", pages: ["robotics", "iot"] },
    { id: "expeyes", title: "ExpEYES", pages: ["expeyes"] },
    { id: "model-kits", title: "Model kits", pages: ["model-kits"] }
  ];
  var MISSIONS = [
    { title: "National Space Day", pages: ["space-day"] },
    { title: "Chandrayaan-3", pages: ["chandrayaan-3"] },
    { title: "Aditya-L1", pages: ["aditya-l1"] }
  ];

  /* Clearer titles and languages for a few source files. */
  var FIX = {
    "spaceday_eng.mp4": { t: "Introduction to National Space Day", l: "English" },
    "spaceday_hindi.mp4": { t: "Introduction to National Space Day", l: "Hindi" },
    "Chandrayaan3_launch_promo.mp4": { t: "Chandrayaan-3: the mission", l: "Hindi" },
    "Aditya L1_promo_eng.mp4": { t: "Aditya-L1: the mission", l: "English" },
    "Solar system.mp4": { t: "Solar system model" },
    "newtons cradle.mp4": { t: "Newton’s cradle" }
  };
  var DOC = {
    "essays": "Essay topics", "Debates": "Debate topics", "Story Writing": "Story writing topics",
    "Hackathon": "Space hackathon: lunar craters", "Hackathon Solutions": "Space hackathon: solutions",
    "Quiz Questions": "Space quiz (English)", "Answer key": "Space quiz answer key (English)",
    "Chandrayaan 3: India's ambitious mission to reach the Moon": "Chandrayaan-3: India’s mission to the Moon (reading)",
    "Chandrayaan 3 Quiz Answer Key Hindi": "Chandrayaan-3 quiz answer key (Hindi)",
    "Aditya L1 MCQ Hindi": "Aditya-L1 quiz (Hindi)",
    "Aditya L1 Answer Keys English": "Aditya-L1 quiz answer key (English)",
    "Aditya L1 Answer Keys Hindi": "Aditya-L1 quiz answer key (Hindi)"
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function mmss(s) { s = Math.round(s || 0); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function lang(v) {
    if (FIX[v.file] && FIX[v.file].l) return FIX[v.file].l;
    var t = (v.caption + " " + v.file).toLowerCase();
    if (/hindi|\bhin\b|_hin|hin\./.test(t) || /[ऀ-ॿ]/.test(v.caption)) return "Hindi";
    if (/english|\beng\b|_eng|eng\./.test(t)) return "English";
    return "";
  }
  function baseTitle(v) {
    if (FIX[v.file]) return FIX[v.file].t;
    var t = v.caption || v.file.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ");
    return t.replace(/\s*\((English|Hindi)( Audio)?\)\s*$/i, "").replace(/\s+in (English|Hindi)$/i, "").trim();
  }
  function docTitle(f) {
    var k = f.replace(/\.[a-z0-9]+$/i, "");
    return DOC[k] || k.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function kb(n) { return n > 1e6 ? (n / 1e6).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1e3)) + " KB"; }

  /* Pair language versions of the same video. */
  function items(list, group) {
    var map = {}, order = [];
    list.forEach(function (v) {
      var key = baseTitle(v).toLowerCase().replace(/[^a-z0-9ऀ-ॿ]+/g, "");
      if (!map[key]) { map[key] = { title: baseTitle(v), group: group, variants: [] }; order.push(key); }
      map[key].variants.push({ lang: lang(v), v: v });
    });
    return order.map(function (k) {
      var it = map[k];
      it.variants.sort(function (a, b) { return a.lang === "English" ? -1 : b.lang === "English" ? 1 : 0; });
      return it;
    });
  }

  var pref = "English";
  function pick(it) {
    return (it.variants.filter(function (x) { return x.lang === pref; })[0] || it.variants[0]);
  }
  function card(it) {
    var p = pick(it);
    var langs = it.variants.map(function (x) { return x.lang; }).filter(Boolean);
    return '<article class="vcard">' +
      '<button type="button" class="vthumb" data-src="' + esc(p.v.src) + '" data-title="' + esc(it.title + (p.lang ? " (" + p.lang + ")" : "")) + '" aria-label="Play ' + esc(it.title) + '">' +
      '<img src="' + esc(p.v.thumb) + '" alt="" loading="lazy" width="320" height="180">' +
      '<span class="vdur">' + mmss(p.v.duration) + "</span>" +
      '<svg class="play" aria-hidden="true"><use href="assets/img/icons.svg#i-play"></use></svg></button>' +
      (it.group ? '<p class="label">' + esc(it.group) + "</p>" : "") +
      "<h3>" + esc(it.title) + "</h3>" +
      (langs.length ? '<p class="lang-row">' + it.variants.map(function (x) {
        return '<button type="button" class="chip' + (x === p ? " on" : "") + '" data-src="' + esc(x.v.src) + '" data-title="' + esc(it.title + " (" + x.lang + ")") + '">' + esc(x.lang || "Play") + "</button>";
      }).join("") + "</p>" : "") +
      "</article>";
  }

  var M = [], lab = [], missions = [], kitFilter = "all";
  function drawLab() {
    var list = lab.filter(function (it) { return kitFilter === "all" || it.kit === kitFilter; });
    document.getElementById("lab-grid").innerHTML = list.map(card).join("");
    document.getElementById("lab-count").textContent = list.length + (list.length === 1 ? " video" : " videos");
  }
  function drawMissions() {
    document.getElementById("mission-grid").innerHTML = missions.map(card).join("");
  }

  fetch("assets/outreach/manifest.json").then(function (r) { return r.ok ? r.json() : []; }).then(function (data) {
    M = data || [];
    if (!M.length) return;
    var by = function (pages, kind) { return M.filter(function (m) { return pages.indexOf(m.page) > -1 && (!kind || m.kind === kind); }); };

    KITS.forEach(function (k) {
      items(by(k.pages, "video"), k.title).forEach(function (it) { it.kit = k.id; lab.push(it); });
    });
    MISSIONS.forEach(function (k) { items(by(k.pages, "video"), k.title).forEach(function (it) { missions.push(it); }); });

    var chips = document.getElementById("kit-filter");
    chips.innerHTML = [{ id: "all", title: "All kits" }].concat(KITS).map(function (k) {
      var n = k.id === "all" ? lab.length : lab.filter(function (it) { return it.kit === k.id; }).length;
      return '<button type="button" class="filter" data-kit="' + k.id + '" aria-pressed="' + (k.id === kitFilter) + '">' + esc(k.title) + ' <span class="count">' + n + "</span></button>";
    }).join("");
    chips.addEventListener("click", function (e) {
      var b = e.target.closest("[data-kit]"); if (!b) return;
      kitFilter = b.getAttribute("data-kit");
      chips.querySelectorAll("[data-kit]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      drawLab();
    });
    document.getElementById("lang-switch").addEventListener("click", function (e) {
      var b = e.target.closest("[data-lang]"); if (!b) return;
      pref = b.getAttribute("data-lang");
      this.querySelectorAll("[data-lang]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      drawLab(); drawMissions();
    });
    drawLab(); drawMissions();

    var groups = [["National Space Day kit", ["space-day"]], ["Chandrayaan-3", ["chandrayaan-3"]], ["Aditya-L1", ["aditya-l1"]]];
    document.getElementById("resource-list").innerHTML = groups.map(function (g) {
      var docs = M.filter(function (m) { return g[1].indexOf(m.page) > -1 && (m.kind === "doc" || m.kind === "pdf"); });
      if (!docs.length) return "";
      return '<div class="res-group"><h3>' + esc(g[0]) + '</h3><ul class="res-list">' + docs.map(function (d) {
        return '<li><a href="' + esc(d.src) + '"><svg class="icon" aria-hidden="true"><use href="assets/img/icons.svg#i-pdf"></use></svg>' + esc(docTitle(d.file)) +
          '</a><span class="mono muted">PDF' + (d.bytes ? " · " + kb(d.bytes) : "") + "</span></li>";
      }).join("") + "</ul></div>";
    }).join("");

    var total = M.filter(function (m) { return m.kind === "video"; }).length;
    var docsN = M.filter(function (m) { return m.kind === "doc" || m.kind === "pdf"; }).length;
    var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    set("stat-videos", total); set("stat-docs", docsN);
    set("tabc-lab", lab.length); set("tabc-missions", missions.length); set("tabc-res", docsN);
  }).catch(function () {});

  /* Player */
  var dlg = document.getElementById("vplayer");
  document.addEventListener("click", function (e) {
    var b = e.target.closest("main [data-src]"); if (!b || !dlg || !dlg.showModal) return;
    dlg.querySelector(".vp-frame").innerHTML = '<video controls autoplay playsinline preload="metadata" src="' + esc(b.getAttribute("data-src")) + '"></video>';
    dlg.querySelector(".vp-title").textContent = b.getAttribute("data-title") || "";
    dlg.showModal();
  });
  function close() { dlg.querySelector(".vp-frame").innerHTML = ""; dlg.close(); }
  if (dlg) {
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest("[data-close]")) close(); });
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); close(); });
  }
})();
