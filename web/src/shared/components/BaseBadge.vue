<template>
  <span
    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
    :class="variantClasses"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral";
  }>(),
  {
    variant: "default",
  },
);

const variantClasses = computed(() => {
  const variants = {
    default: "bg-gray-600/20 text-gray-300",
    success: "bg-green-600/20 text-green-300",
    warning: "bg-yellow-600/20 text-yellow-300",
    danger: "bg-red-600/20 text-red-300",
    info: "bg-blue-600/20 text-blue-300",
    neutral: "bg-gray-800 text-gray-300",
  };
  return variants[props.variant];
});
</script>
