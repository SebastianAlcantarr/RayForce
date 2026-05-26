import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';

const filePath = 'c:\\Users\\lanfa\\.gemini\\antigravity\\scratch\\Rayforce\\RayForce\\_migration\\data\\Existencias por almacen 25052026.xls';
if (!fs.existsSync(filePath)) {
  console.error("File not found:", filePath);
  process.exit(1);
}

const fileBuffer = fs.readFileSync(filePath);
const wb = XLSX.read(fileBuffer, { type: 'buffer' });
console.log("SheetNames:", wb.SheetNames);
const ws = wb.Sheets[wb.SheetNames[0]];

const allRows = XLSX.utils.sheet_to_json(ws, { defval: '', header: 1 });
console.log("First 25 rows:");
for (let i = 0; i < Math.min(25, allRows.length); i++) {
  console.log(`Row ${i}:`, allRows[i]);
}
console.log("Total rows in sheet:", allRows.length);
