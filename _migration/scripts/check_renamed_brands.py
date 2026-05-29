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

def main():
    product_ids = [32686, 31881, 31880, 31879, 31878]
    for pid in product_ids:
        r = requests.get(f"{BASE_API}/products/{pid}", auth=AUTH)
        if r.ok:
            p = r.json()
            name = p.get("name")
            sku = p.get("sku")
            brands = p.get("brands", [])
            attributes = p.get("attributes", [])
            meta = p.get("meta_data", [])
            print(f"Producto ID: {pid} | SKU: {sku} | Nombre: {name}")
            print(f"  Brands: {brands}")
            print(f"  Attributes: {attributes}")
            print(f"  Meta (first 3): {meta[:3]}")
            print("-" * 40)
        else:
            print(f"Error cargando producto {pid}: {r.status_code}")

if __name__ == "__main__":
    main()
