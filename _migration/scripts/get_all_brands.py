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
    print("Obteniendo marcas de WooCommerce...")
    r = requests.get(f"{BASE_API}/products/brands", auth=AUTH, params={"per_page": 100})
    if r.ok:
        brands = r.json()
        for b in brands:
            print(f"ID: {b['id']} | Nombre: {b['name']} | Slug: {b['slug']} | Cantidad de productos: {b.get('count', 0)}")
    else:
        print(f"Error: {r.status_code} - {r.text}")

if __name__ == "__main__":
    main()
