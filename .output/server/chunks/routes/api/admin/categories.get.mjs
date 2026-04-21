import { c as defineEventHandler } from '../../../_/nitro.mjs';
import { g as getCategories } from '../../../_/woocomerce.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'buffer';

const categories_get = defineEventHandler(async () => {
  const cats = await getCategories();
  return cats.filter((c) => c.slug !== "uncategorized");
});

export { categories_get as default };
//# sourceMappingURL=categories.get.mjs.map
