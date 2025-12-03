<template>
  <div
    class="group relative rounded-xl border border-white/10 bg-gray-900/40 p-5 shadow-lg shadow-black/20 transition hover:border-blue-400/40 hover:bg-blue-500/5 hover:shadow-xl cursor-pointer"
    :class="{
      'opacity-50 cursor-not-allowed pointer-events-none': disabled,
    }"
    @click="!disabled && $emit('select')"
  >
    <h3 class="text-base font-semibold text-gray-100 group-hover:text-white">
      {{ tool.title }}
    </h3>
    <p class="mt-2 line-clamp-3 text-sm text-gray-400">
      <span v-html="tool.description"></span>
      <span v-if="!(tool.enabled ?? true)" class="text-red-400">
        <br />Work in Progress
      </span>
    </p>

    <div class="mt-4 flex items-center justify-between text-xs">
      <span class="text-gray-500">{{ tool.fields.length }} fields</span>
      <span
        class="rounded-md bg-emerald-500/15 px-2 py-1 font-semibold text-emerald-300"
      >
        ✓ Executable
      </span>
    </div>
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
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
