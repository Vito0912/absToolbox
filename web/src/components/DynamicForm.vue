<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-6 space-y-2">
      <h2 class="text-2xl font-semibold tracking-tight">
        {{ tool.title }}
      </h2>
      <p class="text-slate-400">
        {{ tool.longDescription }}
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div
        v-for="field in tool.fields"
        :key="field.name"
        class="space-y-2 rounded-xl border border-white/10 bg-slate-900/40 p-4"
      >
        <label class="block text-sm font-medium text-slate-200">
          {{ field.label }}
          <span
            v-if="field.required"
            class="ml-1 align-middle text-rose-400"
            aria-hidden="true"
            >*</span
          >
        </label>
        <p
          v-if="field.description"
          class="text-xs leading-relaxed text-slate-400"
        >
          {{ field.description }}
        </p>

        <input
          v-if="field.type === 'string'"
          v-model="formData[field.name]"
          type="text"
          :placeholder="field.placeholder"
          :required="field.required"
          class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
        />

        <label
          v-else-if="field.type === 'boolean'"
          class="inline-flex items-center gap-3"
        >
          <button
            type="button"
            @click="formData[field.name] = !formData[field.name]"
            class="relative h-7 w-12 rounded-full border border-white/10 transition"
            :class="formData[field.name] ? 'bg-indigo-600' : 'bg-slate-800'"
          >
            <span
              class="absolute top-1 left-1 inline-block h-5 w-5 rounded-full bg-white transition"
              :class="formData[field.name] ? 'translate-x-5' : ''"
            />
          </button>
          <span class="text-sm text-slate-300">
            {{ formData[field.name] ? 'Enabled' : 'Disabled' }}
          </span>
          <input
            v-model="formData[field.name]"
            type="checkbox"
            class="hidden"
          />
        </label>

        <select
          v-else-if="field.type === 'select'"
          v-model="formData[field.name]"
          :required="field.required"
          class="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
        >
          <option value="">Choose an option...</option>
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>

        <div v-else-if="field.type === 'stringArray'" class="space-y-2">
          <div
            v-for="(item, index) in getArrayValue(field.name)"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="getArrayValue(field.name)[index]"
              type="text"
              :placeholder="field.placeholder"
              class="flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none ring-0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30"
            />
            <button
              type="button"
              @click="removeArrayItem(field.name, index)"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="getArrayValue(field.name).length <= 1"
              aria-label="Remove"
              title="Remove"
            >
              ×
            </button>
          </div>
          <button
            type="button"
            @click="addArrayItem(field.name)"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            + Add Item
          </button>
        </div>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          class="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? 'Executing...' : 'Execute Tool' }}
        </button>
      </div>
    </form>

    <div
      v-if="result"
      class="mt-6 overflow-hidden rounded-xl border border-white/10 bg-white/5"
    >
      <div
        class="flex items-center justify-between border-b border-white/10 bg-slate-900/50 px-4 py-3"
      >
        <h3 class="text-sm font-semibold">Execution Result</h3>
        <span
          class="text-sm font-semibold"
          :class="result.success ? 'text-emerald-300' : 'text-rose-300'"
        >
          {{ result.success ? '✓ Success' : '✗ Error' }}
        </span>
      </div>

      <div class="space-y-3 p-4">
        <p class="font-medium text-slate-200">
          {{ result.message }}
        </p>

        <div
          v-if="result.error"
          class="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-200"
        >
          <strong class="font-semibold">Error:</strong> {{ result.error }}
        </div>

        <div v-if="result.data" class="text-sm">
          <details class="group">
            <summary
              class="cursor-pointer select-none text-indigo-300 hover:text-indigo-200"
            >
              View Details
            </summary>
            <pre
              class="mt-2 overflow-x-auto rounded-lg bg-slate-900/80 p-3 text-xs text-slate-200"
            >
{{ JSON.stringify(result.data, null, 2) }}</pre
            >
          </details>
        </div>

        <div class="text-xs text-slate-500">
          Executed at: {{ new Date(result.timestamp).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { ToolDefinition, ToolResult } from '@/types/tool'

interface Props {
  tool: ToolDefinition
}

const props = defineProps<Props>()

const formData = reactive<Record<string, any>>({})
const loading = ref(false)
const result = ref<ToolResult | null>(null)

props.tool.fields.forEach((field) => {
  if (field.type === 'boolean') {
    formData[field.name] = field.default !== undefined ? field.default : false
  } else if (field.type === 'stringArray') {
    formData[field.name] = field.default || ['']
  } else {
    formData[field.name] = field.default !== undefined ? field.default : ''
  }
})

const getArrayValue = (fieldName: string): string[] => {
  if (!formData[fieldName]) formData[fieldName] = ['']
  return formData[fieldName]
}

const addArrayItem = (fieldName: string) => {
  if (!formData[fieldName]) formData[fieldName] = []
  formData[fieldName].push('')
}

const removeArrayItem = (fieldName: string, index: number) => {
  if (formData[fieldName] && formData[fieldName].length > 1) {
    formData[fieldName].splice(index, 1)
  }
}

const handleSubmit = async () => {
  loading.value = true
  result.value = null

  try {
    const cleanedData: Record<string, any> = { ...formData }
    props.tool.fields.forEach((field) => {
      if (field.type === 'stringArray') {
        cleanedData[field.name] = formData[field.name].filter(
          (item: string) => item.trim() !== ''
        )
      }
    })

    result.value = await props.tool.execute(cleanedData)
  } catch (error: any) {
    result.value = {
      success: false,
      message: 'Tool execution failed',
      error: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }
  } finally {
    loading.value = false
  }
}
</script>