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

    <!-- External Projects -->
    <div v-if="externalProjects.length" class="space-y-4 pt-4">
    <div class="pb-4">
        <h2 class="text-xl font-semibold tracking-tight pb-1">External Projects</h2>
        <p class="text-slate-400 text-sm">External projects are handpicked projects by other awesome developers that contribute to the Audiobookshelf ecosystem.</p>
    </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
        <a
          v-for="proj in externalProjects"
          :key="proj.link"
          :href="proj.link"
          target="_blank"
          rel="noopener noreferrer"
          class="block rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 transition hover:border-indigo-400/40 hover:bg-indigo-500/5 hover:shadow-xl"
        >
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-base font-semibold text-slate-100">{{ proj.name }}</h3>
            <span class="text-xs text-slate-500">by
              <span v-for="(a, idx) in proj.authors" :key="a">
                <template v-if="proj.authorLinks?.[idx]">
                  <a :href="proj.authorLinks[idx]" target="_blank" class="text-indigo-300 hover:underline">{{ a }}</a>
                </template>
                <template v-else>{{ a }}</template>
                <span v-if="idx < proj.authors.length - 1">, </span>
              </span>
            </span>
          </div>
          <p v-if="proj.description" class="mt-2 text-sm text-slate-400">
            {{ proj.description }}
          </p>
        </a>
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
import type { ExternalProject } from '@/types/external'
import { ExternalProjects as externalProjectsData } from '@/data/externalProjects'

const { clearLogs, baseDomain } = useApi()
const settingsStore = useSettingsStore()

const isDisabled = computed(() => !settingsStore.settings.serverUrl)

const selectTool = (tool: ToolDefinition) => {
  clearLogs()
  router.push({ name: 'tool', params: { id: tool.id } })
}

const externalProjects = computed<ExternalProject[]>(() => externalProjectsData)
</script>
