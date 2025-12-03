<template>
  <div
    class="flex h-full flex-col rounded-xl border border-white/10 bg-gray-900/40 transition"
  >
    <div class="border-b border-white/10 px-5 py-4">
      <h3 class="text-lg font-semibold text-white">Listening by Hour</h3>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <div
        class="relative flex flex-1 items-end gap-1"
        style="min-height: 160px"
      >
        <div
          v-for="hour in 24"
          :key="hour - 1"
          class="group relative flex-1 cursor-pointer"
          :style="{ height: `${Math.max(getHeight(hour - 1), 4)}%` }"
        >
          <div
            class="h-full w-full rounded-t-sm transition-all duration-300"
            :class="[
              hour - 1 === peakHour
                ? 'bg-blue-500'
                : 'bg-blue-400 hover:bg-blue-500',
            ]"
          />

          <div
            class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-xs opacity-0 shadow-xl ring-1 ring-white/10 transition-opacity group-hover:opacity-100"
          >
            <p class="font-medium text-white">{{ formatHour(hour - 1) }}</p>
            <p class="text-gray-400">
              {{ formatTime(hourData[String(hour - 1)] ?? 0) }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-3 flex justify-between text-xs font-medium text-gray-500">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>11 PM</span>
      </div>

      <div
        class="mt-4 flex items-center justify-center gap-3 rounded-lg bg-gray-800/30 px-4 py-3 ring-1 ring-white/5"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/50 ring-1 ring-white/10"
        >
          <Sun class="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <p class="text-xs text-gray-500">Peak listening</p>
          <p class="font-semibold text-white">{{ formatHour(peakHour) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Sun } from "lucide-vue-next";

const props = defineProps<{
  hourData: Record<string, number>;
  peakHour: number;
}>();

const hasData = computed(() => {
  const values = Object.values(props.hourData);
  return values.length > 0 && values.some((v) => v > 0);
});

const maxValue = computed(() => {
  const values = Object.values(props.hourData);
  return values.length > 0 ? Math.max(...values, 1) : 1;
});

const getHeight = (hour: number) => {
  const value = props.hourData[String(hour)] ?? 0;
  if (!hasData.value) return 8;
  if (value === 0) return 4;
  return Math.max((value / maxValue.value) * 100, 8);
};

const formatHour = (hour: number) => {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
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
