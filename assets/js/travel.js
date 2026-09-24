/* Travel page: India district map and world city map.
   Data: SITE.travel in data.js. Boundaries: assets/data/india.js, world.js.
   Edit mode: open travel.html#edit. Changes stay in this browser until copied
   into data.js with the "Copy data" button. */
(function () {
  "use strict";
  if (!window.d3 || !window.topojson || !window.MAP_INDIA || !window.MAP_WORLD) return;
  var SITE = window.SITE || {};
  var BASE = SITE.travel || { districts: [], places: [], countries: [] };
  var DRAFT_KEY = "ka-travel-draft";
  var EDIT_KEY = "ka-travel-edit";
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function ls(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
    } catch (e) { return null; }
  }
  function ss(k, v) {
    try {
      if (v === undefined) return sessionStorage.getItem(k);
      if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v);
    } catch (e) { return null; }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function fmtDate(d) {
    if (!d) return "";
    var p = String(d).split("-");
    return p[1] ? MONTHS[+p[1] - 1] + " " + p[0] : p[0];
  }
  function lastVisit(p) {
    return (p.visits || []).reduce(function (m, v) { return v.date && v.date > m ? v.date : m; }, "");
  }

  /* ---------- State: published data, or the local draft in edit mode ---------- */
  if (location.hash === "#edit") ss(EDIT_KEY, "1");
  var editing = ss(EDIT_KEY) === "1";
  var state = JSON.parse(JSON.stringify(BASE));
  state.districts = state.districts || [];
  state.places = state.places || [];
  state.countries = state.countries || [];
  if (editing) {
    try {
      var d = JSON.parse(ls(DRAFT_KEY) || "null");
      if (d) state = d;
    } catch (e) { /* keep published data */ }
  }
  var visited = new Set(state.districts);
  function saveDraft() {
    state.districts = Array.from(visited).sort();
    ls(DRAFT_KEY, JSON.stringify(state));
    renderAll();
  }

  /* ---------- Geometry ---------- */
  var IN = window.MAP_INDIA, WO = window.MAP_WORLD;
  var units = topojson.feature(IN, IN.objects.districts).features;
  /* Areas without district data (PoK, Gilgit-Baltistan, Aksai Chin) carry extra: true. */
  var districts = units.filter(function (f) { return !f.properties.extra; });
  var stateBorders = topojson.mesh(IN, IN.objects.states, function (a, b) { return a !== b; });
  var indiaOutline = topojson.mesh(IN, IN.objects.states, function (a, b) { return a === b; });
  var countries = topojson.feature(WO, WO.objects.countries).features.filter(function (f) { return f.properties.name !== "Antarctica"; });
  var STATE_COUNT = IN.objects.states.geometries.length;
  units.forEach(function (f) { f.key = f.properties.state + "/" + f.properties.name; });

  /* ---------- Shared map scaffolding ---------- */
  function makeMap(root, opts) {
    var svg = d3.select(root.querySelector("svg"));
    var W = opts.width, H = opts.height;
    svg.attr("viewBox", "0 0 " + W + " " + H);
    var g = svg.append("g");
    var tip = root.querySelector(".map-tip");
    var zoom = d3.zoom().scaleExtent([1, opts.maxZoom]).translateExtent([[0, 0], [W, H]])
      /* Plain scrolling moves the page; Ctrl/Cmd + scroll or a trackpad pinch zooms the map. */
      .filter(function (e) { return e.type === "wheel" ? (e.ctrlKey || e.metaKey) : !e.button; })
      .on("zoom", function (e) {
        g.attr("transform", e.transform);
        map.k = e.transform.k;
        if (map.onZoom) map.onZoom(e.transform.k);
      });
    svg.call(zoom).on("dblclick.zoom", null);
    var map = { svg: svg, g: g, W: W, H: H, k: 1, zoom: zoom };
    root.querySelectorAll("[data-zoom]").forEach(function (b) {
      b.addEventListener("click", function () {
        var z = b.getAttribute("data-zoom");
        if (z === "reset") svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
        else svg.transition().duration(250).call(zoom.scaleBy, z === "in" ? 1.6 : 1 / 1.6);
      });
    });
    map.focus = function (x, y, k) {
      var t = d3.zoomIdentity.translate(W / 2, H / 2).scale(k).translate(-x, -y);
      svg.transition().duration(600).call(zoom.transform, t);
    };
    map.showTip = function (html, event) {
      tip.innerHTML = html;
      tip.hidden = false;
      var r = root.getBoundingClientRect();
      var x = event.clientX - r.left, y = event.clientY - r.top;
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      tip.style.left = Math.max(8, Math.min(x + 14, r.width - tw - 8)) + "px";
      tip.style.top = Math.max(8, (y - th - 12 < 0 ? y + 16 : y - th - 12)) + "px";
    };
    map.hideTip = function () { tip.hidden = true; };
    root.addEventListener("mouseleave", map.hideTip);
    return map;
  }

  function placeTip(p) {
    var visits = (p.visits || []).slice().sort(function (a, b) { return (b.date || "") > (a.date || "") ? 1 : -1; });
    return "<strong>" + esc(p.name) + "</strong><span>" + esc(p.country) + "</span>" +
      visits.map(function (v) { return "<span>" + esc(fmtDate(v.date)) + (v.note ? " · " + esc(v.note) : "") + "</span>"; }).join("");
  }

  /* ---------- India ---------- */
  var indiaRoot = document.getElementById("india-map");
  var india = null;
  if (indiaRoot) {
    var inProj = d3.geoConicConformal().parallels([12.472944, 35.172806]).rotate([-80, 0]);
    var inOutlineFeature = { type: "FeatureCollection", features: topojson.feature(IN, IN.objects.states).features };
    inProj.fitExtent([[12, 12], [788, 868]], inOutlineFeature);
    var inPath = d3.geoPath(inProj);
    india = makeMap(indiaRoot, { width: 800, height: 880, maxZoom: 14 });
    india.proj = inProj;
    india.dist = india.g.append("g").attr("class", "districts").selectAll("path").data(units).join("path")
      .attr("d", inPath).attr("class", function (f) { return f.properties.extra ? "district extra" : "district"; })
      .on("mousemove", function (e, f) {
        if (f.properties.extra) {
          india.showTip("<strong>" + esc(f.properties.name) + "</strong><span>" + esc(f.properties.state) + "</span>", e);
          return;
        }
        india.showTip("<strong>" + esc(f.properties.name) + "</strong><span>" + esc(f.properties.state) + "</span>" +
          (visited.has(f.key) ? '<span class="tip-flag">Visited</span>' : "") +
          (editing ? '<span class="tip-hint">Click to ' + (visited.has(f.key) ? "unmark" : "mark as visited") + "</span>" : ""), e);
      })
      .on("mouseleave", india.hideTip)
      .on("click", function (e, f) {
        if (!editing || f.properties.extra) return;
        if (visited.has(f.key)) visited.delete(f.key); else visited.add(f.key);
        saveDraft();
      });
    india.g.append("path").attr("class", "state-border").attr("d", inPath(stateBorders));
    india.g.append("path").attr("class", "country-border").attr("d", inPath(indiaOutline));
    india.pins = india.g.append("g").attr("class", "pins");
    india.onZoom = function (k) { india.pins.selectAll("circle").attr("r", 4.5 / Math.sqrt(k)); };
  }

  /* ---------- World ---------- */
  var worldRoot = document.getElementById("world-map");
  var world = null;
  if (worldRoot) {
    var wProj = d3.geoEqualEarth();
    wProj.fitExtent([[4, 4], [996, 496]], { type: "Sphere" });
    var wPath = d3.geoPath(wProj);
    world = makeMap(worldRoot, { width: 1000, height: 500, maxZoom: 40 });
    world.proj = wProj;
    world.g.append("path").attr("class", "sphere").attr("d", wPath({ type: "Sphere" }));
    world.g.append("path").attr("class", "graticule").attr("d", wPath(d3.geoGraticule10()));
    world.ctry = world.g.append("g").selectAll("path").data(countries).join("path")
      .attr("d", wPath).attr("class", "country")
      .on("mousemove", function (e, f) {
        var n = state.places.filter(function (p) { return p.country === f.properties.name; }).length;
        world.showTip("<strong>" + esc(f.properties.name) + "</strong>" +
          (n ? "<span>" + n + (n === 1 ? " city" : " cities") + "</span>" : "") +
          (editing ? '<span class="tip-hint">Click to add a city pin here</span>' : ""), e);
      })
      .on("mouseleave", world.hideTip);
    world.pins = world.g.append("g").attr("class", "pins");
    world.onZoom = function (k) {
      world.pins.selectAll("circle").attr("r", 5 / Math.sqrt(k));
    };
    world.svg.on("click", function (e) {
      if (!editing || e.target.closest(".pin")) return;
      var pt = d3.pointer(e, world.g.node());
      var ll = wProj.invert(pt);
      if (!ll || isNaN(ll[0])) return;
      var hit = countries.filter(function (f) { return d3.geoContains(f, ll); })[0];
      openPinForm(null, { name: "", country: hit ? hit.properties.name : "", lat: +ll[1].toFixed(4), lon: +ll[0].toFixed(4), visits: [{ date: "", note: "" }] });
    });
  }

  function drawPins(map, places) {
    map.pins.selectAll("circle").data(places, function (p) { return p.name + p.lat + p.lon; }).join("circle")
      .attr("class", "pin")
      .attr("cx", function (p) { return map.proj([p.lon, p.lat])[0]; })
      .attr("cy", function (p) { return map.proj([p.lon, p.lat])[1]; })
      .attr("r", (map === world ? 5 : 4.5) / Math.sqrt(map.k))
      .attr("tabindex", 0)
      .attr("aria-label", function (p) { return p.name + ", " + p.country; })
      .on("mousemove focus", function (e, p) {
        var ev = e.clientX ? e : { clientX: this.getBoundingClientRect().left, clientY: this.getBoundingClientRect().top };
        map.showTip(placeTip(p) + (editing ? '<span class="tip-hint">Click to edit</span>' : ""), ev);
      })
      .on("mouseleave blur", map.hideTip)
      .on("click", function (e, p) {
        e.stopPropagation();
        if (editing) openPinForm(p, p);
      });
  }

  /* ---------- Render everything from current state ---------- */
  function renderAll() {
    var visitedCountries = new Set(state.countries);
    state.places.forEach(function (p) { visitedCountries.add(p.country); });
    if (visited.size) visitedCountries.add("India");
    var statesTouched = new Set(Array.from(visited).map(function (k) { return k.split("/")[0]; }));

    if (india) {
      india.dist.classed("visited", function (f) { return visited.has(f.key); });
      drawPins(india, state.places.filter(function (p) { return p.country === "India"; }));
    }
    if (world) {
      world.ctry.classed("visited", function (f) { return visitedCountries.has(f.properties.name); });
      drawPins(world, state.places);
    }

    var stats = document.getElementById("travel-stats");
    if (stats) {
      stats.innerHTML =
        '<div class="stat"><b>' + visited.size + '</b><span>of ' + districts.length + ' districts</span></div>' +
        '<div class="stat"><b>' + statesTouched.size + '</b><span>of ' + STATE_COUNT + ' states and UTs</span></div>' +
        '<div class="stat"><b>' + visitedCountries.size + '</b><span>' + (visitedCountries.size === 1 ? "country" : "countries") + '</span></div>' +
        '<div class="stat"><b>' + state.places.length + '</b><span>cities pinned</span></div>';
    }

    var dl = document.getElementById("district-list");
    if (dl) {
      var byState = {};
      Array.from(visited).sort().forEach(function (k) {
        var p = k.split("/");
        (byState[p[0]] = byState[p[0]] || []).push(p.slice(1).join("/"));
      });
      var keys = Object.keys(byState);
      dl.innerHTML = keys.length ? keys.map(function (s) {
        return '<div class="state-group"><h4>' + esc(s) + ' <span class="count">' + byState[s].length + "</span></h4><p>" + byState[s].map(esc).join(", ") + "</p></div>";
      }).join("") : '<p class="muted">No districts marked yet.</p>';
    }

    var pl = document.getElementById("place-list");
    if (pl) {
      var sorted = state.places.slice().sort(function (a, b) { return lastVisit(b) > lastVisit(a) ? 1 : -1; });
      pl.innerHTML = sorted.map(function (p) {
        var visits = (p.visits || []).slice().sort(function (a, b) { return (b.date || "") > (a.date || "") ? 1 : -1; });
        return '<tr id="place-' + slug(p.name) + '"><td><button type="button" class="linklike" data-focus="' + esc(p.name) + '">' + esc(p.name) + "</button></td><td>" + esc(p.country) + "</td><td>" +
          visits.map(function (v) { return '<span class="visit"><span class="mono">' + esc(fmtDate(v.date)) + "</span> " + esc(v.note || "") + "</span>"; }).join("") + "</td></tr>";
      }).join("");
    }

    var out = document.getElementById("edit-output");
    if (out) out.value = snippet();
    var dirty = document.getElementById("edit-status");
    if (dirty) dirty.textContent = JSON.stringify({ d: Array.from(visited).sort(), p: state.places, c: state.countries }) ===
      JSON.stringify({ d: (BASE.districts || []).slice().sort(), p: BASE.places || [], c: BASE.countries || [] }) ? "No unsaved changes." : "Changes not yet in data.js.";
  }

  /* ---------- Focus a place (from the list, or #place-name in the URL) ---------- */
  function focusPlace(name) {
    var p = state.places.filter(function (x) { return x.name === name || slug(x.name) === name; })[0];
    if (!p || !world) return;
    var tab = document.getElementById("tab-world");
    if (tab) tab.click();
    var xy = world.proj([p.lon, p.lat]);
    world.focus(xy[0], xy[1], 8);
    worldRoot.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-focus]");
    if (b) focusPlace(b.getAttribute("data-focus"));
  });

  /* ---------- Edit mode ---------- */
  function snippet() {
    var t = {
      districts: Array.from(visited).sort(),
      places: state.places,
      countries: state.countries
    };
    var lines = ["  travel: {", "    districts: ["];
    lines.push(t.districts.map(function (d) { return "      " + JSON.stringify(d); }).join(",\n"));
    lines.push("    ],", "    places: [");
    lines.push(t.places.map(function (p) {
      return "      { name: " + JSON.stringify(p.name) + ", country: " + JSON.stringify(p.country) + ", lat: " + p.lat + ", lon: " + p.lon +
        ", visits: [" + (p.visits || []).map(function (v) { return "{ date: " + JSON.stringify(v.date || "") + ", note: " + JSON.stringify(v.note || "") + " }"; }).join(", ") + "] }";
    }).join(",\n"));
    lines.push("    ],", "    countries: " + JSON.stringify(t.countries), "  },");
    return lines.join("\n");
  }

  var form = document.getElementById("pin-form");
  var editingPin = null;
  function openPinForm(existing, p) {
    if (!form) return;
    editingPin = existing;
    form.hidden = false;
    form.elements["pin-name"].value = p.name || "";
    form.elements["pin-country"].value = p.country || "";
    form.elements["pin-lat"].value = p.lat;
    form.elements["pin-lon"].value = p.lon;
    var v = (p.visits && p.visits[0]) || {};
    form.elements["pin-date"].value = v.date || "";
    form.elements["pin-note"].value = v.note || "";
    form.querySelector("[data-act=delete]").hidden = !existing;
    form.elements["pin-name"].focus();
  }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var p = {
        name: f["pin-name"].value.trim(), country: f["pin-country"].value.trim(),
        lat: +(+f["pin-lat"].value).toFixed(4), lon: +(+f["pin-lon"].value).toFixed(4),
        visits: [{ date: f["pin-date"].value.trim(), note: f["pin-note"].value.trim() }]
      };
      if (!p.name || isNaN(p.lat) || isNaN(p.lon)) return;
      if (editingPin) {
        p.visits = [p.visits[0]].concat((editingPin.visits || []).slice(1));
        state.places[state.places.indexOf(editingPin)] = p;
      } else {
        state.places.push(p);
      }
      form.hidden = true;
      saveDraft();
    });
    form.addEventListener("click", function (e) {
      var act = e.target.getAttribute("data-act");
      if (act === "cancel") form.hidden = true;
      if (act === "delete" && editingPin) {
        state.places.splice(state.places.indexOf(editingPin), 1);
        form.hidden = true;
        saveDraft();
      }
    });
  }

  var panel = document.getElementById("edit-panel");
  if (panel && editing) {
    panel.hidden = false;
    document.body.classList.add("is-editing");
    var input = document.getElementById("district-search");
    var list = document.getElementById("district-options");
    list.innerHTML = districts.map(function (f) { return '<option value="' + esc(f.properties.name + ", " + f.properties.state) + '"></option>'; }).sort().join("");
    input.addEventListener("change", function () {
      var v = input.value.split(", ");
      var key = v.slice(1).join(", ") + "/" + v[0];
      var f = districts.filter(function (x) { return x.key === key; })[0];
      if (!f) return;
      visited.add(key);
      saveDraft();
      input.value = "";
      var b = d3.geoPath(india.proj).bounds(f);
      india.focus((b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2, 5);
    });
    panel.addEventListener("click", function (e) {
      var act = e.target.getAttribute("data-act");
      if (act === "copy") {
        var out = document.getElementById("edit-output");
        var done = function () { e.target.textContent = "Copied"; setTimeout(function () { e.target.textContent = "Copy data"; }, 1600); };
        if (navigator.clipboard) navigator.clipboard.writeText(out.value).then(done, function () { out.select(); });
        else out.select();
      }
      if (act === "discard") {
        ls(DRAFT_KEY, null);
        state = JSON.parse(JSON.stringify(BASE));
        visited = new Set(state.districts || []);
        renderAll();
      }
      if (act === "exit") {
        ss(EDIT_KEY, null);
        location.href = location.pathname;
      }
    });
  }

  renderAll();
  if (/^#place-/.test(location.hash)) focusPlace(location.hash.slice(7));
})();
