import { ref, computed, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, unref, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { u as useRoute, a as useRouter, _ as _export_sfc } from './server.mjs';
import { u as useCart } from './useCart.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';

const _sfc_main$3 = {
  __name: "TheNavbar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { cartItems } = useCart();
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
    const cartCount = computed(() => {
      var _a;
      return ((_a = cartItems.value) == null ? void 0 : _a.length) || 0;
    });
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
          class: ["relative font-medium text-[16px] md:text-[17px] transition-all duration-300 group pb-1", isActive(link) ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary hover:-translate-y-0.5"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.label)} <span class="${ssrRenderClass([isActive(link) ? "w-full" : "w-0 group-hover:w-full", "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300"])}"${_scopeId}></span>`);
            } else {
              return [
                createTextVNode(toDisplayString(link.label) + " ", 1),
                createVNode("span", {
                  class: ["absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300", isActive(link) ? "w-full" : "w-0 group-hover:w-full"]
                }, null, 2)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="flex items-center space-x-4"><div class="relative hidden lg:block group"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span><input${ssrRenderAttr("value", unref(searchQuery))} class="pl-10 pr-4 py-2 bg-surface-container border-none focus:ring-2 focus:ring-primary rounded-lg text-sm w-56 outline-none transition-all" placeholder="Buscar productos..." type="text"></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/carrito",
        class: "scale-95 active:opacity-80 transition-transform text-on-surface-variant hover:text-primary relative",
        "aria-label": "Carrito"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined"${_scopeId}>shopping_cart</span>`);
            if (unref(cartCount) > 0) {
              _push2(`<span class="absolute -top-2 -right-2 bg-primary text-on-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"${_scopeId}>${ssrInterpolate(unref(cartCount) > 99 ? "99+" : unref(cartCount))}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("span", { class: "material-symbols-outlined" }, "shopping_cart"),
              unref(cartCount) > 0 ? (openBlock(), createBlock("span", {
                key: 0,
                class: "absolute -top-2 -right-2 bg-primary text-on-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
              }, toDisplayString(unref(cartCount) > 99 ? "99+" : unref(cartCount)), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="scale-95 active:opacity-80 transition-transform text-on-surface-variant hover:text-primary" aria-label="Cuenta" type="button"><span class="material-symbols-outlined">account_circle</span></button></div><div class="bg-outline-variant h-[1px] w-full absolute bottom-0 opacity-15"></div></div></nav>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("componentes_principal/TheNavbar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};

const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-surface-container-lowest w-full border-t border-outline-variant/15 font-manrope text-sm tracking-wide" }, _attrs))}><div class="max-w-screen-2xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12"><div class="space-y-4"><div class="text-3xl md:text-4xl tracking-tighter font-rayforce mb-10"><span class="text-3xl md:text-5xl tracking-tighter text-primary font-rayforce">Rayforce</span></div><p class="text-on-surface-variant max-w-xs leading-relaxed text-xs"> Soluciones eléctricas, materiales de calidad y servicios integrales. Más de 2,000 productos disponibles para proyectos residenciales, comerciales e industriales. </p></div><div class="space-y-4"><span class="font-bold text-primary text-xs uppercase tracking-widest block">Navegación</span><nav class="space-y-3 flex flex-col">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "text-on-surface-variant hover:text-primary transition-colors text-xs",
    to: "/tienda"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Tienda en Línea`);
      } else {
        return [
          createTextVNode("Tienda en Línea")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "text-on-surface-variant hover:text-primary transition-colors text-xs",
    to: "/soporte"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Servicios`);
      } else {
        return [
          createTextVNode("Servicios")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "text-on-surface-variant hover:text-primary transition-colors text-xs",
    to: "/cotizar"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Cotizar Proyecto`);
      } else {
        return [
          createTextVNode("Cotizar Proyecto")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "text-on-surface-variant hover:text-primary transition-colors text-xs",
    to: "/nosotros"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Sobre Nosotros`);
      } else {
        return [
          createTextVNode("Sobre Nosotros")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "text-on-surface-variant hover:text-primary transition-colors text-xs",
    to: "/soporte"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Contacto`);
      } else {
        return [
          createTextVNode("Contacto")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</nav></div><div class="space-y-4"><span class="font-bold text-primary text-xs uppercase tracking-widest block">Categorías</span><div class="space-y-3 flex flex-col"><a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Material Eléctrico</a><a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Herramientas</a><a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Iluminación</a><a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Interruptores y Tableros</a><a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Ferretería General</a></div></div><div class="space-y-4"><span class="font-bold text-primary text-xs uppercase tracking-widest block">Contacto</span><div class="space-y-3 text-xs"><div class="flex items-start gap-2 text-on-surface-variant"><span class="material-symbols-outlined text-sm flex-shrink-0 mt-0.5">location_on</span><span>Campeche 250, Col San Benito,<br>C.P. 83100, Hermosillo, Sonora</span></div><div class="flex items-center gap-2 text-on-surface-variant"><span class="material-symbols-outlined text-sm flex-shrink-0">phone</span><span>(662) 171 1371</span></div><div class="flex items-center gap-2 text-on-surface-variant"><span class="material-symbols-outlined text-sm flex-shrink-0">mail</span><span>ventas2@rayforce.com.mx</span></div><div class="flex items-start gap-2 text-on-surface-variant"><span class="material-symbols-outlined text-sm flex-shrink-0 mt-0.5">schedule</span><span>Lun - Vie: 8:00 - 18:00 | Sáb: 8:00 - 14:00</span></div></div></div></div><div class="max-w-screen-2xl mx-auto px-8 py-8 border-t border-outline-variant/15 flex flex-col items-center justify-center gap-4"><span class="font-bold text-primary text-xs uppercase tracking-widest block mb-2">Síguenos en nuestras redes</span><div class="flex gap-6 items-center"><a href="https://www.facebook.com/people/Rayforce/61586457534163/#" target="_blank" class="w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path></svg></a><a href="https://www.instagram.com/rayforce.mx/" target="_blank" class="w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path></svg></a><a href="https://www.tiktok.com/@rayforce.mx" target="_blank" class="w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 448 512" aria-hidden="true"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path></svg></a></div></div><div class="max-w-screen-2xl mx-auto px-8 py-6 border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant"><div class="flex gap-6"><a class="hover:text-primary transition-colors" href="#">Aviso de Privacidad</a><a class="hover:text-primary transition-colors" href="#">Términos y Condiciones</a><a class="hover:text-primary transition-colors" href="#">Devoluciones</a></div></div></footer>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("componentes_principal/TheFooter.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TheFooter = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);

const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<a${ssrRenderAttrs(mergeProps({
    href: "https://wa.me/5216621711371",
    target: "_blank",
    rel: "noopener noreferrer",
    class: "fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group",
    "aria-label": "Contactar por WhatsApp"
  }, _attrs))}><span class="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping"></span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 relative z-10"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path></svg><div class="absolute right-full mr-4 bg-surface text-on-surface text-xs font-bold px-3 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"> ¡Escríbenos por WhatsApp! </div></a>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("componentes_principal/WhatsAppButton.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const WhatsAppButton = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);

const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-background text-on-surface min-h-screen" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      _push(`<main class="pt-24">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(TheFooter, null, null, _parent));
      _push(ssrRenderComponent(WhatsAppButton, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default.vue.mjs.map
