/* Runs in <head> before paint: applies the saved light/dark choice and any
   design preview chosen on design.html (stored in this browser only). */
(function () {
  var r = document.documentElement, d = null;
  try {
    var t = localStorage.getItem("ka-theme");
    if (t === "light" || t === "dark") r.setAttribute("data-theme", t);
    d = JSON.parse(localStorage.getItem("ka-design") || "null");
  } catch (e) { d = null; }
  if (!d) return;
  ["palette", "font", "layout"].forEach(function (k) { if (d[k]) r.setAttribute("data-" + k, d[k]); });
  var F = {
    plex: "IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400",
    newsreader: "Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400",
    garamond: "EB+Garamond:ital,wght@0,400;0,500;0,600;1,400"
  };
  if (F[d.font]) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=" + F[d.font] + "&display=swap";
    document.head.appendChild(l);
  }
})();
