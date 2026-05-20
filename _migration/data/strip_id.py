import csv

input_file = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\wc-product-export-FINAL-WITH-IMAGES.csv"
output_file = r"c:\Users\lanfa\.gemini\antigravity\scratch\Rayforce\RayForce\_migration\data\wc-product-export-CLEAN-IMPORT.csv"

with open(input_file, 'r', encoding='utf-8') as fin, open(output_file, 'w', encoding='utf-8', newline='') as fout:
    reader = csv.DictReader(fin)
    
    # Remove 'ID' from fieldnames
    fieldnames = [f for f in reader.fieldnames if f != 'ID']
    
    writer = csv.DictWriter(fout, fieldnames=fieldnames)
    writer.writeheader()
    
    for row in reader:
        # Forzar a producto simple por si acaso el export tenia variaciones guardadas
        if 'Tipo' in row:
            row['Tipo'] = 'simple'
            
        if 'ID' in row:
            del row['ID']
            
        writer.writerow(row)

print("Archivo listo para importacion limpia:", output_file)
