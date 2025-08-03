<template>
  <div class="dynamic-form">
    <div class="form-header">
      <h2 class="form-title">{{ tool.title }}</h2>
      <p class="form-description">{{ tool.longDescription }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="form-body">
      <div v-for="field in tool.fields" :key="field.name" class="field-group">
        <label class="field-label">
          {{ field.label }}
          <span v-if="field.required" class="required">*</span>
        </label>
        <p v-if="field.description" class="field-description">{{ field.description }}</p>

        <!-- String Input -->
        <input
          v-if="field.type === 'string'"
          v-model="formData[field.name]"
          type="text"
          :placeholder="field.placeholder"
          :required="field.required"
          class="form-input"
        />

        <!-- Boolean Switch -->
        <label v-else-if="field.type === 'boolean'" class="switch-container">
          <input
            v-model="formData[field.name]"
            type="checkbox"
            class="switch-input"
          />
          <span class="switch-slider"></span>
          <span class="switch-label">{{ formData[field.name] ? 'Enabled' : 'Disabled' }}</span>
        </label>

        <!-- Select Dropdown -->
        <select
          v-else-if="field.type === 'select'"
          v-model="formData[field.name]"
          :required="field.required"
          class="form-select"
        >
          <option value="">Choose an option...</option>
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>

        <!-- String Array -->
        <div v-else-if="field.type === 'stringArray'" class="string-array">
          <div v-for="(item, index) in getArrayValue(field.name)" :key="index" class="array-item">
            <input
              v-model="getArrayValue(field.name)[index]"
              type="text"
              :placeholder="field.placeholder"
              class="form-input array-input"
            />
            <button
              type="button"
              @click="removeArrayItem(field.name, index)"
              class="remove-btn"
              :disabled="getArrayValue(field.name).length <= 1"
            >
              ×
            </button>
          </div>
          <button
            type="button"
            @click="addArrayItem(field.name)"
            class="add-btn"
          >
            + Add Item
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Executing...' : 'Execute Tool' }}
        </button>
      </div>
    </form>

    <!-- Results Display -->
    <div v-if="result" class="result-section">
      <div class="result-header">
        <h3>Execution Result</h3>
        <span class="result-status" :class="result.success ? 'success' : 'error'">
          {{ result.success ? '✓ Success' : '✗ Error' }}
        </span>
      </div>
      
      <div class="result-content">
        <p class="result-message">{{ result.message }}</p>
        
        <div v-if="result.error" class="error-details">
          <strong>Error:</strong> {{ result.error }}
        </div>
        
        <div v-if="result.data" class="result-data">
          <details>
            <summary>View Details</summary>
            <pre class="result-json">{{ JSON.stringify(result.data, null, 2) }}</pre>
          </details>
        </div>
        
        <div class="result-meta">
          <small>Executed at: {{ new Date(result.timestamp).toLocaleString() }}</small>
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

// Initialize form data
props.tool.fields.forEach(field => {
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
    // Clean up string arrays (remove empty items)
    const cleanedData = { ...formData }
    props.tool.fields.forEach(field => {
      if (field.type === 'stringArray') {
        cleanedData[field.name] = formData[field.name]
          .filter((item: string) => item.trim() !== '')
      }
    })

    // Execute the tool's custom function
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

<style scoped>
.dynamic-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.form-description {
  color: #6b7280;
  line-height: 1.5;
}

.form-body {
  margin-bottom: 2rem;
}

.field-group {
  margin-bottom: 1.5rem;
}

.field-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.field-description {
  margin: -0.25rem 0 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.required {
  color: #ef4444;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Switch Styles */
.switch-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.switch-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  background-color: #ccc;
  border-radius: 34px;
  transition: .4s;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}

.switch-input:checked + .switch-slider {
  background-color: #3b82f6;
}

.switch-input:checked + .switch-slider:before {
  transform: translateX(26px);
}

.switch-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* String Array Styles */
.string-array {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.array-item {
  display: flex;
  gap: 0.5rem;
}

.array-input {
  flex: 1;
}

.remove-btn {
  background: #ef4444;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.remove-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.add-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  align-self: flex-start;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

/* Result Styles */
.result-section {
  margin-top: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.result-status.success {
  color: #065f46;
  font-weight: 600;
}

.result-status.error {
  color: #991b1b;
  font-weight: 600;
}

.result-content {
  padding: 1rem;
}

.result-message {
  font-weight: 500;
  margin-bottom: 1rem;
}

.error-details {
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  color: #991b1b;
}

.result-data {
  margin-bottom: 1rem;
}

.result-data details {
  cursor: pointer;
}

.result-data summary {
  font-weight: 500;
  color: #3b82f6;
  padding: 0.5rem 0;
}

.result-json {
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  font-size: 0.875rem;
}

.result-meta {
  color: #6b7280;
  font-size: 0.875rem;
}
</style>