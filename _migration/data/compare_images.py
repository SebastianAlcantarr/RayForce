import csv
import sys

file1 = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\woocommerce_DEFINITIVO (1).csv"
file2 = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\wc-product-export-7-5-2026-1778163630931.csv"

# Read file 1
images_f1 = {}
with open(file1, 'r', encoding='utf-8') as f:
    # Handle possible BOM
    if f.read(1) != '\ufeff':
        f.seek(0)
    reader = csv.DictReader(f)
    for row in reader:
        sku = row.get('SKU', '').strip()
        imgs = row.get('Images', '')
        if sku:
            img_list = [img.strip() for img in imgs.split(',') if img.strip()]
            images_f1[sku] = set(img_list)

# Read file 2
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

missing_images_per_sku = {}
total_missing = 0
dummy_diff_count = 0

for sku, imgs1 in images_f1.items():
    imgs2 = images_f2.get(sku, set())
    # images in f1 but not in f2
    diff = imgs1 - imgs2
    
    if diff:
        missing_images_per_sku[sku] = diff
        total_missing += len(diff)
        
        has_dummy_f2 = any('dummyimage' in img or '000000.png' in img for img in imgs2)
        has_real_f1 = any('dummyimage' not in img and '000000.png' not in img for img in diff)
        if has_dummy_f2 and has_real_f1:
            dummy_diff_count += 1

print(f"Total SKUs in File 1 (DEFINITIVO): {len(images_f1)}")
print(f"Total SKUs in File 2 (Export): {len(images_f2)}")
print(f"Total SKUs with missing images in File 2: {len(missing_images_per_sku)}")
print(f"Total missing images (present in File 1 but not in File 2): {total_missing}")
print(f"SKUs where File 1 has real image(s) but File 2 has dummy image: {dummy_diff_count}")

# Print first 5 for inspection
print("\nEjemplos:")
count = 0
for sku, diff in missing_images_per_sku.items():
    if count >= 5: break
    print(f"SKU {sku} tiene en F1 y no en F2: {diff}")
    count += 1
