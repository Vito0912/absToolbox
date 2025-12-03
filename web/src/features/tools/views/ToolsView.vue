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

    <ToolWarning />

    <div v-if="toolId && selectedTool" class="p-6">
      <DynamicForm :tool="selectedTool" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { toolDefinitions } from "../toolDefinitions";
import { DynamicForm, ToolWarning } from "../components";
import { useRoute } from "vue-router";

const route = useRoute();

const toolId = computed(() => route.params.id as string | undefined);

const selectedTool = computed(
  () => toolDefinitions.find((tool) => tool.id === toolId.value) || null,
);
</script>
