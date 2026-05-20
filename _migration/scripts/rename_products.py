"""
rename_products.py
Renombrador LOCAL de productos de ferreteria.
No requiere API, no tiene cuotas, procesa todo al instante.

Genera:
  - woocommerce_nombres_mejorados.csv  (CSV completo con nuevos nombres)
  - woocommerce_cambios_nombres.csv    (Reporte: SKU | Anterior | Nuevo)
"""

import csv
import re
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

INPUT_CSV   = "woocommerce_estoyharto.csv"
OUTPUT_CSV  = "woocommerce_nombres_mejorados.csv"
CHANGES_CSV = "woocommerce_cambios_nombres.csv"

# ─────────────────────────────────────────────
# 1. TABLA DE CARACTERES CORRUPTOS (latin-1 mal decodificado)
# ─────────────────────────────────────────────
ENCODING_FIXES = [
    ("Ã¡", "á"), ("Ã©", "é"), ("Ã­", "í"), ("Ã³", "ó"), ("Ãº", "ú"),
    ("Ã ", "à"), ("Ã¨", "è"), ("Ã¬", "ì"), ("Ã²", "ò"), ("Ã¹", "ù"),
    ("Ã\x81", "Á"), ("Ã\x89", "É"), ("Ã\x8d", "Í"), ("Ã\x93", "Ó"), ("Ã\x9a", "Ú"),
    ("Ã±", "ñ"), ("Ã\x91", "Ñ"), ("Ãœ", "Ü"), ("Ã¼", "ü"),
    ("\u00e2\u0080\u0099", "'"), ("\u00e2\u0080\u009c", '"'), ("\u00e2\u0080\u009d", '"'),
    ("\u00e2\u0080\u0093", "-"), ("\u00e2\u0080\u0094", "-"),
    ("Â¡", "¡"), ("Â¿", "¿"), ("Â°", "°"), ("Â½", "½"), ("Â¼", "¼"), ("Â¾", "¾"),
    # Caracteres basura comunes
    ("â¨", ""), ("â ", ""), ("Â ", ""), ("â", ""),
    ("ã", ""), ("Ã", ""),
]

# ─────────────────────────────────────────────
# 2. DICCIONARIO DE ABREVIACIONES
#    (orden importa: mas largas primero)
# ─────────────────────────────────────────────
ABBR_WORD = {
    # Electricidad / motores
    "arranc":       "Arrancador",
    "arrancad":     "Arrancador",
    "3f":           "Trifásico",
    "monof":        "Monofásico",
    "bifas":        "Bifásico",
    "trifas":       "Trifásico",
    "bal":          "Balastro",
    "ele":          "Electrónico",
    "elec":         "Electrónico",
    "mag":          "Magnético",
    "interr":       "Interruptor",
    "apag":         "Apagador",
    "cont":         "Contacto",
    "cto":          "Contacto",
    "ctos":         "Contactos",
    "conec":        "Conector",
    "conect":       "Conector",
    "reg":          "Regulador",
    "term":         "Termostato",
    "temp":         "Temperatura",
    "prot":         "Protector",
    "bobina":       "Bobina",
    "transf":       "Transformador",
    "aut":          "Automático",
    "disj":         "Disyuntor",
    "interc":       "Intercambiador",
    "cap":          "Capacitor",

    # Iluminación
    "lamp":         "Lámpara",
    "lam":          "Lámpara",
    "plaf":         "Plafón",
    "portalamp":    "Portalámparas",
    "portalampara": "Portalámparas",
    "foco":         "Foco",
    "led":          "LED",
    "cfl":          "CFL",
    "tubo":         "Tubo",
    "refl":         "Reflector",
    "reflec":       "Reflector",
    "proy":         "Proyector",

    # Cables / cableado
    "cal":          "Calibre",
    "thw":          "THW",
    "thwls":        "THW-LS",
    "xlp":          "XLP",
    "drs":          "DRS",
    "utp":          "UTP",
    "cond":         "Conduit",
    "condu":        "Conduit",

    # Herramientas / ferretería
    "broc":         "Broca",
    "brocas":       "Brocas",
    "barr":         "Barreta",
    "mart":         "Martillo",
    "destorn":      "Destornillador",
    "desatorn":     "Desatornillador",
    "llav":         "Llave",
    "serr":         "Serrucho",
    "seguet":       "Segueta",
    "alcat":        "Alcatara",
    "esp":          "Espiga",
    "punta":        "Punta",
    "puntas":       "Puntas",
    "exten":        "Extensión",
    "ext":          "Extensión",
    "remat":        "Remache",
    "remac":        "Remache",
    "pij":          "Pija",
    "pijas":        "Pijas",
    "torn":         "Tornillo",
    "tornill":      "Tornillo",
    "tornillos":    "Tornillos",
    "clav":         "Clavo",
    "clavos":       "Clavos",
    "taq":          "Taquete",
    "taquetes":     "Taquetes",
    "aran":         "Arandela",
    "arand":        "Arandela",
    "arandelas":    "Arandelas",
    "abraz":        "Abrazadera",
    "cincho":       "Cincho",
    "cinchos":      "Cinchos",
    "mach":         "Macho",
    "hem":          "Hembra",
    "galv":         "Galvanizado",
    "galvan":       "Galvanizado",
    "acero inox":   "Acero Inoxidable",

    # Medidas / materiales
    "pulg":         "pulg.",
    "diám":         "Diámetro",
    "diam":         "Diámetro",
    "long":         "Longitud",
    "pvc":          "PVC",
    "ppr":          "PPR",
    "cpvc":         "CPVC",
    "hss":          "HSS",
    "hg":           "Hierro Galvanizado",
    "br":           "Bronce",
    "bronce":       "Bronce",
    "alumin":       "Aluminio",
    "al":           "Aluminio",
    "plast":        "Plástico",
    "poli":         "Policarbonato",

    # Canalización / cajas
    "caja cuad":    "Caja Cuadrada",
    "caja oct":     "Caja Octagonal",
    "chan":         "Chaflán",
    "cond":         "Conduit",
    "bandej":       "Bandeja",
    "canal":        "Canaleta",
    "unicanal":     "Unicanal",

    # Prefijos y sufijos comunes
    "p/":           "Para ",
    "c/":           "Con ",
    "s/":           "Sin ",
    "mang":         "Manguera",
    "adapt":        "Adaptador",
    "red":          "Reducción",
    "conex":        "Conexión",
    "acces":        "Accesorio",

    # Marcas
    "truper":       "Truper",
    "foset":        "Foset",
    "fiero":        "Fiero",
    "volteck":      "Volteck",
    "condumex":     "Condumex",
    "philips":      "Philips",
    "phillips":     "Phillips",
    "leviton":      "Leviton",
    "makita":       "Makita",
    "weg":          "WEG",
    "siemens":      "Siemens",
    "eaton":        "Eaton",
    "schneider":    "Schneider",
    "pretul":       "Pretul",
    "basic":        "Basic",
    "expert":       "Expert",
    "truclack":     "Trublack",
    "trugold":      "Trugold",
}

