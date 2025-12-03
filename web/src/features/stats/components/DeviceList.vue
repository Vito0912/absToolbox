<template>
  <div
    class="flex h-full flex-col rounded-xl border border-white/10 bg-gray-900/40 transition"
  >
    <div class="border-b border-white/10 px-5 py-4">
      <h3 class="text-lg font-semibold text-white">Devices & Platforms</h3>
    </div>

    <div class="flex-1 p-5">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="device in devices"
          :key="device.name"
          class="flex items-center gap-3 rounded-lg bg-gray-800/30 p-3 ring-1 ring-white/5"
        >
          <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-800/50 ring-1 ring-white/10"
          >
            <Smartphone class="h-5 w-5 text-gray-400" />
          </div>

          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-gray-200">
              {{ device.name }}
            </p>
            <p class="text-xs text-gray-500">{{ device.os }}</p>
          </div>

          <div class="text-right">
            <p class="text-lg font-bold tabular-nums text-white">
              {{ device.count }}
            </p>
            <p class="text-xs text-gray-500">sessions</p>
          </div>
        </div>
      </div>

      <div
        v-if="devices.length === 0"
        class="flex flex-col items-center justify-center py-8 text-center"
      >
        <div
          class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800/50 ring-1 ring-white/10"
        >
          <Smartphone class="h-6 w-6 text-gray-500" />
        </div>
        <p class="text-sm text-gray-500">No devices found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Smartphone } from "lucide-vue-next";

defineProps<{
  devices: { name: string; os: string; count: number }[];
}>();
</script>
