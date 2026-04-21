import { ref } from "vue";
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
export {
  useAdminNotify
};
//# sourceMappingURL=useAdminNotify.mjs.map
