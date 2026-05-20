"""
delete_base_products.py
Elimina de WooCommerce todos los productos de tipo 'variable'
(los que tenian SKU terminado en -BASE) via REST API.

Ejecutar DESPUES de importar el CSV.
"""
import requests
import time
from requests.auth import HTTPBasicAuth

WOO_URL    = "https://springgreen-sparrow-647332.hostingersite.com"
WOO_KEY    = "ck_8c3566e1217c27e84ac4fe9f20752621628e5dca"
WOO_SECRET = "cs_a855360621bee5f3a90ad08368e87687766e7884"

BASE_API   = f"{WOO_URL}/wp-json/wc/v3"
AUTH       = HTTPBasicAuth(WOO_KEY, WOO_SECRET)

def get_variable_products(page=1, per_page=100):
    """Obtiene productos de tipo variable (los BASE)."""
    resp = requests.get(
        f"{BASE_API}/products",
        auth=AUTH,
        params={"type": "variable", "per_page": per_page, "page": page, "status": "any"},
        timeout=30
    )
    resp.raise_for_status()
    return resp.json(), resp.headers

def delete_product(product_id, sku=""):
    """Elimina un producto permanentemente."""
    resp = requests.delete(
        f"{BASE_API}/products/{product_id}",
        auth=AUTH,
        params={"force": True},
        timeout=30
    )
    if resp.status_code in (200, 204):
        return True
    print(f"  Error {resp.status_code} eliminando {sku} (id={product_id}): {resp.text[:100]}")
    return False

def main():
    print("=" * 55)
    print("ELIMINACION DE PRODUCTOS BASE (variable) de WooCommerce")
    print("=" * 55)
    print()

    # 1. Recopilar todos los productos variable
    all_variable = []
    page = 1
    while True:
        print(f"  Obteniendo pagina {page}...", end=" ", flush=True)
        products, headers = get_variable_products(page=page)
        if not products:
            print("sin mas resultados.")
            break
        all_variable.extend(products)
        print(f"{len(products)} productos")
        total_pages = int(headers.get("X-WP-TotalPages", 1))
        if page >= total_pages:
            break
        page += 1
        time.sleep(0.5)

    print(f"\nTotal productos variable encontrados: {len(all_variable)}")

    if not all_variable:
        print("No hay productos variable para eliminar. Todo limpio.")
        return

    # Mostrar muestra de lo que se va a borrar
    print("\nProductos a eliminar (muestra):")
    for p in all_variable[:10]:
        print(f"  ID={p['id']} | SKU={p.get('sku','?')} | {p.get('name','?')[:50]}")
    if len(all_variable) > 10:
        print(f"  ... y {len(all_variable)-10} mas")

    print(f"\nSe van a eliminar {len(all_variable)} productos variable.")
    confirm = input("Escribe 'SI' para confirmar: ").strip()
    if confirm.upper() != "SI":
        print("Cancelado.")
        return

    # 2. Eliminar uno por uno
    print("\nEliminando...")
    deleted   = 0
    failed    = 0

    for i, product in enumerate(all_variable, 1):
        pid  = product["id"]
        sku  = product.get("sku", "?")
        name = product.get("name", "?")[:40]
        print(f"  [{i}/{len(all_variable)}] {sku} - {name}...", end=" ", flush=True)

        ok = delete_product(pid, sku)
        if ok:
            print("OK")
            deleted += 1
        else:
            failed += 1

        # Pausa para no saturar la API
        time.sleep(0.3)

    print()
    print("=" * 55)
    print(f"COMPLETADO")
    print(f"  Eliminados : {deleted}")
    print(f"  Fallidos   : {failed}")
    print("=" * 55)


if __name__ == "__main__":
    main()
