<template>
  <div class="settings-page">
    <div class="settings-container">
      <h1 class="page-title">Settings</h1>
      <p class="page-description">Configure your Audiobookshelf server connection</p>

      <p>Note: All options you save are only stored locally and never leave your browser other than to contact the address you saved above. All requests are made client side and you can inspect them using your browser's developer tools.</p>

      <form @submit.prevent="saveSettings" class="settings-form">
        <div class="field-group">
          <label class="field-label">Server URL</label>
          <input
            v-model="settingsStore.settings.serverUrl"
            type="url"
            placeholder="https://your-audiobookshelf-server.com"
            class="form-input"
            required
          />
        </div>

        <div class="field-group">
          <label class="field-label">Authentication Method</label>
          <div class="radio-group">
            <label class="radio-option">
              <input
                v-model="settingsStore.settings.authMethod"
                type="radio"
                value="token"
              />
              API Token
            </label>
            <label class="radio-option">
              <input
                v-model="settingsStore.settings.authMethod"
                type="radio"
                value="credentials"
              />
              Username & Password
            </label>
          </div>
        </div>

        <div v-if="settingsStore.settings.authMethod === 'token'" class="field-group">
          <label class="field-label">API Token</label>
          <input
            v-model="settingsStore.settings.apiToken"
            type="password"
            placeholder="Your API token"
            class="form-input"
            required
          />
        </div>

        <div v-else class="credentials-group">
          <div class="field-group">
            <label class="field-label">Username</label>
            <input
              v-model="settingsStore.settings.username"
              type="text"
              placeholder="Your username"
              class="form-input"
              required
            />
          </div>
          <div class="field-group">
            <label class="field-label">Password</label>
            <input
              v-model="settingsStore.settings.password"
              type="password"
              placeholder="Your password"
              class="form-input"
              required
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="save-btn">Save Settings</button>
          <button type="button" @click="testConnection" class="test-btn" :disabled="testing">
            {{ testing ? 'Testing...' : 'Test Connection' }}
          </button>
        </div>
      </form>

      <div v-if="testResult" class="test-result" :class="testResult.success ? 'success' : 'error'">
        {{ testResult.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useApi } from '@/composables/useApi'

const settingsStore = useSettingsStore()
const { get } = useApi()
const testing = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

const saveSettings = () => {
  settingsStore.saveSettings()
  testResult.value = { success: true, message: 'Settings saved successfully!' }
  setTimeout(() => {
    testResult.value = null
  }, 3000)
}

const testConnection = async () => {
  testing.value = true
  testResult.value = null

  try {
    const response = await get('/api/me')
    testResult.value = {
      success: true,
      message: `Connection successful! Server responded: ${response.data?.message || 'OK'}`
    }
  } catch (error: any) {
    testResult.value = {
      success: false,
      message: `Connection failed: ${error.response?.data?.message || error.message || 'Unknown error'}`
    }
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.settings-page {
  padding: 2rem;
}

.settings-container {
  max-width: 600px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.page-description {
  color: #6b7280;
  margin-bottom: 2rem;
}

.settings-form {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.credentials-group {
  display: grid;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.save-btn,
.test-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
}

.save-btn {
  background: #10b981;
  color: white;
}

.test-btn {
  background: #3b82f6;
  color: white;
}

.test-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.test-result {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
}

.test-result.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.test-result.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}
</style>