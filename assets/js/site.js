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

  /* ---------- Feeds ----------
     assets/js/feed-*.js are refreshed daily by tools/update_feeds.py.
     Works on ORCID that are not in data.js are added to the publication and
     talk lists; recent papers, videos and articles join the home page list;
     the larger of the Scholar and data.js citation counts is shown. */
  var AUTO_RECENT = [];
  (function mergeFeeds() {
    function norm(t) { return String(t || "").toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, ""); }
    var PUBTYPE = { "journal-article": "journal", "book-chapter": "chapter", "conference-paper": "proceedings", "preprint": "preprint", "working-paper": "preprint", "report": "whitepaper" };
    var TALK = { "conference-poster": "Poster", "conference-abstract": "Talk", "conference-presentation": "Talk", "lecture-speech": "Talk", "conference-output": "Talk" };
    var pubs = SITE.publications = SITE.publications || [];
    var confs = SITE.conferences = SITE.conferences || [];
    var seen = {};
    pubs.forEach(function (p) {
      if (p.doi) seen[p.doi.toLowerCase()] = 1;
      if (p.arxiv) seen[p.arxiv] = 1;
      seen[norm(p.title)] = 1;
    });
    confs.forEach(function (c) { seen["talk:" + norm(c.title)] = 1; });
    var added = 0;
    ((window.WORKS || {}).items || []).forEach(function (w) {
      var arx = w.arxiv || ((w.doi || "").match(/^10\.48550\/arxiv\.(.+)$/) || [])[1];
      var ym = w.year ? w.year + (w.month ? "-" + ("0" + w.month).slice(-2) : "") : "";
      if (PUBTYPE[w.type]) {
        if ((w.doi && seen[w.doi]) || (arx && seen[arx]) || seen[norm(w.title)]) return;
        seen[norm(w.title)] = 1;
        var p = { role: /^Aggarwal,/.test(w.authors || "") ? "first" : "co", kind: PUBTYPE[w.type], year: w.year || "",
          title: w.title, authors: w.authors || "", venue: w.venue || "", doi: w.doi, arxiv: arx, url: w.url };
        pubs.push(p); added++;
        AUTO_RECENT.push({ key: ym, date: monthYear(ym), type: "Paper", title: w.title, where: w.venue, href: w.doi ? "https://doi.org/" + w.doi : w.url });
      } else if (TALK[w.type] && ym && !seen["talk:" + norm(w.title)]) {
        confs.push({ date: ym, dates: monthYear(ym), kind: TALK[w.type], event: w.venue || "Conference", place: "", title: w.title });
        AUTO_RECENT.push({ key: ym, date: monthYear(ym), type: TALK[w.type], title: w.title, where: w.venue, href: "talks.html" });
      }
    });
    if (added) pubs.sort(function (a, b) { return (+b.year || 0) - (+a.year || 0); });
    ((window.VIDEOS || {}).videos || []).forEach(function (v) {
      if (v.id && v.date && !v.hidden) AUTO_RECENT.push({ key: v.date.slice(0, 7), date: monthYear(v.date.slice(0, 7)), type: "Video", title: v.title, where: "YouTube", href: "https://www.youtube.com/watch?v=" + v.id });
    });
    ((window.ARTICLES || {}).items || []).forEach(function (a) {
      if (a.date) AUTO_RECENT.push({ key: a.date.slice(0, 7), date: monthYear(a.date.slice(0, 7)), type: "Article", title: a.title, where: "Medium", href: a.url || a.link });
    });
    var M = window.METRICS;
    if (M && M.citations && (!SITE.metrics || !SITE.metrics.citations || M.citations > SITE.metrics.citations)) {
      SITE.metrics = { citations: M.citations, source: "Google Scholar", url: M.source };
    }
  })();

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
    var href = p.doi ? "https://doi.org/" + p.doi : p.url || (p.arxiv ? "https://arxiv.org/abs/" + p.arxiv : "#");
    var authors = esc(p.authors).replace(/Aggarwal, K\./g, '<span class="me">Aggarwal, K.</span>');
    var links = [];
    if (p.doi) links.push('<a class="chip" href="https://doi.org/' + esc(p.doi) + '">DOI</a>');
    else if (p.url) links.push('<a class="chip" href="' + esc(p.url) + '">Link</a>');
    if (p.arxiv) links.push('<a class="chip" href="https://arxiv.org/abs/' + esc(p.arxiv) + '">arXiv</a>');
    if (p.ads) links.push('<a class="chip" href="' + esc(p.ads) + '">ADS</a>');
    if (p.code) links.push('<a class="chip" href="' + esc(p.code) + '">Code</a>');
    if (p.video) links.push('<a class="chip" href="https://www.youtube.com/watch?v=' + esc(p.video) + '">' + icon("play") + " Video</a>");
    if (!p.status) links.push('<button type="button" class="chip" data-bib="' + esc(bibKey(p)) + '" aria-expanded="false">BibTeX</button>');
    var tags = (p.status ? '<span class="chip status-tag">' + esc(p.status) + "</span>" : "") + (KIND_LABEL[p.kind] ? '<span class="chip kindtag">' + KIND_LABEL[p.kind] + "</span>" : "") +
      (p.collab ? '<span class="chip kindtag">' + esc(p.collab) + "</span>" : "") +
      (p.missions || []).map(function (m) { return '<span class="chip tag">' + esc(m) + "</span>"; }).join("");
    return '<li class="pub">' +
      '<p class="pub-title">' + (href === "#" ? esc(p.title) : '<a href="' + esc(href) + '">' + esc(p.title) + "</a>") + "</p>" +
      '<p class="pub-authors">' + authors + "</p>" +
      '<div class="pub-meta"><span class="pub-venue">' + esc(p.venue) + (p.publisher ? ", " + esc(p.publisher) : "") + '</span><span class="mono muted">' + esc(p.year) + "</span>" +
      '<span class="pub-links">' + links.join("") + "</span>" + (tags ? '<span class="pub-links">' + tags + "</span>" : "") + "</div>" +
      '<div class="bib" hidden><pre>' + esc(bibtex(p)) + '</pre><button type="button" class="btn small ghost" data-copy-bib>Copy</button></div>' +
      "</li>";
  }

  var KIND_LABEL = { proceedings: "Proceedings", chapter: "Book chapter", whitepaper: "White paper", preprint: "Preprint" };
  var PUB_FILTERS = {
    all: function () { return true; },
    first: function (p) { return p.role === "first"; },
    firstjournal: function (p) { return p.role === "first" && p.kind === "journal" && !p.status; },
    co: function (p) { return p.role === "co"; },
    proc: function (p) { return p.kind === "proceedings" || p.kind === "chapter"; }
  };

  /* ---------- BibTeX ---------- */
  function bibAuthors(s) {
    var team = "";
    var m = s.match(/^([^:]+Team):\s*/);
    if (m) { team = "{" + m[1] + "}"; s = s.slice(m[0].length); }
    var others = /et al\./.test(s);
    s = s.replace(/\(incl\.[^)]*\)/, "").replace(/,?\s*et al\./, "");
    var names = [], re = /\s*([^,]+),\s*((?:[A-Z][a-z]?\.[\s-]*)+)(?:,|$)/g, x;
    while ((x = re.exec(s))) names.push(x[1].trim() + ", " + x[2].trim());
    if (team) names.unshift(team);
    if (others) names.push("others");
    return names.join(" and ");
  }
  function bibKey(p) {
    var first = (p.authors.match(/^(?:[^:]+:\s*)?([A-Za-z\u00C0-\u017F-]+)/) || [0, "ref"])[1];
    var word = (p.title.match(/[A-Za-z]{4,}/) || ["paper"])[0];
    return (first + p.year + word).replace(/[^A-Za-z0-9]/g, "");
  }
  function bibtex(p) {
    var f = [["author", bibAuthors(p.authors)], ["title", "{" + p.title + "}"]];
    var type = { journal: "article", proceedings: "inproceedings", chapter: "incollection" }[p.kind] || "misc";
    if (type === "article") f.push(["journal", p.venue]);
    else if (type === "misc") f.push(["howpublished", p.venue]);
    else f.push(["booktitle", p.venue]);
    if (p.publisher) f.push(["publisher", p.publisher]);
    f.push(["year", String(p.year)]);
    if (p.doi) f.push(["doi", p.doi]);
    if (p.url) f.push(["url", p.url]);
    if (p.arxiv) { f.push(["eprint", p.arxiv]); f.push(["archivePrefix", "arXiv"]); }
    return "@" + type + "{" + bibKey(p) + ",\n" + f.map(function (kv) { return "  " + kv[0] + " = {" + kv[1] + "}"; }).join(",\n") + "\n}";
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-bib]");
    if (b) {
      var box = b.closest(".pub").querySelector(".bib");
      box.hidden = !box.hidden;
      b.setAttribute("aria-expanded", box.hidden ? "false" : "true");
      return;
    }
    var c = e.target.closest("[data-copy-bib]");
    if (c) {
      var pre = c.parentNode.querySelector("pre");
      var ok = function () { c.textContent = "Copied"; setTimeout(function () { c.textContent = "Copy"; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(pre.textContent).then(ok, function () { window.getSelection().selectAllChildren(pre); });
      else window.getSelection().selectAllChildren(pre);
    }
  });
  var bibAll = document.getElementById("bib-download");
  if (bibAll && SITE.publications) {
    bibAll.addEventListener("click", function () {
      var text = SITE.publications.filter(function (p) { return !p.status; }).map(bibtex).join("\n\n") + "\n";
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "application/x-bibtex" }));
      a.download = "aggarwal-publications.bib";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
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
    var panels = pubRoot.querySelectorAll("[data-pub-filter]");
    function counts() {
      pubRoot.querySelectorAll("[data-count]").forEach(function (el) {
        var t = el.getAttribute("data-count");
        el.textContent = all.filter(PUB_FILTERS[t]).length;
      });
    }
    function render() {
      var q = (search && search.value || "").trim().toLowerCase();
      var shown = 0;
      panels.forEach(function (panel) {
        var t = panel.getAttribute("data-pub-filter");
        var list = all.filter(function (p) {
          if (!PUB_FILTERS[t](p)) return false;
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

  var citeStat = document.getElementById("stat-citations");
  var M = SITE.metrics;
  if (citeStat && M && M.citations) {
    citeStat.querySelector("b").textContent = M.citations.toLocaleString("en-US");
    citeStat.querySelector("span").innerHTML = 'citations (<a href="' + esc(M.url) + '">' + esc(M.source) + "</a>)";
    citeStat.hidden = false;
  }

  var selected = document.getElementById("selected-pubs");
  if (selected && SITE.publications) {
    var n = +selected.getAttribute("data-limit") || 3;
    selected.innerHTML = SITE.publications.filter(function (p) { return p.role === "first" && p.kind === "journal"; }).slice(0, n).map(pubHTML).join("");
  }

  /* ---------- Compact publication list (CV) ---------- */
  var cvPubs = document.getElementById("cv-pubs");
  if (cvPubs && SITE.publications) {
    var groups = [
      [function (p) { return p.role === "first" && p.kind === "journal" && !p.status; }, "First-author journal papers"],
      [function (p) { return p.role === "co" && p.kind === "journal" && !p.status; }, "Co-authored journal papers"],
      [function (p) { return p.kind === "proceedings" || p.kind === "chapter"; }, "Conference proceedings and book chapters"],
      [function (p) { return p.kind === "whitepaper" || p.kind === "preprint"; }, "White papers and preprints"],
      [function (p) { return !!p.status; }, "Under review"]
    ];
    cvPubs.innerHTML = groups.map(function (g) {
      var list = SITE.publications.filter(g[0]);
      if (!list.length) return "";
      return '<h3 class="cv-pubs-head">' + esc(g[1]) + '</h3><ol class="cv-pub-list">' + list.map(function (p) {
        var href = p.doi ? "https://doi.org/" + p.doi : p.url || (p.arxiv ? "https://arxiv.org/abs/" + p.arxiv : "#");
        return "<li>" + esc(p.authors).replace(/Aggarwal, K\./g, "<b>Aggarwal, K.</b>") + " (" + p.year + "). " + esc(p.title) + ". <i>" + esc(p.venue) + "</i>." +
          (p.doi ? ' <a href="' + esc(href) + '">doi:' + esc(p.doi) + "</a>" : ' <a href="' + esc(href) + '">' + esc(href.replace(/^https?:\/\//, "")) + "</a>") + "</li>";
      }).join("") + "</ol>";
    }).join("");
  }

  /* ---------- Conferences ---------- */
  var CONF = (SITE.conferences || []).slice().sort(function (a, b) {
    return a.date === b.date ? (a.kind === "Talk" ? -1 : 1) : (a.date < b.date ? 1 : -1);
  });
  function confRow(c) {
    return '<div class="row" data-kind="' + esc(c.kind) + '"><div class="row-date">' + esc(c.dates || monthYear(c.date)) + '</div><div class="row-body">' +
      '<p class="row-title">' + esc(c.event) + "</p>" +
      '<p class="row-sub">' + esc(c.place) + "</p>" +
      '<p><span class="kind kind-' + esc(c.kind.toLowerCase()) + '">' + esc(c.kind) + "</span> <em>" + esc(c.title) + "</em></p>" +
      (c.award ? '<p class="award">' + esc(c.award) + "</p>" : "") +
      (c.pdf ? '<p class="pub-links"><a class="chip" href="' + esc(c.pdf) + '">' + icon("pdf") + " " + esc(c.kind) + " PDF</a></p>" : "") +
      "</div></div>";
  }
  var confRoot = document.getElementById("conference-list");
  if (confRoot && CONF.length) {
    var confFilter = document.getElementById("conference-filter");
    var confKind = "All";
    var drawConf = function () {
      confRoot.innerHTML = CONF.filter(function (c) { return confKind === "All" || c.kind === confKind; }).map(confRow).join("");
    };
    if (confFilter) {
      var nTalk = CONF.filter(function (c) { return c.kind === "Talk"; }).length;
      confFilter.innerHTML = [["All", CONF.length], ["Talk", nTalk], ["Poster", CONF.length - nTalk]].map(function (k) {
        return '<button type="button" class="filter" data-kind="' + k[0] + '" aria-pressed="' + (k[0] === confKind) + '">' + (k[0] === "All" ? "All" : k[0] + "s") + ' <span class="count">' + k[1] + "</span></button>";
      }).join("");
      confFilter.addEventListener("click", function (e) {
        var b = e.target.closest("[data-kind]"); if (!b) return;
        confKind = b.getAttribute("data-kind");
        confFilter.querySelectorAll("[data-kind]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        drawConf();
      });
    }
    drawConf();
    var statsEl = document.getElementById("conference-stats");
    if (statsEl) {
      var talks = CONF.filter(function (c) { return c.kind === "Talk"; }).length;
      var awards = CONF.filter(function (c) { return c.award; }).length;
      statsEl.innerHTML =
        '<div class="stat"><b>' + talks + "</b><span>talks</span></div>" +
        '<div class="stat"><b>' + (CONF.length - talks) + "</b><span>posters</span></div>" +
        (awards ? '<div class="stat"><b>' + awards + "</b><span>" + (awards === 1 ? "award or grant" : "awards and grants") + "</span></div>" : "");
    }
  }
  var homeTalks = document.getElementById("home-talks");
  if (homeTalks && CONF.length) {
    homeTalks.innerHTML = CONF.slice(0, +homeTalks.getAttribute("data-limit") || 5).map(function (c) {
      return '<li><time class="mono">' + esc(monthYear(c.date)) + "</time><div>" +
        '<p class="ht-event"><span class="kind kind-' + esc(c.kind.toLowerCase()) + '">' + esc(c.kind) + "</span> " + esc(c.event) + "</p>" +
        '<p class="ht-title">' + esc(c.title) + "</p>" +
        '<p class="ht-place">' + esc(c.place) + "</p>" +
        (c.award ? '<p class="award">' + esc(c.award) + "</p>" : "") + "</div></li>";
    }).join("");
  }

  /* ---------- Contact ---------- */
  var cform = document.getElementById("contact-form");
  if (cform) {
    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = cform.elements;
      var body = f.message.value.trim() + "\n\n" + f.name.value.trim() + "\n" + f.from.value.trim();
      location.href = "mailto:" + cform.getAttribute("data-email") +
        "?subject=" + encodeURIComponent(f.topic.value + " (from website)") + "&body=" + encodeURIComponent(body);
    });
  }
  var copyBtn = document.getElementById("copy-email");
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(copyBtn.getAttribute("data-email")).then(function () {
        copyBtn.textContent = "Copied";
        setTimeout(function () { copyBtn.textContent = "Copy address"; }, 1600);
      });
    });
  } else if (copyBtn) copyBtn.hidden = true;

  /* ---------- Home: recent list and at-a-glance numbers ---------- */
  var recentRoot = document.getElementById("recent-list");
  if (recentRoot && SITE.recent) {
    /* Hand-written entries in data.js plus feed items from the last twelve months, newest first. */
    var recentKey = function (d) {
      var m = String(d).match(/(?:([A-Z][a-z]{2}) )?(\d{4})/);
      return m ? m[2] + "-" + (m[1] ? ("0" + (MONTHS.indexOf(m[1]) + 1)).slice(-2) : "00") : "";
    };
    var now = new Date(), cutoff = (now.getFullYear() - 1) + "-" + ("0" + (now.getMonth() + 1)).slice(-2);
    var have = {}, latest = {};
    var RECENT = SITE.recent.map(function (r) {
      var k = recentKey(r.date);
      have[r.title.toLowerCase()] = 1;
      if (!latest[r.type] || k > latest[r.type]) latest[r.type] = k;
      return Object.assign({ key: k }, r);
    });
    /* A feed item is added only when it is newer than the latest hand-written entry of its type. */
    AUTO_RECENT.forEach(function (r) {
      var t = String(r.title).toLowerCase();
      if (r.key >= cutoff && r.key > (latest[r.type] || "") && !have[t]) { have[t] = 1; RECENT.push(r); }
    });
    RECENT.sort(function (a, b) { return a.key === b.key ? 0 : (a.key < b.key ? 1 : -1); });
    recentRoot.innerHTML = RECENT.slice(0, 10).map(function (r) {
      var t = esc(r.title);
      if (r.href) t = '<a href="' + esc(r.href) + '">' + t + "</a>";
      return '<li><time class="mono">' + esc(r.date) + '</time><div><p class="rc-title"><span class="kind kind-' + esc(r.type.toLowerCase()) + '">' + esc(r.type) + "</span> " + t + "</p>" +
        (r.where ? '<p class="rc-where">' + esc(r.where) + "</p>" : "") + "</div></li>";
    }).join("");
  }
  var glance = document.getElementById("glance");
  if (glance) {
    var P = SITE.publications || [], C = SITE.conferences || [], T = SITE.travel || {};
    var cells = [
      [P.filter(function (p) { return p.role === "first" && p.kind === "journal" && !p.status; }).length, "first-author journal papers", "publications.html#first"],
      [P.filter(function (p) { return !p.status; }).length, "publications in total", "publications.html"],
      [SITE.metrics && SITE.metrics.citations ? SITE.metrics.citations.toLocaleString("en-US") : "", "citations", "publications.html"],
      [C.length, "conference talks and posters", "talks.html"],
      [(T.districts || []).length, "districts of India visited", "travel.html"]
    ].filter(function (c) { return c[0]; });
    glance.innerHTML = cells.map(function (c) {
      return '<a class="glance-cell" href="' + c[2] + '"><b>' + esc(c[0]) + "</b><span>" + esc(c[1]) + "</span></a>";
    }).join("");
  }

  /* ---------- Latest video and article (home page) ---------- */
  var V = window.VIDEOS && window.VIDEOS.videos ? window.VIDEOS.videos.filter(function (v) { return !v.hidden; }) : [];
  var latestV = document.getElementById("latest-video");
  if (latestV && V.length) {
    var lv = V[0];
    latestV.innerHTML = '<a class="mini-media" href="videos.html"><img src="https://i.ytimg.com/vi/' + esc(lv.id) + '/mqdefault.jpg" alt="" loading="lazy" width="320" height="180"></a>' +
      '<div><p class="label">Latest video</p><p class="mini-title"><a href="videos.html">' + esc(lv.title) + '</a></p><p class="mono muted">' + esc(monthYear(lv.date)) + "</p></div>";
    latestV.hidden = false;
  }
  var A = window.ARTICLES && window.ARTICLES.items ? window.ARTICLES.items : [];
  var latestA = document.getElementById("latest-article");
  if (latestA && A.length) {
    var la = A[0];
    latestA.innerHTML = (la.image ? '<a class="mini-media" href="' + esc(la.url) + '"><img src="' + esc(la.image) + '" alt="" loading="lazy"></a>' : "") +
      '<div><p class="label">Latest article</p><p class="mini-title"><a href="' + esc(la.url) + '">' + esc(la.title.replace(/^Title:\s*/, "")) + '</a></p><p class="mono muted">' + esc(monthYear(la.date)) + " · Medium</p></div>";
    latestA.hidden = false;
  }

  /* ---------- Articles (writing page) ---------- */
  var artRoot = document.getElementById("article-list");
  if (artRoot) {
    var tagBox = document.getElementById("article-tags");
    var activeTag = "All";
    var tags = {};
    A.forEach(function (a) { (a.tags || []).forEach(function (t) { tags[t] = (tags[t] || 0) + 1; }); });
    var common = Object.keys(tags).filter(function (t) { return tags[t] > 1; }).sort(function (x, y) { return tags[y] - tags[x]; }).slice(0, 8);
    /* Medium excerpts often repeat the title; drop it. */
    var cleanExcerpt = function (a) {
      var t = a.title.replace(/^Title:\s*/, ""), e = a.excerpt.replace(/^Title:\s*/, "");
      return e.indexOf(t) === 0 ? e.slice(t.length).replace(/^[\s:\u2014-]+/, "") : e;
    };
    var drawArticles = function () {
      var list = A.filter(function (a) { return activeTag === "All" || (a.tags || []).indexOf(activeTag) > -1; });
      artRoot.innerHTML = list.map(function (a) {
        return '<article class="article">' +
          (a.image ? '<a class="article-img" href="' + esc(a.url) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(a.image) + '" alt="" loading="lazy"></a>' : "") +
          '<div class="article-body"><p class="mono muted">' + esc(monthYear(a.date)) + "</p>" +
          '<h3><a href="' + esc(a.url) + '">' + esc(a.title.replace(/^Title:\s*/, "")) + "</a></h3>" +
          (a.excerpt ? '<p class="article-excerpt">' + esc(cleanExcerpt(a)) + "</p>" : "") +
          '<p class="pub-links">' + (a.tags || []).slice(0, 4).map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</p></div></article>";
      }).join("");
    };
    if (tagBox && common.length) {
      tagBox.innerHTML = ["All"].concat(common).map(function (t) {
        return '<button type="button" class="filter" aria-pressed="' + (t === activeTag) + '" data-tag="' + esc(t) + '">' + esc(t) + (t === "All" ? "" : ' <span class="count">' + tags[t] + "</span>") + "</button>";
      }).join("");
      tagBox.addEventListener("click", function (e) {
        var b = e.target.closest("[data-tag]"); if (!b) return;
        activeTag = b.getAttribute("data-tag");
        tagBox.querySelectorAll("[data-tag]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        drawArticles();
      });
    }
    if (A.length) { drawArticles(); var ae = document.getElementById("articles-empty"); if (ae) ae.hidden = true; }
  }

  /* ---------- Generic tab groups (non-publication pages) ---------- */
  document.querySelectorAll(".tabs[data-tabs]").forEach(initTabs);

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
