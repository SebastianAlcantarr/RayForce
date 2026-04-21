import { c as defineEventHandler, r as readBody, e as createError } from '../../../_/nitro.mjs';
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

const updateProduct_put = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, regular_price, stock_quantity } = body || {};
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID de producto requerido" });
  }
  const payload = {};
  if (regular_price !== void 0 && regular_price !== null) {
    payload.regular_price = String(regular_price);
  }
  if (stock_quantity !== void 0 && stock_quantity !== null) {
    payload.stock_quantity = Number(stock_quantity);
    payload.manage_stock = true;
  }
  try {
    const updated = await wooFetch(`/products/${id}`, {
      method: "PUT",
      body: payload
    });
    return {
      id: updated.id,
      name: updated.name,
      sku: updated.sku,
      regular_price: updated.regular_price,
      stock_quantity: updated.stock_quantity
    };
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `Error al actualizar: ${err.statusMessage || err.message || "Error desconocido"}`
    });
  }
});

export { updateProduct_put as default };
//# sourceMappingURL=update-product.put.mjs.map
