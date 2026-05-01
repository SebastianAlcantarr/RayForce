import { defineComponent, ref, mergeProps, unref } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from "vue/server-renderer";
import "C:/Users/lanfa/.gemini/antigravity/scratch/Rayforce/RayForce/node_modules/hookable/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const password = ref("");
    const loading = ref(false);
    const errorMsg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-shell" }, _attrs))} data-v-4f102282><div class="login-card" data-v-4f102282><div class="login-logo" data-v-4f102282><span class="logo-bolt" data-v-4f102282>⚡</span><div data-v-4f102282><div class="logo-brand" data-v-4f102282>Rayforce</div><div class="logo-sub" data-v-4f102282>Panel Administrativo</div></div></div><form class="login-form" data-v-4f102282><div class="field-group" data-v-4f102282><label for="admin-password" class="field-label" data-v-4f102282>Contraseña de acceso</label><input id="admin-password"${ssrRenderAttr("value", unref(password))} type="password" class="field-input" placeholder="••••••••" autocomplete="current-password" required data-v-4f102282></div><button id="login-submit-btn" type="submit" class="login-btn"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-4f102282>`);
      if (unref(loading)) {
        _push(`<span class="spinner" data-v-4f102282></span>`);
      } else {
        _push(`<span data-v-4f102282>Ingresar al Panel →</span>`);
      }
      _push(`</button>`);
      if (unref(errorMsg)) {
        _push(`<p class="error-msg" data-v-4f102282>${ssrInterpolate(unref(errorMsg))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><p class="login-footer" data-v-4f102282>Acceso exclusivo para personal autorizado de Rayforce.</p></div></div>`);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=login.vue3.mjs.map
