<template>
  <div class="admin-shell">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">Rayforce</span>
        <span class="logo-badge">Admin</span>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink to="/admin/inventario" class="nav-item" active-class="nav-item--active">
          <span class="nav-icon">📦</span>
          <span>Inventario</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="logout">
          <span>⬅</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-area">
      <header class="admin-header">
        <div class="header-breadcrumb">
          <span class="text-slate-400 text-sm">Panel Administrativo</span>
          <span class="text-slate-600 mx-2">/</span>
          <slot name="breadcrumb">
            <span class="text-white text-sm font-medium">Inventario</span>
          </slot>
        </div>
        <div class="header-user">
          <div class="user-avatar">RF</div>
          <span class="user-name">Rayforce</span>
        </div>
      </header>

      <main class="admin-content">
        <slot />
      </main>
    </div>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="n in notifications"
          :key="n.id"
          class="toast"
          :class="`toast--${n.type}`"
          @click="dismiss(n.id)"
        >
          <span class="toast-icon">{{ toastIcon[n.type] }}</span>
          <span class="toast-msg">{{ n.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AdminLayout' })

const { notifications, dismiss } = useAdminNotify()

const toastIcon: Record<string, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
}

function logout() {
  if (import.meta.client) {
    localStorage.removeItem('rayforce_admin_session')
  }
  navigateTo('/admin/login')
}
</script>

<style scoped>
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: #0f172a;
  font-family: 'Inter', 'Manrope', sans-serif;
}

/* ── Sidebar ─────────────────────────────────── */
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: #1e293b;
  border-right: 1px solid #334155;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 20px 24px;
  border-bottom: 1px solid #334155;
}

.logo-icon { font-size: 20px; }
.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.3px;
}
.logo-badge {
  font-size: 10px;
  background: #0057B8;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
}
.nav-item:hover { background: #334155; color: #e2e8f0; }
.nav-item--active { background: #0057B8; color: #ffffff; }
.nav-icon { font-size: 16px; }

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid #334155;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}
.logout-btn:hover { background: #7f1d1d22; color: #f87171; }

/* ── Main Area ─────────────────────────────────── */
.main-area {
  margin-left: 220px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
  position: sticky;
  top: 0;
  z-index: 40;
}

.header-breadcrumb { display: flex; align-items: center; }
.header-user { display: flex; align-items: center; gap: 10px; }

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0057B8;
  color: white;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-name { font-size: 13px; color: #cbd5e1; }

.admin-content {
  flex: 1;
  padding: 28px;
}

/* ── Toast ─────────────────────────────────── */
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  backdrop-filter: blur(8px);
  transition: all 0.2s;
}
.toast:hover { opacity: 0.85; transform: scale(0.98); }

.toast--success { background: #14532d; color: #86efac; border: 1px solid #166534; }
.toast--error   { background: #7f1d1d; color: #fca5a5; border: 1px solid #991b1b; }
.toast--info    { background: #1e3a5f; color: #93c5fd; border: 1px solid #1d4ed8; }
.toast--warning { background: #78350f; color: #fcd34d; border: 1px solid #92400e; }

.toast-icon { font-size: 15px; flex-shrink: 0; }
.toast-msg  { flex: 1; line-height: 1.4; }

/* ── Transitions ─────────────────────────────────── */
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to   { opacity: 0; transform: translateX(40px); }
</style>
