<template>
  <div class="space-y-3">
    <div
      v-if="loading"
      class="text-sm text-slate-400"
    >
      Loading libraries...
    </div>

    <div
      v-else-if="error"
      class="text-sm text-rose-400"
    >
      Error loading libraries: {{ error }}
    </div>

    <div v-else class="space-y-2">
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
          {{ selected.length }} of {{ libraries.length }} selected
        </span>
      </div>

      <label
        v-for="library in libraries"
        :key="library.id"
        class="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-white/5"
      >
        <input
          v-model="selected"
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
  </div>
</template>

<script setup lang="ts">
import { AbsLibrary } from "@vito0912/abs-ts-sdk";
import { computed } from "vue";

const props = defineProps<{
  modelValue: string[];
  libraries: AbsLibrary[];
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const selected = computed({
  get: () => (Array.isArray(props.modelValue) ? props.modelValue : []),
  set: (value: string[]) => emit("update:modelValue", value),
});

const selectAll = () => {
  emit(
    "update:modelValue",
    props.libraries.map((library) => library.id),
  );
};

const deselectAll = () => {
  emit("update:modelValue", []);
};
</script>
