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

    <div v-else class="space-y-1">
      <label
        v-for="library in libraries"
        :key="library.id"
        class="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-white/5"
      >
        <input
          type="radio"
          :name="`radio-${name}`"
          :value="library.id"
          :checked="modelValue === library.id"
          class="h-4 w-4 border-white/10 bg-slate-800 text-sky-600 focus:ring-2 focus:ring-sky-500"
          @change="select(library.id)"
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
import { AbsLibrary } from '@vito0912/abs-ts-sdk';


defineProps<{
  modelValue: string;
  name: string;
  libraries: AbsLibrary[];
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const select = (libraryId: string) => {
  emit("update:modelValue", libraryId);
};
</script>
