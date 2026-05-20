import requests
import time
from requests.auth import HTTPBasicAuth

WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"
SITE_URL   = "https://springgreen-sparrow-647332.hostingersite.com"
AUTH       = HTTPBasicAuth(WOO_KEY, WOO_SECRET)

def delete_all():
    print("Iniciando borrado masivo de productos...")
    total_deleted = 0
    
    while True:
        # 1. Obtener IDs de 100 productos
        r = requests.get(f"{SITE_URL}/wp-json/wc/v3/products", auth=AUTH, params={"per_page": 100, "fields": "id"})
        if not r.ok:
            print(f"Error obteniendo productos: {r.text}")
            break
        
        products = r.json()
        if not products:
            print("\nNo quedan más productos por borrar.")
            break
            
        ids = [p['id'] for p in products]
        
        # 2. Borrado por lote (batch)
        # force=True para saltar la papelera
        batch_data = {"delete": ids}
        r_del = requests.post(f"{SITE_URL}/wp-json/wc/v3/products/batch", auth=AUTH, json=batch_data, params={"force": "true"})
        
        if r_del.ok:
            total_deleted += len(ids)
            print(f"  Borrados: {total_deleted}...", end="\r")
        else:
            print(f"\nError en lote: {r_del.text}")
            break
            
        time.sleep(0.5)

if __name__ == "__main__":
    delete_all()
