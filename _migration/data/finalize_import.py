import csv

file_def = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\woocommerce_DEFINITIVO (1).csv"
file_ready = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\woocommerce_import_ready.csv"
file_out = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\FINAL_IMPORT_WOOCOMMERCE.csv"

# Helper to check if image is dummy
def is_dummy(img_str):
    if not img_str: return True
    return 'dummyimage.com' in img_str or '000000.png' in img_str

# 1. Load images from DEFINITIVO
def_images = {}
with open(file_def, 'r', encoding='utf-8') as f:
    if f.read(1) != '\ufeff': f.seek(0)
    reader = csv.DictReader(f)
    for row in reader:
        sku = row.get('SKU', '').strip()
        imgs = row.get('Images', '').strip()
        if sku and imgs and not is_dummy(imgs):
            def_images[sku] = imgs

# 2. Process import_ready and generate final file
stats = {
    'total': 0,
    'injected_from_def': 0,
    'assigned_dummy': 0,
    'kept_existing': 0,
    'fixed_type': 0
}

with open(file_ready, 'r', encoding='utf-8') as fin, open(file_out, 'w', encoding='utf-8', newline='') as fout:
    if fin.read(1) != '\ufeff': fin.seek(0)
    reader = csv.DictReader(fin)
    
    writer = csv.DictWriter(fout, fieldnames=reader.fieldnames)
    writer.writeheader()
    
    for row in reader:
        sku = row.get('SKU', '').strip()
        if not sku:
            continue # Omit rows without SKU (invalid for WooCommerce)
            
        stats['total'] += 1
        
        # Check Type and Parent to ensure flat catalog
        if row.get('Type') != 'simple':
            row['Type'] = 'simple'
            stats['fixed_type'] += 1
            
        if 'Parent' in row and row['Parent']:
            row['Parent'] = ''
            
        # Image logic
        current_img = row.get('Images', '').strip()
        
        if sku in def_images:
            if current_img != def_images[sku]:
                row['Images'] = def_images[sku]
                stats['injected_from_def'] += 1
            else:
                stats['kept_existing'] += 1
        else:
            if is_dummy(current_img) or not current_img:
                row['Images'] = 'https://dummyimage.com/600x600/cccccc/000000.png'
                # Count as assigned_dummy only if it wasn't exactly that string before
                if current_img != 'https://dummyimage.com/600x600/cccccc/000000.png':
                    stats['assigned_dummy'] += 1
                else:
                    stats['kept_existing'] += 1
            else:
                stats['kept_existing'] += 1
                
        writer.writerow(row)

print("--- REPORTE FINAL ---")
print(f"Total de productos válidos listos para importar: {stats['total']}")
print(f"Imágenes recuperadas del DEFINITIVO: {stats['injected_from_def']}")
print(f"Imágenes dummy asignadas a productos vacíos: {stats['assigned_dummy']}")
print(f"Productos que conservaron su imagen actual: {stats['kept_existing']}")
if stats['fixed_type'] > 0:
    print(f"Productos corregidos a tipo 'simple': {stats['fixed_type']}")
print(f"\nArchivo maestro generado: {file_out}")
print("Def_images cargadas:", len(def_images))
