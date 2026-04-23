import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { a as useSeoMeta } from './v3.mjs';
import { u as useRouter, _ as _export_sfc } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'devalue';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Rayforce | Iniciar Sesión",
      description: "Inicia sesión o crea una cuenta en Rayforce"
    });
    useRouter();
    const username = ref("");
    const password = ref("");
    const fullName = ref("");
    const email = ref("");
    const registerPassword = ref("");
    const error = ref("");
    const isLoading = ref(false);
    const isLogin = ref(true);
    const showPassword = ref(false);
    const showRegisterPassword = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen pt-32 pb-20 px-8" }, _attrs))} data-v-48c8bcb0><div class="max-w-md mx-auto" data-v-48c8bcb0><div class="mb-12 text-center" data-v-48c8bcb0><h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-3" data-v-48c8bcb0><span class="text-on-surface" data-v-48c8bcb0>Bienvenido a </span><span class="text-primary font-rayforce" data-v-48c8bcb0>Rayforce</span></h1><p class="text-on-surface-variant text-sm mt-20" data-v-48c8bcb0>${ssrInterpolate(unref(isLogin) ? "Accede a tu cuenta" : "Crea una cuenta nueva")}</p></div><div class="bg-surface-container-lowest border border-outline-variant/15 p-8 rounded-xl space-y-6" data-v-48c8bcb0><div class="flex gap-2 bg-surface-container rounded-lg p-1" data-v-48c8bcb0><button class="${ssrRenderClass([
        "flex-1 py-2 px-4 rounded font-bold text-sm uppercase tracking-widest transition-all",
        unref(isLogin) ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
      ])}" type="button" data-v-48c8bcb0> Iniciar Sesión </button><button class="${ssrRenderClass([
        "flex-1 py-2 px-4 rounded font-bold text-sm uppercase tracking-widest transition-all",
        !unref(isLogin) ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
      ])}" type="button" data-v-48c8bcb0> Crear Cuenta </button></div>`);
      if (unref(isLogin)) {
        _push(`<form class="space-y-6" data-v-48c8bcb0><div class="space-y-2" data-v-48c8bcb0><label class="block text-sm font-bold text-on-surface" data-v-48c8bcb0>Usuario</label><input${ssrRenderAttr("value", unref(username))} type="text" placeholder="Nombre de Usuario o Correo electronico" class="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all" required data-v-48c8bcb0></div><div class="space-y-2" data-v-48c8bcb0><label class="block text-sm font-bold text-on-surface" data-v-48c8bcb0>Contraseña</label><div class="relative" data-v-48c8bcb0><input${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} placeholder="Tu contraseña" class="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all" required data-v-48c8bcb0><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"${ssrRenderAttr("aria-label", unref(showPassword) ? "Ocultar contraseña" : "Mostrar contraseña")} data-v-48c8bcb0><span class="material-symbols-outlined text-xl" data-v-48c8bcb0>${ssrInterpolate(unref(showPassword) ? "visibility" : "visibility_off")}</span></button></div></div>`);
        if (unref(error)) {
          _push(`<div class="p-4 bg-error/10 border border-error rounded-lg" data-v-48c8bcb0><p class="text-sm text-error font-medium" data-v-48c8bcb0>${ssrInterpolate(unref(error))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="w-full bg-primary text-on-primary py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" data-v-48c8bcb0>`);
        if (unref(isLoading)) {
          _push(`<span class="material-symbols-outlined animate-spin" data-v-48c8bcb0>progress_activity</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span data-v-48c8bcb0>${ssrInterpolate(unref(isLoading) ? "Ingresando..." : "Ingresar")}</span></button></form>`);
      } else {
        _push(`<form class="space-y-6" data-v-48c8bcb0><div class="space-y-2" data-v-48c8bcb0><label class="block text-sm font-bold text-on-surface" data-v-48c8bcb0>Nombre Completo</label><input${ssrRenderAttr("value", unref(fullName))} type="text" placeholder="Tu nombre completo" class="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all" required data-v-48c8bcb0></div><div class="space-y-2" data-v-48c8bcb0><label class="block text-sm font-bold text-on-surface" data-v-48c8bcb0>Correo Electrónico</label><input${ssrRenderAttr("value", unref(email))} type="email" placeholder="tu@correo.com" class="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all" required data-v-48c8bcb0></div><div class="space-y-2" data-v-48c8bcb0><label class="block text-sm font-bold text-on-surface" data-v-48c8bcb0>Contraseña</label><div class="relative" data-v-48c8bcb0><input${ssrRenderDynamicModel(unref(showRegisterPassword) ? "text" : "password", unref(registerPassword), null)}${ssrRenderAttr("type", unref(showRegisterPassword) ? "text" : "password")} placeholder="Mínimo 8 caracteres" class="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all" required data-v-48c8bcb0><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"${ssrRenderAttr("aria-label", unref(showRegisterPassword) ? "Ocultar contraseña" : "Mostrar contraseña")} data-v-48c8bcb0><span class="material-symbols-outlined text-xl" data-v-48c8bcb0>${ssrInterpolate(unref(showRegisterPassword) ? "visibility" : "visibility_off")}</span></button></div></div>`);
        if (unref(error)) {
          _push(`<div class="p-4 bg-error/10 border border-error rounded-lg" data-v-48c8bcb0><p class="text-sm text-error font-medium" data-v-48c8bcb0>${ssrInterpolate(unref(error))}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="w-full bg-primary text-on-primary py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3" data-v-48c8bcb0>`);
        if (unref(isLoading)) {
          _push(`<span class="material-symbols-outlined animate-spin" data-v-48c8bcb0>progress_activity</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span data-v-48c8bcb0>${ssrInterpolate(unref(isLoading) ? "Creando..." : "Crear Cuenta")}</span></button></form>`);
      }
      _push(`<div class="relative" data-v-48c8bcb0><div class="absolute inset-0 flex items-center" data-v-48c8bcb0><div class="w-full border-t border-outline-variant/20" data-v-48c8bcb0></div></div><div class="relative flex justify-center text-sm" data-v-48c8bcb0><span class="px-2 bg-surface-container-lowest text-on-surface-variant" data-v-48c8bcb0>${ssrInterpolate(unref(isLogin) ? "O inicia con" : "O crea con")}</span></div></div><button type="button" class="w-full border-2 border-outline-variant/30 text-on-surface py-3 rounded-lg font-bold uppercase tracking-widest hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3" data-v-48c8bcb0><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-48c8bcb0><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" data-v-48c8bcb0></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" data-v-48c8bcb0></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" data-v-48c8bcb0></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" data-v-48c8bcb0></path></svg> Continuar con Google </button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tienda",
        class: "w-full border-2 border-primary text-primary py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined" data-v-48c8bcb0${_scopeId}>storefront</span> Ir a la Tienda `);
          } else {
            return [
              createVNode("span", { class: "material-symbols-outlined" }, "storefront"),
              createTextVNode(" Ir a la Tienda ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-8 text-center" data-v-48c8bcb0><p class="text-on-surface-variant text-sm" data-v-48c8bcb0> ¿Problemas para acceder? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/soporte",
        class: "text-primary hover:underline font-bold"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Contacta Soporte `);
          } else {
            return [
              createTextVNode(" Contacta Soporte ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-48c8bcb0"]]);

export { login as default };
//# sourceMappingURL=login.vue.mjs.map
