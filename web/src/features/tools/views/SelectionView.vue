<template>
  <div class="space-y-6">
    <PageHeader
      title="Tools"
      subtitle="Powerful utilities to manage your Audiobookshelf server"
    />

    <InfoBox v-if="!isConfigured" variant="warning">
      <div class="flex items-center justify-between">
        <div>
          <p class="font-semibold text-amber-100">Configuration Required</p>
          <p class="mt-1 text-sm text-amber-200/80">
            Please configure your Audiobookshelf server connection to use these tools.
          </p>
        </div>
        <router-link
          to="/settings"
          class="shrink-0 ml-4 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
        >
          Go to Settings
        </router-link>
      </div>
    </InfoBox>

    <ToolWarning />

    <div class="space-y-6">
      <div
        v-for="group in groupedTools"
        :key="group.group"
      >
        <h4 class="text-sm font-semibold text-gray-100">{{ group.group }}</h4>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2">
          <ToolCard
            v-for="tool in group.tools"
            :key="tool.id"
            :tool="tool"
            :disabled="isDisabled || !(tool.enabled ?? true)"
            @select="selectTool(tool)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { toolDefinitions } from "../toolDefinitions";
import type { ToolDefinition } from "../types";
import { useSettingsStore } from "@/shared/settings";
import { useApi } from "@/shared/composables/useApi";
import { ToolCard, ToolWarning } from "../components";
import { PageHeader, InfoBox } from "@/shared/components";

const router = useRouter();
const { clearLogs } = useApi();
const settingsStore = useSettingsStore();

const isConfigured = computed(() => !!settingsStore.settings.serverUrl && !!settingsStore.settings.apiToken);
const isDisabled = computed(() => !isConfigured.value);

const selectTool = (tool: ToolDefinition) => {
  if (isDisabled.value) {
    router.push("/settings");
    return;
  }

  if (!(tool.enabled ?? true)) return;

  clearLogs();
  router.push({ name: "tool", params: { id: tool.id } });
};

const groupedTools = computed(() => {
  const map = new Map<string, ToolDefinition[]>();
  for (const t of toolDefinitions) {
    const key = t.group ?? "Other";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  return Array.from(map.entries()).map(([group, tools]) => ({ group, tools }));
});
</script>
