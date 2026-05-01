import { e as createError, u as useRuntimeConfig } from './nitro.mjs';
import { Buffer } from 'buffer';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function getConfig() {
  const config = useRuntimeConfig();
  let wooUrl = String(config.wooUrl || process.env.NUXT_WOO_URL || process.env.WOO_URL || "");
  let key = String(config.wooKey || process.env.NUXT_WOO_KEY || process.env.WOO_KEY || "");
  let secret = String(config.wooSecret || process.env.NUXT_WOO_SECRET || process.env.WOO_SECRET || "");
  if (!wooUrl || !key || !secret) {
    try {
      const envPath = resolve(process.cwd(), ".env.local");
      const content = readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
        const [k, ...rest] = trimmed.split("=");
        const val = rest.join("=").trim();
        if (k.trim() === "WOO_URL" || k.trim() === "NUXT_WOO_URL") wooUrl = wooUrl || val;
        if (k.trim() === "WOO_KEY" || k.trim() === "NUXT_WOO_KEY") key = key || val;
        if (k.trim() === "WOO_SECRET" || k.trim() === "NUXT_WOO_SECRET") secret = secret || val;
      }
    } catch {
    }
  }
  wooUrl = wooUrl.replace(/\/+$/, "");
  if (!wooUrl || !key || !secret) {
    throw createError({
      statusCode: 500,
      statusMessage: "Faltan credenciales de WooCommerce en runtimeConfig (wooUrl, wooKey, wooSecret)."
    });
  }
  return {
    key,
    secret,
    baseUrl: `${wooUrl}/wp-json/wc/v3`
  };
}
function getWooAuth() {
  const { baseUrl, key, secret } = getConfig();
  const rootUrl = baseUrl.replace("/wp-json/wc/v3", "");
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  return { baseUrl, rootUrl, auth };
}
function normalizeProduct(product) {
  return {
    ...product,
    images: (product.images || []).filter((img) => !!(img == null ? void 0 : img.src))
  };
}
async function wooFetchResponse(endpoint, options = {}) {
  const { baseUrl, key, secret } = getConfig();
  const url = new URL(`${baseUrl}${endpoint}`);
  if (options.params) {
    Object.entries(options.params).forEach(([queryKey, value]) => {
      url.searchParams.set(queryKey, String(value));
    });
  }
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const response = await fetch(url.toString(), {
    method: options.method || "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    cache: options.cache || "no-store",
    body: options.body ? JSON.stringify(options.body) : void 0
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`WooCommerce API Error [${response.status}]:`, errorText);
    throw createError({
      statusCode: response.status,
      statusMessage: `WooCommerce API Error: ${response.status}`,
      data: errorText
    });
  }
  return response;
}
async function wooFetch(endpoint, options = {}) {
  const response = await wooFetchResponse(endpoint, options);
  return response.json();
}
async function getProducts(params = {}) {
  const products = await wooFetch("/products", {
    params: {
      status: "publish",
      ...params
    }
  });
  return products.map(normalizeProduct);
}
async function getProductsPaginated(params = {}, page = 1, perPage = 20) {
  const response = await wooFetchResponse("/products", {
    params: {
      status: "publish",
      page,
      per_page: perPage,
      ...params
    }
  });
  const products = await response.json();
  const total = Number(response.headers.get("x-wp-total") || products.length);
  const totalPages = Number(response.headers.get("x-wp-totalpages") || 1);
  return {
    items: products.map(normalizeProduct),
    total,
    totalPages
  };
}
async function getProductBySlug(slug) {
  const products = await getProducts({
    slug,
    per_page: 1
  });
  return products[0] || null;
}
async function getProductVariations(productId) {
  return wooFetch(`/products/${productId}/variations`, {
    params: { per_page: 100 }
  });
}
async function getProductsList(page = 1, perPage = 20, search = "", categoryId) {
  const params = {
    orderby: "date",
    order: "desc"
  };
  if (search) {
    params.search = search;
  }
  if (categoryId) {
    params.category = categoryId;
  }
  const paginated = await getProductsPaginated(params, page, perPage);
  return {
    ...paginated,
    page,
    perPage
  };
}
async function getCategories() {
  return wooFetch("/products/categories", {
    params: { per_page: 100, hide_empty: 1 }
  });
}

export { getWooAuth as a, getProductBySlug as b, getProductVariations as c, getProductsList as d, getCategories as g, wooFetch as w };
//# sourceMappingURL=woocomerce.mjs.map
