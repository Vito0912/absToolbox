import { computed, ref } from "vue";
import { useSettingsStore } from "@/shared/settings";
import { createAbsClient } from "@vito0912/abs-ts-sdk";

const executionLogs = ref<string[]>([]);
const executionStartTime = ref<number | null>(null);
const isExecuting = ref(false);

export function useApi() {
  const settingsStore = useSettingsStore();

  type AbsClient = ReturnType<typeof createAbsClient>;

  let cachedClient: AbsClient | null = null;
  let cachedBaseUrl = "";
  let cachedAccessToken = "";

  const getAbsClient = (): AbsClient => {
    const baseUrl = settingsStore.settings.serverUrl.trim();
    const accessToken = settingsStore.settings.apiToken.trim();

    if (!baseUrl) {
      throw new Error("A valid ABS server URL is required.");
    }

    try {
      new URL(baseUrl);
    } catch {
      throw new Error("A valid ABS server URL is required.");
    }

    if (
      !cachedClient ||
      cachedBaseUrl !== baseUrl ||
      cachedAccessToken !== accessToken
    ) {
      cachedClient = createAbsClient({
        authTokens: {
          accessToken,
        },
        baseUrl,
      });
      cachedBaseUrl = baseUrl;
      cachedAccessToken = accessToken;
    }

    return cachedClient;
  };

  const absClient = new Proxy({} as AbsClient, {
    get(_target, property, receiver) {
      const client = getAbsClient();
      const value = Reflect.get(client as object, property, receiver);

      return typeof value === "function" ? value.bind(client) : value;
    },
  });

  const baseDomain = computed(() => {
    try {
      const url = new URL(settingsStore.settings.serverUrl);
      return url;
    } catch {
      return null;
    }
  });

  const startExecution = () => {
    executionLogs.value = [];
    executionStartTime.value = Date.now();
    isExecuting.value = true;
  };

  const stopExecution = () => {
    isExecuting.value = false;
    executionStartTime.value = null;
  };

  const addLog = (...messages: string[]) => {
    const timestamp = new Date().toLocaleTimeString();
    const combinedMessage = messages.filter(Boolean).join(" ");
    executionLogs.value.push(`[${timestamp}] ${combinedMessage}`);
  };

  const clearLogs = () => {
    executionLogs.value = [];
  };

  const getElapsedTime = () => {
    if (!executionStartTime.value) return "0:00";
    const elapsed = Math.floor((Date.now() - executionStartTime.value) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    absClient,
    baseDomain,
    executionLogs,
    isExecuting,
    startExecution,
    stopExecution,
    addLog,
    clearLogs,
    getElapsedTime,
  };
}
