<template>
  <div class="space-y-8">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-semibold tracking-tight">
        Audiobookshelf Toolbox
      </h1>
      <p class="text-gray-400 text-sm">Select a tool to get started</p>
    </div>

    <ToolWarning />

    <div
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr"
    >
      <ToolCard
        v-for="tool in toolDefinitions"
        :key="tool.id"
        :tool="tool"
        :disabled="isDisabled || !(tool.enabled ?? true)"
        @select="selectTool(tool)"
      />
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

const router = useRouter();
const { clearLogs } = useApi();
const settingsStore = useSettingsStore();

const isDisabled = computed(() => !settingsStore.settings.serverUrl);

const selectTool = (tool: ToolDefinition) => {
  clearLogs();
  router.push({ name: "tool", params: { id: tool.id } });
};
</script>
