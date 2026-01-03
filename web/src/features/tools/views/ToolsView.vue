<template>
  <div class="space-y-6">
    <PageHeader
      :title="selectedTool?.title || 'Tool'"
      :subtitle="selectedTool?.description"
    />

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
import { PageHeader } from "@/shared/components";
import { useRoute } from "vue-router";

const route = useRoute();

const toolId = computed(() => route.params.id as string | undefined);

const selectedTool = computed(
  () => toolDefinitions.find((tool) => tool.id === toolId.value) || null,
);
</script>
