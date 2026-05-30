import os
import re
import time
import requests
from requests.auth import HTTPBasicAuth

# Cargar .env manualmente desde el directorio raíz del proyecto
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

if not WOO_KEY or not WOO_SECRET:
    print(f"Error: No se encontraron credenciales WOO_KEY/WOO_SECRET en {ENV_PATH}")
    exit(1)

BASE_API = f"{WOO_URL}/wp-json/wc/v3"
AUTH = HTTPBasicAuth(WOO_KEY, WOO_SECRET)
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# Grupos de marcas
TRUPER_BRANDS = ['TRUPER', 'FIERO', 'FOSET', 'VOLTECK', 'PRETUL', 'HERMEX']
URREA_BRANDS = ['URREA', 'SURTEK', 'FOY']

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

def check_truper_datasheet(sku):
    """Realiza una petición HEAD rápida para verificar si existe una ficha técnica en Truper."""
    url = f"https://www.truper.com/ficha_merca/ficha-print.php?code={sku}"
    try:
        # Petición HEAD rápida con allow_redirects=False para verificar 200 vs 302
        r = requests.head(url, allow_redirects=False, timeout=10)
        if r.status_code == 200:
            return url
    except Exception:
        pass
    return None

def check_urrea_datasheet(sku):
    """Busca en catálogo de Urrea la ficha técnica PDF para un SKU usando búsqueda y raspado de página."""
    sku_clean = str(sku).strip()
    search_url = f"https://urrea.com/catalogsearch/result/?q={sku_clean}"
    try:
        r = requests.get(search_url, headers=HEADERS, timeout=15)
        if not r.ok:
            return None
        
        html = r.text
        
        # 1. Buscar enlace del detalle del producto
        sku_pattern = rf'<span class="sku-item-text">\s*{re.escape(sku_clean)}\s*</span>'
        match = re.search(sku_pattern, html, re.IGNORECASE)
        
        prod_url = None
        if match:
            pos = match.start()
            chunk = html[max(0, pos-3000):pos]
            hrefs = re.findall(r'href="(https://urrea\.com/[^"]+)"', chunk)
            valid_hrefs = [h for h in hrefs if "/productos/" not in h and "/catalog/" not in h and "/ayuda/" not in h and "facebook" not in h and "instagram" not in h and "linkedin" not in h]
            if valid_hrefs:
                prod_url = valid_hrefs[-1]
                
        if not prod_url:
            # Fallback a buscar el SKU como palabra completa en la página
            sku_pattern_fallback = rf'\b{re.escape(sku_clean)}\b'
            for m in re.finditer(sku_pattern_fallback, html, re.IGNORECASE):
                pos = m.start()
                chunk = html[max(0, pos-3000):pos]
                hrefs = re.findall(r'href="(https://urrea\.com/[^"]+)"', chunk)
                valid_hrefs = [h for h in hrefs if "/productos/" not in h and "/catalog/" not in h and "/ayuda/" not in h and "facebook" not in h and "instagram" not in h and "linkedin" not in h]
                if valid_hrefs:
                    prod_url = valid_hrefs[-1]
                    break
                    
        # Fallback definitivo a buscar patrón simple en URL
        if not prod_url:
            match_url = re.search(rf'href="(https://urrea\.com/[^"]*-{sku_clean})"', html)
            if not match_url:
                match_url = re.search(rf'href="(https://urrea\.com/[^"]*{sku_clean}[^"]*)"', html)
            if match_url:
                prod_url = match_url.group(1)

        if not prod_url:
            return None
            
        # 2. Obtener página del detalle del producto
        r_prod = requests.get(prod_url, headers=HEADERS, timeout=15)
        if not r_prod.ok:
            return None
            
        prod_html = r_prod.text
        # Buscar el PDF
        pdf_match = re.search(r'href="(https://[a-zA-Z0-9\-\.]+\.blob\.core\.windows\.net/[^"]+\.pdf)"', prod_html)
        if not pdf_match:
            pdf_match = re.search(r'href="([^"]+\.pdf)"', prod_html)
            
        if pdf_match:
            pdf_url = pdf_match.group(1)
            if pdf_url.startswith("//"):
                pdf_url = "https:" + pdf_url
            elif pdf_url.startswith("/"):
                pdf_url = "https://urrea.com" + pdf_url
            return pdf_url
    except Exception:
        pass
    return None

