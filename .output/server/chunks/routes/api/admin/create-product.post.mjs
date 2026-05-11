import { d as defineEventHandler, r as readBody, c as createError } from '../../../nitro/nitro.mjs';
import { w as wooFetch } from '../../../_/woocomerce.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'buffer';

const createProduct_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, sku, regular_price, categories, image_id, description } = body || {};
  if (!name || !sku || !regular_price) {
    throw createError({ statusCode: 400, statusMessage: "Nombre, SKU y precio son obligatorios" });
  }
  const payload = {
    name,
    sku,
    regular_price: String(regular_price),
    status: "publish",
    type: "simple",
    manage_stock: true,
    stock_quantity: 0,
    description: description || ""
  };
  if (categories && Array.isArray(categories) && categories.length > 0) {
    payload.categories = categories.map((id) => ({ id }));
  }
  if (image_id) {
    payload.images = [{ id: image_id }];
  }
  try {
    const created = await wooFetch("/products", {
      method: "POST",
      body: payload
    });
    return {
      id: created.id,
      name: created.name,
      sku: created.sku,
      permalink: created.permalink
    };
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `Error al crear producto: ${err.statusMessage || err.message || "Error desconocido"}`
    });
  }
});

export { createProduct_post as default };
//# sourceMappingURL=create-product.post.mjs.map
