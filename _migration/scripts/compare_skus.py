"""
compare_skus.py - Compara SKUs entre la lista oficial (.xls) y el CSV final.
Solo lectura, no modifica nada.
"""
import csv
import xlrd

LISTA_XLS = "Lista de precios de venta-categoria.xls"
FINAL_CSV = "woocommerce_FINAL.csv"
REPORT    = "reporte_comparacion_skus.txt"

# ── 1. Leer SKUs del XLS (lista oficial) ─────────────────────────────────────
print(f"Leyendo {LISTA_XLS}...")
wb = xlrd.open_workbook(LISTA_XLS)
ws = wb.sheet_by_index(0)

# Datos desde fila 7 (índice 6), columna 0 = Código
lista_skus = set()
lista_rows = {}   # sku -> nombre en la lista

for i in range(6, ws.nrows):
    raw = ws.cell_value(i, 0)
    nombre = str(ws.cell_value(i, 1)).strip().lstrip("'")
    # El SKU puede ser número flotante (e.g. 40069.0) o texto
    if isinstance(raw, float):
        # Convertir 40069.0 -> "40069"
        sku = str(int(raw))
    else:
        sku = str(raw).strip()
    if sku:
        lista_skus.add(sku)
        lista_rows[sku] = nombre

print(f"  -> {len(lista_skus)} SKUs únicos en la lista oficial")

# ── 2. Leer SKUs del CSV final ────────────────────────────────────────────────
print(f"Leyendo {FINAL_CSV}...")
csv_skus    = set()
csv_rows    = {}   # sku -> nombre en el csv
csv_types   = {}   # sku -> type (simple/variable/variation)

with open(FINAL_CSV, "r", encoding="utf-8-sig", errors="ignore") as f:
    for row in csv.DictReader(f):
        sku  = row.get("SKU", "").strip()
        name = row.get("Name", "").strip()
        typ  = row.get("Type", "").strip().lower()
        if sku:
            csv_skus.add(sku)
            csv_rows[sku] = name
            csv_types[sku] = typ

print(f"  -> {len(csv_skus)} SKUs únicos en woocommerce_FINAL.csv")

# ── 3. Comparación ────────────────────────────────────────────────────────────

# SKUs que están en la lista oficial pero NO en el CSV
en_lista_no_csv = sorted(lista_skus - csv_skus)

# SKUs que están en el CSV pero NO en la lista oficial
en_csv_no_lista = sorted(csv_skus - lista_skus)

# SKUs que coinciden
coinciden = lista_skus & csv_skus

print()
print("=" * 60)
print("RESULTADO DE COMPARACIÓN")
print("=" * 60)
print(f"  SKUs en lista oficial          : {len(lista_skus)}")
print(f"  SKUs en woocommerce_FINAL.csv  : {len(csv_skus)}")
print(f"  OK Coinciden                   : {len(coinciden)}")
print(f"  FALTA En lista pero NO en CSV  : {len(en_lista_no_csv)}")
print(f"  EXTRA En CSV pero NO en lista  : {len(en_csv_no_lista)}")
print("=" * 60)

# ── 4. Generar reporte detallado en archivo TXT ───────────────────────────────
lines = []
lines.append("=" * 70)
lines.append("REPORTE COMPARACIÓN DE SKUs")
lines.append(f"Lista oficial: {LISTA_XLS}  ({len(lista_skus)} SKUs)")
lines.append(f"CSV final    : {FINAL_CSV}  ({len(csv_skus)} SKUs)")
lines.append("=" * 70)
lines.append(f"\nCOINCIDENCIAS: {len(coinciden)} SKUs estan en ambos archivos")
lines.append(f"\nEN LISTA PERO NO EN CSV ({len(en_lista_no_csv)} productos):")
lines.append("   Estos productos existen en la lista oficial pero faltan en el CSV final:")
lines.append(f"   {'SKU':<20} {'Nombre en lista'}")
lines.append(f"   {'-'*20} {'-'*40}")
for sku in en_lista_no_csv:
    lines.append(f"   {sku:<20} {lista_rows.get(sku,'')[:50]}")

lines.append(f"\nEN CSV PERO NO EN LISTA ({len(en_csv_no_lista)} productos):")
lines.append("   Estos SKUs están en el CSV pero NO aparecen en la lista oficial:")
lines.append("   (pueden ser variaciones -BASE, o productos eliminados)")
lines.append(f"   {'SKU':<25} {'Type':<12} {'Nombre en CSV'}")
lines.append(f"   {'-'*25} {'-'*12} {'-'*35}")
for sku in en_csv_no_lista:
    t = csv_types.get(sku, "")
    n = csv_rows.get(sku, "")[:40]
    lines.append(f"   {sku:<25} {t:<12} {n}")

with open(REPORT, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"\nReporte detallado guardado en: {REPORT}")

# ── 5. Mostrar preview ───────────────────────────────────────────────────────
if en_lista_no_csv:
    print(f"\nPrimeros 20 SKUs en lista oficial que FALTAN en el CSV:")
    for sku in en_lista_no_csv[:20]:
        print(f"   {sku:<20} {lista_rows.get(sku,'')[:50]}")

if en_csv_no_lista:
    # Separar los que son variaciones -BASE (normales en WooCommerce) de los raros
    bases     = [s for s in en_csv_no_lista if s.endswith("-BASE")]
    no_bases  = [s for s in en_csv_no_lista if not s.endswith("-BASE")]
    print(f"\nSKUs en CSV pero NO en lista (excluye {len(bases)} variantes -BASE):")
    for sku in no_bases[:20]:
        t = csv_types.get(sku, "")
        print(f"   {sku:<25} [{t}] {csv_rows.get(sku,'')[:40]}")
    if len(no_bases) > 20:
        print(f"   ... y {len(no_bases)-20} mas (ver {REPORT})")
