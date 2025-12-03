<template>
  <div class="rounded-xl border border-white/10 bg-gray-900/40 transition">
    <div class="border-b border-white/10 px-5 py-4">
      <h3 class="text-lg font-semibold text-white">Configuration</h3>
    </div>

    <div class="space-y-5 p-5">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-400"
            >Start Date</label
          >
          <input
            type="date"
            :value="config.startDate"
            @input="updateStartDate"
            class="w-full rounded-lg border-0 bg-gray-800/50 px-4 py-2.5 text-sm text-gray-200 ring-1 ring-white/10 transition-all placeholder:text-gray-500 hover:ring-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-400"
            >End Date</label
          >
          <input
            type="date"
            :value="config.endDate"
            @input="updateEndDate"
            class="w-full rounded-lg border-0 bg-gray-800/50 px-4 py-2.5 text-sm text-gray-200 ring-1 ring-white/10 transition-all placeholder:text-gray-500 hover:ring-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      <div class="rounded-lg bg-gray-800/30 p-4 ring-1 ring-white/5">
        <label class="flex cursor-pointer items-center justify-between gap-4">
          <div>
            <span class="text-sm font-medium text-gray-200"
              >Fetch Book Details</span
            >
            <p class="mt-1 text-xs text-gray-500">
              Enables tags and more accurate metadata by fetching book details
              from the server. This may take longer for large libraries.
            </p>
          </div>
          <div class="relative flex h-6 w-11 items-center">
            <input
              type="checkbox"
              :checked="config.fetchBookDetails"
              @change="toggleFetchBookDetails"
              class="peer h-6 w-11 cursor-pointer appearance-none rounded-full bg-gray-700 ring-1 ring-white/10 transition-colors checked:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <div
              class="pointer-events-none absolute left-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
            />
          </div>
        </label>
      </div>

      <div>
        <h4 class="mb-3 text-sm font-medium text-gray-400">Visible Sections</h4>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <label
            v-for="key in sectionKeys"
            :key="key"
            class="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800/30 p-2.5 ring-1 ring-white/5 transition-all hover:bg-gray-800/50"
            :class="{
              'ring-blue-500/30 bg-blue-500/5': config.visibleSections[key],
            }"
          >
            <div class="relative flex h-4 w-4 items-center justify-center">
              <input
                type="checkbox"
                :checked="config.visibleSections[key]"
                @change="toggleSection(key)"
                class="peer h-4 w-4 cursor-pointer appearance-none rounded border-0 bg-gray-700 ring-1 ring-white/10 transition-all checked:bg-blue-500 checked:ring-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <Check
                class="pointer-events-none absolute h-2.5 w-2.5 text-white opacity-0 peer-checked:opacity-100"
                :stroke-width="3"
              />
            </div>
            <span class="text-xs text-gray-300">{{
              formatSectionName(key)
            }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Check } from "lucide-vue-next";
import type { StatsConfig } from "../types";

const props = defineProps<{
  config: StatsConfig;
}>();

const emit = defineEmits<{
  "update:config": [config: StatsConfig];
}>();

type SectionKey = keyof StatsConfig["visibleSections"];

const sectionKeys = computed<SectionKey[]>(
  () => Object.keys(props.config.visibleSections) as SectionKey[],
);

const updateStartDate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:config", { ...props.config, startDate: target.value });
};

const updateEndDate = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:config", { ...props.config, endDate: target.value });
};

const toggleFetchBookDetails = () => {
  emit("update:config", {
    ...props.config,
    fetchBookDetails: !props.config.fetchBookDetails,
  });
};

const toggleSection = (key: SectionKey) => {
  emit("update:config", {
    ...props.config,
    visibleSections: {
      ...props.config.visibleSections,
      [key]: !props.config.visibleSections[key],
    },
  });
};

const formatSectionName = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};
</script>
