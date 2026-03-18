<template>
  <section
    v-if="logs.length > 0"
    class="mt-6 overflow-hidden rounded-2xl border border-sky-500/30 bg-slate-900"
  >
    <header
      class="flex items-center justify-between border-b border-sky-500/30 bg-sky-900/25 px-4 py-3"
    >
      <h3 class="text-sm font-semibold text-sky-200">Execution Progress</h3>
      <div class="flex items-center gap-2">
        <div class="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
        <span class="font-mono text-sm text-sky-300">{{ elapsedTime }}</span>
      </div>
    </header>

    <div class="max-h-64 overflow-y-auto p-4">
      <div class="space-y-1">
        <div
          v-for="(log, index) in logs"
          :key="index"
          class="animate-fade-in text-sm font-mono text-slate-300 [&_a]:text-sky-400 [&_a]:underline [&_a]:decoration-sky-400 [&_a]:hover:text-sky-300 [&_a]:hover:decoration-sky-300"
        >
          <span v-html="log" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  logs: string[];
  elapsedTime: string;
}>();
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
