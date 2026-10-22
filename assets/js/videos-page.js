/* Videos tab of media.html: the channel and its research videos (videos linked
   to a paper with publications[].video in data.js). Data: window.VIDEOS from
   assets/js/feed-videos.js, refreshed by the "Update feeds" GitHub Action.
   Players load only when a video is played (youtube-nocookie.com). */
(function () {
  "use strict";
  var DATA = window.VIDEOS || { channel: {}, videos: [] };
  var CH = DATA.channel || {};
  var HANDLE = CH.handle || "jovian_explorer";
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

  /* Papers that have a summary video (publications[].video in data.js) */
  var PAPERS = {};
  ((window.SITE || {}).publications || []).forEach(function (p) { if (p.video) PAPERS[p.video] = p; });
  /* Only the research videos (summaries of papers) are listed; the channel link covers the rest. */
  var videos = (DATA.videos || []).filter(function (v) { return v.id && !v.hidden && PAPERS[v.id]; });
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
    chMeta.textContent = ["@" + HANDLE, subs].filter(Boolean).join(" · ");
  }

  if (!videos.length) return;
  document.getElementById("videos-empty").hidden = true;

  /* ---------- List ---------- */
  var listSec = document.getElementById("video-list-section");
  var grid = document.getElementById("video-grid");
  var countEl = document.getElementById("video-count");
  listSec.hidden = false;

  var shown = [];
  function render() {
    shown = videos.slice().sort(function (a, b) { var x = a.date || "", y = b.date || ""; return y > x ? 1 : y < x ? -1 : 0; });
    grid.innerHTML = shown.length ? shown.map(function (v, i) {
      return '<article class="vcard"><button type="button" class="vthumb" data-i="' + i + '" aria-label="Play ' + esc(v.title) + '">' +
        '<img src="' + thumb(v.id, "mqdefault") + '" alt="" loading="lazy" width="320" height="180">' +
        (v.duration ? '<span class="vdur">' + esc(v.duration) + "</span>" : "") +
        '<svg class="play" aria-hidden="true"><use href="' + ICONS + '#i-play"></use></svg></button>' +
        '<h3><a href="https://www.youtube.com/watch?v=' + esc(v.id) + '">' + esc(v.title) + "</a></h3>" +
        '<p class="vmeta">' + esc(meta(v)) + "</p>" +
        ((v.topic || PAPERS[v.id]) ? '<p class="pub-links">' + (v.topic ? '<span class="chip tag">' + esc(v.topic) + "</span>" : "") + paperLink(v) + "</p>" : "") + "</article>";
    }).join("") : "";
    if (countEl) countEl.textContent = shown.length + (shown.length === 1 ? " video" : " videos");
  }
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
