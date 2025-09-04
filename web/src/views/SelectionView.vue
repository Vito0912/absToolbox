<template>
  <div class="space-y-8">
    <div class="text-center space-y-2">
      <h1 class="text-3xl font-semibold tracking-tight">
        Audiobookshelf Toolbox
      </h1>
      <p class="text-slate-400 text-sm">Select a tool to get started</p>
    </div>

    <p
      v-if="!settingsStore.settings.serverUrl"
      class="text-sm text-red-400 text-center"
    >
      Please configure the server URL in the settings.
    </p>

    <p class="text-red-200" v-if="settingsStore.settings.serverUrl">
      <strong>Warning:</strong> Make a backup before using these tools. I am not responsible for any data loss or issues that may occur by using these tools. Visit
      <a :href="`${baseDomain}config/backups`" target="_blank" class="text-blue-400 underline">Backups</a>
      to create a backup before proceeding.
    </p>

    <!-- Tools -->
    <div
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr"
    >
      <div
        v-for="tool in toolDefinitions"
        :key="tool.id"
        class="group relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 transition hover:border-indigo-400/40 hover:bg-indigo-500/5 hover:shadow-xl cursor-pointer"
        :class="{
          'opacity-50 cursor-not-allowed pointer-events-none': isDisabled || !(tool.enabled ?? true)
        }"
        @click="!isDisabled && (tool.enabled ?? true) && selectTool(tool)"
      >
        <h3
          class="text-base font-semibold text-slate-100 group-hover:text-white"
        >
          {{ tool.title }}
        </h3>
        <p class="mt-2 line-clamp-3 text-sm text-slate-400">
          <span v-html="tool.description"></span>
          <span v-if="!(tool.enabled ?? true)" class="text-red-400"><br />Work in Progress</span>
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
  </div>
  
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toolDefinitions } from '@/data/toolDefinitions'
import type { ToolDefinition } from '@/types/tool'
import { useSettingsStore } from '@/stores/settings'
import router from '@/router'
import { useApi } from '@/composables/useApi'

const { clearLogs, baseDomain } = useApi()
const settingsStore = useSettingsStore()

const isDisabled = computed(() => !settingsStore.settings.serverUrl)

const selectTool = (tool: ToolDefinition) => {
  clearLogs()
  router.push({ name: 'tool', params: { id: tool.id } })
}
</script>
