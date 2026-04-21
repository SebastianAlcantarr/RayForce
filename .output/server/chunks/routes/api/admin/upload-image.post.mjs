import { c as defineEventHandler, f as readMultipartFormData, e as createError } from '../../../_/nitro.mjs';
import { a as getWooAuth } from '../../../_/woocomerce.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'buffer';

const uploadImage_post = defineEventHandler(async (event) => {
  var _a;
  const { rootUrl, auth } = getWooAuth();
  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "No se recibi\xF3 ning\xFAn archivo" });
  }
  const fileField = formData.find((f) => f.name === "file");
  if (!fileField || !fileField.data) {
    throw createError({ statusCode: 400, statusMessage: 'Campo "file" no encontrado en el formulario' });
  }
  const filename = fileField.filename || "upload.jpg";
  const mimeType = fileField.type || "image/jpeg";
  const res = await fetch(`${rootUrl}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": mimeType
    },
    body: fileField.data,
    cache: "no-store"
  });
  if (!res.ok) {
    const errText = await res.text();
    throw createError({ statusCode: res.status, statusMessage: `Error al subir imagen: ${errText}` });
  }
  const media = await res.json();
  return {
    id: media.id,
    src: media.source_url,
    alt: (_a = media.alt_text) != null ? _a : filename
  };
});

export { uploadImage_post as default };
//# sourceMappingURL=upload-image.post.mjs.map
