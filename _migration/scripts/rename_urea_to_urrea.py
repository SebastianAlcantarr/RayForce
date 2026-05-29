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

def replace_urea(text):
    if not text:
        return text
    # Reemplaza "Urea" por "Urrea" respetando mayúsculas/minúsculas
    # Buscamos word boundaries \b para no afectar palabras compuestas si existieran
    # Ejemplos:
    # UREA -> URREA
    # Urea -> Urrea
    # urea -> urrea
    def replace_match(match):
        word = match.group(0)
        if word.isupper():
            return "URREA"
        elif word[0].isupper():
            return "Urrea"
        else:
            return "urrea"
            
    return re.sub(r'\burea\b', replace_match, text, flags=re.IGNORECASE)

def main():
    print(f"Conectando a {WOO_URL}...")
    
    # 1. Buscar todos los productos que contengan "Urea"
    page = 1
    products_to_update = []
    
    print("Obteniendo productos con la palabra 'Urea'...")
    while True:
        try:
            r = requests.get(
                f"{BASE_API}/products", 
                auth=AUTH, 
                params={"search": "Urea", "per_page": 100, "page": page},
                timeout=30
            )
            r.raise_for_status()
        except Exception as e:
            print(f"Error consultando API: {e}")
            break
            
        products = r.json()
        if not products:
            break
            
        for p in products:
            name = p.get("name", "")
            pid = p.get("id")
            sku = p.get("sku", "")
            
            # Verificar si realmente contiene "urea" en el nombre (independiente de la búsqueda general de WooCommerce)
            if re.search(r'\burea\b', name, re.IGNORECASE):
                new_name = replace_urea(name)
                products_to_update.append({
                    "id": pid,
                    "sku": sku,
                    "old_name": name,
                    "new_name": new_name
                })
        
        page += 1
        time.sleep(0.2)
        
    if not products_to_update:
        print("No se encontraron productos con el error de nombre 'Urea'.")
        return
        
    print(f"\nSe encontraron {len(products_to_update)} productos para corregir:")
    for idx, item in enumerate(products_to_update, 1):
        print(f"[{idx}] ID: {item['id']} | SKU: {item['sku']}")
        print(f"    Antes: {item['old_name']}")
        print(f"    Ahora: {item['new_name']}")
        print("-" * 50)
        
    confirm = input("\n¿Deseas aplicar estos cambios en WooCommerce? (escribe 'SI' para confirmar): ").strip()
    if confirm.upper() != "SI":
        print("Operación cancelada. No se modificó ningún producto.")
        return
        
    print("\nActualizando nombres de productos en WooCommerce...")
    updated_count = 0
    error_count = 0
    
    for idx, item in enumerate(products_to_update, 1):
        pid = item["id"]
        new_name = item["new_name"]
        print(f"[{idx}/{len(products_to_update)}] Actualizando ID {pid} -> {new_name}...", end="", flush=True)
        
        try:
            r = requests.put(
                f"{BASE_API}/products/{pid}",
                auth=AUTH,
                json={"name": new_name},
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
        
    print(f"\nProceso terminado:")
    print(f"  Exitosos: {updated_count}")
    print(f"  Errores: {error_count}")

if __name__ == "__main__":
    main()
