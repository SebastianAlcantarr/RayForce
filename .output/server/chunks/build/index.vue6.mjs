import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { u as useCart } from './useCart.mjs';
import { a as useSeoMeta } from './v4.mjs';
import { u as useAuth } from './useAuth.mjs';
import { u as useRouter, _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'consola';
import 'nuxtseo-shared/utils';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'devalue';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Rayforce | Checkout",
      description: "Checkout seguro para pedidos industriales Rayforce."
    });
    const { cartItems, subtotal } = useCart();
    useAuth();
    useRouter();
    const shippingCost = ref("12");
    const isLoading = ref(false);
    ref(true);
    const errorMessage = ref("");
    const showErrors = ref(false);
    const form = reactive({
      nombre: "",
      apellidos: "",
      direccion: "",
      ciudad: "",
      estado: "",
      codigoPostal: "",
      telefono: ""
    });
    reactive({
      nombre: false,
      apellidos: false,
      direccion: false,
      ciudad: false,
      estado: false,
      codigoPostal: false,
      telefono: false
    });
    const isFormValid = computed(() => {
      return form.nombre.trim().length >= 2 && form.apellidos.trim().length >= 2 && form.direccion.trim().length >= 5 && form.ciudad.trim().length >= 2 && form.estado.trim().length >= 2 && form.codigoPostal.trim().length >= 4 && form.telefono.trim().length >= 8;
    });
    const shippingCostNumber = computed(() => Number(shippingCost.value));
    const iva = computed(() => (subtotal.value + shippingCostNumber.value) * 0.16);
    const total = computed(() => subtotal.value + shippingCostNumber.value + iva.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "px-6 md:px-8 py-10 max-w-screen-2xl mx-auto bg-background min-h-screen" }, _attrs))} data-v-0d974320><div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6" data-v-0d974320><div data-v-0d974320><h1 class="text-4xl md:text-5xl font-black tracking-tighter text-on-background" data-v-0d974320> Finalizar Compra </h1><p class="text-on-surface-variant mt-2 font-medium" data-v-0d974320>Completa tus datos para procesar el pedido de forma segura.</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-2 group bg-surface-container py-3 px-5 rounded-full hover:bg-primary/10 w-max",
        to: "/carrito"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform" data-v-0d974320${_scopeId}> arrow_back </span> Volver al carrito `);
          } else {
            return [
              createVNode("span", { class: "material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform" }, " arrow_back "),
              createTextVNode(" Volver al carrito ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-20" data-v-0d974320><div class="xl:col-span-7 space-y-12" data-v-0d974320><section class="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden" data-v-0d974320><div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8" data-v-0d974320></div><div class="flex items-center gap-4 mb-8 relative" data-v-0d974320><span class="text-sm font-black font-inter bg-primary text-white w-8 h-8 flex items-center justify-center rounded-xl shadow-lg shadow-primary/30" data-v-0d974320>01</span><h2 class="text-2xl font-extrabold tracking-tight text-on-surface" data-v-0d974320>Datos de Envío</h2></div><div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 relative" data-v-0d974320><div class="flex flex-col gap-1.5" data-v-0d974320><label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between" data-v-0d974320> Nombre `);
      if (showErrors.value && !form.nombre) {
        _push(`<span class="text-error text-[10px]" data-v-0d974320>Requerido</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><div class="relative group" data-v-0d974320><span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" data-v-0d974320>person</span><input${ssrRenderAttr("value", form.nombre)} class="${ssrRenderClass([
        "w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none",
        showErrors.value && !form.nombre ? "border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10" : "border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant"
      ])}" placeholder="Tu nombre" type="text" data-v-0d974320></div></div><div class="flex flex-col gap-1.5" data-v-0d974320><label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between" data-v-0d974320> Apellido `);
      if (showErrors.value && !form.apellidos) {
        _push(`<span class="text-error text-[10px]" data-v-0d974320>Requerido</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><div class="relative group" data-v-0d974320><span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" data-v-0d974320>badge</span><input${ssrRenderAttr("value", form.apellidos)} class="${ssrRenderClass([
        "w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none",
        showErrors.value && !form.apellidos ? "border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10" : "border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant"
      ])}" placeholder="Tus apellidos" type="text" data-v-0d974320></div></div><div class="flex flex-col gap-1.5 md:col-span-2" data-v-0d974320><label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between" data-v-0d974320> Teléfono de Contacto `);
      if (showErrors.value && !form.telefono) {
        _push(`<span class="text-error text-[10px]" data-v-0d974320>Requerido para la paquetería</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><div class="relative group" data-v-0d974320><span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" data-v-0d974320>call</span><input${ssrRenderAttr("value", form.telefono)} class="${ssrRenderClass([
        "w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none",
        showErrors.value && !form.telefono ? "border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10" : "border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant"
      ])}" placeholder="A 10 dígitos" type="tel" data-v-0d974320></div></div><div class="flex flex-col gap-1.5 md:col-span-2" data-v-0d974320><label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between" data-v-0d974320> Dirección Completa `);
      if (showErrors.value && !form.direccion) {
        _push(`<span class="text-error text-[10px]" data-v-0d974320>Requerido</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><div class="relative group" data-v-0d974320><span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" data-v-0d974320>home_pin</span><input${ssrRenderAttr("value", form.direccion)} class="${ssrRenderClass([
        "w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none",
        showErrors.value && !form.direccion ? "border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10" : "border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant"
      ])}" placeholder="Calle, número exterior, interior, colonia" type="text" data-v-0d974320></div></div><div class="flex flex-col gap-1.5" data-v-0d974320><label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between" data-v-0d974320> Ciudad `);
      if (showErrors.value && !form.ciudad) {
        _push(`<span class="text-error text-[10px]" data-v-0d974320>Requerido</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><div class="relative group" data-v-0d974320><span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" data-v-0d974320>location_city</span><input${ssrRenderAttr("value", form.ciudad)} class="${ssrRenderClass([
        "w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none",
        showErrors.value && !form.ciudad ? "border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10" : "border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant"
      ])}" placeholder="Ciudad o Municipio" type="text" data-v-0d974320></div></div><div class="flex flex-col gap-1.5" data-v-0d974320><label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between" data-v-0d974320> Estado `);
      if (showErrors.value && !form.estado) {
        _push(`<span class="text-error text-[10px]" data-v-0d974320>Requerido</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><div class="relative group" data-v-0d974320><span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" data-v-0d974320>map</span><input${ssrRenderAttr("value", form.estado)} class="${ssrRenderClass([
        "w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none",
        showErrors.value && !form.estado ? "border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10" : "border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant"
      ])}" placeholder="Estado / Provincia" type="text" data-v-0d974320></div></div><div class="flex flex-col gap-1.5" data-v-0d974320><label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between" data-v-0d974320> Código Postal `);
      if (showErrors.value && !form.codigoPostal) {
        _push(`<span class="text-error text-[10px]" data-v-0d974320>Requerido</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label><div class="relative group" data-v-0d974320><span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors" data-v-0d974320>mark_as_unread</span><input${ssrRenderAttr("value", form.codigoPostal)} class="${ssrRenderClass([
        "w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none",
        showErrors.value && !form.codigoPostal ? "border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10" : "border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant"
      ])}" placeholder="Ej. 64000" type="text" data-v-0d974320></div></div></div></section><section class="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden" data-v-0d974320><div class="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full -ml-8 -mt-8" data-v-0d974320></div><div class="flex items-center gap-4 mb-8 relative" data-v-0d974320><span class="text-sm font-black font-inter bg-primary text-white w-8 h-8 flex items-center justify-center rounded-xl shadow-lg shadow-primary/30" data-v-0d974320>02</span><h2 class="text-2xl font-extrabold tracking-tight text-on-surface" data-v-0d974320>Método de Envío</h2></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative" data-v-0d974320><label class="relative group cursor-pointer" data-v-0d974320><input checked class="peer sr-only" name="shipping" type="radio" value="12"${ssrIncludeBooleanAttr(ssrLooseEqual(shippingCost.value, "12")) ? " checked" : ""} data-v-0d974320><div class="p-6 bg-surface-container/30 border-2 border-outline-variant/20 peer-checked:bg-primary/5 peer-checked:border-primary transition-all rounded-2xl flex justify-between items-center group-hover:border-primary/50" data-v-0d974320><div class="flex items-center gap-4" data-v-0d974320><div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center peer-checked:bg-primary peer-checked:text-white transition-colors" data-v-0d974320><span class="material-symbols-outlined text-[20px]" data-v-0d974320>local_shipping</span></div><div class="space-y-0.5" data-v-0d974320><p class="font-bold text-sm text-on-surface" data-v-0d974320>Logística Estándar</p><p class="text-xs text-on-surface-variant font-medium" data-v-0d974320>3-5 Días Hábiles</p></div></div><span class="text-lg font-black text-on-surface" data-v-0d974320>$12.00</span></div></label><label class="relative group cursor-pointer" data-v-0d974320><input class="peer sr-only" name="shipping" type="radio" value="45"${ssrIncludeBooleanAttr(ssrLooseEqual(shippingCost.value, "45")) ? " checked" : ""} data-v-0d974320><div class="p-6 bg-surface-container/30 border-2 border-outline-variant/20 peer-checked:bg-primary/5 peer-checked:border-primary transition-all rounded-2xl flex justify-between items-center group-hover:border-primary/50" data-v-0d974320><div class="flex items-center gap-4" data-v-0d974320><div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center peer-checked:bg-primary peer-checked:text-white transition-colors" data-v-0d974320><span class="material-symbols-outlined text-[20px]" data-v-0d974320>flight_takeoff</span></div><div class="space-y-0.5" data-v-0d974320><p class="font-bold text-sm text-on-surface" data-v-0d974320>Express Premium</p><p class="text-xs text-on-surface-variant font-medium" data-v-0d974320>Día Siguiente</p></div></div><span class="text-lg font-black text-on-surface" data-v-0d974320>$45.00</span></div></label></div></section><div class="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 px-4" data-v-0d974320><div class="flex items-start gap-4" data-v-0d974320><div class="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-600" data-v-0d974320><span class="material-symbols-outlined text-2xl" data-v-0d974320>verified</span></div><div data-v-0d974320><h4 class="font-bold text-sm uppercase tracking-wide" data-v-0d974320>Garantía de Satisfacción</h4><p class="text-xs text-on-surface-variant mt-1 leading-relaxed" data-v-0d974320>Todos nuestros productos industriales están respaldados por nuestra garantía Rayforce.</p></div></div><div class="flex items-start gap-4" data-v-0d974320><div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-600" data-v-0d974320><span class="material-symbols-outlined text-2xl" data-v-0d974320>shield_lock</span></div><div data-v-0d974320><h4 class="font-bold text-sm uppercase tracking-wide" data-v-0d974320>Pago 100% Seguro</h4><p class="text-xs text-on-surface-variant mt-1 leading-relaxed" data-v-0d974320>Tus datos están encriptados y protegidos mediante la pasarela segura de Stripe.</p></div></div></div></div><div class="xl:col-span-5 mt-10 xl:mt-0" data-v-0d974320><div class="sticky top-24 space-y-6" data-v-0d974320><div class="bg-surface-container-lowest shadow-2xl shadow-black/5 p-8 rounded-3xl border border-outline-variant/15 relative overflow-hidden" data-v-0d974320><div class="absolute top-4 right-4 w-16 h-16 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-on-surface to-transparent bg-[length:4px_4px]" data-v-0d974320></div><h3 class="text-2xl font-black tracking-tight mb-8 flex items-center gap-3" data-v-0d974320><span class="material-symbols-outlined text-primary" data-v-0d974320>receipt_long</span> Resumen de Orden </h3><div class="space-y-4 mb-8 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar" data-v-0d974320>`);
      if (unref(cartItems).length === 0) {
        _push(`<div class="text-center py-8" data-v-0d974320><span class="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2" data-v-0d974320>shopping_basket</span><p class="text-sm font-semibold text-on-surface-variant" data-v-0d974320>Tu carrito está vacío.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(cartItems), (item) => {
        _push(`<div class="flex gap-4 p-3 bg-surface-container/20 rounded-2xl border border-outline-variant/5" data-v-0d974320><div class="w-20 h-20 bg-white rounded-xl border border-outline-variant/10 overflow-hidden flex-shrink-0 p-2 flex items-center justify-center" data-v-0d974320><img class="max-w-full max-h-full object-contain"${ssrRenderAttr("alt", item.name)}${ssrRenderAttr("src", item.image)} data-v-0d974320></div><div class="flex-grow flex flex-col justify-between py-1 min-w-0" data-v-0d974320><div data-v-0d974320><p class="text-sm font-bold leading-tight truncate"${ssrRenderAttr("title", item.name)} data-v-0d974320>${ssrInterpolate(item.name)}</p><p class="text-[10px] text-on-surface-variant font-inter uppercase mt-1" data-v-0d974320>SKU: ${ssrInterpolate(item.sku || item.id)}</p></div><div class="flex justify-between items-end mt-2" data-v-0d974320><span class="text-xs font-semibold bg-surface-container px-2 py-0.5 rounded-md text-on-surface-variant" data-v-0d974320>Cant: ${ssrInterpolate(item.quantity)}</span><span class="text-sm font-black text-on-surface" data-v-0d974320>$${ssrInterpolate((item.price * item.quantity).toFixed(2))}</span></div></div></div>`);
      });
      _push(`<!--]--></div><div class="space-y-4 pt-6 border-t-2 border-dashed border-outline-variant/20 font-medium" data-v-0d974320><div class="flex justify-between text-sm text-on-surface-variant" data-v-0d974320><span data-v-0d974320>Subtotal (${ssrInterpolate(unref(cartItems).length)} items)</span><span class="text-on-surface font-bold" data-v-0d974320>$${ssrInterpolate(unref(subtotal).toFixed(2))}</span></div><div class="flex justify-between text-sm text-on-surface-variant" data-v-0d974320><span data-v-0d974320>Costo de Envío</span><span class="text-on-surface font-bold" data-v-0d974320>$${ssrInterpolate(shippingCostNumber.value.toFixed(2))}</span></div><div class="flex justify-between text-sm text-on-surface-variant" data-v-0d974320><span data-v-0d974320>Impuestos (IVA 16%)</span><span class="text-on-surface font-bold" data-v-0d974320>$${ssrInterpolate(iva.value.toFixed(2))}</span></div><div class="flex justify-between items-center pt-6 pb-2 border-t border-outline-variant/20" data-v-0d974320><span class="text-lg font-bold" data-v-0d974320>Total Final</span><span class="text-3xl font-black text-primary" data-v-0d974320>$${ssrInterpolate(total.value.toFixed(2))}</span></div></div>`);
      if (showErrors.value && !isFormValid.value) {
        _push(`<div class="mt-6 mb-2 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3 text-error" data-v-0d974320><span class="material-symbols-outlined text-error" data-v-0d974320>error</span><p class="text-xs font-bold leading-tight pt-0.5" data-v-0d974320>Faltan campos por llenar en los datos de envío. Por favor, complétalos para continuar.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (errorMessage.value) {
        _push(`<div class="mt-6 mb-2 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3 text-error" data-v-0d974320><span class="material-symbols-outlined text-error" data-v-0d974320>warning</span><p class="text-xs font-bold leading-tight pt-0.5" data-v-0d974320>${ssrInterpolate(errorMessage.value)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button${ssrIncludeBooleanAttr(isLoading.value || unref(cartItems).length === 0) ? " disabled" : ""} class="${ssrRenderClass([
        "w-full mt-6 py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3",
        isFormValid.value ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-primary/40" : "bg-surface-container text-on-surface-variant border border-outline-variant/30 cursor-not-allowed hover:bg-surface-container-high"
      ])}" type="button" data-v-0d974320>`);
      if (isLoading.value) {
        _push(`<span class="material-symbols-outlined animate-spin" data-v-0d974320>progress_activity</span>`);
      } else {
        _push(`<span class="material-symbols-outlined text-[20px]" data-v-0d974320>lock</span>`);
      }
      _push(` ${ssrInterpolate(isLoading.value ? "Procesando..." : "Pagar de forma Segura")}</button></div><div class="flex items-center justify-center gap-3 text-on-surface-variant/70 mt-6" data-v-0d974320><span class="material-symbols-outlined text-xl" data-v-0d974320>lock</span><p class="text-[10px] font-inter uppercase tracking-widest leading-relaxed max-w-[250px] text-center font-bold" data-v-0d974320> Transacción encriptada. Al pagar aceptas nuestros <a href="#" class="underline hover:text-primary transition-colors" data-v-0d974320>Términos y Condiciones</a>. </p></div></div></div></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0d974320"]]);

export { index as default };
//# sourceMappingURL=index.vue6.mjs.map
