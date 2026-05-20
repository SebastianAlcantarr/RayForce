import requests
from requests.auth import HTTPBasicAuth

WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"
SITE_URL   = "https://springgreen-sparrow-647332.hostingersite.com"
AUTH       = HTTPBasicAuth(WOO_KEY, WOO_SECRET)

def check_media():
    print("Checking media samples...")
    r = requests.get(f"{SITE_URL}/wp-json/wp/v2/media?per_page=10", auth=AUTH)
    if r.ok:
        for m in r.json():
            print(f"ID={m['id']} | URL={m['source_url']}")
    else:
        print(f"Error: {r.status_code} - {r.text}")

if __name__ == "__main__":
    check_media()
