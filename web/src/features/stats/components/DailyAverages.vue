<template>
  <div class="rounded-xl border border-white/10 bg-gray-900/40 transition">
    <div
      class="flex items-center justify-between border-b border-white/10 px-4 py-3"
    >
      <h3 class="text-sm font-semibold text-white">Daily Averages</h3>
    </div>

    <div class="grid grid-cols-4 divide-x divide-white/5">
      <div class="px-3 py-2.5 text-center">
        <p class="text-lg font-bold tracking-tight text-white">
          {{ formatTime(last7) }}
        </p>
        <p class="text-xs text-gray-500">7 days</p>
      </div>
      <div class="px-3 py-2.5 text-center">
        <p class="text-lg font-bold tracking-tight text-white">
          {{ formatTime(last30) }}
        </p>
        <p class="text-xs text-gray-500">30 days</p>
      </div>
      <div class="px-3 py-2.5 text-center">
        <p class="text-lg font-bold tracking-tight text-white">
          {{ formatTime(last365) }}
        </p>
        <p class="text-xs text-gray-500">365 days</p>
      </div>
      <div class="px-3 py-2.5 text-center">
        <p class="text-lg font-bold tracking-tight text-white">
          {{ formatTime(allTime) }}
        </p>
        <p class="text-xs text-gray-500">All time</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  last7: number;
  last30: number;
  last365: number;
  allTime: number;
}>();

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
</script>