# Patrones de medidas y especificaciones a preservar sin cambios
KEEP_PATTERNS = [
    r'\d+[Ww]\b',           # 100W
    r'\d+[Vv]\b',           # 220V
    r'\d+[Aa]\b',           # 15A
    r'\d+[Hh][Pp]\b',       # 5HP
    r'\d+/\d+',             # 1/2", 3/4"
    r'\d+[Xx]\d+',          # 4x4
    r'[Tt]\d+',             # T8, T5
    r'[Cc]al\s*\d+',        # Cal 14
    r'\d+[Mm][Mm]\b',       # 10mm
    r'\d+[Cc][Mm]\b',       # 10cm
    r'\d+[Mm]\b',           # 4m
    r'[Gg]\d+',             # G13, G5
    r'[A-Z]{2,}-\d+',       # SDS-Plus, etc
]

# ─────────────────────────────────────────────
# 3. PALABRAS QUE SIEMPRE VAN EN MINÚSCULAS (artículos, preposiciones)
# ─────────────────────────────────────────────
LOWERCASE_WORDS = {
    "de", "del", "la", "las", "los", "el", "un", "una",
    "y", "o", "con", "sin", "para", "por", "en", "a",
    "al", "e", "u",
}

# ─────────────────────────────────────────────
# 4. PALABRAS QUE SIEMPRE VAN EN MAYÚSCULAS
# ─────────────────────────────────────────────
UPPERCASE_WORDS = {
    "led", "pvc", "ppr", "cpvc", "hss", "thw", "xlp",
    "drs", "utp", "hp", "weg", "id", "ph2",
    "sds", "cfl", "ip", "ip55", "ip65",
}

# ─────────────────────────────────────────────
# FUNCIONES
# ─────────────────────────────────────────────

def fix_encoding(text: str) -> str:
    """Corrige caracteres corruptos por decodificacion erronea."""
    for bad, good in ENCODING_FIXES:
        text = text.replace(bad, good)
    # Eliminar caracteres no imprimibles raros
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', '', text)
    return text.strip()


def smart_title_case(text: str) -> str:
    """
    Title case inteligente para español:
    - Primera palabra siempre en mayúscula.
    - Artículos/preposiciones en minúsculas.
    - Siglas y técnicos en mayúsculas.
    - Preserva números y medidas.
    """
    words = text.split()
    result = []
    for i, word in enumerate(words):
        w_lower = word.lower().rstrip('.,;:')
        w_upper = word.upper()
        # Siglas técnicas
        if w_lower in UPPERCASE_WORDS:
            result.append(w_upper)
        # Preposiciones/artículos (excepto primera palabra)
        elif w_lower in LOWERCASE_WORDS and i > 0:
            result.append(w_lower)
        # Números y medidas (sin cambiar)
        elif re.match(r'^\d', word):
            result.append(word)
        # El resto: primera letra mayúscula
        else:
            result.append(word[0].upper() + word[1:] if word else word)
    return ' '.join(result)


