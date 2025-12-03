<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-200">
      {{ label }}
      <span v-if="required" class="ml-1 text-rose-400">*</span>
    </label>
    <input
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="w-full rounded-lg border border-white/10 bg-gray-900/60 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <p v-if="hint" class="text-xs text-gray-400">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    type?: "text" | "password" | "email" | "url" | "number" | "date";
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    hint?: string;
  }>(),
  {
    type: "text",
    required: false,
    disabled: false,
  },
);

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
