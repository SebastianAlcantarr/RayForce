"""
Busca imágenes para productos sin foto usando DuckDuckGo Images.
Corre en background — puede tardar 30-60 min para 1,539 productos.

Uso:
  python3 buscar_imagenes.py

Resultado:
  - Imágenes descargadas en: imagenes_productos/
  - Log de resultados:       imagenes_buscadas.log
"""

import json
import os
import re
import time
import urllib.request
import urllib.parse
from html.parser import HTMLParser

PRODUCTOS_JSON  = "productos_sin_imagen.json"
IMGS_DIR        = "imagenes_productos"
LOG_FILE        = "imagenes_buscadas.log"
DELAY           = 1.5   # segundos entre búsquedas (ser amable con DuckDuckGo)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "es-MX,es;q=0.9",
}

# Palabras a quitar del nombre para limpiar la búsqueda
LIMPIAR = re.compile(
    r'\b\d+[-\/x]\d+[-\/x]?\d*\s*(?:mm|cm|mts?|pulg|kg|lb|m|ft)?\b'
    r'|\b\d+\s*(?:mm|cm|mts?|pulg|kg|lb|watts?|volts?|awg|mcm|w|v|a|k)\b'
    r'|\b\d+[-x\/]\d+\b'
    r'|\b(?:no\.|num\.?|mod\.?|ref\.?)\s*\S+',
    re.IGNORECASE
)

EXTENSIONES = re.compile(r'\.(jpg|jpeg|png|webp)', re.IGNORECASE)

DOMINIOS_SKIP = {
    'amazon.', 'amazonaws.', 'ebay.', 'aliexpress.', 'walmart.',
    'facebook.', 'instagram.', 'pinterest.', 'twitter.',
}


class ImgParser(HTMLParser):
    """Extrae URLs de imágenes del HTML de DuckDuckGo."""
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            d = dict(attrs)
            for attr in ('src', 'data-src', 'data-original'):
                url = d.get(attr, '')
                if url.startswith('http') and EXTENSIONES.search(url):
                    self.urls.append(url)


def limpiar_nombre(name: str) -> str:
    n = LIMPIAR.sub(' ', name)
    n = re.sub(r'[*#]+', '', n)
    return re.sub(r'\s+', ' ', n).strip()


def buscar_bing(query: str) -> list[str]:
    """Busca en Bing Images y devuelve lista de URLs de imágenes."""
    q = urllib.parse.quote_plus(query)
    url = f'https://www.bing.com/images/search?q={q}&form=HDRSC2&first=1'
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        urls = re.findall(r'murl&quot;:&quot;(https://[^&]+\.(?:jpg|jpeg|png))&quot;', html)
        if not urls:
            urls = re.findall(r'"murl":"(https://[^"]+\.(?:jpg|jpeg|png))"', html)
        return [u for u in urls if not any(d in u.lower() for d in DOMINIOS_SKIP)]
    except Exception:
        return []


def descargar(url: str, destino: str) -> bool:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            if len(content) < 2000:  # imagen demasiado pequeña = placeholder
                return False
            with open(destino, 'wb') as f:
                f.write(content)
        return True
    except Exception:
        return False


def nombre_destino(sku: str, url: str) -> str:
    ext = re.search(r'\.(jpg|jpeg|png|webp)', url, re.IGNORECASE)
    ext = ext.group(0).lower() if ext else '.jpg'
    ext = ext.replace('.jpeg', '.jpg')
    nombre = re.sub(r'[^\w\-]', '_', sku)
    return f"SKU_{nombre}{ext}"


def main():
    os.makedirs(IMGS_DIR, exist_ok=True)
    ya_tenemos = set(os.listdir(IMGS_DIR))

    with open(PRODUCTOS_JSON, encoding='utf-8') as f:
        productos = json.load(f)

    log = open(LOG_FILE, 'w', encoding='utf-8')

    ok = 0
    fallo = 0
    ya_tenia = 0
    total = len(productos)

    print(f"Buscando imágenes para {total} productos...\n")

    for i, p in enumerate(productos, 1):
        sku  = p['sku']
        name = p['name']

        # Verificar si ya la descargamos antes
        nombre_archivo = nombre_destino(sku, '.jpg')
        if nombre_archivo in ya_tenemos:
            ya_tenia += 1
            continue

        query = limpiar_nombre(name)
        urls  = buscar_bing(query)

        descargado = False
        for url in urls[:3]:  # intentar máximo 3 resultados
            destino = os.path.join(IMGS_DIR, nombre_destino(sku, url))
            if descargar(url, destino):
                log.write(f"OK\t{sku}\t{name[:50]}\t{url}\n")
                ya_tenemos.add(os.path.basename(destino))
                descargado = True
                ok += 1
                break

        if not descargado:
            log.write(f"FALLO\t{sku}\t{name[:50]}\t-\n")
            fallo += 1

        if i % 50 == 0:
            pct = i / total * 100
            print(f"[{i}/{total}] {pct:.0f}%  ✓ {ok}  ✗ {fallo}")

        time.sleep(DELAY)

    log.close()

    print(f"\n{'='*50}")
    print(f"COMPLETADO")
    print(f"  Encontradas : {ok}")
    print(f"  Sin imagen  : {fallo}")
    print(f"  Ya tenía    : {ya_tenia}")
    print(f"  Log         : {LOG_FILE}")
    print("="*50)


if __name__ == "__main__":
    main()
