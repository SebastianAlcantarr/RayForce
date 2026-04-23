import { d as defineEventHandler, g as getQuery, c as createError } from '../../../nitro/nitro.mjs';
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

const searchProduct_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f;
  const query = getQuery(event);
  const sku = String(query.sku || "").trim();
  if (!sku) {
    throw createError({ statusCode: 400, statusMessage: "SKU requerido" });
  }
  const products = await wooFetch("/products", {
    params: { sku, per_page: 1 }
  });
  if (!products || products.length === 0) {
    throw createError({ statusCode: 404, statusMessage: `Producto con SKU "${sku}" no encontrado` });
  }
  const p = products[0];
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    stock_quantity: (_a = p.stock_quantity) != null ? _a : 0,
    regular_price: (_c = (_b = p.regular_price) != null ? _b : p.price) != null ? _c : "0",
    image: (_f = (_e = (_d = p.images) == null ? void 0 : _d[0]) == null ? void 0 : _e.src) != null ? _f : null,
    status: p.status
  };
});

export { searchProduct_get as default };
//# sourceMappingURL=search-product.get.mjs.map