def main():
    print("============================================================")
    print("AUDITORÍA E IMPORTACIÓN AVANZADA DE FICHAS TÉCNICAS")
    print("============================================================")
    
    overwrite_input = input("¿Deseas auditar y verificar TODOS los productos, incluyendo los que ya tienen ficha? (S/N, default N): ").strip().upper()
    overwrite_existing = overwrite_input == "S"
    
    print("\nObteniendo todos los productos publicados de WooCommerce...")
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
        print(f"  Pág {page-1} cargada. Total acumulado: {len(all_products)} productos.")

    total_products = len(all_products)
    print(f"\nTotal productos publicados cargados: {total_products}\n")
    
    to_update = []
    skipped_existing = 0
    skipped_no_sku = 0
    
    print("Iniciando auditoría de SKUs uno por uno...")
    print("-" * 60)
    
    for idx, p in enumerate(all_products, 1):
        pid = p.get("id")
        sku = p.get("sku", "").strip()
        name = p.get("name", "")
        brand = get_product_brand(p)
        
        if not sku or sku == "SIN SKU":
            skipped_no_sku += 1
            continue
            
        # Comprobar si ya tiene una ficha técnica en meta_data
        existing_url = None
        if p.get("meta_data"):
            meta = next((m for m in p["meta_data"] if m.get("key") == "ficha_tecnica_url"), None)
            if meta:
                existing_url = str(meta.get("value", "")).strip()
                
        if existing_url and not overwrite_existing:
            skipped_existing += 1
            continue
            
        print(f"[{idx}/{total_products}] SKU: {sku} | Marca detectada: {brand or 'Ninguna'} | {name[:40]}...")
        
        found_url = None
        source = None
        
        # Determinar prioridad de búsqueda por marca para evitar colisiones incorrectas
        search_order = []
        if brand in TRUPER_BRANDS:
            search_order = [("Truper", check_truper_datasheet), ("Urrea", check_urrea_datasheet)]
        elif brand in URREA_BRANDS:
            search_order = [("Urrea", check_urrea_datasheet), ("Truper", check_truper_datasheet)]
        else:
            # Si no hay marca definida, probar primero Truper (es mucho más rápida por ser petición HEAD)
            search_order = [("Truper", check_truper_datasheet), ("Urrea", check_urrea_datasheet)]
            
        for provider_name, check_fn in search_order:
            result = check_fn(sku)
            if result:
                found_url = result
                source = provider_name
                break
                
        if found_url:
            if existing_url == found_url:
                print(f"  -> Ya tiene asignada la misma URL: {found_url}")
            else:
                action = "Actualizar" if existing_url else "Agregar"
                print(f"  -> ¡Coincidencia encontrada en {source}! ({action}): {found_url}")
                to_update.append({
                    "id": pid,
                    "sku": sku,
                    "name": name,
                    "brand": brand,
                    "pdf_url": found_url,
                    "source": source,
                    "action": action
                })
        else:
            print("  -> Ficha técnica no encontrada en Truper ni Urrea.")
            
        # Retardo prudente para no saturar las llamadas externas de scraping de Urrea/Truper
        time.sleep(0.2)
        
    print("\n" + "=" * 60)
    print("RESUMEN DE AUDITORÍA")
    print("=" * 60)
    print(f"Productos sin SKU saltados         : {skipped_no_sku}")
    print(f"Productos con ficha ya registrada : {skipped_existing} (saltados)")
    print(f"Nuevas fichas técnicas encontradas : {len(to_update)}")
    print("-" * 60)
    
    if not to_update:
        print("\nNo se encontraron nuevas fichas técnicas para agregar o actualizar.")
        return
        
    print("\nDetalle de productos a actualizar:")
    for idx, item in enumerate(to_update, 1):
        print(f"[{idx}] ID: {item['id']} | SKU: {item['sku']} | {item['name'][:50]}")
        print(f"    Marca: {item['brand'] or '—'} | Origen: {item['source']} ({item['action']})")
        print(f"    URL: {item['pdf_url']}")
        print("-" * 60)
        
    confirm = input(f"\n¿Deseas aplicar estos {len(to_update)} cambios en WooCommerce? (SI para confirmar): ").strip()
    if confirm.upper() != "SI":
        print("Operación cancelada. No se modificó ningún producto.")
        return
        
    print("\nActualizando productos en WooCommerce...")
    updated_count = 0
    error_count = 0
    
    for idx, item in enumerate(to_update, 1):
        pid = item["id"]
        pdf_url = item["pdf_url"]
        sku = item["sku"]
        print(f"[{idx}/{len(to_update)}] SKU: {sku} | ID {pid}...", end="", flush=True)
        
        update_body = {
            "meta_data": [
                {
                    "key": "ficha_tecnica_url",
                    "value": pdf_url
                }
            ]
        }
        
        try:
            r = requests.put(
                f"{BASE_API}/products/{pid}",
                auth=AUTH,
                json=update_body,
                timeout=30
            )
            if r.status_code == 200:
                print(" OK")
                updated_count += 1
            else:
                print(f" ERROR: {r.status_code} - {r.text[:120]}")
                error_count += 1
        except Exception as e:
            print(f" EXCEPCIÓN: {e}")
            error_count += 1
            
        time.sleep(0.3)
        
    print(f"\nProceso de actualización terminado:")
    print(f"  Exitosos: {updated_count}")
    print(f"  Errores: {error_count}")

if __name__ == "__main__":
    main()
