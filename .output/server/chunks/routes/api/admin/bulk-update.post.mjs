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

const bulkUpdate_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const items = (body == null ? void 0 : body.items) || [];
  if (!Array.isArray(items) || items.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Se requiere un array "items" no vac\xEDo' });
  }
  const results = [];
  for (const item of items) {
    const sku = String(item.sku || "").trim();
    if (!sku) {
      results.push({ sku: "(vac\xEDo)", status: "error", message: "SKU vac\xEDo" });
      continue;
    }
    try {
      const products = await wooFetch("/products", {
        params: { sku, per_page: 1 }
      });
      if (!products || products.length === 0) {
        results.push({ sku, status: "not_found", message: "SKU no encontrado en WooCommerce" });
        continue;
      }
      const productId = products[0].id;
      const payload = { manage_stock: true };
      if (item.price !== void 0 && item.price !== "") {
        payload.regular_price = String(item.price);
      }
      if (item.stock !== void 0 && item.stock !== "") {
        payload.stock_quantity = Number(item.stock);
      }
      await wooFetch(`/products/${productId}`, {
        method: "PUT",
        body: payload
      });
      results.push({ sku, status: "updated" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ sku, status: "error", message: msg });
    }
  }
  const updated = results.filter((r) => r.status === "updated").length;
  const notFound = results.filter((r) => r.status === "not_found").length;
  const errors = results.filter((r) => r.status === "error").length;
  return { total: items.length, updated, notFound, errors, results };
});

export { bulkUpdate_post as default };
//# sourceMappingURL=bulk-update.post.mjs.map
