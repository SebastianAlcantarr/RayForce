import { d as defineEventHandler, c as createError, a as readMultipartFormData } from '../../../nitro/nitro.mjs';
import { Buffer } from 'buffer';
import { a as getWooAuth } from '../../../_/woocomerce.mjs';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:crypto';
import 'node:url';

function getWPCredentials() {
  let wpUser = process.env.WP_USER || "";
  let wpPass = process.env.WP_APP_PASS || "";
  const stripQuotes = (str) => {
    let s = str.trim();
    if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
    if (s.startsWith("'") && s.endsWith("'")) s = s.slice(1, -1);
    return s.trim();
  };
  if (!wpUser || !wpPass) {
    try {
      const envPath = resolve(process.cwd(), ".env.local");
      const content = readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
        const [k, ...rest] = trimmed.split("=");
        const val = stripQuotes(rest.join("="));
        if (k.trim() === "WP_USER") wpUser = wpUser || val;
        if (k.trim() === "WP_APP_PASS") wpPass = wpPass || val;
      }
    } catch {
    }
  }
  if (!wpUser || !wpPass) {
    try {
      const envPath = resolve(process.cwd(), ".env");
      const content = readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
        const [k, ...rest] = trimmed.split("=");
        const val = stripQuotes(rest.join("="));
        if (k.trim() === "WP_USER") wpUser = wpUser || val;
        if (k.trim() === "WP_APP_PASS") wpPass = wpPass || val;
      }
    } catch {
    }
  }
  return { wpUser: stripQuotes(wpUser), wpPass: stripQuotes(wpPass) };
}
const uploadImage_post = defineEventHandler(async (event) => {
  var _a;
  const { rootUrl } = getWooAuth();
  const { wpUser, wpPass } = getWPCredentials();
  if (!wpUser || !wpPass) {
    throw createError({
      statusCode: 401,
      statusMessage: "Por favor, configura WP_USER y WP_APP_PASS en tu archivo .env"
    });
  }
  const wpAuth = Buffer.from(`${wpUser}:${wpPass}`).toString("base64");
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
      Authorization: `Basic ${wpAuth}`,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": mimeType
    },
    body: fileField.data,
    cache: "no-store"
  });
  if (!res.ok) {
    const errText = await res.text();
    throw createError({ statusCode: res.status, statusMessage: `Error WP_USER(${wpUser}): ${errText}` });
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
