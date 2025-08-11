<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">Settings</h1>
      <p class="text-slate-400">
        Configure your Audiobookshelf server connection
      </p>
    </div>

    <div class="flex flex-row gap-4">
      <div class="flex-1">
        <p class="text-sm text-slate-400 py-2">
          Note: All options you save are only stored locally and never leave your
          browser other than to contact the address you saved above. All requests
          are made client side and you can inspect them using your browser's
          developer tools. They are not sent to any third-party service. Nor can
          anyone else see them unless you use an unsecure http:// connection.
        </p>

        <p class="text-md text-red-300 py-4">
          <strong>Note:</strong> You need to allow CORS for this website inside your
          Audiobookshelf server. Visit your Audiobookshelf server's settings page and add
          <br />
          <code class="text-white">https://abstoolbox.vito0912.de</code>
          <br />
          as an allowed origin. Without this all request will fail with a CORS error.
        </p>

        <p class="text-sm text-slate-400 py-2">
          Alternatively, you can install a browser extension to temporarily disable CORS.
          However, please be aware that many of these extensions pose security risks,
          and some may even contain malware, adware, or other threats.
        </p>
      </div>

      <div>
        <img
          src="/images/cors.png"
          alt="CORS Settings"
          class="h-80 rounded-lg"
        />
      </div>
    </div>



    <form
      @submit.prevent="saveSettings"
      class="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20"
    >
      <div class="grid gap-6">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-200"
            >Server URL</label
          >
          <input
            v-model="settingsStore.settings.serverUrl"
            type="url"
            placeholder="https://your-audiobookshelf-server.com"
            class="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
            required
          />
        </div>

        <div class="space-y-3">
          <label class="block text-sm font-medium text-slate-200"
            >Authentication Method</label
          >
          <div class="flex flex-wrap gap-3">
            <label
              class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 hover:border-indigo-400/50 transition"
            >
              <input
                v-model="settingsStore.settings.authMethod"
                type="radio"
                value="token"
                class="h-4 w-4 accent-indigo-500"
              />
              API Token
            </label>
          </div>
        </div>

        <div
          v-if="settingsStore.settings.authMethod === 'token'"
          class="space-y-2"
        >
          <label class="block text-sm font-medium text-slate-200"
            >API Token</label
          >
          <input
            v-model="settingsStore.settings.apiToken"
            type="password"
            placeholder="Your API token"
            class="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
            required
          />
        </div>

        <div v-else class="grid gap-6 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-200"
              >Username</label
            >
            <input
              v-model="settingsStore.settings.username"
              type="text"
              placeholder="Your username"
              class="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
              required
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-200"
              >Password</label
            >
            <input
              v-model="settingsStore.settings.password"
              type="password"
              placeholder="Your password"
              class="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
              required
            />
          </div>
        </div>

        <div
          class="mt-2 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row"
        >
          <button
            type="submit"
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 sm:w-auto"
          >
            Save Settings
          </button>
          <button
            type="button"
            @click="testConnection"
            :disabled="testing"
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition enabled:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {{ testing ? 'Testing...' : 'Test Connection' }}
          </button>
        </div>
      </div>
    </form>

    <div
      v-if="testResult"
      class="rounded-xl border p-4"
      :class="testResult.success
        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
        : 'border-rose-500/30 bg-rose-500/10 text-rose-200'"
    >
      {{ testResult.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useApi } from '@/composables/useApi'

const settingsStore = useSettingsStore()
const { get } = useApi()
const testing = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

const saveSettings = () => {
  settingsStore.saveSettings()
  testResult.value = { success: true, message: 'Settings saved successfully!' }
  setTimeout(() => {
    testResult.value = null
  }, 3000)
}

const testConnection = async () => {
  testing.value = true
  testResult.value = null

  try {
    const response = await get('/api/me')
    testResult.value = {
      success: true,
      message: `Connection successful! Server responded: ${
        response.data?.message || 'OK'
      }`
    }
  } catch (error: any) {
    testResult.value = {
      success: false,
      message: `Connection failed: ${
        error.response?.data?.message || error.message || 'Unknown error'
      }`
    }
  } finally {
    testing.value = false
  }
}
</script>