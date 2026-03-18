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
        v-for="field in tool.fields"
        :key="field.name"
        :label="field.label"
        :description="field.description"
        :required="field.required"
      >
        <component
          :is="getFieldComponent(field.type)"
          v-bind="getFieldProps(field)"
          @update:modelValue="onFieldValueUpdate(field.name, $event)"
          @update:selectedLibrary="onSelectedLibraryUpdate(field.name, $event)"
          @update:itemSearch="onItemSearchUpdate(field.name, $event)"
          @loadItems="onLoadItems(field.name, $event)"
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
import type { ToolDefinition, ToolField } from "../types";
import ExecutionLogsPanel from "./dynamic-form/ExecutionLogsPanel.vue";
import ExecutionResultPanel from "./dynamic-form/ExecutionResultPanel.vue";
import FormFieldShell from "./dynamic-form/FormFieldShell.vue";
import { getFieldComponent } from "./dynamic-form/fieldRegistry";
import { useDynamicFormState } from "./dynamic-form/useDynamicFormState";

interface Props {
  tool: ToolDefinition;
}

type FieldValue = string | boolean | string[];

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

const getFieldProps = (field: ToolField) => {
  const shared = {
    modelValue: formData[field.name],
    required: field.required,
    placeholder: field.placeholder,
  };

  if (field.type === "select") {
    return {
      ...shared,
      options: field.options ?? [],
    };
  }

  if (field.type === "librarySelector" || field.type === "singleLibrarySelector") {
    return {
      ...shared,
      name: field.name,
      libraries: libraries[field.name] ?? [],
      loading: librariesLoading[field.name] ?? false,
      error: librariesError[field.name] ?? null,
    };
  }

  if (field.type === "libraryItemsSelector") {
    return {
      ...shared,
      libraries: libraries[field.name] ?? [],
      loading: librariesLoading[field.name] ?? false,
      error: librariesError[field.name] ?? null,
      selectedLibrary: selectedLibrary[field.name] ?? "",
      itemSearch: itemSearch[field.name] ?? "",
      items: items[field.name] ?? [],
      itemsLoading: itemsLoading[field.name] ?? false,
      itemsError: itemsError[field.name] ?? null,
    };
  }

  return shared;
};

const onFieldValueUpdate = (fieldName: string, value: FieldValue) => {
  updateFieldValue(fieldName, value);
};

const onSelectedLibraryUpdate = (fieldName: string, value: string) => {
  updateSelectedLibrary(fieldName, value);
};

const onItemSearchUpdate = (fieldName: string, value: string) => {
  updateItemSearch(fieldName, value);
};

const onLoadItems = (fieldName: string, libraryId: string) => {
  loadLibraryItems(fieldName, libraryId);
};
</script>
