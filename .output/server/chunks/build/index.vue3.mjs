import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { a as useSeoMeta } from './v3.mjs';
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
import './server.mjs';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'devalue';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Rayforce | Carrito",
      description: "Resumen de tu carrito y checkout de Rayforce."
    });
    const {
      cartItems,
      subtotal
    } = useCart();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-grow w-full max-w-screen-2xl mx-auto px-8 py-12 md:py-20" }, _attrs))}><div class="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="max-w-2xl"><span class="font-inter text-[10px] uppercase tracking-widest text-primary font-semibold mb-4 block">Seleccion actual</span><h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-background leading-[0.9]">Tu Carrito</h1></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "font-inter text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-2 group",
        to: "/tienda"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform"${_scopeId}>arrow_back</span> Continuar comprando `);
          } else {
            return [
              createVNode("span", { class: "material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform" }, "arrow_back"),
              createTextVNode(" Continuar comprando ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"><div class="lg:col-span-8 space-y-12"><div class="hidden md:grid grid-cols-6 pb-6 border-b border-outline-variant/15 text-[10px] font-inter uppercase tracking-widest text-outline"><div class="col-span-3">Detalles</div><div class="text-center">Precio</div><div class="text-center">Cantidad</div><div class="text-right">Total</div></div><!--[-->`);
      ssrRenderList(unref(cartItems), (item) => {
        _push(`<div class="flex flex-col md:grid md:grid-cols-6 gap-6 items-center"><div class="col-span-3 flex items-center gap-8 w-full"><div class="w-32 h-32 bg-surface-container-highest flex-shrink-0 relative overflow-hidden group"><img class="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"${ssrRenderAttr("alt", item.name)}${ssrRenderAttr("src", item.image)}></div><div class="space-y-1"><h3 class="text-xl font-bold tracking-tight text-on-surface">${ssrInterpolate(item.name)}</h3><p class="text-xs font-inter text-outline uppercase tracking-wider">SKU: ${ssrInterpolate(item.sku)}</p><button class="text-[10px] font-inter text-error tracking-widest mt-2 flex items-center gap-1 hover:opacity-70 transition-opacity" type="button"><span class="material-symbols-outlined text-sm">delete</span> Remover </button></div></div><div class="text-center font-manrope font-semibold text-on-surface-variant">$${ssrInterpolate(item.price.toFixed(2))}</div><div class="flex justify-center"><div class="flex items-center border border-outline-variant/30 rounded-full overflow-hidden h-10 bg-surface-container-low"><button class="px-3 hover:bg-surface-container-high transition-colors" type="button"><span class="material-symbols-outlined text-sm">remove</span></button><span class="px-4 text-sm font-bold w-12 text-center">${ssrInterpolate(String(item.quantity).padStart(2, "0"))}</span><button class="px-3 hover:bg-surface-container-high transition-colors" type="button"><span class="material-symbols-outlined text-sm">add</span></button></div></div><div class="text-right font-manrope font-bold text-lg text-on-surface">$${ssrInterpolate((item.price * item.quantity).toFixed(2))}</div></div>`);
      });
      _push(`<!--]--></div><aside class="lg:col-span-4 lg:sticky lg:top-24"><div class="bg-surface-container-lowest border border-outline-variant/15 p-10 space-y-8"><h2 class="text-2xl font-bold tracking-tight text-on-surface">Total de la Orden</h2>`);
      if (unref(cartItems).length === 0) {
        _push(`<div class="text-center py-8 text-outline-variant"><p class="text-sm">Tu carrito está vacío</p></div>`);
      } else {
        _push(`<div class="space-y-4"><div class="flex justify-between items-center py-2"><span class="text-xs font-inter uppercase tracking-widest text-outline">Subtotal</span><span class="font-bold text-on-surface">$${ssrInterpolate(unref(subtotal).toFixed(2))}</span></div><div class="flex justify-between items-center py-2"><span class="text-xs font-inter uppercase tracking-widest text-outline">Costo de envio</span><span class="font-bold text-on-surface">$45.00</span></div><div class="flex justify-between items-center py-2"><span class="text-xs font-inter uppercase tracking-widest text-outline">Impuestos</span><span class="font-bold text-on-surface">$${ssrInterpolate(((unref(subtotal) + 45) * 0.08).toFixed(2))}</span></div><div class="pt-6 border-t border-outline-variant/15 flex justify-between items-baseline"><span class="text-sm font-bold uppercase tracking-widest text-on-surface">Total</span><span class="text-3xl font-extrabold text-primary tracking-tighter">$${ssrInterpolate((unref(subtotal) + 45 + (unref(subtotal) + 45) * 0.08).toFixed(2))}</span></div></div>`);
      }
      if (unref(cartItems).length > 0) {
        _push(`<div class="space-y-4 pt-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/checkout",
          class: "w-full bg-[#13069f] text-white py-5 rounded-md text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1a0eb0] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Proceder a checkout <span class="material-symbols-outlined text-lg"${_scopeId}>arrow_forward</span>`);
            } else {
              return [
                createTextVNode(" Proceder a checkout "),
                createVNode("span", { class: "material-symbols-outlined text-lg" }, "arrow_forward")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<p class="text-[10px] text-center text-outline uppercase tracking-wider">Envio Seguro </p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(cartItems).length > 0) {
        _push(`<div class="pt-8 mt-8 border-t border-outline-variant/10"><label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-3">Promotional Code</label><div class="flex gap-2"><input class="flex-grow bg-surface-container-high border-none text-xs font-inter tracking-widest px-4 focus:ring-1 focus:ring-primary rounded-sm h-10" placeholder="ENTER CODE" type="text"><button class="px-6 h-10 border border-outline-variant/30 text-[10px] font-bold uppercase tracking-widest hover:bg-on-surface hover:text-white transition-colors" type="button"> Apply </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></aside></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/carrito/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue3.mjs.map
