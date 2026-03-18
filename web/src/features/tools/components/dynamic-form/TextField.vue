<template>
  <input
    :value="modelValue"
    :type="inputType"
    :placeholder="placeholder"
    :required="required"
    class="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
    @input="onInput"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
  required?: boolean;
  inputType?: "text" | "date";
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>
