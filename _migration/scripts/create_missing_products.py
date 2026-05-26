"""
create_missing_products.py
Compara el CSV final con los productos existentes en WooCommerce,
encuentra los que faltan y los crea/fuerza via REST API.
"""
import csv
import requests
import time
import json
from requests.auth import HTTPBasicAuth

WOO_URL    = "https://springgreen-sparrow-647332.hostingersite.com"
WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"
BASE_API   = f"{WOO_URL}/wp-json/wc/v3"
AUTH       = HTTPBasicAuth(WOO_KEY, WOO_SECRET)
CSV_FILE   = "woocommerce_FINAL.csv"

# ── Helpers ────────────────────────────────────────────────────────────────────

def woo_get(endpoint, params=None):
    r = requests.get(f"{BASE_API}{endpoint}", auth=AUTH, params=params or {}, timeout=30)
    r.raise_for_status()
    return r.json(), r.headers

def woo_post(endpoint, body):
    r = requests.post(f"{BASE_API}{endpoint}", auth=AUTH, json=body, timeout=30)
    return r

def woo_put(endpoint, body):
    r = requests.put(f"{BASE_API}{endpoint}", auth=AUTH, json=body, timeout=30)
    return r

def woo_delete(endpoint, params=None):
    r = requests.delete(f"{BASE_API}{endpoint}", auth=AUTH, params=params or {}, timeout=30)
    return r

# ── 1. Obtener todos los SKUs actuales de WooCommerce ─────────────────────────

def get_all_woo_skus():
    """Retorna {sku: {id, type, status}} de TODOS los productos (incluyendo orphaned)."""
    print("Obteniendo productos de WooCommerce...")
    skus = {}
    page = 1
    while True:
        products, headers = woo_get("/products", {
            "per_page": 100, "page": page, "status": "any"
        })
        if not products:
            break
        for p in products:
            sku = p.get("sku", "").strip()
            if sku:
                skus[sku] = {"id": p["id"], "type": p.get("type",""), "status": p.get("status","")}
        total_pages = int(headers.get("X-WP-TotalPages", 1))
        print(f"  Pagina {page}/{total_pages} ({len(skus)} SKUs)", end="\r")
        if page >= total_pages:
            break
        page += 1
        time.sleep(0.3)

    # Tambien buscar variaciones huerfanas
    print(f"\n  {len(skus)} SKUs totales en WooCommerce")
    return skus

# ── 2. Leer CSV ────────────────────────────────────────────────────────────────

def read_csv():
    print(f"\nLeyendo {CSV_FILE}...")
    rows = {}
    with open(CSV_FILE, "r", encoding="utf-8-sig", errors="ignore") as f:
        for row in csv.DictReader(f):
            sku = row.get("SKU", "").strip()
            if sku:
                rows[sku] = row
    print(f"  {len(rows)} SKUs en el CSV")
    return rows

# ── 3. Parsear categorias del CSV ─────────────────────────────────────────────

_cat_cache = {}

def get_or_create_category(cat_name):
    """Obtiene o crea una categoria y devuelve su ID."""
    cat_name = cat_name.strip()
    if cat_name in _cat_cache:
        return _cat_cache[cat_name]
    # Buscar existente
    cats, _ = woo_get("/products/categories", {"search": cat_name, "per_page": 5})
    for c in cats:
        if c["name"].lower() == cat_name.lower():
            _cat_cache[cat_name] = c["id"]
            return c["id"]
    # Crear nueva
    r = woo_post("/products/categories", {"name": cat_name})
    if r.ok:
        cid = r.json().get("id")
        _cat_cache[cat_name] = cid
        return cid
    return None

def parse_categories(cat_str):
    """Parsea el string de categorias del CSV -> lista de {id}."""
    if not cat_str:
        return []
    # Formato: "MATERIAL ELECTRICO > Canalización"
    # Usar solo la ultima parte (subcategoria)
    parts = [p.strip() for p in cat_str.split(">")]
    result = []
    for part in parts:
        if part:
            cid = get_or_create_category(part)
            if cid:
                result.append({"id": cid})
    return result

def parse_attributes(row):
    """Parsea los atributos del CSV."""
    attrs = []
    for i in range(1, 4):
        name = row.get(f"Attribute {i} name", "").strip()
        vals = row.get(f"Attribute {i} value(s)", "").strip()
        if name and vals:
            attrs.append({
                "name": name,
                "options": [v.strip() for v in vals.split("|") if v.strip()],
                "visible": True,
            })
    return attrs

def csv_row_to_product(row):
    """Convierte una fila del CSV al formato de la API de WooCommerce."""
    images = []
    img_src = row.get("Images", "").strip()
    if img_src and "dummyimage" not in img_src:
        images = [{"src": img_src}]

    return {
        "name": row.get("Name", "").strip(),
        "type": "simple",
        "status": "publish",
        "sku": row.get("SKU", "").strip(),
        "regular_price": row.get("Regular price", "0").strip() or "0",
        "description": row.get("Description", "").strip(),
        "images": images,
        "attributes": parse_attributes(row),
        "manage_stock": True,
        "stock_quantity": 0,
        "stock_status": "outofstock",
    }

