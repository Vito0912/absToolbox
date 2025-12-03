<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
    :class="[variantClasses, sizeClasses]"
  >
    <span
      v-if="loading"
      class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    variant: "primary",
    size: "md",
    type: "button",
    disabled: false,
    loading: false,
  },
);

const variantClasses = computed(() => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 focus:ring-blue-500/40",
    secondary: "bg-gray-600 hover:bg-gray-500 focus:ring-gray-500/40",
    success: "bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-500/40",
    danger: "bg-rose-600 hover:bg-rose-500 focus:ring-rose-500/40",
    ghost:
      "bg-transparent hover:bg-white/5 text-gray-300 shadow-none focus:ring-white/20",
  };
  return variants[props.variant];
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return sizes[props.size];
});
</script>
