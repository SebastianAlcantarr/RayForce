import csv

input_file = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\FINAL_IMPORT_WOOCOMMERCE.csv"
output_file = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\failed_products_retry.csv"

bad_domains = ['electricaseis.com.mx', 'se.com']
dummy_url = 'https://dummyimage.com/600x600/cccccc/000000.png'

with open(input_file, 'r', encoding='utf-8') as fin, open(output_file, 'w', encoding='utf-8', newline='') as fout:
    reader = csv.DictReader(fin)
    
    writer = csv.DictWriter(fout, fieldnames=reader.fieldnames)
    writer.writeheader()
    
    count = 0
    for row in reader:
        imgs = row.get('Images', '')
        if any(d in imgs for d in bad_domains):
            # Replace the bad URL with the dummy image
            row['Images'] = dummy_url
            writer.writerow(row)
            count += 1

print(f"Generated {output_file} with {count} products.")
