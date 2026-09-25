/* Photography page: collections, filters, justified grid and lightbox.
   Photos come from assets/js/photos.js (written by tools/photos.py).
   Album titles and descriptions come from SITE.photography in data.js.
   photography.html#demo fills the page with generated sample tiles to
   preview the layout; nothing is saved. */
(function () {
  "use strict";
  var SITE = window.SITE || {};
  var CONF = SITE.photography || { albums: [] };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var grid = document.getElementById("photo-grid");
  if (!grid) return;
  window.addEventListener("hashchange", function () { if (location.hash === "#demo" || demo) location.reload(); });

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
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  var demo = location.hash === "#demo";
  var photos = (window.PHOTOS || []).slice();
  if (demo) photos = samplePhotos();
  photos.sort(function (a, b) { return (b.date || "") > (a.date || "") ? 1 : -1; });

  var albums = (CONF.albums || []).map(function (a) {
    var items = photos.filter(function (p) { return p.album === a.id; });
    return { id: a.id, title: a.title, description: a.description, items: items, cover: items.filter(function (p) { return p.cover; })[0] || items[0] };
  }).filter(function (a) { return a.items.length; });

  var emptyBox = document.getElementById("photo-empty");
  var main = document.getElementById("photo-main");
  var demoBar = document.getElementById("demo-note");
  if (!photos.length) { main.hidden = true; return; }
  emptyBox.hidden = true;
  if (demoBar) demoBar.hidden = !demo;

  /* ---------- Collections ---------- */
  var albumRoot = document.getElementById("albums");
  var active = { album: "all", sort: "new" };
  if (albumRoot) {
    albumRoot.innerHTML = albums.map(function (a) {
      var years = a.items.map(function (p) { return String(p.date || "").slice(0, 4); }).filter(Boolean).sort();
      var span = years.length ? (years[0] === years[years.length - 1] ? years[0] : years[0] + "–" + years[years.length - 1]) : "";
      return '<button type="button" class="album" data-album="' + esc(a.id) + '" aria-pressed="false">' +
        '<span class="album-cover"><img src="' + esc(a.cover.thumb || a.cover.src) + '" alt="" loading="lazy"></span>' +
        '<span class="album-meta"><span class="album-title">' + esc(a.title) + '</span>' +
        '<span class="album-sub">' + a.items.length + (a.items.length === 1 ? " photograph" : " photographs") + (span ? " · " + span : "") + "</span></span></button>";
    }).join("");
    document.getElementById("albums-section").hidden = albums.length < 2;
    albumRoot.addEventListener("click", function (e) {
      var b = e.target.closest("[data-album]"); if (!b) return;
      setAlbum(active.album === b.getAttribute("data-album") ? "all" : b.getAttribute("data-album"));
      document.getElementById("photo-grid-head").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  /* ---------- Filters ---------- */
  var filterRoot = document.getElementById("photo-filters");
  function drawFilters() {
    filterRoot.innerHTML = [{ id: "all", title: "All" }].concat(albums).map(function (a) {
      var n = a.id === "all" ? photos.length : a.items.length;
      return '<button type="button" class="filter" data-album="' + esc(a.id) + '" aria-pressed="' + (active.album === a.id) + '">' + esc(a.title) + ' <span class="count">' + n + "</span></button>";
    }).join("");
  }
  filterRoot.addEventListener("click", function (e) {
    var b = e.target.closest("[data-album]"); if (b) setAlbum(b.getAttribute("data-album"));
  });
  var sortSel = document.getElementById("photo-sort");
  sortSel.addEventListener("change", function () { active.sort = sortSel.value; layout(); });

  function setAlbum(id) {
    active.album = id;
    drawFilters();
    if (albumRoot) albumRoot.querySelectorAll("[data-album]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-album") === id ? "true" : "false"); });
    var a = albums.filter(function (x) { return x.id === id; })[0];
    var desc = document.getElementById("album-desc");
    desc.textContent = a ? a.description || "" : "";
    desc.hidden = !a || !a.description;
    layout();
  }

  /* ---------- Justified grid ---------- */
  var shown = [];
  function current() {
    var list = photos.filter(function (p) { return active.album === "all" || p.album === active.album; });
    if (active.sort === "old") list = list.slice().reverse();
    return list;
  }
  function layout() {
    shown = current();
    var W = grid.clientWidth;
    var gap = 8;
    var target = W < 560 ? 180 : W < 900 ? 220 : 260;
    var rows = [], row = [], sum = 0;
    shown.forEach(function (p, i) {
      var ar = p.width && p.height ? p.width / p.height : 1.5;
      row.push({ p: p, ar: ar, i: i });
      sum += ar;
      if (sum * target + gap * (row.length - 1) >= W) { rows.push({ items: row, sum: sum, full: true }); row = []; sum = 0; }
    });
    if (row.length) rows.push({ items: row, sum: sum, full: false });
    grid.innerHTML = rows.map(function (r) {
      var h = r.full ? (W - gap * (r.items.length - 1)) / r.sum : target;
      return '<div class="jrow" style="height:' + h.toFixed(1) + 'px">' + r.items.map(function (it) {
        var p = it.p;
        return '<figure class="jitem" style="width:' + (h * it.ar).toFixed(1) + 'px">' +
          '<button type="button" data-i="' + it.i + '" aria-label="Open ' + esc(p.title || "photograph") + '">' +
          '<img src="' + esc(p.thumb || p.src) + '" alt="' + esc(p.alt || p.title || "") + '" loading="lazy" decoding="async"></button>' +
          '<figcaption><span>' + esc(p.title || "") + "</span><span>" + esc([p.place, fmtDate(p.date)].filter(Boolean).join(" · ")) + "</span></figcaption></figure>";
      }).join("") + "</div>";
    }).join("");
    document.getElementById("photo-count").textContent = shown.length + (shown.length === 1 ? " photograph" : " photographs");
  }
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(layout, 120); });

  /* ---------- Lightbox ---------- */
  var box = document.getElementById("lightbox");
  var idx = 0;
  function exifLine(p) {
    var e = p.exif || {};
    return [e.camera, e.lens, e.focal, e.aperture, e.shutter, e.iso ? "ISO " + e.iso : ""].filter(Boolean).join("  ·  ");
  }
  function show(i) {
    idx = (i + shown.length) % shown.length;
    var p = shown[idx];
    var img = box.querySelector(".lb-img");
    img.src = p.src;
    img.alt = p.alt || p.title || "";
    box.querySelector(".lb-title").textContent = p.title || "";
    var where = [p.place, fmtDate(p.date)].filter(Boolean).join(" · ");
    var placeLink = box.querySelector(".lb-place");
    placeLink.innerHTML = p.place ? '<a href="travel.html#place-' + esc(slug(p.place.split(",")[0])) + '">' + esc(where) + "</a>" : esc(where);
    box.querySelector(".lb-desc").textContent = p.description || "";
    box.querySelector(".lb-exif").textContent = exifLine(p);
    box.querySelector(".lb-count").textContent = (idx + 1) + " / " + shown.length;
  }
  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-i]"); if (!b || !box.showModal) return;
    var p = current()[+b.getAttribute("data-i")];
    show(shown.indexOf(p));
    box.showModal();
  });
  box.addEventListener("click", function (e) {
    var a = e.target.closest("[data-lb]");
    if (a) {
      var act = a.getAttribute("data-lb");
      if (act === "close") box.close();
      if (act === "prev") show(idx - 1);
      if (act === "next") show(idx + 1);
    } else if (e.target === box) box.close();
  });
  box.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  var sx = null;
  box.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (sx == null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });

  var kit = document.getElementById("photo-kit");
  if (kit && CONF.kit) { kit.textContent = CONF.kit; kit.parentNode.hidden = false; }

  var start = location.hash.replace("#", "");
  setAlbum(albums.some(function (a) { return a.id === start; }) ? start : "all");

  /* ---------- Sample tiles for #demo ---------- */
  function samplePhotos() {
    var specs = [
      ["night-sky", 1.5, "Orion Nebula (M42)", "Indore", "2025-01"], ["night-sky", 1, "Waxing gibbous Moon", "Indore", "2024-12"],
      ["night-sky", 1.78, "Milky Way core", "Bhimtal", "2024-10"], ["night-sky", 0.8, "Star trails", "Bhimtal", "2024-10"],
      ["night-sky", 1.5, "Pleiades (M45)", "Indore", "2023-11"], ["travel", 1.5, "Sydney Harbour", "Sydney", "2025-08"],
      ["travel", 0.67, "Hawa Mahal", "Jaipur", "2025-09"], ["travel", 1.78, "Naukuchiatal lake", "Bhimtal", "2024-10"],
      ["travel", 1.33, "Kovalam coast", "Thiruvananthapuram", "2026-02"], ["travel", 1.5, "Ganga canal", "Roorkee", "2025-03"],
      ["conferences", 1.5, "URSI AP-RASC, Sydney", "Sydney", "2025-08"], ["conferences", 1.33, "IIT Roorkee campus", "Roorkee", "2025-03"],
      ["conferences", 1.5, "URSI-RCRS venue", "Bhimtal", "2024-10"], ["night-sky", 1.5, "Jupiter and moons", "Indore", "2024-01"]
    ];
    return specs.map(function (s, i) {
      var w = 900, h = Math.round(w / s[1]);
      var src = sampleImage(w, h, s[0], i, s[2]);
      return { src: src, thumb: src, width: w, height: h, album: s[0], title: s[2] + " (sample)", place: s[3], date: s[4],
        exif: { camera: "Sample image", focal: "", aperture: "", shutter: "", iso: "" } };
    });
  }
  function sampleImage(w, h, kind, seed, label) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var x = c.getContext("2d");
    var rnd = (function (s) { return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; })(seed * 7919 + 17);
    var pal = kind === "night-sky" ? ["#070b16", "#1a2340"] : kind === "travel" ? ["#6f8fa6", "#d8c9a8"] : ["#3c4654", "#9aa5b1"];
    var gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, pal[0]); gr.addColorStop(1, pal[1]);
    x.fillStyle = gr; x.fillRect(0, 0, w, h);
    if (kind === "night-sky") {
      for (var i = 0; i < 700; i++) { x.fillStyle = "rgba(255,255,255," + (rnd() * 0.8 + 0.1) + ")"; var r = rnd() < 0.97 ? rnd() * 1.2 : rnd() * 2.6; x.beginPath(); x.arc(rnd() * w, rnd() * h, r, 0, 7); x.fill(); }
    } else {
      x.fillStyle = "rgba(20,24,30,0.35)";
      x.beginPath(); x.moveTo(0, h);
      for (var j = 0; j <= 10; j++) x.lineTo(j * w / 10, h * (0.55 + rnd() * 0.25));
      x.lineTo(w, h); x.fill();
    }
    x.fillStyle = "rgba(255,255,255,0.85)"; x.font = "600 " + Math.round(w / 28) + "px system-ui, sans-serif";
    x.fillText("SAMPLE", w * 0.05, h * 0.12 + 10);
    x.font = Math.round(w / 34) + "px system-ui, sans-serif";
    x.fillText(label, w * 0.05, h * 0.12 + 10 + w / 22);
    return c.toDataURL("image/jpeg", 0.8);
  }
})();
