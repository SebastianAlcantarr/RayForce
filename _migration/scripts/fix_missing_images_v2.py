"""
fix_missing_images_v2.py
Para cada producto sin imagen, busca el attachment ID en la media
library de WordPress (usando la URL del CSV) y asigna la imagen
por ID en vez de URL, evitando el problema de loopback en Hostinger.
"""
import csv
import requests
import time
import re
from requests.auth import HTTPBasicAuth

WOO_URL    = "https://springgreen-sparrow-647332.hostingersite.com"
WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"
BASE_API   = f"{WOO_URL}/wp-json/wc/v3"
WP_API     = f"{WOO_URL}/wp-json/wp/v2"
AUTH       = HTTPBasicAuth(WOO_KEY, WOO_SECRET)
CSV_FILE   = "woocommerce_FINAL.csv"

def woo_get(endpoint, params=None):
    r = requests.get(f"{BASE_API}{endpoint}", auth=AUTH, params=params or {}, timeout=30)
    r.raise_for_status()
    return r.json(), r.headers

def woo_put(endpoint, body):
    r = requests.put(f"{BASE_API}{endpoint}", auth=AUTH, json=body, timeout=30)
    return r

def find_attachment_id(image_url):
    """Busca el ID del attachment en WordPress por URL o nombre de archivo."""
    # Extraer nombre de archivo limpio (sin sufijos de tamaño como -300x300)
    filename = image_url.rstrip('/').split('/')[-1]
    base_name = re.sub(r'-\d+x\d+\.(jpg|jpeg|png|gif|webp)$', r'.\1', filename, flags=re.IGNORECASE)

    # 1. Buscar por source_url exacto
    try:
        r = requests.get(f"{WP_API}/media", auth=AUTH,
                         params={"search": base_name, "per_page": 5}, timeout=15)
        if r.ok:
            for m in r.json():
                src = m.get("source_url", "")
                # Coincidencia exacta o misma ruta (ignorando dominio)
                if src == image_url or image_url.split(".com")[-1] in src:
                    return m["id"]
                # Coincidencia por nombre de archivo
                if base_name in src:
                    return m["id"]
    except Exception:
        pass
    return None

# ── 1. Cargar imagenes del CSV por SKU ────────────────────────────────────────
print("Leyendo imagenes del CSV...")
csv_images = {}
with open(CSV_FILE, "r", encoding="utf-8-sig", errors="ignore") as f:
    for row in csv.DictReader(f):
        sku = row.get("SKU", "").strip()
        img = row.get("Images", "").strip()
        if sku and img and "dummyimage" not in img:
            csv_images[sku] = img
print(f"  {len(csv_images)} SKUs con imagen real en el CSV")

# ── 2. Obtener productos de WooCommerce sin imagen ────────────────────────────
print("\nObteniendo productos sin imagen de WooCommerce...")
no_image_products = []
page = 1

while True:
    products, headers = woo_get("/products", {"per_page": 100, "page": page, "status": "publish"})
    if not products:
        break
    for p in products:
        images = p.get("images", [])
        has_real = any(
            img.get("src") and
            "placeholder" not in img.get("src", "") and
            "woocommerce-placeholder" not in img.get("src", "")
            for img in images
        )
        if not has_real:
            sku = p.get("sku", "").strip()
            if sku in csv_images:
                no_image_products.append({
                    "id": p["id"],
                    "sku": sku,
                    "name": p.get("name", "")[:40],
                    "img_url": csv_images[sku]
                })
    total_pages = int(headers.get("X-WP-TotalPages", 1))
    print(f"  Pagina {page}/{total_pages} ({len(no_image_products)} a corregir)", end="\r")
    if page >= total_pages:
        break
    page += 1
    time.sleep(0.3)

print(f"\n  Productos a corregir: {len(no_image_products)}")

if not no_image_products:
    print("No hay nada que corregir.")
    exit()

# ── 3. Para cada uno: buscar attachment ID y actualizar ───────────────────────
print(f"\nBuscando attachment IDs y actualizando imagenes...")
updated = 0
errors  = 0
not_found = 0
error_list = []

for i, p in enumerate(no_image_products, 1):
    sku     = p["sku"]
    pid     = p["id"]
    img_url = p["img_url"]

    # Buscar ID del attachment en la media library
    att_id = find_attachment_id(img_url)

    if att_id:
        # Actualizar por ID (no hay loopback)
        r = woo_put(f"/products/{pid}", {"images": [{"id": att_id}]})
        if r.ok:
            updated += 1
            status = f"OK (att_id={att_id})"
        else:
            errors += 1
            status = f"ERR {r.status_code}"
            error_list.append(f"{sku}: {r.text[:60]}")
    else:
        # Fallback: intentar con src de todas formas
        r = woo_put(f"/products/{pid}", {"images": [{"src": img_url}]})
        if r.ok:
            updated += 1
            status = "OK (src fallback)"
        else:
            not_found += 1
            status = "NO ENCONTRADA EN MEDIA"

    if i <= 20 or i % 25 == 0:
        print(f"  [{i}/{len(no_image_products)}] {sku} -> {status}")

    time.sleep(0.4)

print()
print("=" * 55)
print("COMPLETADO")
print(f"  Imagenes asignadas : {updated}")
print(f"  No encontradas     : {not_found}")
print(f"  Errores API        : {errors}")
print("=" * 55)

if error_list:
    with open("errores_imagenes_v2.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(error_list))
    print(f"  Detalles en: errores_imagenes_v2.txt")
