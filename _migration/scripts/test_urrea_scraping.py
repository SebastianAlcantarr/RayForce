import requests
import re
import urllib.parse

def test_scrape(sku):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    # 1. Buscar el SKU en Urrea
    search_url = f"https://urrea.com/catalogsearch/result/?q={sku}"
    print(f"Buscando SKU {sku} en: {search_url}")
    
    r = requests.get(search_url, headers=headers, timeout=15)
    if not r.ok:
        print(f"Error en búsqueda: {r.status_code}")
        return
        
    html = r.text
    
    # Intentar buscar el link del producto mediante regex
    # El link suele contener el SKU y tener formato de url limpia: https://urrea.com/...sku
    # O buscamos href en links de producto.
    # Busquemos URLs que comiencen con https://urrea.com/ y terminen con el SKU
    product_url_pattern = rf'href="(https://urrea\.com/[^"]*-{sku})"'
    match = re.search(product_url_pattern, html)
    
    if not match:
        # Intentar una búsqueda de regex más amplia: cualquier url de producto que contenga el sku
        product_url_pattern = rf'href="(https://urrea\.com/[^"]*{sku}[^"]*)"'
        match = re.search(product_url_pattern, html)
        
    if not match:
        print("No se encontró el link del producto en los resultados de búsqueda.")
        # Escribir el HTML para depuración
        with open("search_debug.html", "w", encoding="utf-8") as f:
            f.write(html)
        print("HTML de búsqueda guardado en search_debug.html")
        return
        
    prod_url = match.group(1)
    print(f"Producto encontrado: {prod_url}")
    
    # 2. Obtener la página del producto
    r_prod = requests.get(prod_url, headers=headers, timeout=15)
    if not r_prod.ok:
        print(f"Error cargando producto: {r_prod.status_code}")
        return
        
    prod_html = r_prod.text
    
    # Buscar el link de la ficha técnica (PDF)
    # Ejemplo de link: https://uhpproductosdev.blob.core.windows.net/catalogo/ASSETS/UHM/FichasTecnicas/FTDOC1490.pdf
    pdf_pattern = r'href="(https://[a-zA-Z0-9\-\.]+\.blob\.core\.windows\.net/[^"]+\.pdf)"'
    pdf_match = re.search(pdf_pattern, prod_html)
    
    if not pdf_match:
        # Buscar cualquier PDF
        pdf_pattern = r'href="([^"]+\.pdf)"'
        pdf_match = re.search(pdf_pattern, prod_html)
        
    if pdf_match:
        pdf_url = pdf_match.group(1)
        print(f"¡Ficha técnica encontrada! -> {pdf_url}")
    else:
        print("No se encontró el link del PDF en la página del producto.")
        with open("prod_debug.html", "w", encoding="utf-8") as f:
            f.write(prod_html)
        print("HTML del producto guardado en prod_debug.html")

if __name__ == "__main__":
    test_scrape("123034")
