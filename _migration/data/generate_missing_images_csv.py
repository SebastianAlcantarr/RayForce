import csv

file1 = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\woocommerce_DEFINITIVO (1).csv"
file2 = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\wc-product-export-7-5-2026-1778163630931.csv"
output_file = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\update_missing_images.csv"

# Leer imágenes del archivo exportado (F2)
images_f2 = {}
with open(file2, 'r', encoding='utf-8') as f:
    if f.read(1) != '\ufeff':
        f.seek(0)
    reader = csv.DictReader(f)
    for row in reader:
        sku = row.get('SKU', '').strip()
        imgs = row.get('Imágenes', '')
        if sku:
            img_list = [img.strip() for img in imgs.split(',') if img.strip()]
            images_f2[sku] = set(img_list)

# Leer archivo definitivo y escribir filas afectadas
with open(file1, 'r', encoding='utf-8') as f1, open(output_file, 'w', encoding='utf-8', newline='') as fout:
    if f1.read(1) != '\ufeff':
        f1.seek(0)
    reader = csv.DictReader(f1)
    
    # Escribimos toda la fila original del DEFINITIVO
    fieldnames = reader.fieldnames
    writer = csv.DictWriter(fout, fieldnames=fieldnames)
    writer.writeheader()
    
    count = 0
    for row in reader:
        sku = row.get('SKU', '').strip()
        imgs = row.get('Images', '')
        
        if not sku:
            continue
            
        img_list_f1 = set([img.strip() for img in imgs.split(',') if img.strip()])
        imgs2 = images_f2.get(sku, set())
        
        # Si hay imágenes en F1 que no están en F2, hay pérdida/diferencia
        diff = img_list_f1 - imgs2
        
        if diff:
            writer.writerow(row)
            count += 1

print(f"Se ha generado exitosamente: {output_file}")
print(f"Total de productos (SKUs) agregados al archivo de actualización: {count}")
