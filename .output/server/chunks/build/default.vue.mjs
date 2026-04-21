import { ref, mergeProps, withCtx, createTextVNode, toDisplayString, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { u as useRoute, e as useRouter, _ as _export_sfc } from './server.mjs';
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("componentes_principal/TheNavbar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};

const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-surface-container-lowest w-full border-t border-outline-variant/15 font-manrope text-sm tracking-wide" }, _attrs))}><div class="max-w-screen-2xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8"><div class="space-y-4"><div class="font-bold text-on-surface uppercase text-lg">Rayforce</div><p class="text-on-surface-variant max-w-xs leading-relaxed"> Distribuidor líder en componentes eléctricos y hardware de precisión. Tecnología al servicio de la industria. </p></div><div class="grid grid-cols-2 md:grid-cols-3 gap-6 md:col-span-2"><div class="space-y-3 flex flex-col"><span class="font-bold text-on-surface text-xs uppercase tracking-widest mb-2">Contacto</span><a class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2" href="tel:6621711371"><span class="material-symbols-outlined text-sm">phone</span> 662 171 1371 </a><a class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2" href="mailto:ventas2@rayforce.com.mx"><span class="material-symbols-outlined text-sm">mail</span> ventas2@rayforce.com.mx </a></div><div class="space-y-3 flex flex-col"><span class="font-bold text-on-surface text-xs uppercase tracking-widest mb-2">Redes</span><a class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2" href="https://www.instagram.com/rayforce.mx/" target="_blank"><span class="material-symbols-outlined text-sm">photo_camera</span> @rayforce.mx </a><a class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2" href="https://www.facebook.com/people/Rayforce/61586457534163/#" target="_blank"><span class="material-symbols-outlined text-sm">thumb_up</span> Rayforce </a><a class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2" href="https://www.tiktok.com/@rayforce.mx" target="_blank"><span class="material-symbols-outlined text-sm">play_arrow</span> @rayfrce.mx </a></div><div class="space-y-3 flex flex-col"><span class="font-bold text-on-surface text-xs uppercase tracking-widest mb-2">Legal</span><a class="text-on-surface-variant hover:text-primary transition-colors block" href="#">Aviso de Privacidad</a><a class="text-on-surface-variant hover:text-primary transition-colors block" href="#">Términos y Condiciones</a></div></div></div><div class="border-t border-outline-variant/15 mt-8 max-w-screen-2xl mx-auto px-8 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-outline-variant"><span>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Rayforce. Todos los derechos reservados.</span></div></footer>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/WhatsAppButton.vue");
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
