import __nuxt_component_0 from "../node_modules/nuxt/dist/app/components/nuxt-link.mjs";
import { defineComponent, mergeProps, withCtx, createVNode, unref } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { useAdminNotify } from "../composables/useAdminNotify.mjs";
import "C:/Users/lanfa/.gemini/antigravity/scratch/Rayforce/RayForce/node_modules/hookable/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "AdminLayout" },
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const { notifications } = useAdminNotify();
    const toastIcon = {
      success: "✓",
      error: "✕",
      info: "ℹ",
      warning: "⚠"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-shell" }, _attrs))} data-v-eb585ed8><aside class="sidebar" data-v-eb585ed8><div class="sidebar-logo" data-v-eb585ed8><span class="logo-icon" data-v-eb585ed8>⚡</span><span class="logo-text" data-v-eb585ed8>Rayforce</span><span class="logo-badge" data-v-eb585ed8>Admin</span></div><nav class="sidebar-nav" data-v-eb585ed8>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/inventario",
        class: "nav-item",
        "active-class": "nav-item--active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="nav-icon" data-v-eb585ed8${_scopeId}>📦</span><span data-v-eb585ed8${_scopeId}>Inventario</span>`);
          } else {
            return [
              createVNode("span", { class: "nav-icon" }, "📦"),
              createVNode("span", null, "Inventario")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><div class="sidebar-footer" data-v-eb585ed8><button class="logout-btn" data-v-eb585ed8><span data-v-eb585ed8>⬅</span><span data-v-eb585ed8>Cerrar Sesión</span></button></div></aside><div class="main-area" data-v-eb585ed8><header class="admin-header" data-v-eb585ed8><div class="header-breadcrumb" data-v-eb585ed8><span class="text-slate-400 text-sm" data-v-eb585ed8>Panel Administrativo</span><span class="text-slate-600 mx-2" data-v-eb585ed8>/</span>`);
      ssrRenderSlot(_ctx.$slots, "breadcrumb", {}, () => {
        _push(`<span class="text-white text-sm font-medium" data-v-eb585ed8>Inventario</span>`);
      }, _push, _parent);
      _push(`</div><div class="header-user" data-v-eb585ed8><div class="user-avatar" data-v-eb585ed8>RF</div><span class="user-name" data-v-eb585ed8>Rayforce</span></div></header><main class="admin-content" data-v-eb585ed8>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div><div class="toast-container" data-v-eb585ed8><!--[-->`);
      ssrRenderList(unref(notifications), (n) => {
        _push(`<div class="${ssrRenderClass([`toast--${n.type}`, "toast"])}" data-v-eb585ed8><span class="toast-icon" data-v-eb585ed8>${ssrInterpolate(toastIcon[n.type])}</span><span class="toast-msg" data-v-eb585ed8>${ssrInterpolate(n.message)}</span></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=admin.vue2.mjs.map
