<template>
  <div class="rounded-xl border border-white/10 bg-gray-900/40 transition">
    <div class="border-b border-white/10 px-5 py-4">
      <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
    </div>

    <div class="p-5">
      <div class="space-y-3">
        <div
          v-for="(book, index) in books"
          :key="book.libraryItemId"
          class="flex items-center gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-white/5"
        >
          <div
            class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gray-800/50 text-sm font-bold text-gray-400 ring-1 ring-white/10"
          >
            {{ index + 1 }}
          </div>

          <div
            class="relative h-12 w-8 flex-shrink-0 overflow-hidden rounded bg-gray-800 ring-1 ring-white/10"
          >
            <img
              v-if="book.coverPath"
              :src="getCoverUrl(book.libraryItemId)"
              :alt="book.title"
              class="h-full w-full object-cover"
              loading="lazy"
              @error="handleImageError"
            />
            <div v-else class="flex h-full w-full items-center justify-center">
              <BookOpen class="h-4 w-4 text-gray-600" />
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-gray-200">
              {{ book.title }}
            </p>
            <p class="truncate text-xs text-gray-500">{{ book.author }}</p>
          </div>

          <div class="text-right">
            <span class="text-sm font-medium tabular-nums text-gray-400">{{
              formatTime(book.time)
            }}</span>
          </div>
        </div>

        <div
          v-if="books.length === 0"
          class="flex flex-col items-center justify-center py-8 text-center"
        >
          <div
            class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800/50 ring-1 ring-white/10"
          >
            <BookOpen class="h-6 w-6 text-gray-500" />
          </div>
          <p class="text-sm text-gray-500">No data available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/shared/settings";
import { BookOpen } from "lucide-vue-next";

defineProps<{
  title: string;
  books: {
    title: string;
    author: string;
    time: number;
    coverPath: string | null;
    libraryItemId: string;
  }[];
}>();

const settingsStore = useSettingsStore();

const getCoverUrl = (libraryItemId: string) => {
  return `${settingsStore.settings.serverUrl}/api/items/${libraryItemId}/cover?token=${settingsStore.settings.apiToken}`;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
</script>
