"""
Script para llenar imágenes faltantes en woocommerce_final.csv
Uso:
  1. Pon el CSV en la misma carpeta con el nombre: woocommerce_final.csv
  2. Corre:  python3 buscar_imagenes.py
  3. Al terminar genera: woocommerce_final_con_imagenes.csv

- Guarda progreso en progreso_imagenes.json, puedes pausar y retomar.
- Tiempo estimado: ~45-60 min para 1612 productos.
"""

import csv, requests, re, time, json, os
from bs4 import BeautifulSoup
import urllib.parse

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'es-MX,es;q=0.9',
}
DELAY = 0.5

# Archivos — ajusta las rutas si es necesario
CSV_ENTRADA  = 'woocommerce_final.csv'
CSV_SALIDA   = 'woocommerce_final_con_imagenes.csv'
PROGRESO_FILE = 'progreso_imagenes.json'


# ─────────────────────────────────────────────
# Funciones de búsqueda
# ─────────────────────────────────────────────

def buscar_truper(sku):
    try:
        r = requests.get(
            f"https://www.truper.com/catalogsearch/result/?q={sku}",
            headers=HEADERS, timeout=10)
        if r.status_code != 200:
            return None
        soup = BeautifulSoup(r.text, 'html.parser')
        for img in soup.find_all('img', src=True):
            if 'truper.com/media/product/' in img['src']:
                return img['src']
    except:
        pass
    return None


def buscar_urrea(sku):
    try:
        r = requests.get(
            f"https://urrea.com/catalogsearch/result/?q={sku}",
            headers=HEADERS, timeout=10)
        if r.status_code != 200:
            return None
        soup = BeautifulSoup(r.text, 'html.parser')
        for img in soup.find_all('img', src=True):
            if 'urrea.com/media/catalog/product' in img['src']:
                return img['src']
    except:
        pass
    return None


def construir_query_ddg(nombre):
    nombre_lower = nombre.lower()
    nombre_limpio = nombre.replace('*', '').strip()
    if any(x in nombre_lower for x in ['bfco', 'bcxml', 'bcxmf', 'bcxmr', 'reele',
                                        'bloco', 'fixacao', 'botonera', 'banco de cap',
                                        'itm ', 'dwb', 'cwc', 'cwm']):
        return f"WEG {nombre_limpio} producto imagen"
    elif any(x in nombre_lower for x in ['led', 'luminaria', 'foco', 'lampara', 'reflector',
                                          'plafon', 'vial', 'poste']):
        return f"{nombre_limpio} luminaria imagen producto"
    elif any(x in nombre_lower for x in ['broca', 'llave', 'pinza', 'herramienta',
                                          'flexometro', 'espatula']):
        return f"{nombre_limpio} herramienta producto"
    else:
        return f"{nombre_limpio} ferreteria producto"


def buscar_ddg(sku, nombre):
    query = construir_query_ddg(nombre)
    try:
        r = requests.get(
            "https://duckduckgo.com/",
            params={"q": query, "iax": "images", "ia": "images"},
            headers=HEADERS, timeout=10)
        vqd_match = re.search(r'vqd=(["\'])([^"\']+)\1', r.text)
        if not vqd_match:
            return None
        vqd = vqd_match.group(2)
        time.sleep(0.3)
        r2 = requests.get(
            "https://duckduckgo.com/i.js",
            params={"q": query, "vqd": vqd, "f": ",,,,,", "p": "1"},
            headers={**HEADERS, "Referer": "https://duckduckgo.com/"},
            timeout=10)
        if r2.status_code == 200:
            data = r2.json()
            results = data.get("results", [])
            if results:
                return results[0].get("image")
    except:
        pass
    return None


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────

# Cargar progreso previo (permite pausar y retomar)
progreso = {}
if os.path.exists(PROGRESO_FILE):
    with open(PROGRESO_FILE) as f:
        progreso = json.load(f)
    print(f"Retomando: {len(progreso)} productos ya procesados")

# Leer CSV
todos = []
with open(CSV_ENTRADA, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    for row in reader:
        todos.append(dict(row))

sin_imagen = [p for p in todos if not p.get('Images', '').strip() and p['SKU'] not in progreso]
total_pendientes = len(sin_imagen)
print(f"Productos sin imagen pendientes: {total_pendientes}")
print(f"Tiempo estimado: ~{total_pendientes * 2 // 60} minutos\n")

fuentes = {'truper': 0, 'urrea': 0, 'ddg': 0, 'nada': 0}

try:
    for i, p in enumerate(sin_imagen):
        sku, nombre = p['SKU'], p['Name']
        img, fuente = None, None

        img = buscar_truper(sku)
        if img:
            fuente = 'truper'
        time.sleep(DELAY)

        if not img:
            img = buscar_urrea(sku)
            if img:
                fuente = 'urrea'
            time.sleep(DELAY)

        if not img:
            img = buscar_ddg(sku, nombre)
            if img:
                fuente = 'ddg'
            time.sleep(DELAY)

        progreso[sku] = img or ''
        fuentes[fuente or 'nada'] += 1

        estado = '✓' if img else '✗'
        procesados = len(progreso)
        print(f"{estado} [{procesados:4d}/{total_pendientes + len(progreso) - total_pendientes + i + 1}] "
              f"{sku:<15} [{fuente or '-':6}] {nombre[:45]}")

        # Guardar progreso cada 20 productos
        if (i + 1) % 20 == 0:
            with open(PROGRESO_FILE, 'w') as f:
                json.dump(progreso, f)

        time.sleep(DELAY)

except KeyboardInterrupt:
    print("\n\nPausado. Guardando progreso...")

# Guardar progreso final
with open(PROGRESO_FILE, 'w') as f:
    json.dump(progreso, f)

con_img = sum(1 for v in progreso.values() if v)
print(f"\n{'='*55}")
print(f"Procesados: {len(progreso)} | Con imagen: {con_img} | Sin imagen: {len(progreso)-con_img}")
print(f"Por fuente: {fuentes}")

# ─────────────────────────────────────────────
# Generar CSV de salida
# ─────────────────────────────────────────────
print(f"\nGenerando {CSV_SALIDA}...")

with open(CSV_ENTRADA, newline='', encoding='utf-8') as fin, \
     open(CSV_SALIDA, 'w', newline='', encoding='utf-8') as fout:
    reader = csv.DictReader(fin)
    writer = csv.DictWriter(fout, fieldnames=reader.fieldnames)
    writer.writeheader()
    for row in reader:
        if not row.get('Images', '').strip() and row['SKU'] in progreso and progreso[row['SKU']]:
            row['Images'] = progreso[row['SKU']]
        writer.writerow(row)

print(f"Listo! Archivo generado: {CSV_SALIDA}")
