"""One-off: copy outreach media from the Google Sites into this repository.

Videos are converted to 720p H.264 MP4 and uploaded as assets of the GitHub
release "outreach-media"; thumbnails, photographs and documents are written
to assets/outreach/. assets/outreach/manifest.json lists everything.
"""
import html, json, os, re, subprocess, urllib.request
from pathlib import Path
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36"}
PAGES = {
    "optics": "https://sites.google.com/iiti.ac.in/abhirupdatta/asi-lab/group-a-optics",
    "virtual-lab": "https://sites.google.com/iiti.ac.in/abhirupdatta/asi-lab/group-b-virtual-lab",
    "radio": "https://sites.google.com/iiti.ac.in/abhirupdatta/asi-lab/group-c-radio-astronomy",
    "robotics": "https://sites.google.com/iiti.ac.in/abhirupdatta/asi-lab/group-d-robotics-and-iot/robotics",
    "iot": "https://sites.google.com/iiti.ac.in/abhirupdatta/asi-lab/group-d-robotics-and-iot/iot",
    "expeyes": "https://sites.google.com/iiti.ac.in/abhirupdatta/asi-lab/group-d-robotics-and-iot/expeyes",
    "model-kits": "https://sites.google.com/iiti.ac.in/abhirupdatta/asi-lab/group-e-model-kits",
    "asi-lab": "https://sites.google.com/iiti.ac.in/abhirupdatta/asi-lab",
    "space-day": "https://sites.google.com/iiti.ac.in/space-events/national-space-day",
    "chandrayaan-3": "https://sites.google.com/iiti.ac.in/space-events/chandrayaan-3",
    "aditya-l1": "https://sites.google.com/iiti.ac.in/space-events/aditya-l1",
    "hundred-hours": "https://sites.google.com/iiti.ac.in/space-events/outreach",
}
OUT = Path("assets/outreach")
for d in ("thumbs", "img", "docs"):
    (OUT / d).mkdir(parents=True, exist_ok=True)
TMP = Path("/tmp/harvest"); TMP.mkdir(exist_ok=True)
REL = "outreach-media"
REPO = os.environ["GITHUB_REPOSITORY"]


def get(u, binary=False):
    r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=600)
    data = r.read()
    return (data, r.headers) if binary else data.decode("utf-8", "replace")


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]


def sh(*a):
    return subprocess.run(a, capture_output=True, text=True)


def fname(headers, default):
    cd = headers.get("Content-Disposition", "")
    m = re.search(r"filename\*=UTF-8''([^;]+)", cd) or re.search(r'filename="([^"]+)"', cd)
    return urllib.request.unquote(m.group(1)) if m else default


if sh("gh", "release", "view", REL).returncode:
    r = sh("gh", "release", "create", REL, "--title", "Outreach media",
           "--notes", "Videos shown on outreach.html.", "--target", os.environ.get("GITHUB_REF_NAME", "testing"))
    print("release create:", r.returncode, r.stderr[-300:])

