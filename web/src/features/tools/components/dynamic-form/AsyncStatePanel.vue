<template>
  <div class="space-y-3">
    <div
      v-if="loading"
      class="text-sm text-slate-400"
    >
      {{ loadingText }}
    </div>

    <div
      v-else-if="error"
      class="text-sm text-rose-400"
    >
      {{ errorPrefix }}{{ error }}
    </div>

    <div v-else :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    loading: boolean;
    error: string | null;
    loadingText?: string;
    errorPrefix?: string;
    contentClass?: string;
  }>(),
  {
    loadingText: "Loading...",
    errorPrefix: "Error: ",
    contentClass: "space-y-2",
  },
);
</script>
