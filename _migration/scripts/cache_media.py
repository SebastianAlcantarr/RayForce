import requests
import json
import time
import os

WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"
SITE_URL   = "https://springgreen-sparrow-647332.hostingersite.com"
CACHE_FILE = "media_library_cache.json"

def get_all_media():
    if os.path.exists(CACHE_FILE):
        print(f"Loading media from {CACHE_FILE}...")
        with open(CACHE_FILE, 'r') as f:
            return json.load(f)

    print("Scanning entire media library (this may take a while)...")
    media_map = {}
    page = 1
    while True:
        url = f"{SITE_URL}/wp-json/wp/v2/media"
        params = {
            "consumer_key": WOO_KEY,
            "consumer_secret": WOO_SECRET,
            "per_page": 100,
            "page": page
        }
        r = requests.get(url, params=params)
        if not r.ok:
            break
        
        items = r.json()
        if not items:
            break
            
        for m in items:
            full_url = m.get('source_url', '')
            filename = full_url.split('/')[-1].lower()
            media_map[filename] = m['id']
            
        print(f"  Page {page} scanned ({len(media_map)} items found)...", end="\r")
        page += 1
        time.sleep(0.1)
        
    print(f"\nScan complete. Total items: {len(media_map)}")
    with open(CACHE_FILE, 'w') as f:
        json.dump(media_map, f)
    return media_map

if __name__ == "__main__":
    get_all_media()
