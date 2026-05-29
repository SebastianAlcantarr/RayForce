import os
import re
import requests
import time
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

def get_products_by_brand(brand_id):
    """Obtiene todos los productos de un brand_id en WooCommerce."""
    products = []
    page = 1
    while True:
        r = requests.get(
            f"{BASE_API}/products",
            auth=AUTH,
            params={"brand": brand_id, "per_page": 100, "page": page, "status": "any"},
            timeout=30
        )
        if not r.ok:
            print(f"Error cargando productos para marca {brand_id}: {r.text}")
            break
        items = r.json()
        if not items:
            break
        products.extend(items)
        page += 1
    return products

def scrape_pdf_url(sku):
    """Busca en catálogo de Urrea la ficha técnica PDF para un SKU."""
    sku_clean = str(sku).strip()
    if not sku_clean or sku_clean == "SIN SKU":
        return None
        
    search_url = f"https://urrea.com/catalogsearch/result/?q={sku_clean}"
    try:
        r = requests.get(search_url, headers=HEADERS, timeout=15)
        if not r.ok:
            return None
        
        # 1. Buscar enlace del detalle del producto
        # Patrón que termina en -SKU o contiene el SKU
        html = r.text
        match = re.search(rf'href="(https://urrea\.com/[^"]*-{sku_clean})"', html)
        if not match:
            match = re.search(rf'href="(https://urrea\.com/[^"]*{sku_clean}[^"]*)"', html)
            
        if not match:
            return None
            
        prod_url = match.group(1)
        
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
            # Asegurar que sea URL absoluta si viene relativa
            if pdf_url.startswith("//"):
                pdf_url = "https:" + pdf_url
            elif pdf_url.startswith("/"):
                pdf_url = "https://urrea.com" + pdf_url
            return pdf_url
    except Exception as e:
        # Silenciar y retornar None
        pass
    return None

def main():
    brand_ids = {
        "361": "URREA",
        "267": "SURTEK",
        "351": "FOY"
    }
    
    all_products = []
    print("Obteniendo productos de marcas Urrea/Surtek/Foy de WooCommerce...")
    for bid, bname in brand_ids.items():
        prods = get_products_by_brand(bid)
        print(f"  Marca {bname} (ID {bid}): {len(prods)} productos encontrados.")
        all_products.extend(prods)
        
    print(f"\nTotal de productos a procesar: {len(all_products)}")
    
    # 2. Scrapear URLs de PDFs
    to_update = []
    print("\nBuscando fichas técnicas en urrea.com...")
    for idx, p in enumerate(all_products, 1):
        sku = p.get("sku", "").strip()
        pid = p.get("id")
        name = p.get("name", "")
        
        # Buscar si ya tiene una ficha técnica en meta_data
        existing_url = None
        if p.get("meta_data"):
            meta = next((m for m in p["meta_data"] if m.get("key") == "ficha_tecnica_url"), None)
            if meta:
                existing_url = meta.get("value")
                
        print(f"[{idx}/{len(all_products)}] Analizando ID {pid} | SKU: {sku} | {name}...")
        
        if not sku or sku == "SIN SKU":
            print("  -> Saltado (Sin SKU)")
            continue
            
        pdf_url = scrape_pdf_url(sku)
        if pdf_url:
            if existing_url == pdf_url:
                print(f"  -> Ya tiene la ficha técnica correcta: {pdf_url}")
            else:
                action = "Actualizar" if existing_url else "Agregar"
                print(f"  -> ¡Ficha encontrada! ({action}): {pdf_url}")
                to_update.append({
                    "id": pid,
                    "name": name,
                    "sku": sku,
                    "pdf_url": pdf_url,
                    "action": action
                })
        else:
            print("  -> Ficha técnica no encontrada en urrea.com")
            
        # Espera prudente entre consultas para no ser bloqueados
        time.sleep(0.3)
        
    if not to_update:
        print("\nNo hay fichas técnicas nuevas o actualizadas para importar.")
        return
        
    print(f"\nSe encontraron {len(to_update)} productos para actualizar/agregar ficha técnica:")
    for idx, item in enumerate(to_update, 1):
        print(f"[{idx}] ID: {item['id']} | SKU: {item['sku']} | {item['name']}")
        print(f"    Ficha Técnica: {item['pdf_url']}")
        print("-" * 55)
        
    confirm = input(f"\n¿Deseas aplicar estos {len(to_update)} cambios en WooCommerce? (escribe 'SI' para confirmar): ").strip()
    if confirm.upper() != "SI":
        print("Operación cancelada. No se modificó ningún producto.")
        return
        
    print("\nActualizando metadatos de productos en WooCommerce...")
    updated_count = 0
    error_count = 0
    
    for idx, item in enumerate(to_update, 1):
        pid = item["id"]
        pdf_url = item["pdf_url"]
        print(f"[{idx}/{len(to_update)}] Actualizando ID {pid}...", end="", flush=True)
        
        # Formatear el metadato
        # En WooCommerce, para agregar o actualizar meta_data por REST API pasamos:
        # meta_data = [{"key": "ficha_tecnica_url", "value": pdf_url}]
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
                print(f" ERROR: {r.status_code} - {r.text[:100]}")
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