manifest, seen = [], set()
for page, url in PAGES.items():
    try:
        h = get(url)
    except Exception as e:
        print("page fail", page, e); continue
    body = re.sub(r"(?s)<(script|style)[^>]*>.*?</\1>", " ", h)
    lines = [l.strip() for l in html.unescape(re.sub(r"<[^>]+>", "\n", body)).split("\n") if l.strip()]
    ids = []
    for m in re.finditer(r"drive\.google\.com/(?:file/d/|open\?id=|uc\?id=|thumbnail\?id=)([\w-]{25,})", h):
        if m.group(1) not in ids:
            ids.append(m.group(1))
    docs = []
    for m in re.finditer(r"docs\.google\.com/(document|presentation|spreadsheets)/d/([\w-]{25,})", h):
        if m.group(2) not in [d[1] for d in docs]:
            docs.append((m.group(1), m.group(2)))
    imgs = []
    for m in re.finditer(r'<img[^>]+src="(https://lh\d\.googleusercontent\.com/[^"]+)"', h):
        u = html.unescape(m.group(1))
        if u not in imgs:
            imgs.append(u)
    print(f"== {page}: {len(ids)} drive files, {len(docs)} docs, {len(imgs)} images", flush=True)

    for fid in ids:
        if fid in seen:
            continue
        seen.add(fid)
        try:
            data, hd = get(f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t", binary=True)
        except Exception as e:
            print("  drive fail", fid, e); continue
        name = fname(hd, fid)
        ctype = hd.get("Content-Type", "")
        if "text/html" in ctype:
            print("  drive returned html (not public?)", fid); continue
        src = TMP / (fid + Path(name).suffix.lower())
        src.write_bytes(data)
        caption = ""
        if name in lines:
            i = lines.index(name)
            if i + 1 < len(lines):
                caption = lines[i + 1]
        entry = {"page": page, "id": fid, "file": name, "caption": caption, "bytes": len(data), "type": ctype}
        info = json.loads(sh("ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height:format=duration",
                             "-of", "json", str(src)).stdout or "{}")
        is_video = any(s.get("codec_type") == "video" for s in info.get("streams", [])) and float(info.get("format", {}).get("duration", 0) or 0) > 1
        if is_video:
            base = slug(Path(name).stem) + "-" + fid[:6]
            mp4 = TMP / (base + ".mp4")
            r = sh("ffmpeg", "-y", "-i", str(src), "-vf", "scale=-2:'min(720,ih)'", "-c:v", "libx264", "-preset", "veryfast",
                   "-crf", "26", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(mp4))
            if r.returncode:
                print("  ffmpeg fail", name, r.stderr[-300:]); continue
            dur = float(info["format"]["duration"])
            thumb = OUT / "thumbs" / (base + ".jpg")
            sh("ffmpeg", "-y", "-ss", str(min(3.0, dur / 3)), "-i", str(mp4), "-frames:v", "1", "-vf", "scale=640:-2", "-q:v", "4", str(thumb))
            up = sh("gh", "release", "upload", REL, str(mp4), "--clobber")
            if up.returncode:
                print("  upload fail", up.stderr[-300:]); continue
            entry.update({"kind": "video", "src": f"https://github.com/{REPO}/releases/download/{REL}/{mp4.name}",
                          "thumb": str(thumb), "duration": round(dur), "mp4_bytes": mp4.stat().st_size})
        elif "pdf" in ctype or name.lower().endswith(".pdf"):
            dest = OUT / "docs" / (slug(Path(name).stem) + ".pdf"); dest.write_bytes(data)
            entry.update({"kind": "pdf", "src": str(dest)})
        elif ctype.startswith("image/") or re.search(r"\.(jpe?g|png|webp|heic)$", name.lower()):
            dest = OUT / "img" / (slug(Path(name).stem) + "-" + fid[:6] + ".jpg")
            sh("convert", str(src), "-auto-orient", "-resize", "1600x1600>", "-quality", "82", str(dest))
            entry.update({"kind": "image", "src": str(dest)})
        else:
            entry["kind"] = "other"
        manifest.append(entry)
        print("  ", entry.get("kind"), "|", name, "|", caption, "|", entry.get("duration", ""), "|", entry.get("mp4_bytes", ""), flush=True)

    for kind, did in docs:
        try:
            data, hd = get(f"https://docs.google.com/{kind}/d/{did}/export?format=pdf", binary=True)
            title = fname(hd, did)
            dest = OUT / "docs" / (slug(Path(title).stem) + ".pdf"); dest.write_bytes(data)
            manifest.append({"page": page, "kind": "doc", "id": did, "file": title, "src": str(dest), "bytes": len(data)})
            print("   doc |", title, flush=True)
        except Exception as e:
            print("  doc fail", did, e)

    for n, u in enumerate(imgs):
        try:
            full = re.sub(r"=w\d+[^/]*$", "=w1600", u)
            data, hd = get(full, binary=True)
            if len(data) < 15000:
                continue
            tmp = TMP / f"{page}-{n}"; tmp.write_bytes(data)
            dest = OUT / "img" / f"{page}-{n:02d}.jpg"
            sh("convert", str(tmp), "-auto-orient", "-resize", "1600x1600>", "-quality", "82", str(dest))
            if dest.exists():
                manifest.append({"page": page, "kind": "photo", "src": str(dest), "bytes": dest.stat().st_size})
                print("   photo |", dest, flush=True)
        except Exception as e:
            print("  img fail", e)

(OUT / "manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False))
print("TOTAL", len(manifest), "videos", sum(1 for m in manifest if m.get("kind") == "video"))