# ── 4. Forzar actualizacion/creacion ──────────────────────────────────────────

def find_by_sku(sku):
    """Busca un producto por SKU incluyendo huerfanos (cualquier status)."""
    try:
        products, _ = woo_get("/products", {"sku": sku, "status": "any", "per_page": 5})
        if products:
            return products[0]
    except Exception:
        pass
    return None

def force_upsert(sku, row, woo_info):
    """
    Estrategia:
    1. Si woo_info existe (encontrado por listado) -> PUT directo
    2. Si no, buscar por SKU (puede ser huerfano) -> PUT si encontrado
    3. Si no existe, crear sin imagen primero (para evitar errores de imagen)
    """
    product_data = csv_row_to_product(row)

    # Intentar encontrar por SKU primero (captura variaciones huerfanas)
    if not woo_info:
        found = find_by_sku(sku)
        if found:
            woo_info = {"id": found["id"], "type": found.get("type", ""), "status": found.get("status", "")}

    if woo_info:
        # Existe: actualizar forzando tipo simple
        pid = woo_info["id"]
        product_data["type"] = "simple"
        r = woo_put(f"/products/{pid}", product_data)
        if r.ok:
            return "updated"
        else:
            return f"error_update:{r.status_code}:{r.text[:80]}"
    else:
        # No existe: crear sin imagen para evitar errores de imagen
        data_no_img = {k: v for k, v in product_data.items() if k != "images"}
        r = woo_post("/products", data_no_img)
        if r.ok:
            pid = r.json().get("id")
            # Si tiene imagen, intentar agregarla aparte
            if product_data.get("images"):
                try:
                    woo_put(f"/products/{pid}", {"images": product_data["images"]})
                except Exception:
                    pass
            return "created"
        else:
            return f"error_create:{r.status_code}:{r.text[:80]}"

# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("FORZAR CREACION/ACTUALIZACION DE PRODUCTOS FALTANTES")
    print("=" * 60)

    woo_skus  = get_all_woo_skus()
    csv_rows  = read_csv()

    # Identificar los que faltan o estan en estado malo (variation/orphaned)
    to_fix = {}
    for sku, row in csv_rows.items():
        woo = woo_skus.get(sku)
        if woo is None:
            # No existe en WooCommerce
            to_fix[sku] = (row, None)
        elif woo["type"] in ("variation",):
            # Existe pero como variacion huerfana -> forzar a simple
            to_fix[sku] = (row, woo)

    missing_count  = sum(1 for _, w in to_fix.values() if w is None)
    orphan_count   = sum(1 for _, w in to_fix.values() if w is not None)

    print(f"\nAnalisis:")
    print(f"  SKUs en CSV              : {len(csv_rows)}")
    print(f"  SKUs en WooCommerce      : {len(woo_skus)}")
    print(f"  Productos faltantes (nuevo): {missing_count}")
    print(f"  Variaciones huerfanas     : {orphan_count}")
    print(f"  Total a procesar          : {len(to_fix)}")

    if not to_fix:
        print("\nTodo esta sincronizado. No hay nada que hacer.")
        return

    confirm = input(f"\nProcesar {len(to_fix)} productos? (SI para confirmar): ").strip()
    if confirm.upper() != "SI":
        print("Cancelado.")
        return

    results = {"created": 0, "updated": 0, "error": 0}
    errors  = []

    for i, (sku, (row, woo_info)) in enumerate(to_fix.items(), 1):
        action = "crear" if woo_info is None else "actualizar"
        print(f"  [{i}/{len(to_fix)}] {action} {sku}...", end=" ", flush=True)

        result = force_upsert(sku, row, woo_info)
        print(result)

        if result == "created":
            results["created"] += 1
        elif result == "updated":
            results["updated"] += 1
        else:
            results["error"] += 1
            errors.append(f"{sku}: {result}")

        # Respetar limites de la API
        time.sleep(0.4)

        # Mini-resumen cada 50
        if i % 50 == 0:
            print(f"  --- Progreso: {i}/{len(to_fix)} | Creados:{results['created']} Actualizados:{results['updated']} Errores:{results['error']} ---")

    print()
    print("=" * 60)
    print("COMPLETADO")
    print(f"  Creados    : {results['created']}")
    print(f"  Actualizados: {results['updated']}")
    print(f"  Errores    : {results['error']}")
    print("=" * 60)

    if errors:
        with open("errores_productos.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(errors))
        print(f"  Errores guardados en: errores_productos.txt")

if __name__ == "__main__":
    main()
