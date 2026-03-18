<template>
  <AsyncStatePanel
    :loading="libraryState.loading"
    :error="libraryState.error"
    loading-text="Loading libraries..."
    error-prefix="Error loading libraries: "
    content-class="space-y-3"
  >
    <label class="block text-sm font-medium text-slate-200">Choose Library</label>
    <select
      :value="itemState.selectedLibrary"
      class="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
      @change="handleLibraryChange"
    >
      <option value="">-- Select a library --</option>
      <option
        v-for="library in libraryState.libraries"
        :key="library.id"
        :value="library.id"
      >
        {{ library.name }} ({{ library.mediaType }})
      </option>
    </select>

    <div v-if="itemState.selectedLibrary" class="space-y-2">
      <input
        :value="itemState.itemSearch"
        type="text"
        placeholder="Search items..."
        class="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
        @input="handleSearch"
      />

      <AsyncStatePanel
        :loading="itemState.loading"
        :error="itemState.error"
        loading-text="Loading items..."
        error-prefix="Error loading items: "
        content-class="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-white/10 p-2"
      >
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
      </AsyncStatePanel>
    </div>
  </AsyncStatePanel>
</template>

<script setup lang="ts">
import AsyncStatePanel from "./AsyncStatePanel.vue";
import { computed } from "vue";
import type { LibraryAsyncState, LibraryItemsState } from "../../form/types";

const props = defineProps<{
  modelValue: string[];
  libraryState: LibraryAsyncState;
  itemState: LibraryItemsState;
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
  const searchTerm = props.itemState.itemSearch.toLowerCase();
  if (!searchTerm) {
    return props.itemState.items;
  }

  return props.itemState.items.filter((item) =>
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
