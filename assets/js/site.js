/* Shared behaviour: menu, theme toggle, tabs, and rendering of data.js lists. */
(function () {
  "use strict";
  var root = document.documentElement;
  var SITE = window.SITE || {};
  var ICONS = "assets/img/icons.svg";

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) { return null; }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name) {
    return '<svg class="icon" aria-hidden="true"><use href="' + ICONS + "#i-" + name + '"></use></svg>';
  }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function monthYear(d) {
    if (!d) return "";
    var p = String(d).split("-");
    return p[1] ? MONTHS[+p[1] - 1] + " " + p[0] : p[0];
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Light / dark toggle ---------- */
  var themeBtn = document.querySelector(".theme-toggle");
  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function paintThemeBtn() {
    if (!themeBtn) return;
    var dark = isDark();
    themeBtn.innerHTML = icon(dark ? "sun" : "moon");
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeBtn.title = themeBtn.getAttribute("aria-label");
  }
  if (themeBtn) {
    paintThemeBtn();
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store("ka-theme", next);
      paintThemeBtn();
    });
  }

  /* ---------- Design preview bar (set from design.html) ---------- */
  var DEFAULTS = { palette: "prussian", font: "source", layout: "topbar" };
  var preview = null;
  try { preview = JSON.parse(store("ka-design") || "null"); } catch (e) { preview = null; }
  if (preview && !document.body.hasAttribute("data-no-preview-bar")) {
    var differs = Object.keys(DEFAULTS).some(function (k) { return preview[k] && preview[k] !== DEFAULTS[k]; });
    if (differs) {
      var bar = document.createElement("div");
      bar.className = "preview-bar";
      bar.innerHTML = "<span>Preview: " + esc(preview.palette) + " / " + esc(preview.font) + " / " + esc(preview.layout) +
        '</span><a href="design.html">Change</a><button type="button">Reset</button>';
      bar.querySelector("button").addEventListener("click", function () { store("ka-design", null); location.reload(); });
      document.body.appendChild(bar);
    }
  }

  /* ---------- Tabs ---------- */
  function initTabs(container) {
    var tabs = Array.prototype.slice.call(container.querySelectorAll('[role="tab"]'));
    function select(tab, push) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (push && tab.dataset.hash) history.replaceState(null, "", "#" + tab.dataset.hash);
      container.dispatchEvent(new CustomEvent("tabchange", { detail: tab }));
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(t, true); });
      t.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus(); select(n, true);
      });
    });
    var start = tabs.filter(function (t) { return t.dataset.hash && "#" + t.dataset.hash === location.hash; })[0] || tabs[0];
    if (start) select(start, false);
  }

  /* ---------- Publications ---------- */
  function pubHTML(p) {
    var href = p.doi ? "https://doi.org/" + p.doi : p.url;
    var authors = esc(p.authors).replace(/Aggarwal, K\./g, '<span class="me">Aggarwal, K.</span>');
    var links = [];
    if (p.doi) links.push('<a class="chip" href="https://doi.org/' + esc(p.doi) + '">DOI</a>');
    else if (p.url) links.push('<a class="chip" href="' + esc(p.url) + '">Link</a>');
    if (p.arxiv) links.push('<a class="chip" href="https://arxiv.org/abs/' + esc(p.arxiv) + '">arXiv</a>');
    if (p.ads) links.push('<a class="chip" href="' + esc(p.ads) + '">ADS</a>');
    if (p.code) links.push('<a class="chip" href="' + esc(p.code) + '">Code</a>');
    var tags = (p.missions || []).map(function (m) { return '<span class="chip tag">' + esc(m) + "</span>"; }).join("");
    return '<li class="pub">' +
      '<p class="pub-title"><a href="' + esc(href) + '">' + esc(p.title) + "</a></p>" +
      '<p class="pub-authors">' + authors + "</p>" +
      '<div class="pub-meta"><span class="pub-venue">' + esc(p.venue) + '</span><span class="mono muted">' + esc(p.year) + "</span>" +
      '<span class="pub-links">' + links.join("") + "</span>" + (tags ? '<span class="pub-links">' + tags + "</span>" : "") + "</div>" +
      "</li>";
  }
  function groupedByYear(list) {
    var years = {};
    list.forEach(function (p) { (years[p.year] = years[p.year] || []).push(p); });
    return Object.keys(years).sort(function (a, b) { return b - a; }).map(function (y) {
      return '<section class="year-group"><h3>' + y + '</h3><ul class="pub-list">' + years[y].map(pubHTML).join("") + "</ul></section>";
    }).join("");
  }

  var pubRoot = document.getElementById("publications");
  if (pubRoot && SITE.publications) {
    var all = SITE.publications;
    var search = document.getElementById("pub-search");
    var countEl = document.getElementById("pub-count");
    var panels = pubRoot.querySelectorAll("[data-pub-type]");
    function counts() {
      pubRoot.querySelectorAll("[data-count]").forEach(function (el) {
        var t = el.getAttribute("data-count");
        el.textContent = t === "all" ? all.length : all.filter(function (p) { return p.type === t; }).length;
      });
    }
    function render() {
      var q = (search && search.value || "").trim().toLowerCase();
      var shown = 0;
      panels.forEach(function (panel) {
        var t = panel.getAttribute("data-pub-type");
        var list = all.filter(function (p) {
          if (t !== "all" && p.type !== t) return false;
          if (!q) return true;
          return [p.title, p.authors, p.venue, p.year, (p.missions || []).join(" ")].join(" ").toLowerCase().indexOf(q) > -1;
        });
        if (!panel.hidden) shown = list.length;
        panel.innerHTML = list.length ? groupedByYear(list) : '<p class="empty">No publications match this search.</p>';
      });
      if (countEl) countEl.textContent = shown + (shown === 1 ? " entry" : " entries");
    }
    counts();
    var tabsEl = pubRoot.querySelector(".tabs");
    if (tabsEl) { tabsEl.addEventListener("tabchange", render); initTabs(tabsEl); }
    if (search) search.addEventListener("input", render);
    render();
  }

  var selected = document.getElementById("selected-pubs");
  if (selected && SITE.publications) {
    var n = +selected.getAttribute("data-limit") || 3;
    selected.innerHTML = SITE.publications.filter(function (p) { return p.type === "first"; }).slice(0, n).map(pubHTML).join("");
  }

  /* ---------- Conferences ---------- */
  var confRoot = document.getElementById("conference-list");
  if (confRoot && SITE.conferences) {
    confRoot.innerHTML = SITE.conferences.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).map(function (c) {
      return '<div class="row"><div class="row-date">' + esc(c.dates || monthYear(c.date)) + '</div><div class="row-body">' +
        '<p class="row-title">' + esc(c.event) + "</p>" +
        '<p class="row-sub">' + esc(c.place) + "</p>" +
        "<p>" + esc(c.kind) + ": <em>" + esc(c.title) + "</em></p>" +
        (c.pdf ? '<p class="pub-links"><a class="chip" href="' + esc(c.pdf) + '">' + icon("pdf") + " " + esc(c.kind) + " PDF</a></p>" : "") +
        "</div></div>";
    }).join("");
    var placesEl = document.getElementById("conference-stats");
    if (placesEl) {
      var countries = {};
      SITE.conferences.forEach(function (c) { countries[c.place.split(",").pop().trim()] = 1; });
      placesEl.innerHTML =
        '<div class="stat"><b>' + SITE.conferences.length + "</b><span>presentations</span></div>" +
        '<div class="stat"><b>' + Object.keys(countries).length + "</b><span>countries</span></div>";
    }
  }

  /* ---------- Videos ---------- */
  document.querySelectorAll("[data-videos]").forEach(function (el) {
    var vids = (SITE.videos || []).slice(0, +el.getAttribute("data-limit") || 99);
    if (!vids.length) { el.hidden = true; return; }
    el.innerHTML = vids.map(function (v) {
      return '<article class="video"><div class="video-frame">' +
        '<img src="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt="" loading="lazy">' +
        '<button type="button" data-yt="' + esc(v.id) + '" aria-label="Play: ' + esc(v.title) + '">' +
        '<svg class="play" aria-hidden="true"><use href="' + ICONS + '#i-play"></use></svg></button></div>' +
        '<h3><a href="https://www.youtube.com/watch?v=' + esc(v.id) + '">' + esc(v.title) + "</a></h3>" +
        '<p class="mono">' + esc(monthYear(v.date)) + (v.note ? " · " + esc(v.note) : "") + "</p></article>";
    }).join("");
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-yt]");
      if (!b) return;
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + b.getAttribute("data-yt") + "?autoplay=1&rel=0";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      f.title = b.getAttribute("aria-label");
      b.parentNode.replaceChildren(f);
    });
    var empty = document.getElementById(el.getAttribute("data-empty") || "");
    if (empty) empty.hidden = true;
  });

  /* ---------- Generic tab groups (non-publication pages) ---------- */
  document.querySelectorAll(".tabs[data-tabs]").forEach(initTabs);

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
