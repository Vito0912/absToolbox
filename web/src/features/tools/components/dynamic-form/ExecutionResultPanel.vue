<template>
  <section
    v-if="result"
    class="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5"
  >
    <header
      class="flex items-center justify-between border-b border-white/10 bg-slate-900/50 px-4 py-3"
    >
      <h3 class="text-sm font-semibold">Execution Result</h3>
      <span
        class="text-sm font-semibold"
        :class="result.success ? 'text-emerald-300' : 'text-rose-300'"
      >
        {{ result.success ? "Success" : "Error" }}
      </span>
    </header>

    <div class="space-y-3 p-4">
      <p class="font-medium text-slate-200">{{ result.message }}</p>

      <div
        v-if="result.error"
        class="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-200"
      >
        <strong class="font-semibold">Error:</strong> {{ result.error }}
      </div>

      <div class="text-xs text-slate-500">
        Executed at: {{ new Date(result.timestamp).toLocaleString() }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ToolResult } from "../../types";

defineProps<{
  result: ToolResult | null;
}>();
</script>
