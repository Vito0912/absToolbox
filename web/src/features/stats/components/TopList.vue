<template>
  <div class="rounded-xl border border-white/10 bg-gray-900/40 transition">
    <div class="border-b border-white/10 px-5 py-4">
      <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
    </div>

    <div class="p-5">
      <div class="space-y-4">
        <div
          v-for="(item, index) in items"
          :key="item.name"
          class="flex items-center gap-4"
        >
          <div
            class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gray-800/50 text-sm font-bold text-gray-400 ring-1 ring-white/10"
          >
            {{ index + 1 }}
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-3 mb-2">
              <span class="text-sm font-medium text-gray-200 truncate">{{
                item.name
              }}</span>
              <span
                class="text-sm font-medium text-gray-400 tabular-nums whitespace-nowrap"
                >{{ formatTime(item.time) }}</span
              >
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-gray-700/50">
              <div
                class="h-full rounded-full bg-blue-500 transition-all duration-500"
                :style="{ width: `${getPercentage(item.time)}%` }"
              />
            </div>
          </div>
        </div>

        <div
          v-if="items.length === 0"
          class="flex flex-col items-center justify-center py-8 text-center"
        >
          <div
            class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800/50 ring-1 ring-white/10"
          >
            <Inbox class="h-6 w-6 text-gray-500" />
          </div>
          <p class="text-sm text-gray-500">No data available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Inbox } from "lucide-vue-next";

const props = defineProps<{
  title: string;
  items: { name: string; time: number }[];
}>();

const maxTime = computed(() => {
  if (props.items.length === 0) return 1;
  return Math.max(...props.items.map((i) => i.time));
});

const getPercentage = (time: number) => {
  return (time / maxTime.value) * 100;
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
