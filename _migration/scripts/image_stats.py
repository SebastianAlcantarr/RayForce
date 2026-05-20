import requests
from requests.auth import HTTPBasicAuth

WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"
SITE_URL   = "https://springgreen-sparrow-647332.hostingersite.com"
AUTH       = HTTPBasicAuth(WOO_KEY, WOO_SECRET)

def stats():
    print("Gathering stats...")
    page = 1
    total_with = 0
    total_without = 0
    while page <= 5: # Just check first 500
        r = requests.get(f"{SITE_URL}/wp-json/wc/v3/products", auth=AUTH, params={"per_page": 100, "page": page})
        if not r.ok or not r.json():
            break
        for p in r.json():
            if p.get('images'):
                total_with += 1
            else:
                total_without += 1
        page += 1
    print(f"Sample (first 500): With Image: {total_with} | Without Image: {total_without}")

if __name__ == "__main__":
    stats()
