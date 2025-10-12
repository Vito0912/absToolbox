<template>
  <div class="space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-semibold tracking-tight">
        {{ selectedTool?.title || "Tool" }}
      </h1>
      <p
        class="text-gray-400 text-sm"
        v-if="selectedTool?.description"
        v-html="selectedTool?.description"
      />
    </div>

    <!-- WARNING IF NO SETTING -->
    <p
      v-if="!settingsStore.settings.serverUrl"
      class="text-sm text-red-400 text-center"
    >
      Please configure the server URL in the settings.
    </p>

    <p class="text-red-200" v-if="settingsStore.settings.serverUrl">
      <strong>Warning:</strong> Make a backup before using these tools. I am not
      responsible for any data loss or issues that may occur by using these
      tools. Visit
      <a
        :href="`${baseDomain}config/backups`"
        target="_blank"
        class="text-blue-400 underline"
        >Backups</a
      >
      to create a backup before proceeding.
    </p>

    <div v-if="toolId && selectedTool" class="p-6">
      <DynamicForm :tool="selectedTool" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { toolDefinitions } from "@/data/toolDefinitions";
import DynamicForm from "@/components/DynamicForm.vue";
import { useSettingsStore } from "@/stores/settings";
import { useRoute } from "vue-router";
import { useApi } from "@/composables/useApi";
const { baseDomain } = useApi();

const route = useRoute();

const toolId = computed(() => route.params.id as string | undefined);

const selectedTool = computed(
  () => toolDefinitions.find((tool) => tool.id === toolId.value) || null
);

const settingsStore = useSettingsStore();
const isDisabled = computed(() => !settingsStore.settings.serverUrl);
</script>
