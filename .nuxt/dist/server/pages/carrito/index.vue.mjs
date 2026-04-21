import __nuxt_component_0 from "../../node_modules/nuxt/dist/app/components/nuxt-link.mjs";
import { computed, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { useCart } from "../../composables/useCart.mjs";
import { useSeoMeta } from "../../node_modules/nuxt/dist/head/runtime/composables/v3.mjs";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Rayforce | Tu Carrito",
      description: "Resumen de tu carrito y checkout de Rayforce."
    });
    const { cartItems, subtotal } = useCart();
    const whatsappCheckoutUrl = computed(() => {
      if (cartItems.value.length === 0) return "https://wa.me/5216621711371";
      let orderDetails = "Hola, me interesa cerrar el siguiente pedido:\n\n";
      cartItems.value.forEach((item) => {
        orderDetails += `• ${item.quantity}x ${item.name} (SKU: ${item.sku}) - $${(item.price * item.quantity).toFixed(2)}
`;
      });
      orderDetails += `
*Total Estimado:* $${subtotal.value.toFixed(2)}

`;
      orderDetails += `¿Cuál es el siguiente paso para pagar y coordinar el envío?`;
      return `https://wa.me/5216621711371?text=${encodeURIComponent(orderDetails)}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex-grow w-full max-w-screen-2xl mx-auto px-8 py-12 md:py-20" }, _attrs))}><div class="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="max-w-2xl"><span class="font-inter text-[10px] uppercase tracking-widest text-primary font-semibold mb-4 block">SELECCIÓN ACTUAL</span><h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-background leading-[0.9]">Tu Carrito</h1></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "font-inter text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-2 group",
        to: "/tienda"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform"${_scopeId}>arrow_back</span> Continuar Comprando `);
          } else {
            return [
              createVNode("span", { class: "material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform" }, "arrow_back"),
              createTextVNode(" Continuar Comprando ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"><div class="lg:col-span-8 space-y-12"><div class="hidden md:grid grid-cols-6 pb-6 border-b border-outline-variant/15 text-[10px] font-inter uppercase tracking-widest text-outline"><div class="col-span-3">Detalle del Producto</div><div class="text-center">Precio</div><div class="text-center">Cantidad</div><div class="text-right">Total</div></div>`);
      if (unref(cartItems).length === 0) {
        _push(`<div class="py-12 flex flex-col items-center text-center space-y-4"><span class="material-symbols-outlined text-6xl text-outline-variant">remove_shopping_cart</span><p class="text-xl text-on-surface font-light">Tu carrito está vacío.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/tienda",
          class: "text-primary font-bold hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Explorar Catálogo`);
            } else {
              return [
                createTextVNode("Explorar Catálogo")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(cartItems), (item) => {
          _push(`<div class="flex flex-col md:grid md:grid-cols-6 gap-6 items-center"><div class="col-span-3 flex items-center gap-8 w-full"><div class="w-32 h-32 bg-surface-container-lowest border border-outline-variant/20 flex-shrink-0 relative overflow-hidden group p-2"><img class="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"${ssrRenderAttr("alt", item.name)}${ssrRenderAttr("src", item.image)}></div><div class="space-y-1"><h3 class="text-xl font-bold tracking-tight text-on-surface line-clamp-2 leading-tight">${ssrInterpolate(item.name)}</h3><p class="text-xs font-inter text-outline uppercase tracking-wider mt-1">SKU: ${ssrInterpolate(item.sku)}</p><button class="text-[10px] font-inter text-error uppercase tracking-widest mt-2 flex items-center gap-1 hover:opacity-70 transition-opacity" type="button"><span class="material-symbols-outlined text-sm">delete</span> Eliminar </button></div></div><div class="text-center font-manrope font-semibold text-on-surface-variant">$${ssrInterpolate(item.price.toFixed(2))}</div><div class="flex justify-center"><div class="flex items-center border border-outline-variant/30 rounded-md overflow-hidden h-10 bg-white shadow-sm"><button class="w-10 hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-500" type="button"><span class="material-symbols-outlined text-sm">remove</span></button><span class="w-12 text-sm font-bold text-center border-x border-outline-variant/10 leading-[40px]">${ssrInterpolate(item.quantity)}</span><button class="w-10 hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-500" type="button"><span class="material-symbols-outlined text-sm">add</span></button></div></div><div class="text-right font-manrope font-bold text-lg text-primary">$${ssrInterpolate((item.price * item.quantity).toFixed(2))}</div></div>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div><aside class="lg:col-span-4 lg:sticky lg:top-24"><div class="bg-surface-container-lowest border border-outline-variant/15 p-8 md:p-10 space-y-8 rounded-xl shadow-sm"><h2 class="text-2xl font-bold tracking-tight text-on-surface">Resumen de tu Orden</h2><div class="space-y-4"><div class="flex justify-between items-center py-2 border-b border-outline-variant/10"><span class="text-xs font-inter uppercase tracking-widest text-outline">Subtotal</span><span class="font-bold text-on-surface">$${ssrInterpolate(unref(subtotal).toFixed(2))}</span></div><div class="flex justify-between items-center py-2 border-b border-outline-variant/10"><span class="text-xs font-inter uppercase tracking-widest text-outline">Cálculo de Envío</span><span class="font-bold text-on-surface">Calculado al pago</span></div><div class="pt-6 flex justify-between items-baseline"><span class="text-sm font-bold uppercase tracking-widest text-on-surface">Total Estimado</span><span class="text-3xl font-extrabold text-primary tracking-tighter">$${ssrInterpolate(unref(subtotal).toFixed(2))}</span></div></div>`);
      if (unref(cartItems).length > 0) {
        _push(`<div class="space-y-4 pt-4"><div class="flex flex-col gap-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/checkout",
          class: "w-full bg-[#13069f] text-white py-4 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#1a0eb0] hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="material-symbols-outlined text-lg"${_scopeId}>credit_card</span> Pagar vía Rayforce `);
            } else {
              return [
                createVNode("span", { class: "material-symbols-outlined text-lg" }, "credit_card"),
                createTextVNode(" Pagar vía Rayforce ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<a${ssrRenderAttr("href", whatsappCheckoutUrl.value)} target="_blank" class="w-full bg-surface-container-low border border-primary text-primary py-4 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" class="w-5 h-5"> Cerrar pedido por WhatsApp </a></div><div class="flex justify-center items-center gap-4 mt-6 opacity-60"><span class="material-symbols-outlined" title="Visa">credit_card</span><span class="material-symbols-outlined" title="Mercado Pago">account_balance_wallet</span><span class="material-symbols-outlined" title="PayPal">payments</span></div><p class="text-[10px] text-center text-outline uppercase tracking-wider mt-4 block">Pagos protegidos mediante tecnología encriptada SSL.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4"><span class="material-symbols-outlined text-primary">verified_user</span><div><h4 class="text-sm font-bold text-slate-800 mb-1">Pagos 100% Seguros</h4><p class="text-xs text-slate-500 leading-relaxed"> Tus transacciones y datos están protegidos en todo momento, sea pago en web o vía asesor de WhatsApp. </p></div></div></aside></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/carrito/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index.vue.mjs.map
