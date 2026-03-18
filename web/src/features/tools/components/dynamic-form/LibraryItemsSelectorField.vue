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

    <div v-else class="space-y-3">
      <label class="block text-sm font-medium text-slate-200">Choose Library</label>
      <select
        :value="selectedLibrary"
        class="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
        @change="handleLibraryChange"
      >
        <option value="">-- Select a library --</option>
        <option
          v-for="library in libraries"
          :key="library.id"
          :value="library.id"
        >
          {{ library.name }} ({{ library.mediaType }})
        </option>
      </select>

      <div v-if="selectedLibrary" class="space-y-2">
        <input
          :value="itemSearch"
          type="text"
          placeholder="Search items..."
          class="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
          @input="handleSearch"
        />

        <div
          v-if="itemsLoading"
          class="text-sm text-slate-400"
        >
          Loading items...
        </div>

        <div
          v-else-if="itemsError"
          class="text-sm text-rose-400"
        >
          Error loading items: {{ itemsError }}
        </div>

        <div v-else class="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-white/10 p-2">
          <label
            v-for="item in filteredItems"
            :key="item.id"
            class="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition hover:bg-white/5"
          >
            <input
              v-model="selectedItems"
              type="checkbox"
              :value="item.id"
              class="h-4 w-4 rounded border-white/10 bg-slate-800 text-sky-600 focus:ring-2 focus:ring-sky-500"
            />
            <span class="text-sm text-slate-200">{{ item.media.metadata.title }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AbsLibrary, AbsLibraryItemMinified } from "@vito0912/abs-ts-sdk";
import { computed } from "vue";

const props = defineProps<{
  modelValue: string[];
  libraries: AbsLibrary[];
  loading: boolean;
  error: string | null;
  selectedLibrary: string;
  itemSearch: string;
  items: AbsLibraryItemMinified[];
  itemsLoading: boolean;
  itemsError: string | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
  "update:selectedLibrary": [value: string];
  "update:itemSearch": [value: string];
  loadItems: [libraryId: string];
}>();

const selectedItems = computed({
  get: () => (Array.isArray(props.modelValue) ? props.modelValue : []),
  set: (value: string[]) => emit("update:modelValue", value),
});

const filteredItems = computed(() => {
  const searchTerm = props.itemSearch.toLowerCase();
  if (!searchTerm) {
    return props.items;
  }

  return props.items.filter((item) =>
    item.media.metadata.title.toLowerCase().includes(searchTerm),
  );
});

const handleLibraryChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:selectedLibrary", target.value);
  emit("loadItems", target.value);
};

const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:itemSearch", target.value);
};
</script>
