"""
fix_and_merge.py
Pipeline completo:
  1. Corrige encoding corrupto en TODOS los productos
  2. Aplica encima los nombres manuales del Excel (prioridad maxima)
Genera:
  - woocommerce_nombres_mejorados.csv
  - woocommerce_cambios_nombres.csv
"""
import csv
import openpyxl
import re

INPUT_CSV   = "woocommerce_estoyharto.csv"
EXCEL_FILE  = "nombres_productos_mejorados.xlsx"
OUTPUT_CSV  = "woocommerce_nombres_mejorados.csv"
CHANGES_CSV = "woocommerce_cambios_nombres.csv"

# ─────────────────────────────────────────────
# TABLA DE CORRECCIONES DE ENCODING
# (caracteres UTF-8 mal decodificados como Latin-1)
# ─────────────────────────────────────────────
FIXES = [
    ("Ã¡", "á"), ("Ã©", "é"), ("Ã­", "í"), ("Ã³", "ó"), ("Ãº", "ú"),
    ("Ã ", "à"), ("Ã¨", "è"), ("Ã¬", "ì"), ("Ã²", "ò"), ("Ã¹", "ù"),
    ("Ã\x81", "Á"), ("Ã\x89", "É"), ("Ã\x8d", "Í"), ("Ã\x93", "Ó"), ("Ã\x9a", "Ú"),
    ("Ã±", "ñ"), ("Ã\x91", "Ñ"), ("Ãœ", "Ü"), ("Ã¼", "ü"),
    ("\u00e2\u0080\u0099", "'"),
    ("\u00e2\u0080\u009c", '"'),
    ("\u00e2\u0080\u009d", '"'),
    ("\u00e2\u0080\u0093", "-"),
    ("\u00e2\u0080\u0094", "-"),
    ("Â¡", "¡"), ("Â¿", "¿"), ("Â°", "°"),
    ("Â½", "½"), ("Â¼", "¼"), ("Â¾", "¾"),
    # Basura sin significado
    ("â¨", ""), ("â ", ""), ("Â ", ""), ("ã", ""),
    # Patrones tipo "Ã," que no mapean a nada util
    ("Ã,", ""), ("Ã.", ""),
]


def fix_encoding(text: str) -> str:
    """Corrige caracteres corruptos en un texto."""
    for bad, good in FIXES:
        text = text.replace(bad, good)
    # Eliminar caracteres de control invisibles
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)
    return text.strip()


def main():
    # ── 1. Cargar nombres manuales del Excel ──────────────────────────────
    print(f"Leyendo {EXCEL_FILE}...")
    wb = openpyxl.load_workbook(EXCEL_FILE)
    ws = wb.active
    excel_rows = list(ws.iter_rows(values_only=True))

    excel_map = {}
    for r in excel_rows[1:]:
        sku  = str(r[0]).strip() if r[0] else ""
        orig = str(r[1]).strip() if r[1] else ""
        imp  = str(r[2]).strip() if r[2] else ""
        # Solo guardar si hay cambio real respecto al original
        if sku and imp and imp != orig:
            excel_map[sku] = imp

    print(f"  -> {len(excel_map)} nombres manuales cargados del Excel")

    # ── 2. Leer CSV original ───────────────────────────────────────────────
    print(f"Leyendo {INPUT_CSV}...")
    with open(INPUT_CSV, "r", encoding="utf-8-sig", errors="ignore") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        all_rows = list(reader)

    sku_col = next((k for k in fieldnames if "SKU" in k.upper()), "SKU")
    print(f"  -> {len(all_rows)} filas | Columna SKU: [{sku_col}]")

    # ── 3. Pipeline: fix encoding + aplicar Excel ─────────────────────────
    changes     = []
    enc_count   = 0
    excel_count = 0

    for row in all_rows:
        sku           = row.get(sku_col, "").strip()
        original_name = row.get("Name", "").strip()

        # Paso A: Corregir encoding en Name y Description
        for field in ["Name", "Description"]:
            if row.get(field):
                row[field] = fix_encoding(row[field])

        name_fixed = row.get("Name", "").strip()

        # Paso B: Si el Excel tiene un nombre para este SKU, ese tiene prioridad
        if sku in excel_map:
            final_name = excel_map[sku]
            row["Name"] = final_name
            if final_name != original_name:
                changes.append({
                    "SKU": sku,
                    "Anterior": original_name,
                    "Nuevo": final_name,
                    "Fuente": "Excel"
                })
                excel_count += 1
        elif name_fixed != original_name:
            # Solo fix de encoding
            changes.append({
                "SKU": sku,
                "Anterior": original_name,
                "Nuevo": name_fixed,
                "Fuente": "EncodingFix"
            })
            enc_count += 1

    print(f"  -> Encoding fixes: {enc_count} productos")
    print(f"  -> Nombres del Excel: {excel_count} productos")
    print(f"  -> Total cambios: {len(changes)}")

    # ── 4. Guardar CSV final ───────────────────────────────────────────────
    print(f"Guardando {OUTPUT_CSV}...")
    # utf-8-sig = UTF-8 con BOM: hace que Excel muestre acentos y ñ correctamente
    with open(OUTPUT_CSV, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_rows)

    # ── 5. Guardar reporte de cambios ─────────────────────────────────────
    print(f"Guardando {CHANGES_CSV}...")
    with open(CHANGES_CSV, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["SKU", "Anterior", "Nuevo", "Fuente"])
        writer.writeheader()
        writer.writerows(changes)

    # ── 6. Mostrar ejemplos ───────────────────────────────────────────────
    print()
    print("Ejemplos de nombres corregidos:")
    shown = 0
    for c in changes:
        if shown >= 8:
            break
        print(f"  [{c['SKU']}] ({c['Fuente']})")
        print(f"    Antes : {c['Anterior']}")
        print(f"    Ahora : {c['Nuevo']}")
        shown += 1

    print()
    print("=" * 55)
    print("COMPLETADO")
    print(f"  Encoding fixes aplicados : {enc_count}")
    print(f"  Nombres del Excel        : {excel_count}")
    print(f"  Total mejorados          : {len(changes)}")
    print(f"  CSV listo para WooCommerce: {OUTPUT_CSV}")
    print("=" * 55)


if __name__ == "__main__":
    main()
