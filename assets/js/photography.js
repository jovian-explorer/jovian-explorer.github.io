/* Photography page: sections (tabs) > albums > photographs.
   Sections and albums: SITE.photography in data.js.
   Photographs: window.PHOTOS in assets/js/photos.js (tools/photos.py).
   Albums without photographs get a generated cover: a map of the region
   with visited districts shaded, a star field, or a conference card.
   photography.html#demo fills albums with generated sample tiles. */
(function () {
  "use strict";
  var SITE = window.SITE || {};
  var CONF = SITE.photography || { sections: [], albums: [] };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var tabsRoot = document.getElementById("photo-tabs");
  if (!tabsRoot) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(d) {
    if (!d) return "";
    var p = String(d).split("-");
    return p[1] ? MONTHS[+p[1] - 1] + " " + p[0] : p[0];
  }
  function rnd(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }
  function hash(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000; return h; }

  var demo = location.hash === "#demo";
  window.addEventListener("hashchange", function () { if (location.hash === "#demo" || demo) location.reload(); });

  var photos = (demo ? samplePhotos() : (window.PHOTOS || []).slice()).filter(function (p) { return !p.hidden; });
  photos.sort(function (a, b) { var x = a.date || "", y = b.date || ""; return x === y ? 0 : (y > x ? 1 : -1); });
  var albums = (CONF.albums || []).map(function (a) {
    var items = photos.filter(function (p) { return p.album === a.id; });
    return Object.assign({}, a, { items: items, cover: items.filter(function (p) { return p.cover; })[0] || items[0] });
  });
  var sections = (CONF.sections || []).filter(function (s) { return albums.some(function (a) { return a.section === s.id; }); });
  var demoBar = document.getElementById("demo-note");
  if (demoBar) demoBar.hidden = !demo;
  var kit = document.getElementById("photo-kit");
  if (kit && CONF.kit) { kit.textContent = CONF.kit; kit.parentNode.hidden = false; }

  /* ---------- Generated covers ---------- */
  var VISITED = new Set((SITE.travel || {}).districts || []);
  function regionCover(r) {
    if (!window.d3 || !window.topojson) return "";
    var W = 400, H = 300, proj;
    if (r.country && window.MAP_WORLD) {
      var c = topojson.feature(MAP_WORLD, MAP_WORLD.objects.countries).features.filter(function (f) { return f.properties.name === r.country; });
      if (!c.length) return "";
      proj = d3.geoMercator().fitExtent([[24, 24], [W - 24, H - 24]], { type: "FeatureCollection", features: c });
      var path = d3.geoPath(proj);
      var pt = r.point ? proj(r.point) : null;
      return '<svg viewBox="0 0 ' + W + " " + H + '" aria-hidden="true"><rect width="100%" height="100%" class="cv-sea"/>' +
        c.map(function (f) { return '<path class="cv-visit-soft" d="' + path(f) + '"/>'; }).join("") +
        (pt ? '<circle class="cv-pin" cx="' + pt[0].toFixed(1) + '" cy="' + pt[1].toFixed(1) + '" r="7"/>' : "") + "</svg>";
    }
    if (!r.states || !window.MAP_INDIA) return "";
    var IN = window.MAP_INDIA;
    var feats = topojson.feature(IN, IN.objects.states).features.filter(function (f) { return r.states.indexOf(f.properties.state) > -1; });
    if (!feats.length) return "";
    var dists = topojson.feature(IN, IN.objects.districts).features.filter(function (f) { return r.states.indexOf(f.properties.state) > -1 && !f.properties.extra; });
    proj = d3.geoMercator().fitExtent([[24, 24], [W - 24, H - 24]], { type: "FeatureCollection", features: feats });
    var p2 = d3.geoPath(proj);
    return '<svg viewBox="0 0 ' + W + " " + H + '" aria-hidden="true"><rect width="100%" height="100%" class="cv-sea"/>' +
      feats.map(function (f) { return '<path class="cv-land" d="' + p2(f) + '"/>'; }).join("") +
      dists.map(function (f) {
        var key = f.properties.state + "/" + f.properties.name;
        var cls = !VISITED.has(key) ? "cv-district" : (!r.focus || r.focus.indexOf(f.properties.name) > -1 ? "cv-visit" : "cv-visit-other");
        return '<path class="' + cls + '" d="' + p2(f) + '"/>';
      }).join("") +
      feats.map(function (f) { return '<path class="cv-outline" d="' + p2(f) + '"/>'; }).join("") + "</svg>";
  }
  function skyCover(a) {
    var r = rnd(hash(a.id)), s = [];
    for (var i = 0; i < 140; i++) {
      var big = r() > 0.95;
      s.push('<circle cx="' + (r() * 400).toFixed(1) + '" cy="' + (r() * 300).toFixed(1) + '" r="' + (big ? 1.6 + r() : 0.4 + r() * 0.8).toFixed(2) + '" fill="#fff" fill-opacity="' + (0.35 + r() * 0.6).toFixed(2) + '"/>');
    }
    var id = "g-" + a.id, extra = "";
    if (a.id === "wide-field") extra = '<ellipse cx="200" cy="160" rx="260" ry="46" transform="rotate(-24 200 160)" fill="url(#' + id + ')"/>';
    if (a.id === "moon-planets") extra = '<circle cx="280" cy="110" r="56" fill="url(#' + id + ')"/><circle cx="96" cy="210" r="7" fill="#e9c58b"/>';
    if (a.id === "deep-sky") extra = '<ellipse cx="200" cy="150" rx="90" ry="54" fill="url(#' + id + ')"/>';
    var grad = a.id === "moon-planets"
      ? '<radialGradient id="' + id + '" cx="0.4" cy="0.4"><stop offset="0" stop-color="#f2efe6"/><stop offset="1" stop-color="#a9a597"/></radialGradient>'
      : a.id === "deep-sky"
        ? '<radialGradient id="' + id + '"><stop offset="0" stop-color="#e58aa8" stop-opacity="0.55"/><stop offset="0.5" stop-color="#7b8fe0" stop-opacity="0.25"/><stop offset="1" stop-color="#7b8fe0" stop-opacity="0"/></radialGradient>'
        : '<radialGradient id="' + id + '"><stop offset="0" stop-color="#c9d4ff" stop-opacity="0.35"/><stop offset="1" stop-color="#c9d4ff" stop-opacity="0"/></radialGradient>';
    return '<svg viewBox="0 0 400 300" aria-hidden="true"><defs>' + grad + '</defs><rect width="400" height="300" fill="#0b1020"/>' + extra + s.join("") + "</svg>";
  }
  function eventCover(a) {
    var year = String(a.date || "").slice(0, 4);
    return '<svg viewBox="0 0 400 300" aria-hidden="true"><rect width="400" height="300" class="cv-event"/>' +
      '<text x="28" y="258" class="cv-year">' + esc(year) + "</text>" +
      '<text x="30" y="54" class="cv-place">' + esc(a.place || "") + "</text></svg>";
  }
  function coverHTML(a) {
    if (a.cover) return '<img src="' + esc(a.cover.thumb || a.cover.src) + '" alt="" loading="lazy">';
    if (a.region) return regionCover(a.region);
    if (a.section === "night-sky") return skyCover(a);
    return eventCover(a);
  }

  /* ---------- Tabs and album grids ---------- */
  var secRoot = document.getElementById("photo-sections");
  var tabs = sections.map(function (s) { return { id: s.id, title: s.title }; });
  if (photos.length) tabs.push({ id: "all", title: "All photographs" });
  tabsRoot.innerHTML = tabs.map(function (t) {
    var n = t.id === "all" ? photos.length : albums.filter(function (a) { return a.section === t.id; }).length;
    return '<button class="tab" role="tab" id="ptab-' + t.id + '" aria-controls="ppanel-' + t.id + '" data-hash="' + t.id + '">' + esc(t.title) +
      ' <span class="count">' + n + "</span></button>";
  }).join("");
  secRoot.innerHTML = sections.map(function (s) {
    var list = albums.filter(function (a) { return a.section === s.id; });
    return '<div class="tab-panel" role="tabpanel" id="ppanel-' + s.id + '" aria-labelledby="ptab-' + s.id + '" hidden>' +
      '<p class="section-desc">' + esc(s.description || "") + "</p>" +
      '<div class="albums">' + list.map(albumCard).join("") + "</div></div>";
  }).join("") + (photos.length ? '<div class="tab-panel" role="tabpanel" id="ppanel-all" aria-labelledby="ptab-all" hidden><div class="jgrid" id="all-grid"></div></div>' : "");

  function albumCard(a) {
    var n = a.items.length;
    var meta = [a.place, fmtDate(a.date)].filter(Boolean).join(" · ");
    var inner = '<span class="album-cover">' + coverHTML(a) + "</span>" +
      '<span class="album-meta"><span class="album-title">' + esc(a.title) + "</span>" +
      (meta ? '<span class="album-place">' + esc(meta) + "</span>" : "") +
      (n ? '<span class="album-sub">' + n + (n === 1 ? " photograph" : " photographs") + "</span>" : "") + "</span>";
    return n ? '<button type="button" class="album" data-album="' + esc(a.id) + '">' + inner + "</button>"
             : '<div class="album is-empty">' + inner + "</div>";
  }

  var tabEls = Array.prototype.slice.call(tabsRoot.querySelectorAll('[role="tab"]'));
  var albumView = document.getElementById("album-view");
  function showTab(id, push) {
    albumView.hidden = true;
    secRoot.hidden = false; tabsRoot.hidden = false;
    tabEls.forEach(function (t) {
      var on = t.getAttribute("data-hash") === id;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (id === "all") layout(document.getElementById("all-grid"), photos);
    if (push) history.replaceState(null, "", "#" + id);
  }
  tabEls.forEach(function (t, i) {
    t.addEventListener("click", function () { showTab(t.getAttribute("data-hash"), true); });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      var n = tabEls[(i + d + tabEls.length) % tabEls.length];
      n.focus(); showTab(n.getAttribute("data-hash"), true);
    });
  });

  /* ---------- Album view ---------- */
  var current = { album: null };
  var sortSel = document.getElementById("av-sort");
  function openAlbum(id, push) {
    var a = albums.filter(function (x) { return x.id === id; })[0];
    if (!a || !a.items.length) return;
    current.album = a;
    tabsRoot.hidden = true; secRoot.hidden = true; albumView.hidden = false;
    var sec = sections.filter(function (s) { return s.id === a.section; })[0];
    document.getElementById("av-section").textContent = sec ? sec.title : "";
    document.getElementById("av-title").textContent = a.title;
    document.getElementById("av-meta").textContent = [a.place, fmtDate(a.date), a.items.length + (a.items.length === 1 ? " photograph" : " photographs")].filter(Boolean).join(" · ");
    var d = document.getElementById("av-desc");
    d.textContent = a.description || ""; d.hidden = !a.description;
    drawAlbum();
    if (push) history.replaceState(null, "", "#" + id);
  }
  function drawAlbum() {
    var list = current.album.items.slice();
    if (sortSel.value === "old") list.reverse();
    layout(document.getElementById("av-grid"), list);
  }
  sortSel.addEventListener("change", drawAlbum);
  secRoot.addEventListener("click", function (e) {
    var b = e.target.closest("[data-album]"); if (b) openAlbum(b.getAttribute("data-album"), true);
  });
  document.getElementById("album-back").addEventListener("click", function () {
    showTab(current.album ? current.album.section : tabs[0].id, true);
  });

  /* ---------- Justified grid ---------- */
  var grids = new Map();
  function layout(grid, list) {
    if (!grid) return;
    grids.set(grid, list);
    var W = grid.clientWidth || grid.parentNode.clientWidth;
    var gap = 8, target = W < 560 ? 170 : W < 900 ? 210 : 250;
    var rows = [], row = [], sum = 0;
    list.forEach(function (p, i) {
      var ar = p.width && p.height ? p.width / p.height : 1.5;
      row.push({ p: p, ar: ar, i: i }); sum += ar;
      if (sum * target + gap * (row.length - 1) >= W) { rows.push({ items: row, sum: sum, full: true }); row = []; sum = 0; }
    });
    if (row.length) rows.push({ items: row, sum: sum, full: false });
    grid.innerHTML = rows.map(function (r) {
      var h = r.full ? (W - gap * (r.items.length - 1)) / r.sum : target;
      return '<div class="jrow" style="height:' + h.toFixed(1) + 'px">' + r.items.map(function (it) {
        var p = it.p;
        return '<figure class="jitem" style="width:' + (h * it.ar).toFixed(1) + 'px"><button type="button" data-i="' + it.i + '" aria-label="Open ' + esc(p.title || "photograph") + '">' +
          '<img src="' + esc(p.thumb || p.src) + '" alt="' + esc(p.alt || p.title || "") + '" loading="lazy" decoding="async"></button>' +
          "<figcaption><span>" + esc(p.title || "") + "</span><span>" + esc(fmtDate(p.date)) + "</span></figcaption></figure>";
      }).join("") + "</div>";
    }).join("");
  }
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { grids.forEach(function (list, g) { if (g.offsetParent) layout(g, list); }); }, 120);
  });

  /* ---------- Lightbox ---------- */
  var box = document.getElementById("lightbox");
  var lb = { list: [], i: 0 };
  function exifLine(p) {
    var e = p.exif || {};
    return [e.camera, e.lens, e.focal, e.aperture, e.shutter, e.iso ? "ISO " + e.iso : ""].filter(Boolean).join("  ·  ");
  }
  function show(i) {
    lb.i = (i + lb.list.length) % lb.list.length;
    var p = lb.list[lb.i];
    var img = box.querySelector(".lb-img");
    img.src = p.src; img.alt = p.alt || p.title || "";
    box.querySelector(".lb-title").textContent = p.title || "";
    box.querySelector(".lb-place").textContent = [p.place, fmtDate(p.date)].filter(Boolean).join(" · ");
    box.querySelector(".lb-desc").textContent = p.description || "";
    box.querySelector(".lb-exif").textContent = exifLine(p);
    box.querySelector(".lb-count").textContent = (lb.i + 1) + " / " + lb.list.length;
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".jitem [data-i]"); if (!b || !box.showModal) return;
    lb.list = grids.get(b.closest(".jgrid")) || [];
    show(+b.getAttribute("data-i"));
    box.showModal();
  });
  box.addEventListener("click", function (e) {
    var a = e.target.closest("[data-lb]");
    if (a) {
      var act = a.getAttribute("data-lb");
      if (act === "close") box.close();
      if (act === "prev") show(lb.i - 1);
      if (act === "next") show(lb.i + 1);
    } else if (e.target === box) box.close();
  });
  box.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(lb.i - 1);
    if (e.key === "ArrowRight") show(lb.i + 1);
  });
  var sx = null;
  box.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (sx == null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(lb.i + (dx < 0 ? 1 : -1));
    sx = null;
  });

  /* ---------- Start ---------- */
  var start = location.hash.replace("#", "");
  if (albums.some(function (a) { return a.id === start && a.items.length; })) openAlbum(start, false);
  else showTab(tabs.some(function (t) { return t.id === start; }) ? start : (tabs[0] || {}).id, false);

  /* ---------- Sample tiles for #demo ---------- */
  function samplePhotos() {
    var specs = [
      ["deep-sky", 1.5, "Orion Nebula (M42)", "Indore", "2025-01"], ["deep-sky", 1.5, "Pleiades (M45)", "Indore", "2023-11"],
      ["moon-planets", 1, "Waxing gibbous Moon", "Indore", "2024-12"], ["moon-planets", 1.33, "Jupiter and moons", "Indore", "2024-01"],
      ["wide-field", 1.78, "Milky Way core", "Bhimtal", "2024-10"], ["wide-field", 0.8, "Star trails", "Manali", "2024-05"],
      ["sydney", 1.5, "Harbour at dusk", "Sydney", "2025-08"], ["sydney", 0.67, "Opera House", "Sydney", "2025-08"],
      ["goa", 1.78, "Baga beach", "Goa", "2023-12"], ["goa", 0.75, "Dudhsagar Falls", "Goa", "2023-12"],
      ["northeast", 1.5, "Nohkalikai Falls", "Cherrapunji", "2024-06"], ["himachal", 1.5, "Mall Road", "Shimla", "2022-05"],
      ["ursi-aprasc-2025", 1.5, "Talk session", "Sydney", "2025-08"], ["ipsc-2025", 1.33, "Poster award", "IIT Roorkee", "2025-03"]
    ];
    return specs.map(function (s, i) {
      var w = 900, h = Math.round(w / s[1]);
      var src = sampleImage(w, h, s[0], i, s[2]);
      return { src: src, thumb: src, width: w, height: h, album: s[0], title: s[2] + " (sample)", place: s[3], date: s[4], exif: { camera: "Sample image" } };
    });
  }
  function sampleImage(w, h, album, seed, label) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var x = c.getContext("2d"), r = rnd(seed * 7919 + 17);
    var night = ["deep-sky", "moon-planets", "wide-field"].indexOf(album) > -1;
    var pal = night ? ["#070b16", "#1a2340"] : ["#6f8fa6", "#d8c9a8"];
    var gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, pal[0]); gr.addColorStop(1, pal[1]);
    x.fillStyle = gr; x.fillRect(0, 0, w, h);
    if (night) {
      for (var i = 0; i < 700; i++) { x.fillStyle = "rgba(255,255,255," + (r() * 0.8 + 0.1) + ")"; x.beginPath(); x.arc(r() * w, r() * h, r() < 0.97 ? r() * 1.2 : r() * 2.6, 0, 7); x.fill(); }
    } else {
      x.fillStyle = "rgba(20,24,30,0.35)"; x.beginPath(); x.moveTo(0, h);
      for (var j = 0; j <= 10; j++) x.lineTo(j * w / 10, h * (0.55 + r() * 0.25));
      x.lineTo(w, h); x.fill();
    }
    x.fillStyle = "rgba(255,255,255,0.85)"; x.font = "600 " + Math.round(w / 28) + "px system-ui, sans-serif";
    x.fillText("SAMPLE", w * 0.05, h * 0.12 + 10);
    x.font = Math.round(w / 34) + "px system-ui, sans-serif";
    x.fillText(label, w * 0.05, h * 0.12 + 10 + w / 22);
    return c.toDataURL("image/jpeg", 0.8);
  }
})();
