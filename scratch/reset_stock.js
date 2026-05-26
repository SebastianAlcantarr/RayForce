import fs from 'node:fs';
import path from 'node:path';

// 1. Cargar y parsear .env
const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('No se encontró el archivo .env en la raíz del proyecto.');
  process.exit(1);
}

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

if (!wooUrl || !wooKey || !wooSecret) {
  console.error('Faltan credenciales de WooCommerce (WOO_URL, WOO_KEY, WOO_SECRET) en el archivo .env.');
  process.exit(1);
}

const baseUrl = `${wooUrl.replace(/\/+$/, '')}/wp-json/wc/v3`;
const authHeader = `Basic ${Buffer.from(`${wooKey}:${wooSecret}`).toString('base64')}`;

// Helper para peticiones WooCommerce API
async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${baseUrl}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error en API (${response.status}): ${text}`);
  }
  return response.json();
}

async function main() {
  try {
    console.log('Iniciando proceso de actualización de inventario a 0...');
    
    let page = 1;
    let allProducts = [];
    let hasMore = true;

    // 2. Obtener todos los productos simples y variables
    while (hasMore) {
      console.log(`Obteniendo productos (Página ${page})...`);
      const products = await apiRequest(`/products?per_page=100&page=${page}`);
      if (products.length === 0) {
        hasMore = false;
      } else {
        allProducts = allProducts.concat(products);
        page++;
      }
    }

    console.log(`Total de productos obtenidos: ${allProducts.length}`);

    // Separar productos a actualizar y buscar variaciones
    const simpleProductsToUpdate = [];
    
    for (const product of allProducts) {
      if (product.type === 'variable') {
        console.log(`Producto variable detectado (ID: ${product.id} - ${product.name}). Buscando variaciones...`);
        try {
          const variations = await apiRequest(`/products/${product.id}/variations?per_page=100`);
          if (variations.length > 0) {
            console.log(`Actualizando ${variations.length} variaciones del producto ID: ${product.id}...`);
            const variationUpdates = variations.map(v => ({
              id: v.id,
              stock_status: 'outofstock',
              stock_quantity: 0
            }));
            
            // Batch update de variaciones para este producto variable
            await apiRequest(`/products/${product.id}/variations/batch`, 'POST', {
              update: variationUpdates
            });
            console.log(`Variaciones del producto ID ${product.id} actualizadas exitosamente.`);
          }
        } catch (err) {
          console.error(`Error al actualizar variaciones de producto ID ${product.id}:`, err.message);
        }
      }
      
      // Todos los productos principales (simples o variables) pasan a outofstock
      simpleProductsToUpdate.push({
        id: product.id,
        stock_status: 'outofstock',
        stock_quantity: 0
      });
    }

    // 3. Batch update de los productos principales en lotes de 100
    console.log('Actualizando productos principales a stock 0 y outofstock...');
    const chunkSize = 100;
    for (let i = 0; i < simpleProductsToUpdate.length; i += chunkSize) {
      const chunk = simpleProductsToUpdate.slice(i, i + chunkSize);
      console.log(`Enviando lote de actualización de productos principales (${i + 1} a ${Math.min(i + chunkSize, simpleProductsToUpdate.length)})...`);
      await apiRequest('/products/batch', 'POST', {
        update: chunk
      });
    }

    console.log('¡Proceso completado con éxito! Todos los productos y sus variaciones ahora tienen 0 existencias.');
  } catch (error) {
    console.error('Ocurrió un error crítico durante la ejecución:', error.message);
  }
}

main();
