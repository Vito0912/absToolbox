<template>
  <div class="space-y-6">
    <PageHeader
      title="Settings"
      subtitle="Configure your Audiobookshelf server connection"
    />

    <div class="flex flex-row gap-4">
      <div class="flex-1">
        <p class="text-sm text-gray-400 py-2">
          Note: All options you save are only stored locally and never leave
          your browser other than to contact the address you saved above. All
          requests are made client side and you can inspect them using your
          browser's developer tools.
        </p>

        <InfoBox variant="danger" class="my-4">
          <p>
            <strong>Note:</strong> You need to allow CORS for this website
            inside your Audiobookshelf server. Visit your Audiobookshelf
            server's settings page and add
            <br />
            <code class="text-white">https://abstoolbox.vito0912.de</code>
            <br />
            as an allowed origin. Without this all request will fail with a CORS
            error.
          </p>
        </InfoBox>

        <p class="text-sm text-gray-400 py-2">
          Alternatively, you can install a browser extension to temporarily
          disable CORS. However, please be aware that many of these extensions
          pose security risks.
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

    <BaseCard>
      <form @submit.prevent="saveSettings" class="grid gap-6">
        <BaseInput
          v-model="settingsStore.settings.serverUrl"
          label="Server URL"
          type="url"
          placeholder="https://your-audiobookshelf-server.com"
          required
        />

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

        <BaseInput
          v-if="settingsStore.settings.authMethod === 'token'"
          v-model="settingsStore.settings.apiToken"
          label="API Token"
          type="password"
          placeholder="Your API token"
          required
        />

        <div v-else class="grid gap-6 sm:grid-cols-2">
          <BaseInput
            v-model="settingsStore.settings.username"
            label="Username"
            placeholder="Your username"
            required
          />
          <BaseInput
            v-model="settingsStore.settings.password"
            label="Password"
            type="password"
            placeholder="Your password"
            required
          />
        </div>

        <InfoBox
          v-if="settingsStore.settings.serverUrl.startsWith('http:')"
          variant="warning"
          title="Insecure Connection"
        >
          <p class="text-sm leading-relaxed">
            You are using <code>http://</code>, which is
            <span class="font-semibold">not secure</span>. To allow connections
            you need to enable insecure content in your browser's site settings.
          </p>

          <p class="text-sm leading-relaxed mt-2">
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
              alt="Browser site settings"
              class="w-full max-w-md rounded-lg border border-white/10 shadow-md"
            />
            <img
              src="/images/insecure2.png"
              alt="Allow insecure content"
              class="w-full max-w-md rounded-lg border border-white/10 shadow-md"
            />
          </div>
        </InfoBox>

        <div
          class="mt-2 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row"
        >
          <BaseButton
            type="submit"
            variant="success"
            :disabled="!isValidUrl(settingsStore.settings.serverUrl)"
          >
            Save Settings
          </BaseButton>
          <BaseButton
            type="button"
            @click="testConnection"
            :loading="testing"
            :disabled="!isValidUrl(settingsStore.settings.serverUrl)"
          >
            Test Connection
          </BaseButton>
        </div>
      </form>
    </BaseCard>

    <InfoBox
      v-if="testResult"
      :variant="testResult.success ? 'success' : 'danger'"
    >
      {{ testResult.message }}
    </InfoBox>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSettingsStore } from "@/shared/settings";
import { useApi } from "@/shared/composables/useApi";
import {
  PageHeader,
  BaseInput,
  BaseButton,
  BaseCard,
  InfoBox,
} from "@/shared/components";

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
      message: `Connection successful! Server responded: ${response.data?.message || "OK"}`,
    };
  } catch (error: any) {
    testResult.value = {
      success: false,
      message: `Connection failed: ${error.response?.data?.message || error.message || "Unknown error"}`,
    };
  } finally {
    testing.value = false;
  }
};
</script>
