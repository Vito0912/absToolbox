<template>
  <div
    class="group relative rounded-xl border border-white/10 bg-gray-900/40 p-5 shadow-lg shadow-black/20 transition hover:border-blue-400/40 hover:bg-blue-500/5 hover:shadow-xl cursor-pointer"
    :class="{
      'opacity-50 cursor-not-allowed': disabled,
    }"
    @click="$emit('select')"
  >
    <h3 class="text-base font-semibold text-gray-100 group-hover:text-white">
      {{ tool.title }}
    </h3>
    <p class="mt-2 text-sm text-gray-400">
      <span v-html="tool.description"></span>
      <span v-if="!(tool.enabled ?? true)" class="text-red-400">
        <br />Work in Progress
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ToolDefinition } from "../types";

defineProps<{
  tool: ToolDefinition;
  disabled?: boolean;
}>();

defineEmits<{
  select: [];
}>();
</script>

<style scoped>
</style>
