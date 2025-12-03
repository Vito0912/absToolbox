<template>
  <div
    class="flex flex-col items-center justify-center"
    :class="containerClass"
  >
    <div
      class="animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
      :class="sizeClasses"
    />
    <p v-if="message" class="text-gray-400 mt-3">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    size?: "sm" | "md" | "lg";
    message?: string;
    fullPage?: boolean;
  }>(),
  {
    size: "md",
    fullPage: false,
  },
);

const sizeClasses = computed(() => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };
  return sizes[props.size];
});

const containerClass = computed(() => {
  return props.fullPage ? "py-16" : "";
});
</script>
