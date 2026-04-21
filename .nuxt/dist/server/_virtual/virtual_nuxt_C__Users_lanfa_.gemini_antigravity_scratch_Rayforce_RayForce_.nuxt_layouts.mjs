import { defineAsyncComponent } from "vue";
const layouts = {
  admin: defineAsyncComponent(() => import("../layouts/admin.vue.mjs").then((m) => m.default || m)),
  checkout: defineAsyncComponent(() => import("../layouts/checkout.vue.mjs").then((m) => m.default || m)),
  default: defineAsyncComponent(() => import("../layouts/default.vue.mjs").then((m) => m.default || m))
};
export {
  layouts as default
};
//# sourceMappingURL=virtual_nuxt_C__Users_lanfa_.gemini_antigravity_scratch_Rayforce_RayForce_.nuxt_layouts.mjs.map
