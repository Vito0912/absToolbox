import { defineStore } from "pinia";
import { ref } from "vue";
import type { Settings } from "@/features/tools/types";

export const useSettingsStore = defineStore("settings", () => {
  const settings = ref<Settings>({
    serverUrl: "",
    authMethod: "token",
    apiToken: "",
    username: "",
    password: "",
  });

  const saveSettings = () => {
    localStorage.setItem(
      "abs-toolbox-settings",
      JSON.stringify(settings.value),
    );
  };

  const loadSettings = () => {
    const saved = localStorage.getItem("abs-toolbox-settings");
    if (saved) {
      Object.assign(settings.value, JSON.parse(saved));
    }
  };

  loadSettings();

  return {
    settings,
    saveSettings,
    loadSettings,
  };
});
