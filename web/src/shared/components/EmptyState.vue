<template>
  <div class="flex flex-col items-center justify-center py-16">
    <div class="text-gray-500 mb-2">
      <slot name="icon">
        <FileText class="h-12 w-12 mx-auto" />
      </slot>
    </div>
    <p class="text-gray-400 text-center">{{ message }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
import { FileText } from "lucide-vue-next";

defineProps<{
  message: string;
}>();
</script>
