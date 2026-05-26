import fs from 'node:fs';
import path from 'node:path';

// 1. Cargar y parsear .env
const envPath = path.resolve(process.cwd(), '.env');
const content = fs.readFileSync(envPath, 'utf-8');
const env = {};
for (const line of content.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
  const [k, ...rest] = trimmed.split('=');
  env[k.trim()] = rest.join('=').trim();
}

const wooUrl = env.WOO_URL || '';
const wooKey = env.WOO_KEY || '';
const wooSecret = env.WOO_SECRET || '';

const baseUrl = `${wooUrl.replace(/\/+$/, '')}/wp-json/wc/v3`;
const authHeader = `Basic ${Buffer.from(`${wooKey}:${wooSecret}`).toString('base64')}`;

async function apiRequest(endpoint) {
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error(`Error ${response.status}`);
  return response.json();
}

async function main() {
  console.log("Comenzando prueba de mapeo...");
  const startTime = Date.now();
  
  let page = 1;
  let hasMore = true;
  let totalProducts = 0;
  let simpleCount = 0;
  let variableCount = 0;
  let variationsCount = 0;
  
  const skuToIdMap = {};

  while (hasMore) {
    console.log(`Buscando productos, página ${page}...`);
    // Usamos _fields para que la respuesta sea súper pequeña y rápida
    const products = await apiRequest(`/products?per_page=100&page=${page}&_fields=id,sku,type,variations`);
    if (products.length === 0) {
      hasMore = false;
    } else {
      totalProducts += products.length;
      for (const p of products) {
        if (p.sku) {
          skuToIdMap[p.sku.trim().toUpperCase()] = { id: p.id, type: p.type, isVariation: false };
        }
        if (p.type === 'simple') simpleCount++;
        if (p.type === 'variable') {
          variableCount++;
          if (p.variations && p.variations.length > 0) {
            variationsCount += p.variations.length;
          }
        }
      }
      page++;
    }
  }

  console.log(`Prueba completada en ${(Date.now() - startTime) / 1000}s`);
  console.log(`Productos totales: ${totalProducts}`);
  console.log(`- Simples: ${simpleCount}`);
  console.log(`- Variables: ${variableCount}`);
  console.log(`- Variaciones estimadas: ${variationsCount}`);
  console.log(`- SKUs únicos mapeados (excluyendo variaciones): ${Object.keys(skuToIdMap).length}`);
}

main();
