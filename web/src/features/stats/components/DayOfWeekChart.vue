<template>
  <div
    class="flex h-full flex-col rounded-xl border border-white/10 bg-gray-900/40 transition"
  >
    <div class="border-b border-white/10 px-5 py-4">
      <h3 class="text-lg font-semibold text-white">Listening by Day</h3>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <div class="space-y-2">
        <div
          v-for="day in orderedDays"
          :key="day.name"
          class="flex items-center gap-3"
        >
          <span class="w-10 text-sm font-medium text-gray-500">{{
            day.short
          }}</span>

          <div class="flex-1 h-6 overflow-hidden rounded-md bg-gray-700/30">
            <div
              class="h-full rounded-md transition-all duration-500"
              :class="day.name === peakDay ? 'bg-blue-500' : 'bg-blue-500/40'"
              :style="{ width: `${Math.max(getPercentage(day.time), 2)}%` }"
            />
          </div>

          <span
            class="w-16 text-right text-sm font-medium tabular-nums text-gray-400"
            >{{ formatTime(day.time) }}</span
          >
        </div>
      </div>

      <div
        v-if="peakDay"
        class="mt-4 flex items-center justify-center gap-3 rounded-lg bg-gray-800/30 px-4 py-3 ring-1 ring-white/5"
      >
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/50 ring-1 ring-white/10"
        >
          <Calendar class="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <p class="text-xs text-gray-500">Most active day</p>
          <p class="font-semibold text-white">{{ peakDay }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Calendar } from "lucide-vue-next";

const props = defineProps<{
  dayData: Record<string, number>;
  peakDay: string;
}>();

const daysOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const shortDays: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const orderedDays = computed(() => {
  return daysOrder.map((name) => ({
    name,
    short: shortDays[name],
    time: props.dayData[name] || 0,
  }));
});

const maxTime = computed(() => {
  const values = Object.values(props.dayData);
  return values.length > 0 ? Math.max(...values) : 1;
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
