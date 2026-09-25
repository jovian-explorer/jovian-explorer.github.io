#!/usr/bin/env python3
"""Copy chosen photographs, by contact-sheet number, into zip files for upload.

Reads the index.csv written by tools/contact_sheet.py, takes the photos whose
numbers are in PICKS (or given on the command line), and writes each one as
<number>.jpg: 2400 px on the long side, rotated upright, GPS and all other
metadata removed except the date taken and camera. The files are packed into
zips of at most --max-mb each.

    python pick_photos.py contact_sheets\\index.csv
    python pick_photos.py contact_sheets\\index.csv 1311 951 988

Output: a "picks" folder and picks_1.zip, picks_2.zip, ... next to where it runs.
"""
import argparse
import csv
import zipfile
from pathlib import Path

from PIL import Image, ImageOps

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass

PICKS = [
    340, 347, 365, 376, 388, 418, 421, 438, 454, 458, 495, 522, 533, 569, 577, 598,
    740, 746, 759, 783, 815, 824, 864, 865, 868, 873, 874, 884, 896, 905, 915, 927,
    934, 937, 942, 943, 944, 948, 951, 955, 963, 973, 988, 992, 1003, 1016, 1083,
    1088, 1111, 1134, 1140, 1144, 1146, 1148, 1161, 1179, 1191, 1294, 1297, 1307,
    1311, 1316, 1329, 1343, 1352, 1374, 1396, 1438, 1489, 1495, 1500, 1501, 1514,
    1519, 1539, 1566, 1590, 1615, 1683, 1690, 1745, 1774, 1776, 1781, 1804, 1832,
    1862, 1868, 1872, 1901, 1904, 1905, 1910, 1933, 1984, 1987, 1990, 1994, 1996,
    2004,
]
KEEP = {271: "Make", 272: "Model", 306: "DateTime"}
EXIF_KEEP = {36867, 33434, 33437, 34855, 37386}  # date taken, exposure, f-number, ISO, focal length


def clean_exif(img):
    src = img.getexif()
    out = Image.Exif()
    for k in KEEP:
        if k in src:
            out[k] = src[k]
    try:
        sub = src.get_ifd(0x8769)
        ifd = out.get_ifd(0x8769)
        for k in EXIF_KEEP:
            if k in sub:
                ifd[k] = sub[k]
    except Exception:
        pass
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("index")
    ap.add_argument("numbers", nargs="*", type=int)
    ap.add_argument("--out", default="picks")
    ap.add_argument("--max-mb", type=float, default=28)
    a = ap.parse_args()
    want = set(a.numbers or PICKS)
    rows = {int(r["number"]): r for r in csv.DictReader(open(a.index, encoding="utf-8"))}
    missing = sorted(want - rows.keys())
    if missing:
        print("not in index:", missing)
    out = Path(a.out); out.mkdir(exist_ok=True)
    files = []
    for n in sorted(want & rows.keys()):
        src = Path(rows[n]["path"])
        dst = out / f"{n}.jpg"
        try:
            with Image.open(src) as im:
                exif = clean_exif(im)
                im = ImageOps.exif_transpose(im).convert("RGB")
                im.thumbnail((2400, 2400), Image.LANCZOS)
                im.save(dst, "JPEG", quality=90, optimize=True, exif=exif.tobytes())
        except Exception as e:
            print("  skip", n, src, e); continue
        files.append(dst)
        print("  wrote", dst)
    part, size, z = 0, 0, None
    for f in files:
        if z is None or size + f.stat().st_size > a.max_mb * 1e6:
            if z: z.close()
            part += 1; size = 0
            z = zipfile.ZipFile(f"{a.out}_{part}.zip", "w", zipfile.ZIP_STORED)
            print(f"{a.out}_{part}.zip")
        z.write(f, f.name); size += f.stat().st_size
    if z: z.close()
    print(f"{len(files)} photos in {part} zip file(s)")


if __name__ == "__main__":
    main()
