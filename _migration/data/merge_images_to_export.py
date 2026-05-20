import csv

file_def = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\woocommerce_DEFINITIVO (1).csv"
file_exp = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\wc-product-export-7-5-2026-1778163630931.csv"
file_out = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\wc-product-export-FINAL-WITH-IMAGES.csv"

# 1. Cargar las imágenes correctas desde el DEFINITIVO
def_images = {}
with open(file_def, 'r', encoding='utf-8') as f:
    if f.read(1) != '\ufeff': f.seek(0)
    reader = csv.DictReader(f)
    for row in reader:
        sku = row.get('SKU', '').strip()
        imgs = row.get('Images', '').strip()
        if sku and imgs:
            def_images[sku] = imgs

# 2. Leer el Export (que tiene los nombres y estado correcto) y reemplazar las imágenes
with open(file_exp, 'r', encoding='utf-8') as fin, open(file_out, 'w', encoding='utf-8', newline='') as fout:
    if fin.read(1) != '\ufeff': fin.seek(0)
    reader = csv.DictReader(fin)
    
    # Escribir con las mismas columnas exactas del export
    writer = csv.DictWriter(fout, fieldnames=reader.fieldnames)
    writer.writeheader()
    
    updated_count = 0
    total_count = 0
    
    for row in reader:
        total_count += 1
        sku = row.get('SKU', '').strip()
        
        # Si existe el SKU en el definitivo, le inyectamos sus imágenes
        if sku in def_images:
            old_imgs = row.get('Imágenes', '')
            new_imgs = def_images[sku]
            
            # Reemplazamos si son diferentes (esto borra los dummy y pone los reales)
            if old_imgs != new_imgs:
                row['Imágenes'] = new_imgs
                updated_count += 1
                
        writer.writerow(row)

print(f"Archivo generado: {file_out}")
print(f"Total de productos en el export: {total_count}")
print(f"Productos a los que se les inyecto la imagen del DEFINITIVO: {updated_count}")
