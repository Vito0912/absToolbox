<template>
  <div class="rounded-xl border p-4" :class="variantClasses">
    <div v-if="title" class="flex items-center gap-2 mb-2">
      <p class="font-semibold">{{ title }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "info" | "warning" | "danger" | "success";
    title?: string;
  }>(),
  {
    variant: "info",
  },
);

const variantClasses = computed(() => {
  const variants = {
    info: "border-blue-500/30 bg-blue-500/10 text-blue-200",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    danger: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  };
  return variants[props.variant];
});
</script>
