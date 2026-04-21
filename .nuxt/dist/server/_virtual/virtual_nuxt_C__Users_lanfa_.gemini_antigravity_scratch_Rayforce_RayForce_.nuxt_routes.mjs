import __nuxt_page_meta from "../pages/admin/login.vue2.mjs";
import __nuxt_page_meta$1 from "../pages/checkout/index.vue2.mjs";
import __nuxt_page_meta$2 from "../pages/admin/inventario.vue2.mjs";
function handleHotUpdate(_router, _generateRoutes) {
}
const _routes = [
  {
    name: "index",
    path: "/",
    component: () => import("../pages/index.vue.mjs")
  },
  {
    name: "admin-login",
    path: "/admin/login",
    meta: __nuxt_page_meta || {},
    component: () => import("../pages/admin/login.vue.mjs")
  },
  {
    name: "tienda",
    path: "/tienda",
    component: () => import("../pages/tienda/index.vue.mjs")
  },
  {
    name: "carrito",
    path: "/carrito",
    component: () => import("../pages/carrito/index.vue.mjs")
  },
  {
    name: "cotizar",
    path: "/cotizar",
    component: () => import("../pages/cotizar/index.vue.mjs")
  },
  {
    name: "tienda-slug",
    path: "/tienda/:slug()",
    component: () => import("../pages/tienda/_slug_.vue.mjs")
  },
  {
    name: "checkout",
    path: "/checkout",
    meta: __nuxt_page_meta$1 || {},
    component: () => import("../pages/checkout/index.vue.mjs")
  },
  {
    name: "contacto",
    path: "/contacto",
    component: () => import("../pages/contacto/index.vue.mjs")
  },
  {
    name: "nosotros",
    path: "/nosotros",
    component: () => import("../pages/nosotros/index.vue.mjs")
  },
  {
    name: "servicios",
    path: "/servicios",
    component: () => import("../pages/servicios/index.vue.mjs")
  },
  {
    name: "admin-inventario",
    path: "/admin/inventario",
    meta: __nuxt_page_meta$2 || {},
    component: () => import("../pages/admin/inventario.vue.mjs")
  }
];
export {
  _routes as default,
  handleHotUpdate
};
//# sourceMappingURL=virtual_nuxt_C__Users_lanfa_.gemini_antigravity_scratch_Rayforce_RayForce_.nuxt_routes.mjs.map
