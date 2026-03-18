<template>
  <div class="inline-flex items-center gap-3 rounded-xl px-3 py-2">
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      class="relative h-7 w-12 rounded-full border border-white/10 transition-all duration-200"
      :class="modelValue ? 'bg-sky-600 shadow-sky-600 shadow' : 'bg-slate-800'"
      @click="toggle"
    >
      <span
        class="absolute top-1 left-1 inline-block h-5 w-5 rounded-full bg-white transition-transform duration-200"
        :class="modelValue ? 'translate-x-5' : ''"
      />
    </button>
    <span class="text-sm font-medium text-slate-300">
      {{ modelValue ? "Enabled" : "Disabled" }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const toggle = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>
