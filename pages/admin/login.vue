<template>
  <div class="login-shell">
    <div class="login-card">
      <!-- Logo -->
      <div class="login-logo">
        <span class="logo-bolt">⚡</span>
        <div>
          <div class="logo-brand">Rayforce</div>
          <div class="logo-sub">Panel Administrativo</div>
        </div>
      </div>

      <!-- Form -->
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="field-group">
          <label for="admin-password" class="field-label">Contraseña de acceso</label>
          <input
            id="admin-password"
            v-model="password"
            type="password"
            class="field-input"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>

        <button
          id="login-submit-btn"
          type="submit"
          class="login-btn"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner" />
          <span v-else>Ingresar al Panel →</span>
        </button>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
      </form>

      <p class="login-footer">Acceso exclusivo para personal autorizado de Rayforce.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const password = ref('')
const loading  = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  if (!password.value) return
  loading.value  = true
  errorMsg.value = ''

  try {
    const data = await $fetch<{ token: string; expires: number }>('/api/admin/verify-password', {
      method: 'POST',
      body: { password: password.value },
    })

    localStorage.setItem('rayforce_admin_session', JSON.stringify({
      token: data.token,
      expires: data.expires,
    }))

    await navigateTo('/admin/inventario')
  } catch (err: unknown) {
    const e = err as { statusMessage?: string; data?: { message?: string } }
    errorMsg.value = e?.statusMessage || 'Contraseña incorrecta. Inténtalo de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', 'Manrope', sans-serif;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 40px 36px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}

.login-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 36px;
}
.logo-bolt {
  font-size: 32px;
  background: #0057B8;
  border-radius: 10px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-brand { font-size: 20px; font-weight: 700; color: #f1f5f9; }
.logo-sub   { font-size: 12px; color: #64748b; margin-top: 1px; }

.login-form { display: flex; flex-direction: column; gap: 20px; }

.field-group { display: flex; flex-direction: column; gap: 8px; }
.field-label { font-size: 13px; font-weight: 500; color: #94a3b8; }
.field-input {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 12px 14px;
  color: #f1f5f9;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}
.field-input::placeholder { color: #475569; }
.field-input:focus { border-color: #0057B8; box-shadow: 0 0 0 3px rgba(0,87,184,0.15); }

.login-btn {
  background: #0057B8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 13px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
}
.login-btn:hover:not(:disabled) { background: #004494; transform: translateY(-1px); }
.login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-msg {
  background: #7f1d1d;
  color: #fca5a5;
  border: 1px solid #991b1b;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  text-align: center;
  margin: 0;
}

.login-footer {
  margin-top: 28px;
  font-size: 12px;
  color: #475569;
  text-align: center;
}
</style>