def expand_abbreviations(text: str) -> str:
    """Expande abreviaciones conocidas en el texto."""
    result = text

    # Abreviaciones de palabras completas (case-insensitive)
    for abbr, full in sorted(ABBR_WORD.items(), key=lambda x: -len(x[0])):
        # Buscar como palabra completa o parte del inicio de palabra
        pattern = re.compile(r'(?<![a-záéíóúñA-ZÁÉÍÓÚÑ])' + re.escape(abbr) + r'(?![a-záéíóúñ])', re.IGNORECASE)
        result = pattern.sub(full, result)

    return result


def clean_garbage(text: str) -> str:
    """Limpia caracteres basura, espacios multiples y puntuacion rara."""
    # Eliminar codigos de bodega al final (patrones tipo: A7b10000002569, 3rt2934-5an21)
    text = re.sub(r'\s+[A-Z][a-z]\w{8,}$', '', text)

    # Limpiar comillas dobles sueltas al final
    text = text.rstrip('"').strip()

    # Limpiar puntuacion repetida
    text = re.sub(r'[,;]\s*[,;]', ',', text)
    text = re.sub(r'\s{2,}', ' ', text)

    # Limpiar espacios antes de puntuacion
    text = re.sub(r'\s+([,\.\;\:])', r'\1', text)

    return text.strip()


def should_skip(text: str) -> bool:
    """Retorna True si el nombre ya esta bien escrito y no necesita cambio."""
    # Si es muy corto, siempre procesar
    if len(text) < 5:
        return False
    # Si tiene caracteres corruptos, procesar
    for bad, _ in ENCODING_FIXES:
        if bad in text:
            return False
    # Si empieza en minusculas, procesar
    if text[0].islower():
        return False
    return False  # Siempre procesar para uniformidad


def rename(original: str) -> str:
    """Pipeline completo de renombrado para un producto."""
    name = original

    # Paso 1: Corregir encoding
    name = fix_encoding(name)

    # Paso 2: Limpiar basura
    name = clean_garbage(name)

    # Paso 3: Expandir abreviaciones
    name = expand_abbreviations(name)

    # Paso 4: Limpiar de nuevo por si las expansiones generaron espacios extra
    name = re.sub(r'\s{2,}', ' ', name).strip()

    # Paso 5: Title Case inteligente
    name = smart_title_case(name)

    # Paso 6: Truncar a 80 chars si es muy largo
    if len(name) > 80:
        name = name[:77].rsplit(' ', 1)[0] + '...'

    return name if name else original


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

def main():
    print(f"Leyendo {INPUT_CSV}...")
    with open(INPUT_CSV, 'r', encoding='utf-8', errors='ignore') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        all_rows = list(reader)

    sku_col = next((k for k in fieldnames if 'SKU' in k.upper()), 'SKU')
    print(f"Total filas: {len(all_rows)}")

    name_map = {}
    changes  = []

    for row in all_rows:
        row_type = row.get('Type', '').lower()
        original = row.get('Name', '').strip()
        sku = row.get(sku_col, '').strip()

        if not original or not sku:
            continue

        new_name = rename(original)

        name_map[sku] = new_name

        if new_name != original:
            changes.append({'SKU': sku, 'Anterior': original, 'Nuevo': new_name})

    print(f"Nombres procesados: {len(name_map)}")
    print(f"Nombres modificados: {len(changes)}")

    # Guardar CSV mejorado
    print(f"Guardando {OUTPUT_CSV}...")
    with open(OUTPUT_CSV, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in all_rows:
            sku = row.get(sku_col, '').strip()
            if sku in name_map:
                row['Name'] = name_map[sku]
            writer.writerow(row)

    # Guardar reporte de cambios
    print(f"Guardando {CHANGES_CSV}...")
    with open(CHANGES_CSV, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['SKU', 'Anterior', 'Nuevo'])
        writer.writeheader()
        writer.writerows(changes)

    print(f"\n{'='*50}")
    print(f"COMPLETADO")
    print(f"  Productos procesados : {len(name_map)}")
    print(f"  Nombres mejorados    : {len(changes)}")
    print(f"  CSV actualizado      : {OUTPUT_CSV}")
    print(f"  Reporte de cambios   : {CHANGES_CSV}")
    print(f"{'='*50}")

    # Mostrar 10 ejemplos de cambios
    if changes:
        print("\nEjemplos de cambios realizados:")
        for c in changes[:10]:
            print(f"  [{c['SKU']}]")
            print(f"    Antes : {c['Anterior']}")
            print(f"    Ahora : {c['Nuevo']}")
            print()


if __name__ == '__main__':
    main()
