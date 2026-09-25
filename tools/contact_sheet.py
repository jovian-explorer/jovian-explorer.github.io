#!/usr/bin/env python3
"""Make numbered contact sheets of photo folders, for choosing website photos.

Nothing is uploaded or modified. For each folder given, the script writes
JPEG contact sheets (thumbnail grids with a number, file name and date under
each photo) and an index.csv mapping numbers to full paths.

    pip install pillow            # add pillow-heif to include .HEIC files
    python tools/contact_sheet.py "C:\\Users\\kesha\\OneDrive\\Documents\\PhD\\travel" ^
        "D:\\Dev_backup_full\\Pictures\\Kayu\\Self\\IITI" "D:\\Dev_backup_full\\travel"

Output goes to a "contact_sheets" folder next to where you run it.
Options: --out DIR, --per-sheet N (default 48), --every K (use every Kth
photo of a folder), --include TEXT... (only subfolders whose path contains
one of these), --dedupe N (drop a photo that looks like the one before it;
larger N drops more, 0 keeps all), --thumb PX, --cols N.
"""
import argparse
import csv
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tif", ".tiff"}
PAD, LABEL = 10, 40


def taken(img, path):
    try:
        exif = img.getexif()
        v = exif.get(36867) or exif.get_ifd(0x8769).get(36867) or exif.get(306)
        if v:
            return str(v)[:10].replace(":", "-")
    except Exception:
        pass
    return datetime.fromtimestamp(path.stat().st_mtime).strftime("%Y-%m-%d")


def dhash(im):
    g = im.convert("L").resize((9, 8))
    px = g.tobytes()
    return sum(1 << i for i in range(64) if px[(i // 8) * 9 + i % 8] > px[(i // 8) * 9 + i % 8 + 1])


def font(size):
    for name in ("arial.ttf", "DejaVuSans.ttf", "segoeui.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folders", nargs="+")
    ap.add_argument("--out", default="contact_sheets")
    ap.add_argument("--per-sheet", type=int, default=48)
    ap.add_argument("--every", type=int, default=1)
    ap.add_argument("--include", nargs="*", default=[])
    ap.add_argument("--dedupe", type=int, default=0)
    ap.add_argument("--thumb", type=int, default=260)
    ap.add_argument("--cols", type=int, default=8)
    a = ap.parse_args()
    THUMB, COLS = a.thumb, a.cols
    inc = [t.lower() for t in a.include]
    out = Path(a.out); out.mkdir(exist_ok=True)
    f_small, f_num, f_head = font(13), font(18), font(22)
    rows, n = [], 0
    for fi, folder in enumerate(a.folders, 1):
        files = sorted(p for p in Path(folder).rglob("*") if p.suffix.lower() in EXTS and p.stat().st_size > 30_000
                       and (not inc or any(t in str(p.relative_to(folder)).lower() for t in inc)))[:: a.every]
        if a.dedupe:
            kept, last = [], None
            for p in files:
                try:
                    with Image.open(p) as im:
                        im.draft("RGB", (64, 64))
                        h = dhash(ImageOps.exif_transpose(im))
                except Exception:
                    continue
                if last is None or bin(h ^ last).count("1") > a.dedupe:
                    kept.append(p)
                last = h
            files = kept
        print(f"{folder}: {len(files)} photos")
        for s in range(0, len(files), a.per_sheet):
            chunk = files[s:s + a.per_sheet]
            nrows = (len(chunk) + COLS - 1) // COLS
            W = COLS * (THUMB + PAD) + PAD
            H = 50 + nrows * (THUMB + LABEL + PAD) + PAD
            sheet = Image.new("RGB", (W, H), (245, 245, 245))
            d = ImageDraw.Draw(sheet)
            d.text((PAD, 14), f"Folder {fi}: {folder}   (sheet {s // a.per_sheet + 1})", fill=(20, 20, 20), font=f_head)
            for k, p in enumerate(chunk):
                n += 1
                try:
                    with Image.open(p) as im:
                        date = taken(im, p)
                        size = im.size
                        im = ImageOps.exif_transpose(im).convert("RGB")
                        im.thumbnail((THUMB, THUMB))
                except Exception as e:
                    print("  skip", p, e); continue
                x = PAD + (k % COLS) * (THUMB + PAD)
                y = 50 + (k // COLS) * (THUMB + LABEL + PAD)
                sheet.paste(im, (x + (THUMB - im.width) // 2, y + (THUMB - im.height) // 2))
                d.rectangle([x, y + THUMB + 2, x + 54, y + THUMB + 24], fill=(31, 79, 122))
                d.text((x + 4, y + THUMB + 3), str(n), fill="white", font=f_num)
                d.text((x + 60, y + THUMB + 6), date, fill=(60, 60, 60), font=f_small)
                d.text((x, y + THUMB + 25), p.parent.name[:30], fill=(90, 90, 90), font=f_small)
                rows.append([n, fi, str(p), date, f"{size[0]}x{size[1]}"])
            name = out / f"folder{fi}_sheet{s // a.per_sheet + 1:02d}.jpg"
            sheet.save(name, quality=80)
            print("  wrote", name)
    with open(out / "index.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["number", "folder", "path", "date", "size"])
        w.writerows(rows)
    print(f"{n} photos, index at {out / 'index.csv'}")


if __name__ == "__main__":
    main()
