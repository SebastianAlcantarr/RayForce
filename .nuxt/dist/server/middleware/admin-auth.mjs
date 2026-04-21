import { defineNuxtRouteMiddleware } from "../node_modules/nuxt/dist/app/composables/router.mjs";
const adminAuth = defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith("/admin") || to.path === "/admin/login") {
    return;
  }
});
export {
  adminAuth as default
};
//# sourceMappingURL=admin-auth.mjs.map
