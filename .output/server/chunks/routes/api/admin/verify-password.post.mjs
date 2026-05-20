import { c as defineEventHandler, r as readBody, u as useRuntimeConfig, e as createError } from '../../../_/nitro.mjs';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Buffer } from 'node:buffer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:crypto';
import 'node:url';

function readEnvLocal(key1, key2) {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [k, ...rest] = trimmed.split("=");
      if (k.trim() === key1 || k.trim() === key2) return rest.join("=").trim();
    }
  } catch {
  }
  return "";
}
const verifyPassword_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { password } = body || {};
  const config = useRuntimeConfig(event);
  let adminPassword = String(config.adminPassword || "");
  if (!adminPassword) adminPassword = process.env.NUXT_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "";
  if (!adminPassword) adminPassword = readEnvLocal("NUXT_ADMIN_PASSWORD", "ADMIN_PASSWORD");
  if (!adminPassword) {
    throw createError({ statusCode: 500, statusMessage: "ADMIN_PASSWORD no configurada en .env.local" });
  }
  if (!password || password !== adminPassword) {
    throw createError({ statusCode: 401, statusMessage: "Contrase\xF1a incorrecta" });
  }
  const now = Date.now();
  const token = Buffer.from(`${now}:${adminPassword.slice(0, 4)}`).toString("base64");
  const expires = now + 24 * 60 * 60 * 1e3;
  return { token, expires };
});

export { verifyPassword_post as default };
//# sourceMappingURL=verify-password.post.mjs.map
