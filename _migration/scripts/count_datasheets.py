import os
import requests
from requests.auth import HTTPBasicAuth

ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env"))

def load_env(path):
    config = {}
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                config[k.strip()] = v.strip()
    return config

env = load_env(ENV_PATH)
WOO_URL = env.get("WOO_URL", "https://wp.rayforce.com.mx")
WOO_KEY = env.get("WOO_KEY")
WOO_SECRET = env.get("WOO_SECRET")

BASE_API = f"{WOO_URL}/wp-json/wc/v3"
AUTH = HTTPBasicAuth(WOO_KEY, WOO_SECRET)

def get_product_brand(p):
    # 1. Brands taxonomy
    brands = p.get("brands", [])
    if brands:
        name = brands[0].get("name", "").upper()
        if name:
            return name
            
    # 2. Marca attribute
    attrs = p.get("attributes", [])
    for attr in attrs:
        if attr.get("name", "").lower() == "marca":
            options = attr.get("options", [])
            if options:
                return str(options[0]).upper()
                
    # 3. Name keywords
    name_lower = p.get("name", "").lower()
    for kw in ['truper', 'urrea', 'surtek', 'fiero', 'foset', 'volteck', 'pretul', 'hermex', 'foy']:
        if kw in name_lower:
            return kw.upper()
            
    return None

def main():
    print("Obteniendo todos los productos de WooCommerce...")
    all_products = []
    page = 1
    while True:
        r = requests.get(
            f"{BASE_API}/products",
            auth=AUTH,
            params={"per_page": 100, "page": page, "status": "publish"},
            timeout=30
        )
        if not r.ok:
            print(f"Error cargando productos: {r.text}")
            break
        items = r.json()
        if not items:
            break
        all_products.extend(items)
        page += 1

    total_products = len(all_products)
    print(f"Total productos publicados: {total_products}\n")

    truper_brands = ['TRUPER', 'FIERO', 'FOSET', 'VOLTECK', 'PRETUL', 'HERMEX']
    urrea_brands = ['URREA', 'SURTEK', 'FOY']

    custom_meta_count = 0
    truper_fallback_count = 0
    urrea_search_count = 0
    no_datasheet_count = 0

    custom_meta_items = []
    truper_fallback_items = []
    urrea_search_items = []

    for p in all_products:
        sku = p.get("sku", "").strip()
        pid = p.get("id")
        name = p.get("name")
        brand = get_product_brand(p)

        # 1. Custom Metadata
        meta_url = None
        if p.get("meta_data"):
            meta = next((m for m in p["meta_data"] if m.get("key") == "ficha_tecnica_url"), None)
            if meta:
                meta_url = str(meta.get("value")).strip()

        if meta_url:
            custom_meta_count += 1
            custom_meta_items.append((pid, sku, name, meta_url))
            continue

        # 2. Truper Fallback (Direct PDF link)
        if brand in truper_brands and sku and sku != "SIN SKU":
            truper_fallback_count += 1
            truper_fallback_items.append((pid, sku, name, f"https://www.truper.com/ficha_merca/ficha-print.php?code={sku}"))
            continue

        # 3. Urrea Fallback (Search Link)
        if brand in urrea_brands and sku and sku != "SIN SKU":
            urrea_search_count += 1
            urrea_search_items.append((pid, sku, name, f"https://urrea.com/catalogsearch/result/?q={sku}"))
            continue

        no_datasheet_count += 1

    print("=" * 60)
    print("RESUMEN DE FICHAS TÉCNICAS")
    print("=" * 60)
    print(f"1. Fichas personalizadas (meta_data)       : {custom_meta_count}")
    print(f"2. Fichas automáticas Truper (PDF directo) : {truper_fallback_count}")
    print(f"3. Enlaces de búsqueda Urrea (Catálogo)    : {urrea_search_count}")
    print(f"4. Sin ficha técnica ni enlaces            : {no_datasheet_count}")
    print("-" * 60)
    
    total_with_btn = custom_meta_count + truper_fallback_count + urrea_search_count
    direct_pdf_total = custom_meta_count + truper_fallback_count
    
    print(f"Total productos con botón de ficha técnica : {total_with_btn} ({total_with_btn/total_products*100:.1f}%)")
    print(f"  -> Con enlace a PDF Directo              : {direct_pdf_total} ({direct_pdf_total/total_products*100:.1f}%)")
    print(f"  -> Con enlace a buscador (Urrea)         : {urrea_search_count} ({urrea_search_count/total_products*100:.1f}%)")
    print("=" * 60)

if __name__ == "__main__":
    main()
