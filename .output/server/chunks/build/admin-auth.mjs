import { h as defineNuxtRouteMiddleware } from './server.mjs';
import 'vue';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';
import 'vue/server-renderer';

const adminAuth = defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith("/admin") || to.path === "/admin/login") {
    return;
  }
});

export { adminAuth as default };
//# sourceMappingURL=admin-auth.mjs.map
