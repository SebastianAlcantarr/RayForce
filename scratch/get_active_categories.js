import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer variables de .env
const envPath = path.resolve(__dirname, '../.env');
const content = fs.readFileSync(envPath, 'utf-8');
let wooUrl = '';
let key = '';
let secret = '';

for (const line of content.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
  const [k, ...rest] = trimmed.split('=');
  const val = rest.join('=').trim();
  if (k.trim() === 'WOO_URL' || k.trim() === 'NUXT_WOO_URL') wooUrl = val;
  if (k.trim() === 'WOO_KEY' || k.trim() === 'NUXT_WOO_KEY') key = val;
  if (k.trim() === 'WOO_SECRET' || k.trim() === 'NUXT_WOO_SECRET') secret = val;
}

const auth = Buffer.from(`${key}:${secret}`).toString('base64');
const url = `${wooUrl.replace(/\/+$/, '')}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=true`;

console.log('Fetching from:', url);
try {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });
  const data = await response.json();
  console.log('Categories found:');
  data.forEach(c => {
    console.log(`- ID: ${c.id}, Name: ${c.name}, Slug: ${c.slug}, Count: ${c.count}`);
  });
} catch (err) {
  console.error('Error:', err);
}
