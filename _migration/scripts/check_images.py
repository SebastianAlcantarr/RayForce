import requests
from requests.auth import HTTPBasicAuth

WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"
SITE_URL   = "https://springgreen-sparrow-647332.hostingersite.com"
AUTH       = HTTPBasicAuth(WOO_KEY, WOO_SECRET)

def check_products():
    print("Checking product images...")
    r = requests.get(f"{SITE_URL}/wp-json/wc/v3/products?per_page=20", auth=AUTH)
    if r.ok:
        products = r.json()
        for p in products:
            sku = p.get('sku')
            images = p.get('images', [])
            has_img = "YES" if images else "NO"
            print(f"SKU={sku} | HasImage={has_img} | ImageCount={len(images)}")
            if images:
                print(f"  First Image: {images[0]['src']}")
    else:
        print(f"Error: {r.status_code} - {r.text}")

if __name__ == "__main__":
    check_products()
