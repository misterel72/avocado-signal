#!/usr/bin/env python3
"""Check public Avocado Signal demos for broken images and navigation."""
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import concurrent.futures
import sys

SITES = {
    "Travel World": "https://travelworld-avocado-concept.netlify.app/",
    "Samarcanda": "https://samarcanda-avocado-concept.netlify.app/",
    "Pamir Eco Tourism": "https://pamir-avocado-concept.netlify.app/",
    "Pamir Trips": "https://pamirtrips-avocado-concept.netlify.app/",
    "Piano Borracho": "https://avocado-pianoborracho-concept.netlify.app/",
}
class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.anchors = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"): self.ids.add(a["id"])
        if tag == "img" and a.get("src"): self.images.append(a["src"])
        if tag == "a" and a.get("href"): self.anchors.append(a["href"])
def fetch(url):
    req = Request(url, headers={"User-Agent":"AvocadoSignal-QA/1.0"})
    with urlopen(req, timeout=18) as r:
        body = r.read()
        return r.status, r.headers.get("Content-Type", ""), body
def check(name, url):
    errors=[]
    try:
        status, typ, body = fetch(url)
        if status != 200: errors.append(f"Page HTTP {status}")
        p=Page();p.feed(body.decode("utf-8","replace"))
        resources = list(dict.fromkeys(urljoin(url,x) for x in p.images if not x.startswith("data:")))
        for href in p.anchors:
            if href == "#": errors.append("Placeholder link: #")
            elif href.startswith("#") and href[1:] not in p.ids: errors.append(f"Missing anchor: {href}")
        def image_check(u):
            try:
                st, content_type, data=fetch(u)
                if st != 200 or not content_type.lower().startswith("image/") or len(data)<100:
                    return f"Image invalid: {u} (HTTP {st}, {content_type})"
            except Exception as exc:
                return f"Image unavailable: {u} ({type(exc).__name__})"
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            errors.extend(x for x in pool.map(image_check,resources) if x)
        return name, len(resources), errors
    except Exception as exc:
        return name, 0, [f"Site unavailable: {type(exc).__name__}: {exc}"]
def main():
    results=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        results=list(pool.map(lambda kv:check(*kv),SITES.items()))
    for name, n, errors in results:
        print(f"\n{'FAIL' if errors else 'PASS'} {name}: {n} external/local image URLs checked")
        for e in errors:print("  -",e)
    print(f"\n{sum(not e for _,_,e in results)}/{len(results)} sites passed")
    return 1 if any(e for _,_,e in results) else 0
if __name__=="__main__":sys.exit(main())
