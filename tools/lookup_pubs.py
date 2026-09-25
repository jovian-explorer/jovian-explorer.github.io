"""One-off: list works from ORCID, Crossref and Google Scholar (printed to the log)."""
import json, re, urllib.request, urllib.parse
UA = {"User-Agent": "Mozilla/5.0 (mailto:keshavagg1098@gmail.com)", "Accept": "application/json"}
def get(u, h=UA):
    return urllib.request.urlopen(urllib.request.Request(u, headers=h), timeout=40).read().decode("utf-8", "replace")
print("=== ORCID")
try:
    d = json.loads(get("https://pub.orcid.org/v3.0/0000-0002-7004-8670/works"))
    for g in d.get("group", []):
        s = g["work-summary"][0]
        pd = s.get("publication-date") or {}
        y = (pd.get("year") or {}).get("value", "")
        ids = [e["external-id-type"] + ":" + e["external-id-value"] for e in (s.get("external-ids") or {}).get("external-id", [])]
        print(s["type"], "|", y, "|", s["title"]["title"]["value"], "|", (s.get("journal-title") or {}).get("value"), "|", ids, "| put-code", s["put-code"])
        if s["type"] in ("book-chapter", "book", "edited-book", "conference-paper", "other"):
            w = json.loads(get(f"https://pub.orcid.org/v3.0/0000-0002-7004-8670/work/{s['put-code']}"))
            print("   DETAIL:", json.dumps({k: w.get(k) for k in ("title", "journal-title", "publication-date", "citation", "url", "contributors", "external-ids")})[:3000])
except Exception as e:
    print("ORCID failed", e)
print("=== Crossref")
for t in ("book-chapter", "book", "proceedings-article", "posted-content"):
    try:
        q = urllib.parse.urlencode({"query.author": "Keshav Aggarwal", "filter": f"type:{t}", "rows": 30})
        for it in json.loads(get("https://api.crossref.org/works?" + q))["message"]["items"]:
            auth = [a.get("family", "") + ", " + a.get("given", "") for a in it.get("author", [])]
            if not any(re.match(r"Aggarwal, K", a) for a in auth):
                continue
            print(t, "|", it.get("issued", {}).get("date-parts"), "|", (it.get("title") or [""])[0], "|", (it.get("container-title") or [""])[0], "|", it.get("publisher"), "|", it.get("DOI"), "|", "; ".join(auth), "| pages", it.get("page"), "| isbn", it.get("ISBN"))
    except Exception as e:
        print("Crossref", t, "failed", e)
print("=== Scholar")
try:
    h = get("https://scholar.google.com/citations?user=KO8MtmEAAAAJ&hl=en&cstart=0&pagesize=100", {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126 Safari/537.36"})
    for m in re.finditer(r'class="gsc_a_at">([^<]+)</a><div class="gs_gray">([^<]*)</div><div class="gs_gray">(.*?)</div>', h):
        print(re.sub("<[^>]+>", "", " | ".join(m.groups())))
    c = re.findall(r'class="gsc_rsb_std">(\d+)</td>', h)
    print("citation table", c)
except Exception as e:
    print("Scholar failed", e)
