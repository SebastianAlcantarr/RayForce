import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-surface text-on-surface min-h-screen" }, _attrs))}><header class="fixed top-0 w-full z-50 bg-[#f9f9fb]/70 backdrop-blur-xl shadow-[0_40px_40px_-15px_rgba(45,51,56,0.06)]"><div class="flex justify-between items-center px-8 py-6 max-w-[1440px] mx-auto w-full">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "text-2xl font-black tracking-tighter text-[#13069f] uppercase"
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
  _push(`<div class="flex items-center gap-6"><div class="hidden md:flex items-center gap-2 text-on-surface-variant font-inter text-[11px] uppercase tracking-widest"><span class="material-symbols-outlined text-sm">lock</span> Secure Checkout </div>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "text-on-surface hover:text-primary transition-colors",
    to: "/carrito",
    "aria-label": "Cerrar checkout"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<span class="material-symbols-outlined"${_scopeId}>close</span>`);
      } else {
        return [
          createVNode("span", { class: "material-symbols-outlined" }, "close")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></header><main class="pt-32 pb-20 px-8 max-w-[1440px] mx-auto">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main><footer class="w-full mt-20 bg-[#f2f4f6] border-t border-outline-variant/15"><div class="flex flex-col md:flex-row justify-between items-center px-12 py-10 max-w-[1440px] mx-auto w-full"><div class="text-lg font-bold text-on-surface mb-4 md:mb-0">RAYFORCE</div><div class="flex flex-wrap justify-center gap-8 mb-4 md:mb-0"><a class="font-inter text-[11px] uppercase tracking-[0.05em] text-outline-variant hover:text-on-surface transition-colors duration-200" href="#">Technical Support</a><a class="font-inter text-[11px] uppercase tracking-[0.05em] text-outline-variant hover:text-on-surface transition-colors duration-200" href="#">Distribution</a><a class="font-inter text-[11px] uppercase tracking-[0.05em] text-outline-variant hover:text-on-surface transition-colors duration-200" href="#">Sustainability</a><a class="font-inter text-[11px] uppercase tracking-[0.05em] text-outline-variant hover:text-on-surface transition-colors duration-200" href="#">Legal</a></div><div class="font-inter text-[11px] uppercase tracking-[0.05em] text-outline-variant"> © 2024 RAYFORCE INDUSTRIAL ATELIER. ALL RIGHTS RESERVED. </div></div></footer></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const checkout = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { checkout as default };
//# sourceMappingURL=checkout.vue.mjs.map
