<template>
  <div class="space-y-4 rounded-xl border border-white/10 bg-gray-900/40 p-4">
    <div class="relative">
      <input
        :value="modelValue.search"
        @input="handleSearchInput"
        type="text"
        :placeholder="searchPlaceholder"
        class="w-full rounded-lg border border-white/10 bg-gray-900 px-4 py-2 pl-10 text-sm text-gray-100 placeholder:text-gray-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
      />
      <div class="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="flex-1" v-if="filterOptions.length > 0">
        <label class="block text-sm font-medium text-gray-300 mb-2">{{ filterLabel }}</label>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="option in filterOptions"
            :key="option.value"
            @click="toggleFilter(option.value)"
            class="relative group px-2 py-1 rounded-md text-xs font-medium transition"
            :class="[
              selectedFilters.includes(option.value)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
            :title="option.description || ''"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-300">Sort by</label>
        <select
          :value="modelValue.sortBy"
          @change="handleSortChange"
          class="rounded-lg border border-white/10 bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <button
          @click="toggleSortDirection"
          class="p-2 rounded-lg border border-white/10 bg-gray-900 hover:bg-gray-800 transition"
        >
          <svg
            class="h-4 w-4 text-gray-300 transition-transform"
            :class="{ 'rotate-180': modelValue.sortDirection === 'desc' }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="selectedFilters.length > 0" class="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
      <span class="text-sm text-gray-400">Filtered by {{ filterLabel.toLowerCase() }}:</span>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="filter in selectedFilters"
          :key="filter"
          class="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-xs"
        >
          {{ getFilterLabel(filter) }}
          <button @click="removeFilter(filter)" class="hover:text-white transition">
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </div>
      <button
        @click="clearFilters"
        class="text-xs text-gray-400 hover:text-gray-300 underline transition"
      >
        Clear all
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FilterOption, SortOption, FilterBarModelValue } from '@/types/filterBar'

export interface FilterBarProps {
  modelValue: FilterBarModelValue
  searchPlaceholder: string
  filterLabel: string
  filterOptions: FilterOption[]
  sortOptions: SortOption[]
}

const props = defineProps<FilterBarProps>()

const emit = defineEmits<{
  'update:modelValue': [value: FilterBarModelValue]
}>()

const selectedFilters = computed(() => props.modelValue.filters)

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  updateFilter('search', target.value)
}

const handleSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  updateFilter('sortBy', target.value)
}

const updateFilter = (key: keyof FilterBarModelValue, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  })
}

const toggleFilter = (filter: string) => {
  const filters = [...props.modelValue.filters]
  const index = filters.indexOf(filter)
  
  if (index === -1) {
    filters.push(filter)
  } else {
    filters.splice(index, 1)
  }
  
  updateFilter('filters', filters)
}

const removeFilter = (filter: string) => {
  const filters = props.modelValue.filters.filter(f => f !== filter)
  updateFilter('filters', filters)
}

const toggleSortDirection = () => {
  updateFilter('sortDirection', props.modelValue.sortDirection === 'asc' ? 'desc' : 'asc')
}

const clearFilters = () => {
  updateFilter('filters', [])
}

const getFilterLabel = (filterValue: string) => {
  const option = props.filterOptions.find(opt => opt.value === filterValue)
  return option?.label || filterValue
}
</script>

<script lang="ts">
export default {
  name: 'FilterBar'
}
</script>