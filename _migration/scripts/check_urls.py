import csv
target_skus = ['45557','45556','57061','57056','13995','12579','COCR0001','COCR0002','HDL36050','EGB14020']
with open('woocommerce_FINAL.csv', 'r', encoding='utf-8-sig', errors='ignore') as f:
    reader = csv.DictReader(f)
    for row in reader:
        sku = row.get('SKU','').strip()
        if sku in target_skus:
            print(f"SKU={sku} | IMG={row.get('Images','')}")
