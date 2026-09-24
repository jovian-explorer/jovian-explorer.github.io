#!/usr/bin/env python3
"""Prepare photographs for the website.

Put full-size JPEG/PNG/TIFF files in assets/photos/originals/ (sub-folders
become album ids, e.g. originals/night-sky/m42.jpg -> album "night-sky"),
then run from the repository root:

    pip install pillow
    python3 tools/photos.py

For each image the script writes
    assets/photos/web/<name>.jpg     2400 px on the long side
    assets/photos/thumbs/<name>.jpg   800 px on the long side
with all metadata (including GPS) stripped, and updates assets/js/photos.js
with size, date and camera settings read from EXIF. Titles, places,
descriptions and albums already present in photos.js are kept, so the file
can be edited by hand between runs. The originals folder is git-ignored.
"""
import json
import re
import sys
from fractions import Fraction
from pathlib import Path

try:
    from PIL import Image, ImageOps
    from PIL.ExifTags import TAGS
except ImportError:
    sys.exit("Pillow is required: pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
ORIG = ROOT / "assets/photos/originals"
WEB = ROOT / "assets/photos/web"
THUMB = ROOT / "assets/photos/thumbs"
OUT = ROOT / "assets/js/photos.js"
EXTS = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".webp"}
HEADER = OUT.read_text().split("window.PHOTOS")[0] if OUT.exists() else ""


def load_existing():
    if not OUT.exists():
        return {}
    m = re.search(r"window\.PHOTOS\s*=\s*(\[.*\]);", OUT.read_text(), re.S)
    if not m:
        return {}
    try:
        return {p["src"]: p for p in json.loads(m.group(1))}
    except json.JSONDecodeError:
        sys.exit("assets/js/photos.js is not valid JSON inside window.PHOTOS = [...]; fix it and rerun.")


def exif_info(img):
    raw = img.getexif()
    tags = {TAGS.get(k, k): v for k, v in raw.items()}
    try:
        tags.update({TAGS.get(k, k): v for k, v in raw.get_ifd(0x8769).items()})
    except Exception:
        pass
    info = {}
    make, model = str(tags.get("Make", "")).strip(), str(tags.get("Model", "")).strip()
    if model:
        info["camera"] = model if model.lower().startswith(make.lower()) else f"{make} {model}".strip()
    if tags.get("LensModel"):
        info["lens"] = str(tags["LensModel"]).strip()
    if tags.get("FocalLength"):
        info["focal"] = f"{float(tags['FocalLength']):.0f} mm"
    if tags.get("FNumber"):
        info["aperture"] = f"f/{float(tags['FNumber']):.1f}".replace(".0", "")
    if tags.get("ExposureTime"):
        t = float(tags["ExposureTime"])
        info["shutter"] = f"{t:.1f} s".replace(".0 s", " s") if t >= 1 else f"1/{round(1 / t)} s"
    iso = tags.get("ISOSpeedRatings") or tags.get("PhotographicSensitivity")
    if iso:
        info["iso"] = int(iso[0] if isinstance(iso, tuple) else iso)
    date = str(tags.get("DateTimeOriginal") or tags.get("DateTime") or "")
    return info, (date[:7].replace(":", "-") if len(date) >= 7 else "")


def save(img, path, long_side):
    im = img.copy()
    im.thumbnail((long_side, long_side), Image.LANCZOS)
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "JPEG", quality=85 if long_side > 1000 else 80, optimize=True, progressive=True)


def main():
    if not ORIG.exists():
        ORIG.mkdir(parents=True)
        print(f"Created {ORIG.relative_to(ROOT)}; put photographs there and run again.")
        return
    existing = load_existing()
    photos = []
    files = sorted(p for p in ORIG.rglob("*") if p.suffix.lower() in EXTS)
    for f in files:
        rel = f.relative_to(ORIG)
        name = re.sub(r"[^a-z0-9]+", "-", str(rel.with_suffix("")).lower()).strip("-")
        src, thumb = f"assets/photos/web/{name}.jpg", f"assets/photos/thumbs/{name}.jpg"
        with Image.open(f) as img:
            exif, date = exif_info(img)
            img = ImageOps.exif_transpose(img).convert("RGB")
            if not (ROOT / src).exists() or (ROOT / src).stat().st_mtime < f.stat().st_mtime:
                save(img, ROOT / src, 2400)
                save(img, ROOT / thumb, 800)
            w, h = img.size
            scale = min(1, 2400 / max(w, h))
            w, h = round(w * scale), round(h * scale)
        old = existing.get(src, {})
        album = rel.parts[0] if len(rel.parts) > 1 else old.get("album", "")
        entry = {
            "src": src, "thumb": thumb, "width": w, "height": h,
            "album": old.get("album", album),
            "title": old.get("title", f.stem.replace("-", " ").replace("_", " ").capitalize()),
            "place": old.get("place", ""),
            "date": old.get("date", date),
            "description": old.get("description", ""),
            "alt": old.get("alt", ""),
            "exif": {**exif, **old.get("exif", {})},
        }
        if old.get("cover"):
            entry["cover"] = True
        photos.append(entry)
        print(f"  {rel}  ->  {src}  ({w}x{h})")
    body = json.dumps(photos, indent=2, ensure_ascii=False)
    OUT.write_text((HEADER or "") + "window.PHOTOS = " + body + ";\n")
    print(f"Wrote {len(photos)} photographs to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
