import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { ref, defineComponent, mergeProps, withCtx, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
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

const notifications = ref([]);
let nextId = 0;
function push(type, message, duration = 4e3) {
  const id = ++nextId;
  notifications.value.push({ id, type, message });
  setTimeout(() => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  }, duration);
}
function useAdminNotify() {
  return {
    notifications,
    success: (msg) => push("success", msg),
    error: (msg) => push("error", msg, 6e3),
    info: (msg) => push("info", msg),
    warning: (msg) => push("warning", msg),
    dismiss: (id) => {
      notifications.value = notifications.value.filter((n) => n.id !== id);
    }
  };
}

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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-shell" }, _attrs))} data-v-af716df2><aside class="sidebar" data-v-af716df2><div class="sidebar-logo" data-v-af716df2><span class="logo-icon" data-v-af716df2>⚡</span><span class="logo-text" data-v-af716df2>Rayforce</span><span class="logo-badge" data-v-af716df2>Admin</span></div><nav class="sidebar-nav" data-v-af716df2>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/inventario",
        class: "nav-item",
        "active-class": "nav-item--active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="nav-icon" data-v-af716df2${_scopeId}>📦</span><span data-v-af716df2${_scopeId}>Inventario</span>`);
          } else {
            return [
              createVNode("span", { class: "nav-icon" }, "📦"),
              createVNode("span", null, "Inventario")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><div class="sidebar-footer" data-v-af716df2><button class="logout-btn" data-v-af716df2><span data-v-af716df2>⬅</span><span data-v-af716df2>Cerrar Sesión</span></button></div></aside><div class="main-area" data-v-af716df2><header class="admin-header" data-v-af716df2><div class="header-breadcrumb" data-v-af716df2><span class="text-slate-400 text-sm" data-v-af716df2>Panel Administrativo</span><span class="text-slate-600 mx-2" data-v-af716df2>/</span>`);
      ssrRenderSlot(_ctx.$slots, "breadcrumb", {}, () => {
        _push(`<span class="text-white text-sm font-medium" data-v-af716df2>Inventario</span>`);
      }, _push, _parent);
      _push(`</div><div class="header-user" data-v-af716df2><div class="user-avatar" data-v-af716df2>RF</div><span class="user-name" data-v-af716df2>Rayforce</span></div></header><main class="admin-content" data-v-af716df2>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div><div class="toast-container" data-v-af716df2><!--[-->`);
      ssrRenderList(unref(notifications), (n) => {
        _push(`<div class="${ssrRenderClass([`toast--${n.type}`, "toast"])}" data-v-af716df2><span class="toast-icon" data-v-af716df2>${ssrInterpolate(toastIcon[n.type])}</span><span class="toast-msg" data-v-af716df2>${ssrInterpolate(n.message)}</span></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const admin = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-af716df2"]]);

export { admin as default };
//# sourceMappingURL=admin.vue.mjs.map
