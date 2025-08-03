<template>
  <div class="tools-page">
    <div class="tools-container">
      <h1 class="page-title">Audiobookshelf Toolbox</h1>
      <p class="page-description">Select a tool to get started</p>

      <div class="tools-grid">
        <div
          v-for="tool in toolDefinitions"
          :key="tool.id"
          class="tool-card"
          :class="{ active: selectedTool?.id === tool.id }"
          @click="selectTool(tool)"
        >
          <h3 class="tool-title">{{ tool.title }}</h3>
          <p class="tool-description">{{ tool.description }}</p>
          <div class="tool-meta">
            <span class="field-count">{{ tool.fields.length }} fields</span>
            <span class="execute-badge">✓ Executable</span>
          </div>
        </div>
      </div>

      <div v-if="selectedTool" class="tool-form">
        <DynamicForm :tool="selectedTool" />
      </div>
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

<style scoped>
.tools-page {
  padding: 2rem;
}

.tools-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1f2937;
  text-align: center;
}

.page-description {
  color: #6b7280;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.1rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.tool-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  border: 2px solid transparent;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tool-card.active {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.tool-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.tool-description {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.tool-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-count {
  font-size: 0.875rem;
  color: #9ca3af;
}

.execute-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: #d1fae5;
  color: #065f46;
}

.tool-form {
  margin-top: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>