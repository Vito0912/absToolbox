<template>
  <div class="space-y-2">
    <div
      v-for="(item, index) in normalizedValues"
      :key="`${index}-${item}`"
      class="flex items-center gap-2"
    >
      <input
        :value="item"
        type="text"
        :placeholder="placeholder"
        class="flex-1 rounded-xl border border-white/10 bg-slate-900/90 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30"
        @input="updateItem(index, $event)"
      />
      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="normalizedValues.length <= 1"
        aria-label="Remove"
        title="Remove"
        @click="remove(index)"
      >
        ×
      </button>
    </div>

    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
      @click="add"
    >
      + Add Item
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string[]];
}>();

const normalizedValues = computed(() => {
  if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
    return props.modelValue;
  }
  return [""];
});

const updateItem = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const next = [...normalizedValues.value];
  next[index] = target.value;
  emit("update:modelValue", next);
};

const add = () => {
  emit("update:modelValue", [...normalizedValues.value, ""]);
};

const remove = (index: number) => {
  if (normalizedValues.value.length <= 1) {
    return;
  }

  const next = [...normalizedValues.value];
  next.splice(index, 1);
  emit("update:modelValue", next);
};
</script>
