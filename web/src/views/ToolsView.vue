<template>
  <div class="space-y-8">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-semibold tracking-tight">
        Audiobookshelf Toolbox
      </h1>
      <p class="text-slate-400 text-sm">Select a tool to get started</p>
    </div>

    <div
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr"
    >
      <div
        v-for="tool in toolDefinitions"
        :key="tool.id"
        class="group relative cursor-pointer rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 transition hover:border-indigo-400/40 hover:bg-indigo-500/5 hover:shadow-xl"
        :class="{
          'ring-2 ring-indigo-500/40': selectedTool?.id === tool.id
        }"
        @click="selectTool(tool)"
      >
        <h3
          class="text-base font-semibold text-slate-100 group-hover:text-white"
        >
          {{ tool.title }}
        </h3>
        <p class="mt-2 line-clamp-3 text-sm text-slate-400">
          {{ tool.description }}
        </p>

        <div class="mt-4 flex items-center justify-between text-xs">
          <span class="text-slate-500">{{ tool.fields.length }} fields</span>
          <span
            class="rounded-md bg-emerald-500/15 px-2 py-1 font-semibold text-emerald-300"
            >✓ Executable</span
          >
        </div>
      </div>
    </div>

    <div
      v-if="selectedTool"
      class="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20"
    >
      <DynamicForm :tool="selectedTool" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toolDefinitions } from '@/data/toolDefinitions'
import DynamicForm from '@/components/DynamicForm.vue'
import type { ToolDefinition } from '@/types/tool'

const selectedTool = ref<ToolDefinition | null>(null)

const selectTool = (tool: ToolDefinition) => {
  selectedTool.value = tool
}
</script>