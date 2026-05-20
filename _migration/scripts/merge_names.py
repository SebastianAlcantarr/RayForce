"""
merge_names.py
Une los nombres del Excel (prioridad) con el CSV original.
"""
import csv
import openpyxl

EXCEL_FILE  = "nombres_productos_mejorados.xlsx"
INPUT_CSV   = "woocommerce_estoyharto.csv"
OUTPUT_CSV  = "woocommerce_nombres_mejorados.csv"
CHANGES_CSV = "woocommerce_cambios_nombres.csv"

# 1. Cargar Excel (nombres mejorados a mano)
wb = openpyxl.load_workbook(EXCEL_FILE)
ws = wb.active
rows = list(ws.iter_rows(values_only=True))

excel_map = {}
for r in rows[1:]:
    sku      = str(r[0]).strip() if r[0] else ""
    original = str(r[1]).strip() if r[1] else ""
    improved = str(r[2]).strip() if r[2] else ""
    if sku and improved and improved != original:
        excel_map[sku] = improved

print(f"Excel: {len(excel_map)} nombres mejorados cargados")

# 2. Leer CSV original con utf-8-sig (elimina BOM si existe)
with open(INPUT_CSV, "r", encoding="utf-8-sig", errors="ignore") as f:
    reader    = csv.DictReader(f)
    fieldnames = reader.fieldnames
    all_rows  = list(reader)

sku_col = next((k for k in fieldnames if "SKU" in k.upper()), None)
print(f"Columna SKU: [{sku_col}]")
print(f"Total filas: {len(all_rows)}")

# 3. Aplicar mejoras del Excel sobre el CSV original
changes = []
count   = 0

for row in all_rows:
    sku           = row.get(sku_col, "").strip()
    original_name = row.get("Name", "").strip()

    if sku in excel_map:
        new_name = excel_map[sku]
        if new_name != original_name:
            row["Name"] = new_name
            changes.append({"SKU": sku, "Anterior": original_name, "Nuevo": new_name})
            count += 1

print(f"Nombres actualizados: {count}")

# 4. Guardar CSV final
with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(all_rows)

# 5. Guardar reporte de cambios
with open(CHANGES_CSV, "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["SKU", "Anterior", "Nuevo"])
    writer.writeheader()
    writer.writerows(changes)

print()
print("Ejemplos de cambios:")
for c in changes[:8]:
    print(f"  [{c['SKU']}]")
    print(f"    Antes : {c['Anterior']}")
    print(f"    Ahora : {c['Nuevo']}")

print()
print("=" * 50)
print(f"COMPLETADO: {count} nombres mejorados")
print(f"  CSV final        : {OUTPUT_CSV}")
print(f"  Reporte cambios  : {CHANGES_CSV}")
print("=" * 50)
