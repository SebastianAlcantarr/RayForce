import { c as defineEventHandler, g as getQuery, e as createError } from '../../_/nitro.mjs';
import { c as getProductsList } from '../../_/woocomerce.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'buffer';

const index = defineEventHandler(async (event) => {
  var _a;
  const query = getQuery(event);
  const page = Math.max(Number(query.page) || 1, 1);
  const perPageRaw = Number((_a = query.perPage) != null ? _a : query.limit) || 20;
  const perPage = Math.min(Math.max(perPageRaw, 1), 20);
  const search = String(query.search || query.q || "");
  try {
    return await getProductsList(page, perPage, search);
  } catch (error) {
    console.error("Error loading products list:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "No fue posible cargar productos"
    });
  }
});

export { index as default };
//# sourceMappingURL=index.mjs.map
