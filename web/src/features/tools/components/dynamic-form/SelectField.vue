<template>
  <select
    :value="modelValue"
    :required="required"
    class="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
    @change="onChange"
  >
    <option value="">Choose an option...</option>
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  options?: string[];
  required?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
};
</script>
