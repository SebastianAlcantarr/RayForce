import { c as defineEventHandler, h as getRouterParam, e as createError } from '../../../_/nitro.mjs';
import { b as getProductBySlug } from '../../../_/woocomerce.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'buffer';

const _slug_ = defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug de producto requerido"
    });
  }
  const product = await getProductBySlug(slug);
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: "Producto no encontrado"
    });
  }
  return product;
});

export { _slug_ as default };
//# sourceMappingURL=_slug_.mjs.map
