<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">Settings</h1>
      <p class="text-gray-400">
        Configure your Audiobookshelf server connection
      </p>
    </div>

    <div class="flex flex-row gap-4">
      <div class="flex-1">
        <p class="text-sm text-gray-400 py-2">
          Note: All options you save are only stored locally and never leave
          your browser other than to contact the address you saved above. All
          requests are made client side and you can inspect them using your
          browser's developer tools. They are not sent to any third-party
          service. Nor can anyone else see them unless you use an unsecure
          http:// connection.
        </p>

        <p class="text-md text-red-300 py-4">
          <strong>Note:</strong> You need to allow CORS for this website inside
          your Audiobookshelf server. Visit your Audiobookshelf server's
          settings page and add
          <br />
          <code class="text-white">https://abstoolbox.vito0912.de</code>
          <br />
          as an allowed origin. Without this all request will fail with a CORS
          error.
        </p>

        <p class="text-sm text-gray-400 py-2">
          Alternatively, you can install a browser extension to temporarily
          disable CORS. However, please be aware that many of these extensions
          pose security risks, and some may even contain malware, adware, or
          other threats.
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
          <label class="block text-sm font-medium text-gray-200"
            >Server URL</label
          >
          <input
            v-model="settingsStore.settings.serverUrl"
            type="url"
            placeholder="https://your-audiobookshelf-server.com"
            class="w-full rounded-lg border border-white/10 bg-gray-900/60 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
            required
          />
        </div>

        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-200"
            >Authentication Method</label
          >
          <div class="flex flex-wrap gap-3">
            <label
              class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-gray-900/60 px-3 py-2 text-sm text-gray-200 hover:border-blue-400/50 transition"
            >
              <input
                v-model="settingsStore.settings.authMethod"
                type="radio"
                value="token"
                class="h-4 w-4 accent-blue-500"
              />
              API Token
            </label>
          </div>
        </div>

        <div
          v-if="settingsStore.settings.authMethod === 'token'"
          class="space-y-2"
        >
          <label class="block text-sm font-medium text-gray-200"
            >API Token</label
          >
          <input
            v-model="settingsStore.settings.apiToken"
            type="password"
            placeholder="Your API token"
            class="w-full rounded-lg border border-white/10 bg-gray-900/60 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
            required
          />
        </div>

        <div v-else class="grid gap-6 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-200"
              >Username</label
            >
            <input
              v-model="settingsStore.settings.username"
              type="text"
              placeholder="Your username"
              class="w-full rounded-lg border border-white/10 bg-gray-900/60 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-200"
              >Password</label
            >
            <input
              v-model="settingsStore.settings.password"
              type="password"
              placeholder="Your password"
              class="w-full rounded-lg border border-white/10 bg-gray-900/60 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>
        </div>

        <div
          v-if="settingsStore.settings.serverUrl.startsWith('http:')"
          class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-200 space-y-4"
        >
          <div class="flex items-center gap-2 text-amber-300">
            <p class="font-semibold text-lg">Insecure Connection</p>
          </div>

          <p class="text-sm leading-relaxed">
            You are using <code>http://</code>, which is
            <span class="font-semibold">not secure</span>. To allow connections
            you need to enable insecure content in your browser’s site settings.
            After this, restart Chrome and re-enter the address. For others
            browsers please refer to their documentation to allow
            <code>mixed content</code>.
          </p>

          <p class="text-sm leading-relaxed">
            If you still get <code>Connection failed: Network Error</code>, try
            using:
            <br />
            <span class="font-mono text-white break-all">
              {{ settingsStore.settings.serverUrl }}/audiobookshelf
            </span>
          </p>

          <div class="flex flex-col gap-4 pt-2">
            <img
              src="/images/insecure1.png"
              alt="Browser site settings insecure content"
              class="w-full max-w-md rounded-lg border border-white/10 shadow-md object-contain mx-auto"
            />
            <img
              src="/images/insecure2.png"
              alt="Allow insecure content option"
              class="w-full max-w-md rounded-lg border border-white/10 shadow-md object-contain mx-auto"
            />
          </div>
        </div>

        <div
          class="mt-2 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row"
        >
          <button
            type="submit"
            :disabled="!isValidUrl(settingsStore.settings.serverUrl)"
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Save Settings
          </button>
          <button
            type="button"
            @click="testConnection"
            :disabled="testing || !isValidUrl(settingsStore.settings.serverUrl)"
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition enabled:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {{ testing ? "Testing..." : "Test Connection" }}
          </button>
        </div>
      </div>
    </form>

    <div
      v-if="testResult"
      class="rounded-xl border p-4"
      :class="
        testResult.success
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          : 'border-rose-500/30 bg-rose-500/10 text-rose-200'
      "
    >
      {{ testResult.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { useApi } from "@/composables/useApi";

const settingsStore = useSettingsStore();
const { get } = useApi();
const testing = ref(false);
const testResult = ref<{ success: boolean; message: string } | null>(null);

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const saveSettings = () => {
  settingsStore.saveSettings();
  testResult.value = { success: true, message: "Settings saved successfully!" };
  setTimeout(() => {
    testResult.value = null;
  }, 3000);
};

const testConnection = async () => {
  testing.value = true;
  testResult.value = null;

  try {
    const response = await get("/api/me");
    testResult.value = {
      success: true,
      message: `Connection successful! Server responded: ${
        response.data?.message || "OK"
      }`,
    };
  } catch (error: any) {
    testResult.value = {
      success: false,
      message: `Connection failed: ${
        error.response?.data?.message || error.message || "Unknown error"
      }`,
    };
  } finally {
    testing.value = false;
  }
};
</script>
