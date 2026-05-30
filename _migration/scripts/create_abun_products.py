import os
import csv
import requests
import time
from requests.auth import HTTPBasicAuth

# Cargar .env manualmente desde el directorio raíz del proyecto
ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.env"))
CSV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../_archivos_temporales/productos_faltantes_woocomerce.csv"))

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

def main():
    print("=" * 60)
    print("CREADOR DE AB UNICANAL (ABUN000x)")
    print("=" * 60)
    
    if not os.path.exists(CSV_PATH):
        print(f"Error: No existe el archivo CSV en {CSV_PATH}")
        return
        
    products_to_create = []
    with open(CSV_PATH, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sku = row.get("SKU", "").strip()
            name = row.get("Nombre", "").strip()
            price = row.get("Precio normal", "0").strip()
            stock = row.get("Inventario", "0").strip()
            
            if sku:
                products_to_create.append({
                    "sku": sku,
                    "name": name,
                    "type": "simple",
                    "status": "publish",
                    "regular_price": price,
                    "manage_stock": True,
                    "stock_quantity": int(stock),
                    "stock_status": "instock" if int(stock) > 0 else "outofstock",
                    "categories": [{"id": 259}]  # Categoría 'Generica' o 'Varios' (ID 259 es 'Generica')
                })
                
    print(f"Leídos {len(products_to_create)} productos para crear.")
    
    confirm = input("¿Deseas intentar dar de alta estos productos en WooCommerce? (SI para confirmar): ").strip()
    if confirm.upper() != "SI":
        print("Cancelado.")
        return
        
    created_count = 0
    error_count = 0
    
    for item in products_to_create:
        print(f"Creando SKU {item['sku']} ({item['name']})...", end="", flush=True)
        
        r = requests.post(f"{BASE_API}/products", auth=AUTH, json=item)
        if r.ok:
            data = r.json()
            print(f" OK (ID: {data['id']})")
            created_count += 1
        else:
            print(f" ERROR: {r.status_code} - {r.text[:100]}")
            error_count += 1
            
        time.sleep(0.3)
        
    print(f"\nProceso completado:")
    print(f"  Creados: {created_count}")
    print(f"  Errores: {error_count}")

if __name__ == "__main__":
    main()
