<template>
  <div class="mx-auto max-w-3xl">
    <header class="mb-6 space-y-2">
      <h2 class="text-slate-50 bg-clip-text text-2xl font-semibold">
        {{ tool.title }}
      </h2>
      <p class="text-slate-400" v-html="tool.longDescription"></p>
    </header>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <FormFieldShell
        v-for="binding in fieldBindings"
        :key="binding.field.name"
        :label="binding.field.label"
        :description="binding.field.description"
        :required="binding.field.required"
      >
        <component
          :is="binding.component"
          v-bind="binding.props"
          v-on="binding.listeners"
        />
      </FormFieldShell>

      <div class="pt-2">
        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? `Executing... (${elapsedTime})` : "Execute Tool" }}
        </button>
      </div>
    </form>

    <ExecutionLogsPanel :logs="executionLogs" :elapsed-time="elapsedTime" />
    <ExecutionResultPanel :result="result" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ToolDefinition } from "../types";
import ExecutionLogsPanel from "./dynamic-form/ExecutionLogsPanel.vue";
import ExecutionResultPanel from "./dynamic-form/ExecutionResultPanel.vue";
import FormFieldShell from "./dynamic-form/FormFieldShell.vue";
import { resolveFieldBinding } from "../form/fieldRegistry";
import { useDynamicFormState } from "../form/useDynamicFormState";

interface Props {
  tool: ToolDefinition;
}

const props = defineProps<Props>();

const {
  elapsedTime,
  executionLogs,
  formData,
  handleSubmit,
  itemSearch,
  items,
  itemsError,
  itemsLoading,
  libraries,
  librariesError,
  librariesLoading,
  loadLibraryItems,
  loading,
  result,
  selectedLibrary,
  updateFieldValue,
  updateItemSearch,
  updateSelectedLibrary,
} = useDynamicFormState(props.tool);

const fieldBindings = computed(() => {
  const state = {
    formData,
    libraries,
    librariesLoading,
    librariesError,
    items,
    itemsLoading,
    itemsError,
    selectedLibrary,
    itemSearch,
  };

  const actions = {
    updateFieldValue,
    updateSelectedLibrary,
    updateItemSearch,
    loadLibraryItems,
  };

  return props.tool.fields.map((field) => ({
    field,
    ...resolveFieldBinding(field, state, actions),
  }));
});
</script>
