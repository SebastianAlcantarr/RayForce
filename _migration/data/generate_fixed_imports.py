import csv

file_def = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\woocommerce_DEFINITIVO (1).csv"
file_exp = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\wc-product-export-7-5-2026-1778163630931.csv"
file_missing = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\missing_products_reimport.csv"
file_update = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\update_missing_images_simple.csv"

# Leer export actual
images_f2 = {}
with open(file_exp, 'r', encoding='utf-8') as f:
    if f.read(1) != '\ufeff':
        f.seek(0)
    reader = csv.DictReader(f)
    for row in reader:
        sku = row.get('SKU', '').strip()
        imgs = row.get('Imágenes', '')
        if sku:
            img_list = [img.strip() for img in imgs.split(',') if img.strip()]
            images_f2[sku] = set(img_list)

with open(file_def, 'r', encoding='utf-8') as f1, \
     open(file_missing, 'w', encoding='utf-8', newline='') as fmiss, \
     open(file_update, 'w', encoding='utf-8', newline='') as fupd:
    
    if f1.read(1) != '\ufeff':
        f1.seek(0)
    reader = csv.DictReader(f1)
    
    fieldnames = reader.fieldnames
    
    w_miss = csv.DictWriter(fmiss, fieldnames=fieldnames)
    w_miss.writeheader()
    
    w_upd = csv.DictWriter(fupd, fieldnames=fieldnames)
    w_upd.writeheader()
    
    count_missing = 0
    count_update = 0
    
    for row in reader:
        sku = row.get('SKU', '').strip()
        imgs = row.get('Images', '')
        
        if not sku:
            continue
            
        # FORZAR A PRODUCTO SIMPLE PARA EVITAR QUE DESAPAREZCAN
        row['Type'] = 'simple'
        if 'Parent' in row:
            row['Parent'] = ''
            
        img_list_f1 = set([img.strip() for img in imgs.split(',') if img.strip()])
        
        if sku not in images_f2:
            # Producto no existe en WooCommerce
            w_miss.writerow(row)
            count_missing += 1
        else:
            # Producto existe, chequear si hay pérdida de imágenes
            imgs2 = images_f2.get(sku, set())
            diff = img_list_f1 - imgs2
            if diff:
                w_upd.writerow(row)
                count_update += 1

print(f"Productos nuevos para crear: {count_missing} (guardados en {file_missing})")
print(f"Productos existentes para actualizar imágenes: {count_update} (guardados en {file_update})")
