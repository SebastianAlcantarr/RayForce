import { ref } from 'vue'

export type NotifyType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: number
  type: NotifyType
  message: string
}

const notifications = ref<Notification[]>([])
let nextId = 0

function push(type: NotifyType, message: string, duration = 4000) {
  const id = ++nextId
  notifications.value.push({ id, type, message })
  setTimeout(() => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }, duration)
}

export function useAdminNotify() {
  return {
    notifications,
    success: (msg: string) => push('success', msg),
    error: (msg: string) => push('error', msg, 6000),
    info: (msg: string) => push('info', msg),
    warning: (msg: string) => push('warning', msg),
    dismiss: (id: number) => {
      notifications.value = notifications.value.filter((n) => n.id !== id)
    },
  }
}
