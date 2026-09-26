#!/usr/bin/env python3
"""Refresh videos, articles, citations and the ORCID works list.

Writes assets/js/feed-videos.js (window.VIDEOS), assets/js/feed-articles.js
(window.ARTICLES), assets/js/feed-metrics.js (window.METRICS) and
assets/js/feed-works.js (window.WORKS: papers, chapters, preprints, talks and
posters listed on ORCID, with authors from Crossref). Runs daily in GitHub Actions
(.github/workflows/update-feeds.yml) and can be run by hand:

    python3 tools/update_feeds.py

Standard library only. Sources, in order of completeness:
  1. YouTube Data API v3, if the YT_API_KEY environment variable is set
     (full upload list with durations and view counts).
  2. The channel's uploads playlist page (up to about 100 videos).
  3. The channel RSS feed (latest 15 videos, with dates and view counts).
Fields added by hand to a video in feed-videos.js (topic, featured, hidden,
note) are kept on every run.
"""
import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

HANDLE = os.environ.get("YT_HANDLE", "keshavagg1098")
MEDIUM_FEED = os.environ.get("MEDIUM_FEED", "https://jovian-explorer.medium.com/feed")
ROOT = Path(__file__).resolve().parent.parent
VIDEO_JS = ROOT / "assets/js/feed-videos.js"
ARTICLE_JS = ROOT / "assets/js/feed-articles.js"
METRICS_JS = ROOT / "assets/js/feed-metrics.js"
WORKS_JS = ROOT / "assets/js/feed-works.js"
ORCID = os.environ.get("ORCID_ID", "0000-0002-7004-8670")
SCHOLAR = os.environ.get("SCHOLAR_URL", "https://scholar.google.com/citations?user=KO8MtmEAAAAJ&hl=en")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
KEEP = ("topic", "featured", "hidden", "note")
NS = {
    "a": "http://www.w3.org/2005/Atom",
    "yt": "http://www.youtube.com/xml/schemas/2015",
    "media": "http://search.yahoo.com/mrss/",
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
}


def log(*a):
    print(*a, flush=True)


def get(url):
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept-Language": "en-US,en;q=0.9",
        "Cookie": "CONSENT=YES+cb; SOCS=CAI",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def read_js(path, var):
    if not path.exists():
        return None
    m = re.search(r"window\." + var + r"\s*=\s*(\{.*\});", path.read_text(), re.S)
    return json.loads(m.group(1)) if m else None


def write_js(path, var, header, data):
    body = json.dumps(data, indent=2, ensure_ascii=False)
    path.write_text(header + "window." + var + " = " + body + ";\n")


