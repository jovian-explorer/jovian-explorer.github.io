"""One-off: crawl outreach-related Google Sites and print their text, links and media."""
import html, re, urllib.request
from urllib.parse import urljoin
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36"}
ROOTS = ["https://sites.google.com/iiti.ac.in/abhirupdatta/", "https://sites.google.com/iiti.ac.in/space-events/"]
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40).read().decode("utf-8", "replace")
def text(h):
    h = re.sub(r"(?s)<(script|style)[^>]*>.*?</\1>", " ", h)
    h = re.sub(r"<br\s*/?>|</p>|</div>|</h\d>|</li>", "\n", h)
    t = html.unescape(re.sub(r"<[^>]+>", " ", h))
    lines = [re.sub(r"[ \t]+", " ", l).strip() for l in t.split("\n")]
    out, prev = [], None
    for l in lines:
        if l and l != prev: out.append(l)
        prev = l
    return "\n".join(out)
seen = set()
for root in ROOTS:
    queue = [root]
    while queue and len([s for s in seen if s.startswith(root)]) < 40:
        u = queue.pop(0).split("#")[0].split("?")[0]
        if u in seen: continue
        seen.add(u)
        try: h = get(u)
        except Exception as e:
            print("\n######", u, "FAILED", e); continue
        print("\n######", u)
        print(text(h)[:6000])
        yt = sorted(set(re.findall(r"(?:youtube\.com/(?:embed/|watch\?v=)|youtu\.be/)([\w-]{11})", h)))
        if yt: print("YOUTUBE:", yt)
        docs = sorted(set(re.findall(r"https://(?:drive|docs)\.google\.com/[^\"'\\ <>]+", h)))[:30]
        if docs: print("DRIVE/DOCS:", docs)
        ext = sorted(set(l for l in re.findall(r'href="(https?://[^"]+)"', h) if "google" not in l))[:40]
        if ext: print("EXTERNAL LINKS:", ext)
        for l in re.findall(r'href="([^"]+)"', h):
            full = urljoin(u, html.unescape(l)).split("#")[0].split("?")[0]
            if full.startswith(root) and full not in seen and full not in queue and not re.search(r"\.(css|js|png|jpg|pdf)$", full):
                queue.append(full)
