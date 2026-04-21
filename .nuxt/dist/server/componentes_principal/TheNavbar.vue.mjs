import __nuxt_component_0 from "../node_modules/nuxt/dist/app/components/nuxt-link.mjs";
import { ref, mergeProps, withCtx, createTextVNode, toDisplayString, unref, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { useRoute, useRouter } from "../node_modules/nuxt/dist/app/composables/router.mjs";
const _sfc_main = {
  __name: "TheNavbar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const navLinks = [
      { label: "Inicio", href: "/" },
      { label: "Tienda", href: "/tienda" },
      { label: "Servicios", href: "/servicios" },
      { label: "Cotizar Proyecto", href: "/cotizar" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "Contacto", href: "/contacto" }
    ];
    const searchQuery = ref("");
    useRouter();
    const isActive = (link) => {
      if (link.href === "/") {
        return route.path === "/";
      }
      return route.path.startsWith(link.href);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "fixed top-0 w-full z-50 bg-[#f9f9fb]/70 backdrop-blur-xl font-manrope antialiased tracking-tight" }, _attrs))}><div class="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto relative">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-3xl md:text-5xl tracking-tighter text-primary font-rayforce"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Rayforce `);
          } else {
            return [
              createTextVNode(" Rayforce ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden md:flex items-center space-x-8"><!--[-->`);
      ssrRenderList(navLinks, (link) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: link.label,
          to: link.href,
          class: isActive(link) ? "text-primary border-b-2 border-primary pb-1 font-bold" : "text-on-surface-variant font-medium hover:text-primary transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="flex items-center space-x-4"><div class="relative hidden lg:block group"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span><input${ssrRenderAttr("value", unref(searchQuery))} class="pl-10 pr-4 py-2 bg-surface-container border-none focus:ring-2 focus:ring-primary rounded-lg text-sm w-56 outline-none transition-all" placeholder="Buscar productos..." type="text"></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/carrito",
        class: "scale-95 active:opacity-80 transition-transform text-on-surface-variant hover:text-primary",
        "aria-label": "Carrito"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined"${_scopeId}>shopping_cart</span>`);
          } else {
            return [
              createVNode("span", { class: "material-symbols-outlined" }, "shopping_cart")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="scale-95 active:opacity-80 transition-transform text-on-surface-variant hover:text-primary" aria-label="Cuenta" type="button"><span class="material-symbols-outlined">account_circle</span></button></div><div class="bg-outline-variant h-[1px] w-full absolute bottom-0 opacity-15"></div></div></nav>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("componentes_principal/TheNavbar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=TheNavbar.vue.mjs.map
