/* Videos page. Data: window.VIDEOS from assets/js/feed-videos.js, which the
   "Update video and article lists" GitHub Action refreshes daily.
   Players load only when a video is played (youtube-nocookie.com). */
(function () {
  "use strict";
  var DATA = window.VIDEOS || { channel: {}, videos: [] };
  var CH = DATA.channel || {};
  var HANDLE = CH.handle || "keshavagg1098";
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var ICONS = "assets/img/icons.svg";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(d) {
    if (!d) return "";
    var p = String(d).split("-");
    return p[1] ? (p[2] ? +p[2] + " " : "") + MONTHS[+p[1] - 1] + " " + p[0] : p[0];
  }
  function fmtViews(n) {
    if (n == null) return "";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(".0", "") + "M views";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(".0", "") + "K views";
    return n + (n === 1 ? " view" : " views");
  }
  function thumb(id, q) { return "https://i.ytimg.com/vi/" + id + "/" + (q || "hqdefault") + ".jpg"; }
  function embed(id, autoplay) {
    return "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&modestbranding=1" + (autoplay ? "&autoplay=1" : "");
  }
  function iframe(v) {
    var f = document.createElement("iframe");
    f.src = embed(v.id, true);
    f.title = v.title || "YouTube video";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    f.allowFullscreen = true;
    f.referrerPolicy = "strict-origin-when-cross-origin";
    return f;
  }
  function meta(v) {
    return [fmtDate(v.date), fmtViews(v.views), v.duration].filter(Boolean).join(" · ");
  }

  var videos = (DATA.videos || []).filter(function (v) { return v.id && !v.hidden; });
  /* Papers that have a summary video (publications[].video in data.js) */
  var PAPERS = {};
  ((window.SITE || {}).publications || []).forEach(function (p) { if (p.video) PAPERS[p.video] = p; });
  function paperLink(v) {
    var p = PAPERS[v.id];
    if (!p) return "";
    var venue = p.venue.replace("Monthly Notices of the Royal Astronomical Society", "MNRAS").replace("Journal of Geophysical Research: Planets", "JGR: Planets");
    return '<a class="chip" href="' + (p.doi ? "https://doi.org/" + esc(p.doi) : esc(p.url)) + '">Paper: ' + esc(venue) + " " + esc(p.year) + "</a>";
  }

  /* ---------- Channel strip ---------- */
  var chName = document.getElementById("ch-name");
  var chMeta = document.getElementById("ch-meta");
  if (chName && CH.title) chName.textContent = CH.title;
  if (chMeta) {
    var subs = CH.subscribers ? (/subscriber/i.test(CH.subscribers) ? CH.subscribers : CH.subscribers + " subscribers") : "";
    chMeta.textContent = ["@" + HANDLE, videos.length ? videos.length + (videos.length === 1 ? " video" : " videos") : "", subs].filter(Boolean).join(" · ");
  }
  var uploads = document.getElementById("ch-uploads");
  if (uploads && CH.id) { uploads.href = "https://www.youtube.com/playlist?list=UU" + CH.id.slice(2); uploads.hidden = false; }

  if (!videos.length) return;
  document.getElementById("videos-empty").hidden = true;

  /* ---------- Featured ---------- */
  var featured = videos.filter(function (v) { return v.featured; })[0] || videos[0];
  var fBox = document.getElementById("featured");
  fBox.hidden = false;
  var fFrame = document.getElementById("f-frame");
  function setFeatured(v, play) {
    featured = v;
    document.getElementById("f-label").textContent = v.featured ? "Featured" : v === videos[0] ? "Latest" : "Now playing";
    document.getElementById("f-title").textContent = v.title || "";
    document.getElementById("f-meta").textContent = meta(v);
    var d = document.getElementById("f-desc");
    d.textContent = v.note || v.description || "";
    d.hidden = !d.textContent;
    document.getElementById("f-link").href = "https://www.youtube.com/watch?v=" + v.id;
    var fp = document.getElementById("f-paper");
    fp.innerHTML = paperLink(v);
    fp.hidden = !fp.innerHTML;
    if (play) { fFrame.replaceChildren(iframe(v)); return; }
    fFrame.innerHTML = '<img src="' + thumb(v.id) + '" alt="">' +
      '<button type="button" aria-label="Play ' + esc(v.title) + '"><svg class="play" aria-hidden="true"><use href="' + ICONS + '#i-play"></use></svg></button>';
    /* Use the full-resolution thumbnail when YouTube has one (the fallback is a 120 px placeholder). */
    var hi = new Image();
    hi.onload = function () { if (hi.naturalWidth > 200 && featured === v) { var im = fFrame.querySelector("img"); if (im) im.src = hi.src; } };
    hi.src = thumb(v.id, "maxresdefault");
  }
  fFrame.addEventListener("click", function (e) { if (e.target.closest("button")) setFeatured(featured, true); });
  setFeatured(featured, false);

  /* ---------- List ---------- */
  var listSec = document.getElementById("video-list-section");
  var grid = document.getElementById("video-grid");
  var search = document.getElementById("video-search");
  var sortSel = document.getElementById("video-sort");
  var filters = document.getElementById("video-topics");
  var countEl = document.getElementById("video-count");
  var topic = "All";
  if (videos.length > 1) listSec.hidden = false;

  var topics = videos.map(function (v) { return v.topic; }).filter(function (t, i, a) { return t && a.indexOf(t) === i; });
  if (topics.length) {
    filters.innerHTML = ["All"].concat(topics).map(function (t) {
      var n = t === "All" ? videos.length : videos.filter(function (v) { return v.topic === t; }).length;
      return '<button type="button" class="filter" aria-pressed="' + (t === topic) + '" data-topic="' + esc(t) + '">' + esc(t) + ' <span class="count">' + n + "</span></button>";
    }).join("");
    filters.addEventListener("click", function (e) {
      var b = e.target.closest("[data-topic]"); if (!b) return;
      topic = b.getAttribute("data-topic");
      filters.querySelectorAll("[data-topic]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      render();
    });
  } else filters.hidden = true;
  if (!videos.some(function (v) { return v.views != null; })) sortSel.querySelector('[value="views"]').remove();

  var shown = [];
  function render() {
    var q = (search.value || "").trim().toLowerCase();
    shown = videos.filter(function (v) {
      if (topic !== "All" && v.topic !== topic) return false;
      return !q || [v.title, v.description, v.topic, v.note].join(" ").toLowerCase().indexOf(q) > -1;
    });
    var s = sortSel.value;
    shown.sort(function (a, b) {
      if (s === "views") return (b.views || 0) - (a.views || 0);
      var x = a.date || "", y = b.date || "";
      return s === "old" ? (x > y ? 1 : -1) : (y > x ? 1 : -1);
    });
    grid.innerHTML = shown.length ? shown.map(function (v, i) {
      return '<article class="vcard"><button type="button" class="vthumb" data-i="' + i + '" aria-label="Play ' + esc(v.title) + '">' +
        '<img src="' + thumb(v.id, "mqdefault") + '" alt="" loading="lazy" width="320" height="180">' +
        (v.duration ? '<span class="vdur">' + esc(v.duration) + "</span>" : "") +
        '<svg class="play" aria-hidden="true"><use href="' + ICONS + '#i-play"></use></svg></button>' +
        '<h3><a href="https://www.youtube.com/watch?v=' + esc(v.id) + '">' + esc(v.title) + "</a></h3>" +
        '<p class="vmeta">' + esc(meta(v)) + "</p>" +
        ((v.topic || PAPERS[v.id]) ? '<p class="pub-links">' + (v.topic ? '<span class="chip tag">' + esc(v.topic) + "</span>" : "") + paperLink(v) + "</p>" : "") + "</article>";
    }).join("") : '<p class="empty">No videos match this search.</p>';
    countEl.textContent = shown.length + (shown.length === 1 ? " video" : " videos");
  }
  search.addEventListener("input", render);
  sortSel.addEventListener("change", render);
  render();

  /* ---------- Player dialog ---------- */
  var dlg = document.getElementById("vplayer");
  function openPlayer(v) {
    if (!dlg.showModal) { location.href = "https://www.youtube.com/watch?v=" + v.id; return; }
    dlg.querySelector(".vp-frame").replaceChildren(iframe(v));
    dlg.querySelector(".vp-title").textContent = v.title || "";
    dlg.querySelector(".vp-meta").textContent = meta(v);
    dlg.querySelector(".vp-link").href = "https://www.youtube.com/watch?v=" + v.id;
    dlg.showModal();
  }
  function closePlayer() { dlg.querySelector(".vp-frame").replaceChildren(); dlg.close(); }
  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-i]"); if (b) openPlayer(shown[+b.getAttribute("data-i")]);
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.closest("[data-close]")) closePlayer(); });
  dlg.addEventListener("cancel", function (e) { e.preventDefault(); closePlayer(); });
})();
