import requests
import csv
import time
import os
from requests.auth import HTTPBasicAuth

WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"
SITE_URL   = "https://springgreen-sparrow-647332.hostingersite.com"
AUTH       = HTTPBasicAuth(WOO_KEY, WOO_SECRET)
CSV_FILE   = "woocommerce_FINAL.csv"
TEMP_DIR   = "temp_images"

def upload_missing_images():
    if not os.path.exists(TEMP_DIR): os.makedirs(TEMP_DIR)
    
    # 1. Load CSV Images
    print("Loading CSV data...")
    csv_data = {}
    with open(CSV_FILE, "r", encoding="utf-8-sig", errors="ignore") as f:
        for row in csv.DictReader(f):
            sku = row.get("SKU", "").strip()
            imgs = row.get("Images", "").strip().split(",")
            if sku and imgs:
                for img in imgs:
                    img = img.strip()
                    if img and "dummyimage" not in img:
                        csv_data[sku] = img
                        break

    # 2. Get Products without images
    print("Finding remaining products without images...")
    page = 1
    to_upload = []
    while True:
        r = requests.get(f"{SITE_URL}/wp-json/wc/v3/products", auth=AUTH, params={"per_page": 100, "page": page})
        if not r.ok or not r.json(): break
        for p in r.json():
            if not p.get('images'):
                sku = p.get('sku', '').strip()
                if sku in csv_data:
                    to_upload.append({"id": p["id"], "sku": sku, "url": csv_data[sku]})
        page += 1
        time.sleep(0.1)
    
    print(f"Found {len(to_upload)} products that need image uploads.")

    # 3. Download and Upload
    for i, p in enumerate(to_upload, 1):
        sku, pid, url = p['sku'], p['id'], p['url']
        filename = url.split('/')[-1]
        local_path = os.path.join(TEMP_DIR, filename)
        
        try:
            # Download locally
            resp = requests.get(url, timeout=15)
            if resp.ok:
                with open(local_path, 'wb') as f: f.write(resp.content)
                
                # Upload to WP
                with open(local_path, 'rb') as img_file:
                    headers = {'Content-Disposition': f'attachment; filename="{filename}"', 'Content-Type': 'image/jpeg'}
                    # Use query params for auth as found earlier
                    up_url = f"{SITE_URL}/wp-json/wp/v2/media?consumer_key={WOO_KEY}&consumer_secret={WOO_SECRET}"
                    up_resp = requests.post(up_url, data=img_file, headers=headers)
                    
                    if up_resp.ok:
                        att_id = up_resp.json()['id']
                        # Link to Product
                        requests.put(f"{SITE_URL}/wp-json/wc/v3/products/{pid}", auth=AUTH, json={"images": [{"id": att_id}]})
                        print(f"  [{i}/{len(to_upload)}] {sku}: Uploaded and linked (ID={att_id})")
                    else:
                        print(f"  [{i}/{len(to_upload)}] {sku}: Upload failed ({up_resp.status_code})")
            else:
                print(f"  [{i}/{len(to_upload)}] {sku}: Download failed from URL")
        except Exception as e:
            print(f"  [{i}/{len(to_upload)}] {sku}: Error: {str(e)}")
        
        time.sleep(0.5)

if __name__ == "__main__":
    upload_missing_images()
