<template>
  <section
    class="space-y-2 rounded-2xl border border-white/10 bg-slate-900 p-4 backdrop-blur-sm"
  >
    <header class="space-y-1">
      <label class="block text-sm font-semibold tracking-wide text-slate-100">
        {{ label }}
        <span
          v-if="required"
          class="ml-1 align-middle text-rose-400"
          aria-hidden="true"
          >*</span
        >
      </label>
      <p
        v-if="description"
        class="text-xs leading-relaxed text-slate-400"
      >
        {{ description }}
      </p>
    </header>

    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  description?: string;
  required?: boolean;
}>();
</script>
