<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-200">
      {{ label }}
      <span v-if="required" class="ml-1 text-rose-400">*</span>
    </label>
    <select
      :value="modelValue"
      @change="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
      :required="required"
      :disabled="disabled"
      class="w-full rounded-lg border border-white/10 bg-gray-900/60 px-3 py-2 text-sm text-gray-100 outline-none ring-0 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="getOptionValue(option)"
        :value="getOptionValue(option)"
      >
        {{ getOptionLabel(option) }}
      </option>
    </select>
    <p v-if="hint" class="text-xs text-gray-400">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
type OptionType = string | { value: string; label: string };

const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: OptionType[];
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    hint?: string;
  }>(),
  {
    required: false,
    disabled: false,
  },
);

defineEmits<{
  "update:modelValue": [value: string];
}>();

const getOptionValue = (option: OptionType) => {
  return typeof option === "string" ? option : option.value;
};

const getOptionLabel = (option: OptionType) => {
  return typeof option === "string" ? option : option.label;
};
</script>
