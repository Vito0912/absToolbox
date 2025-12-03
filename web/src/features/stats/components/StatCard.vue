<template>
  <div
    class="rounded-xl border border-white/10 bg-gray-900/40 p-5 transition hover:border-white/20 hover:bg-gray-900/60"
  >
    <div class="flex items-center gap-3">
      <div
        class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800/50 ring-1 ring-white/10"
      >
        <slot name="icon">
          <div class="h-5 w-5 text-blue-400" />
        </slot>
      </div>
      <span class="text-sm font-medium text-gray-400">{{ label }}</span>
    </div>

    <div class="mt-4 text-3xl font-bold tracking-tight text-white">
      <slot>{{ value }}</slot>
    </div>

    <p v-if="description" class="mt-2 text-xs text-gray-500">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value?: string | number;
  description?: string;
}>();
</script>
