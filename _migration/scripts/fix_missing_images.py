"""
fix_missing_images.py
Busca en WooCommerce productos sin imagen y les asigna
la imagen que tiene el CSV, si es una imagen real (no placeholder).
"""
import csv
import requests
import time
from requests.auth import HTTPBasicAuth

WOO_URL    = "https://springgreen-sparrow-647332.hostingersite.com"
WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"
BASE_API   = f"{WOO_URL}/wp-json/wc/v3"
AUTH       = HTTPBasicAuth(WOO_KEY, WOO_SECRET)
CSV_FILE   = "woocommerce_FINAL.csv"

def woo_get(endpoint, params=None):
    r = requests.get(f"{BASE_API}{endpoint}", auth=AUTH, params=params or {}, timeout=30)
    r.raise_for_status()
    return r.json(), r.headers

def woo_put(endpoint, body):
    r = requests.put(f"{BASE_API}{endpoint}", auth=AUTH, json=body, timeout=30)
    return r

# ── 1. Cargar imagenes del CSV indexadas por SKU ──────────────────────────────
print(f"Leyendo imagenes del CSV...")
csv_images = {}
with open(CSV_FILE, "r", encoding="utf-8-sig", errors="ignore") as f:
    for row in csv.DictReader(f):
        sku = row.get("SKU", "").strip()
        img = row.get("Images", "").strip()
        if sku and img and "dummyimage" not in img:
            csv_images[sku] = img

print(f"  {len(csv_images)} SKUs con imagen real en el CSV")

# ── 2. Obtener todos los productos de WooCommerce sin imagen ──────────────────
print(f"\nObteniendo productos de WooCommerce...")
no_image_products = []
page = 1

while True:
    products, headers = woo_get("/products", {
        "per_page": 100, "page": page, "status": "publish"
    })
    if not products:
        break

    for p in products:
        images = p.get("images", [])
        has_real_image = any(
            img.get("src") and "placeholder" not in img.get("src", "") and "woocommerce-placeholder" not in img.get("src","")
            for img in images
        )
        if not has_real_image:
            sku = p.get("sku", "").strip()
            no_image_products.append({"id": p["id"], "sku": sku, "name": p.get("name","")[:40]})

    total_pages = int(headers.get("X-WP-TotalPages", 1))
    print(f"  Pagina {page}/{total_pages} ({len(no_image_products)} sin imagen hasta ahora)", end="\r")
    if page >= total_pages:
        break
    page += 1
    time.sleep(0.3)

print(f"\n  Productos sin imagen en WooCommerce: {len(no_image_products)}")

# ── 3. Filtrar los que tienen imagen en el CSV ────────────────────────────────
to_update = [
    p for p in no_image_products
    if p["sku"] in csv_images
]
no_csv_image = len(no_image_products) - len(to_update)

print(f"  Con imagen disponible en CSV: {len(to_update)}")
print(f"  Sin imagen en CSV tampoco   : {no_csv_image}")

if not to_update:
    print("\nNo hay productos que actualizar.")
    exit()

# ── 4. Actualizar imagenes ────────────────────────────────────────────────────
print(f"\nActualizando {len(to_update)} productos con sus imagenes...")

updated = 0
errors  = 0
error_list = []

for i, p in enumerate(to_update, 1):
    sku     = p["sku"]
    pid     = p["id"]
    img_url = csv_images[sku]

    r = woo_put(f"/products/{pid}", {"images": [{"src": img_url}]})

    if r.ok:
        updated += 1
        status = "OK"
    else:
        errors += 1
        status = f"ERR {r.status_code}"
        error_list.append(f"{sku}: {r.text[:60]}")

    if i <= 20 or i % 50 == 0:
        print(f"  [{i}/{len(to_update)}] {sku} - {status}")

    time.sleep(0.3)

print()
print("=" * 55)
print("COMPLETADO")
print(f"  Imagenes actualizadas : {updated}")
print(f"  Errores               : {errors}")
print("=" * 55)

if error_list:
    with open("errores_imagenes.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(error_list))
    print(f"  Errores guardados en: errores_imagenes.txt")
