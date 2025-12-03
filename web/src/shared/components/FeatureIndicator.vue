<template>
  <div class="flex items-center gap-1" :class="featureClass">
    <component :is="icon" class="h-3 w-3" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";

const props = defineProps<{
  available?: boolean | undefined;
}>();

const featureClass = computed(() => {
  if (props.available === true) return "text-green-400";
  if (props.available === false) return "text-red-400";
  return "text-gray-500";
});

const icon = computed(() => {
  if (props.available === true) {
    return h("svg", { fill: "currentColor", viewBox: "0 0 20 20" }, [
      h("path", {
        "fill-rule": "evenodd",
        d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
        "clip-rule": "evenodd",
      }),
    ]);
  } else if (props.available === false) {
    return h("svg", { fill: "currentColor", viewBox: "0 0 20 20" }, [
      h("path", {
        "fill-rule": "evenodd",
        d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
        "clip-rule": "evenodd",
      }),
    ]);
  } else {
    return h("svg", { fill: "currentColor", viewBox: "0 0 20 20" }, [
      h("path", {
        "fill-rule": "evenodd",
        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z",
        "clip-rule": "evenodd",
      }),
    ]);
  }
});
</script>
