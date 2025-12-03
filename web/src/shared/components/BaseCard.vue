<template>
  <div
    class="rounded-xl border border-white/10 bg-gray-900/40 transition"
    :class="[
      hoverable && 'hover:border-white/20 hover:bg-gray-900/60 cursor-pointer',
      interactive && 'hover:border-blue-400/50 hover:bg-gray-900/60',
      padding && 'p-5',
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    hoverable?: boolean;
    interactive?: boolean;
    padding?: boolean;
  }>(),
  {
    hoverable: false,
    interactive: false,
    padding: true,
  },
);
</script>
