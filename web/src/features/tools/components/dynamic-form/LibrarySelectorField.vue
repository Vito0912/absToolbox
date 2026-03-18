<template>
  <AsyncStatePanel
    :loading="libraryState.loading"
    :error="libraryState.error"
    loading-text="Loading libraries..."
    error-prefix="Error loading libraries: "
  >
    <div
      v-if="isMultiple"
      class="space-y-2"
    >
      <div class="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          class="rounded-lg bg-sky-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-sky-500"
          @click="selectAll"
        >
          Select All
        </button>
        <button
          type="button"
          class="rounded-lg bg-slate-700 px-3 py-1 text-xs font-medium text-white transition hover:bg-slate-600"
          @click="deselectAll"
        >
          Deselect All
        </button>
        <span class="text-xs text-slate-400">
          {{ selectedCount }} of {{ libraryState.libraries.length }} selected
        </span>
      </div>

      <label
        v-for="library in libraryState.libraries"
        :key="library.id"
        class="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-white/5"
      >
        <input
          v-model="selectedLibraries"
          type="checkbox"
          :value="library.id"
          class="h-4 w-4 rounded border-white/10 bg-slate-800 text-sky-600 focus:ring-2 focus:ring-sky-500"
        />
        <span class="text-sm font-medium text-slate-200">{{ library.name }}</span>
        <span class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-400">
          {{ library.mediaType }}
        </span>
      </label>
    </div>

    <div
      v-else
      class="space-y-1"
    >
      <label
        v-for="library in libraryState.libraries"
        :key="library.id"
        class="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-white/5"
      >
        <input
          type="radio"
          :name="`radio-${name}`"
          :value="library.id"
          :checked="modelValue === library.id"
          class="h-4 w-4 border-white/10 bg-slate-800 text-sky-600 focus:ring-2 focus:ring-sky-500"
          @change="selectSingle(library.id)"
        />
        <span class="text-sm font-medium text-slate-200">{{ library.name }}</span>
        <span class="rounded bg-slate-800 px-2 py-1 text-xs text-slate-400">
          {{ library.mediaType }}
        </span>
      </label>
    </div>
  </AsyncStatePanel>
</template>

<script setup lang="ts">
import AsyncStatePanel from "./AsyncStatePanel.vue";
import { computed } from "vue";
import type { LibraryAsyncState } from "../../form/types";

const props = defineProps<{
  modelValue: string | string[];
  mode: "single" | "multiple";
  name?: string;
  libraryState: LibraryAsyncState;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string | string[]];
}>();

const isMultiple = computed(() => props.mode === "multiple");

const selectedLibraries = computed({
  get: () => (Array.isArray(props.modelValue) ? props.modelValue : []),
  set: (value: string[]) => emit("update:modelValue", value),
});

const selectedCount = computed(() => selectedLibraries.value.length);

const selectAll = () => {
  emit(
    "update:modelValue",
    props.libraryState.libraries.map((library) => library.id),
  );
};

const deselectAll = () => {
  emit("update:modelValue", []);
};

const selectSingle = (libraryId: string) => {
  emit("update:modelValue", libraryId);
};
</script>