def strip_tags(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


def excerpt(s, n=220):
    s = strip_tags(s)
    return s if len(s) <= n else s[: s.rfind(" ", 0, n)] + "…"


# ---------------------------------------------------------------- YouTube

def resolve_channel(existing):
    cid = os.environ.get("YT_CHANNEL_ID") or (existing or {}).get("channel", {}).get("id")
    title = (existing or {}).get("channel", {}).get("title", "")
    try:
        page = get(f"https://www.youtube.com/@{HANDLE}")
        m = (re.search(r'"externalId":"(UC[\w-]{22})"', page)
             or re.search(r'<link rel="canonical" href="https://www\.youtube\.com/channel/(UC[\w-]{22})"', page)
             or re.search(r'"channelId":"(UC[\w-]{22})"', page))
        if m:
            cid = m.group(1)
        t = re.search(r'<meta property="og:title" content="([^"]*)"', page)
        if t:
            title = html.unescape(t.group(1))
        s = re.search(r'"subscriberCountText":\{[^}]*?"simpleText":"([^"]+)"', page) or \
            re.search(r'([\d.,]+[KMB]?) subscribers', page)
        subs = s.group(1) if s else ""
    except Exception as e:  # network or layout change
        log("channel page:", e)
        subs = ""
    return cid, title, subs


def from_rss(cid):
    xml = get(f"https://www.youtube.com/feeds/videos.xml?channel_id={cid}")
    root = ET.fromstring(xml)
    out = []
    for e in root.findall("a:entry", NS):
        vid = e.findtext("yt:videoId", "", NS)
        g = e.find("media:group", NS)
        stats = g.find("media:community/media:statistics", NS) if g is not None else None
        out.append({
            "id": vid,
            "title": e.findtext("a:title", "", NS),
            "date": e.findtext("a:published", "", NS)[:10],
            "description": excerpt(g.findtext("media:description", "", NS) if g is not None else ""),
            "views": int(stats.get("views")) if stats is not None and stats.get("views", "").isdigit() else None,
        })
    return out


def walk(o, key):
    if isinstance(o, dict):
        if key in o:
            yield o[key]
        for v in o.values():
            yield from walk(v, key)
    elif isinstance(o, list):
        for v in o:
            yield from walk(v, key)


def from_playlist_page(cid):
    page = get(f"https://www.youtube.com/playlist?list=UU{cid[2:]}")
    m = re.search(r"var ytInitialData\s*=\s*(\{.*?\});\s*</script>", page, re.S)
    if not m:
        raise ValueError("ytInitialData not found")
    data = json.loads(m.group(1))
    out = []
    for r in walk(data, "playlistVideoRenderer"):
        t = r.get("title", {})
        title = t.get("simpleText") or "".join(x.get("text", "") for x in t.get("runs", []))
        out.append({
            "id": r.get("videoId"),
            "title": title,
            "duration": (r.get("lengthText") or {}).get("simpleText", ""),
        })
    return [v for v in out if v["id"]]


def iso_duration(s):
    m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", s or "")
    if not m:
        return ""
    d, h, mi, se = (int(x or 0) for x in m.groups())
    h += 24 * d
    return f"{h}:{mi:02d}:{se:02d}" if h else f"{mi}:{se:02d}"


def from_api(cid, key):
    base = "https://www.googleapis.com/youtube/v3/"
    items, token = [], ""
    while True:
        q = urllib.parse.urlencode({"part": "snippet", "playlistId": "UU" + cid[2:], "maxResults": 50, "pageToken": token, "key": key})
        d = json.loads(get(base + "playlistItems?" + q))
        items += d.get("items", [])
        token = d.get("nextPageToken")
        if not token:
            break
    out = {}
    for it in items:
        s = it["snippet"]
        vid = s["resourceId"]["videoId"]
        out[vid] = {"id": vid, "title": s["title"], "date": s.get("publishedAt", "")[:10], "description": excerpt(s.get("description", ""))}
    ids = list(out)
    for i in range(0, len(ids), 50):
        q = urllib.parse.urlencode({"part": "contentDetails,statistics,snippet", "id": ",".join(ids[i:i + 50]), "key": key})
        for v in json.loads(get(base + "videos?" + q)).get("items", []):
            o = out[v["id"]]
            o["duration"] = iso_duration(v["contentDetails"].get("duration"))
            o["views"] = int(v["statistics"].get("viewCount", 0))
            o["date"] = v["snippet"].get("publishedAt", o["date"])[:10]
    return list(out.values())


def update_videos():
    old = read_js(VIDEO_JS, "VIDEOS") or {"channel": {}, "videos": []}
    cid, title, subs = resolve_channel(old)
    if not cid:
        log("YouTube: channel id not found; leaving feed-videos.js unchanged")
        return False
    log("YouTube channel:", cid, title, subs)

    fresh, complete = {}, False
    key = os.environ.get("YT_API_KEY")
    if key:
        try:
            for v in from_api(cid, key):
                fresh[v["id"]] = v
            complete = True
            log(f"  API: {len(fresh)} videos")
        except Exception as e:
            log("  API failed:", e)
    if not complete:
        try:
            pl = from_playlist_page(cid)
            for v in pl:
                fresh[v["id"]] = v
            complete = len(pl) > 0 and len(pl) < 100
            log(f"  playlist page: {len(pl)} videos")
        except Exception as e:
            log("  playlist page failed:", e)
    try:
        rss = from_rss(cid)
        for v in rss:
            fresh.setdefault(v["id"], {}).update({k: x for k, x in v.items() if x not in (None, "")})
        log(f"  RSS: {len(rss)} videos")
    except Exception as e:
        log("  RSS failed:", e)

    if not fresh:
        log("YouTube: nothing fetched; leaving feed-videos.js unchanged")
        return False

    previous = {v["id"]: v for v in old.get("videos", [])}
    merged = []
    ids = list(fresh) + ([] if complete else [i for i in previous if i not in fresh])
    for vid in ids:
        v = dict(previous.get(vid, {}))
        v.update({k: x for k, x in fresh.get(vid, {}).items() if x not in (None, "")})
        for k in KEEP:
            if k in previous.get(vid, {}):
                v[k] = previous[vid][k]
        merged.append(v)
    merged.sort(key=lambda v: v.get("date", ""), reverse=True)

    new = {"channel": {"id": cid, "handle": HANDLE, "title": title, "subscribers": subs}, "videos": merged}
    if json.dumps({**new, "updated": ""}, sort_keys=True) == json.dumps({**old, "updated": ""}, sort_keys=True):
        log("YouTube: no changes")
        return False
    new["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    write_js(VIDEO_JS, "VIDEOS", VIDEO_HEADER, new)
    log(f"YouTube: wrote {len(merged)} videos")
    for v in merged[:40]:
        log(f"  {v.get('date', '          ')}  {v['id']}  {v.get('title', '')}")
    return True


# ---------------------------------------------------------------- Medium

def update_articles():
    old = read_js(ARTICLE_JS, "ARTICLES") or {"items": []}
    try:
        root = ET.fromstring(get(MEDIUM_FEED))
    except Exception as e:
        log("Medium failed:", e)
        return False
    fresh = []
    for it in root.iter("item"):
        link = (it.findtext("link") or "").split("?")[0]
        body = it.findtext("content:encoded", "", NS)
        img = re.search(r'<img[^>]+src="([^"]+)"', body or "")
        try:
            date = datetime.strptime(it.findtext("pubDate", ""), "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%d")
        except ValueError:
            date = ""
        fresh.append({
            "title": strip_tags(it.findtext("title", "")),
            "url": link,
            "date": date,
            "excerpt": excerpt(body),
            "tags": [c.text for c in it.findall("category") if c.text][:5],
            "image": img.group(1) if img else "",
        })
    by_url = {a["url"]: a for a in old.get("items", [])}
    for a in fresh:
        by_url[a["url"]] = {**by_url.get(a["url"], {}), **a}
    items = sorted(by_url.values(), key=lambda a: a.get("date", ""), reverse=True)
    new = {"source": MEDIUM_FEED, "items": items}
    if json.dumps({**new, "updated": ""}, sort_keys=True) == json.dumps({**old, "updated": ""}, sort_keys=True):
        log("Medium: no changes")
        return False
    new["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    write_js(ARTICLE_JS, "ARTICLES", ARTICLE_HEADER, new)
    log(f"Medium: wrote {len(items)} articles")
    for a in items[:20]:
        log(f"  {a['date']}  {a['title']}")
    return True


# ---------------------------------------------------------------- Scholar

def update_metrics():
    old = read_js(METRICS_JS, "METRICS") or {}
    try:
        page = get(SCHOLAR)
    except Exception as e:
        log("Scholar failed:", e)
        return False
    nums = re.findall(r'class="gsc_rsb_std">(\d+)</td>', page)
    if len(nums) < 6:
        log("Scholar: citation table not found; leaving feed-metrics.js unchanged")
        return False
    new = {"source": SCHOLAR.split("&")[0], "citations": int(nums[0]), "h_index": int(nums[2]), "i10_index": int(nums[4])}
    if all(old.get(k) == v for k, v in new.items()):
        log("Scholar: no changes")
        return False
    new["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    METRICS_JS.write_text(METRICS_HEADER + "window.METRICS = " + json.dumps(new, indent=2) + ";\n")
    log(f"Scholar: {new}")
    return True


# ---------------------------------------------------------------- ORCID

def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "jovian-explorer.github.io feed updater", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def val(o, *keys):
    for k in keys:
        if not isinstance(o, dict):
            return ""
        o = o.get(k)
    return o if isinstance(o, str) else ""


def crossref_meta(doi):
    try:
        m = get_json("https://api.crossref.org/works/" + urllib.parse.quote(doi))["message"]
    except Exception as e:
        log("  Crossref failed for", doi, e)
        return {}
    names = []
    for a in m.get("author", []):
        fam = a.get("family") or a.get("name") or ""
        ini = " ".join(x[0] + "." for x in re.split(r"[\s.-]+", a.get("given", "")) if x)
        names.append(f"{fam}, {ini}".strip(", "))
    out = {"authors": ", ".join(names[:12]) + (", et al." if len(names) > 12 else "")}
    if m.get("container-title"):
        out["venue"] = m["container-title"][0]
    parts = (m.get("published") or m.get("issued") or {}).get("date-parts", [[None]])[0]
    if parts and parts[0]:
        out["year"] = int(parts[0])
        if len(parts) > 1:
            out["month"] = int(parts[1])
    return out


def update_works():
    old = read_js(WORKS_JS, "WORKS") or {}
    cache = {w.get("doi") or w.get("title"): w for w in old.get("items", [])}
    try:
        data = get_json(f"https://pub.orcid.org/v3.0/{ORCID}/works")
    except Exception as e:
        log("ORCID failed:", e)
        return False
    items = []
    for g in data.get("group", []):
        w = (g.get("work-summary") or [{}])[0]
        title = val(w, "title", "title", "value").strip()
        if not title:
            continue
        ids = {}
        for x in (w.get("external-ids") or {}).get("external-id", []):
            ids.setdefault(x.get("external-id-type", ""), (x.get("external-id-value") or "").strip())
        doi = ids.get("doi", "").lower().replace("https://doi.org/", "")
        arxiv = ids.get("arxiv", "").replace("arXiv:", "")
        date = w.get("publication-date") or {}
        item = {"title": title, "type": w.get("type", ""), "venue": val(w, "journal-title", "value")}
        y, mth = val(date, "year", "value"), val(date, "month", "value")
        if y:
            item["year"] = int(y)
        if mth:
            item["month"] = int(mth)
        if doi:
            item["doi"] = doi
        if arxiv:
            item["arxiv"] = arxiv
        url = val(w, "url", "value")
        if url and not doi:
            item["url"] = url
        prev = cache.get(doi or title, {})
        if doi and "authors" not in prev:
            prev = {**prev, **crossref_meta(doi)}
        for k in ("authors", "venue"):  # Crossref values win
            if prev.get(k):
                item[k] = prev[k]
        for k in ("year", "month"):  # ORCID values win
            if prev.get(k) and not item.get(k):
                item[k] = prev[k]
        items.append(item)
    items.sort(key=lambda w: (w.get("year", 0), w.get("month", 0)), reverse=True)
    new = {"orcid": ORCID, "items": items}
    if old.get("items") == items:
        log(f"ORCID: no changes ({len(items)} works)")
        return False
    new["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    WORKS_JS.write_text(WORKS_HEADER + "window.WORKS = " + json.dumps(new, indent=2, ensure_ascii=False) + ";\n")
    log(f"ORCID: wrote {len(items)} works")
    for w in items[:15]:
        log(f"  {w.get('year', '')}  {w['type']}  {w['title'][:90]}")
    return True


WORKS_HEADER = """/* Works listed on ORCID, refreshed by tools/update_feeds.py (GitHub Actions, daily).
   The site adds any paper whose DOI, arXiv id or title is not already in
   assets/js/data.js to the publications list and the home page, and any
   conference poster or talk to the talks list. Add a work to ORCID and it
   appears here the next day. */
"""


METRICS_HEADER = """/* Google Scholar citation metrics, refreshed by tools/update_feeds.py (GitHub Actions, daily). */
"""
VIDEO_HEADER = """/* YouTube videos, refreshed by tools/update_feeds.py (GitHub Actions, daily).
   Per-video fields you may add by hand and that are kept on refresh:
     "topic": "Lecture"      groups videos into filter buttons
     "featured": true        shows the video in the large player
     "hidden": true          leaves it off the site
     "note": "..."           extra line under the title */
"""
ARTICLE_HEADER = """/* Medium articles, refreshed by tools/update_feeds.py (GitHub Actions, daily). */
"""

if __name__ == "__main__":
    changed = [update_videos(), update_articles(), update_metrics(), update_works()]
    sys.exit(0)
