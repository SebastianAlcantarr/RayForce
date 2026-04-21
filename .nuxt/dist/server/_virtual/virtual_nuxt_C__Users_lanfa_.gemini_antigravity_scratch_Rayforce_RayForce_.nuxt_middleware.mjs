import validate from "../node_modules/nuxt/dist/pages/runtime/validate.mjs";
import manifest_45route_45rule from "../node_modules/nuxt/dist/app/middleware/manifest-route-rule.mjs";
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {
  "admin-auth": () => import("../middleware/admin-auth.mjs")
};
export {
  globalMiddleware,
  namedMiddleware
};
//# sourceMappingURL=virtual_nuxt_C__Users_lanfa_.gemini_antigravity_scratch_Rayforce_RayForce_.nuxt_middleware.mjs.map
