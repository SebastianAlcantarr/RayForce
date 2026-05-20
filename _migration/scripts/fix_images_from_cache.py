import requests
import json
import csv
import time
import os
import re
from requests.auth import HTTPBasicAuth

WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"
SITE_URL   = "https://springgreen-sparrow-647332.hostingersite.com"
AUTH       = HTTPBasicAuth(WOO_KEY, WOO_SECRET)
CACHE_FILE = "media_library_cache.json"
CSV_FILE   = "woocommerce_FINAL.csv"

def fix_images():
    # 1. Load Media Cache
    print("Loading media cache...")
    with open(CACHE_FILE, 'r') as f:
        media_cache = json.load(f)
    
    # 2. Load CSV Images
    print("Loading CSV images...")
    csv_images = {}
    with open(CSV_FILE, "r", encoding="utf-8-sig", errors="ignore") as f:
        for row in csv.DictReader(f):
            sku = row.get("SKU", "").strip()
            imgs = row.get("Images", "").strip().split(",")
            if sku and imgs:
                # Get the first real image filename
                for img in imgs:
                    img = img.strip()
                    if img and "dummyimage" not in img:
                        filename = img.split('/')[-1].lower()
                        csv_images[sku] = filename
                        break
    
    # 3. Get Products from WooCommerce
    print("Fetching products without images from WooCommerce...")
    products_to_fix = []
    page = 1
    while True:
        url = f"{SITE_URL}/wp-json/wc/v3/products"
        params = {"per_page": 100, "page": page, "status": "publish"}
        r = requests.get(url, auth=AUTH, params=params)
        if not r.ok or not r.json():
            break
        
        for p in r.json():
            if not p.get('images'):
                sku = p.get('sku', '').strip()
                if sku in csv_images:
                    products_to_fix.append({
                        "id": p["id"],
                        "sku": sku,
                        "filename": csv_images[sku]
                    })
        
        print(f"  Checked {page*100} products, found {len(products_to_fix)} to fix...", end="\r")
        page += 1
        time.sleep(0.1)

    print(f"\nFound {len(products_to_fix)} products to fix.")

    # 4. Apply Fixes
    updated = 0
    not_found = 0
    for i, p in enumerate(products_to_fix, 1):
        filename = p['filename']
        if filename in media_cache:
            att_id = media_cache[filename]
            r = requests.put(f"{SITE_URL}/wp-json/wc/v3/products/{p['id']}", 
                             auth=AUTH, json={"images": [{"id": att_id}]})
            if r.ok:
                updated += 1
            else:
                print(f"  Error updating {p['sku']}: {r.status_code}")
        else:
            not_found += 1
            
        if i % 50 == 0:
            print(f"  Progress: {i}/{len(products_to_fix)} (Fixed: {updated})")
        time.sleep(0.2)

    print(f"\nFinished. Updated: {updated}, Not found in media library: {not_found}")

if __name__ == "__main__":
    fix_images()
