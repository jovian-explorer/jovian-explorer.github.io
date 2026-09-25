/* Outreach page: videos, documents and photographs listed in
   assets/outreach/manifest.json. Videos are served from the repository's
   "outreach-media" release; English and Hindi versions are paired. */
(function () {
  "use strict";
  if (!document.getElementById("kit-media") || !window.fetch) return;

  var KITS = [
    { title: "Optics", pages: ["optics"] },
    { title: "Virtual lab", pages: ["virtual-lab"] },
    { title: "Radio astronomy", pages: ["radio"] },
    { title: "Robotics and IoT", pages: ["robotics", "iot"] },
    { title: "ExpEYES", pages: ["expeyes"] },
    { title: "Model kits", pages: ["model-kits"] }
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
    "newtons cradle.mp4": { t: "Newton\u2019s cradle" }
  };
  var DOC = {
    "essays": "Essay topics", "Debates": "Debate topics", "Story Writing": "Story writing topics",
    "Hackathon": "Space hackathon: lunar craters", "Hackathon Solutions": "Space hackathon: solutions",
    "Quiz Questions": "Space quiz", "Answer key": "Space quiz: answer key",
    "Chandrayaan 3: India's ambitious mission to reach the Moon": "Chandrayaan-3: India\u2019s mission to the Moon (reading)"
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
    t = t.replace(/\s*\((English|Hindi)( Audio)?\)\s*$/i, "").replace(/\s+in (English|Hindi)$/i, "");
    return t.trim();
  }
  function prettyDoc(f) {
    var k = f.replace(/\.[a-z0-9]+$/i, "");
    if (DOC[k]) return DOC[k];
    return f.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  }

  /* Group videos into items with language variants. */
  function items(list) {
    var map = {}, order = [];
    list.forEach(function (v) {
      var key = baseTitle(v).toLowerCase().replace(/[^a-z0-9ऀ-ॿ]+/g, "");
      var l = lang(v);
      if (!FIX[v.file] && l === "Hindi" && /[ऀ-ॿ]/.test(v.caption)) key = "hi:" + key;
      if (!map[key]) { map[key] = { title: baseTitle(v), variants: [] }; order.push(key); }
      map[key].variants.push({ lang: l, v: v });
    });
    return order.map(function (k) { return map[k]; });
  }

  function videoCard(it) {
    var first = it.variants[0].v;
    return '<article class="vcard">' +
      '<button type="button" class="vthumb" data-src="' + esc(first.src) + '" data-title="' + esc(it.title) + '" aria-label="Play ' + esc(it.title) + '">' +
      '<img src="' + esc(first.thumb) + '" alt="" loading="lazy" width="320" height="180">' +
      '<span class="vdur">' + mmss(first.duration) + "</span>" +
      '<svg class="play" aria-hidden="true"><use href="assets/img/icons.svg#i-play"></use></svg></button>' +
      "<h3>" + esc(it.title) + "</h3>" +
      (it.variants.length > 1 || it.variants[0].lang
        ? '<p class="lang-row">' + it.variants.map(function (x) {
            return '<button type="button" class="chip" data-src="' + esc(x.v.src) + '" data-title="' + esc(it.title + (x.lang ? " (" + x.lang + ")" : "")) + '">' + esc(x.lang || "Play") + "</button>";
          }).join("") + "</p>"
        : "") +
      "</article>";
  }

  function block(title, list, docs) {
    var vids = items(list.filter(function (m) { return m.kind === "video"; }));
    var d = (docs || []).concat(list.filter(function (m) { return m.kind === "doc" || m.kind === "pdf"; }));
    if (!vids.length && !d.length) return "";
    return '<div class="media-block"><h3 class="media-head">' + esc(title) + ' <span class="count">' + vids.length + (vids.length === 1 ? " video" : " videos") + "</span></h3>" +
      (vids.length ? '<div class="video-grid">' + vids.map(videoCard).join("") + "</div>" : "") +
      (d.length ? '<ul class="doc-list">' + d.map(function (x) {
        return '<li><a href="' + esc(x.src) + '">' + esc(prettyDoc(x.file)) + '</a> <span class="mono muted">PDF</span></li>';
      }).join("") + "</ul>" : "") + "</div>";
  }

  fetch("assets/outreach/manifest.json").then(function (r) { return r.ok ? r.json() : []; }).then(function (M) {
    if (!M || !M.length) return;
    var by = function (pages) { return M.filter(function (m) { return pages.indexOf(m.page) > -1; }); };
    var kitHTML = KITS.map(function (k) { return block(k.title, by(k.pages)); }).join("");
    var missionHTML = MISSIONS.map(function (k) { return block(k.title, by(k.pages)); }).join("");
    var photos = M.filter(function (m) { return m.kind === "photo" || m.kind === "image"; });

    var kitRoot = document.getElementById("kit-media");
    if (kitRoot && kitHTML) { kitRoot.innerHTML = kitHTML; var st = document.getElementById("kit-static"); if (st) st.hidden = true; }
    var misRoot = document.getElementById("mission-media");
    if (misRoot && missionHTML) { misRoot.innerHTML = missionHTML; misRoot.closest("section").hidden = false; }
    var phRoot = document.getElementById("outreach-photos");
    if (phRoot && photos.length) {
      phRoot.innerHTML = photos.map(function (p, i) {
        return '<button type="button" class="ophoto" data-photo="' + i + '"><img src="' + esc(p.src) + '" alt="" loading="lazy"></button>';
      }).join("");
      phRoot.closest("section").hidden = false;
      phRoot.addEventListener("click", function (e) {
        var b = e.target.closest("[data-photo]"); if (!b) return;
        var dlg = document.getElementById("photo-dialog");
        dlg.querySelector("img").src = photos[+b.getAttribute("data-photo")].src;
        dlg.showModal();
      });
    }
    var count = M.filter(function (m) { return m.kind === "video"; }).length;
    var cEl = document.getElementById("video-total");
    if (cEl && count) cEl.textContent = count;
  }).catch(function () {});

  /* Player */
  var dlg = document.getElementById("vplayer");
  document.addEventListener("click", function (e) {
    var b = e.target.closest("main [data-src]"); if (!b || !dlg || !dlg.showModal) return;
    var f = dlg.querySelector(".vp-frame");
    f.innerHTML = '<video controls autoplay playsinline preload="metadata" src="' + esc(b.getAttribute("data-src")) + '"></video>';
    dlg.querySelector(".vp-title").textContent = b.getAttribute("data-title") || "";
    dlg.showModal();
  });
  function close() { dlg.querySelector(".vp-frame").innerHTML = ""; dlg.close(); }
  if (dlg) {
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest("[data-close]")) close(); });
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); close(); });
  }
  var pd = document.getElementById("photo-dialog");
  if (pd) pd.addEventListener("click", function () { pd.close(); });
})();
