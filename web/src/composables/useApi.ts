import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { computed, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const executionLogs = ref<string[]>([])
const executionStartTime = ref<number | null>(null)
const isExecuting = ref(false)

export function useApi() {
  const settingsStore = useSettingsStore()

  const apiClient = computed((): AxiosInstance => {
    const client = axios.create({
      baseURL: settingsStore.settings.serverUrl,
      timeout: 600000, // 10 minutes for now
      headers: {
        'Content-Type': 'application/json'
      }
    })

    client.interceptors.request.use((config) => {
      if (settingsStore.settings.authMethod === 'token') {
        config.headers.Authorization = `Bearer ${settingsStore.settings.apiToken}`
      }
      return config
    })

    client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error)
        return Promise.reject(error)
      }
    )

    return client
  })

  const get = (url: string, config?: AxiosRequestConfig) => {
    return apiClient.value.get(url, config)
  }

  const post = (url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.value.post(url, data, config)
  }

  const put = (url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.value.put(url, data, config)
  }

  const patch = (url: string, data?: any, config?: AxiosRequestConfig) => {
    return apiClient.value.patch(url, data, config)
  }

  const del = (url: string, config?: AxiosRequestConfig) => {
    return apiClient.value.delete(url, config)
  }

  const baseDomain = computed(() => {
    const url = new URL(settingsStore.settings.serverUrl)
    return url
  })

  const startExecution = () => {
    executionLogs.value = []
    executionStartTime.value = Date.now()
    isExecuting.value = true
  }

  const stopExecution = () => {
    isExecuting.value = false
    executionStartTime.value = null
  }

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    executionLogs.value.push(`[${timestamp}] ${message}`)
  }

  const clearLogs = () => {
    executionLogs.value = []
  }

  const getElapsedTime = () => {
    if (!executionStartTime.value) return '0:00'
    const elapsed = Math.floor((Date.now() - executionStartTime.value) / 1000)
    const minutes = Math.floor(elapsed / 60)
    const seconds = elapsed % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return {
    apiClient,
    get,
    post,
    put,
    patch,
    delete: del,
    baseDomain,
    executionLogs,
    isExecuting,
    startExecution,
    stopExecution,
    addLog,
    clearLogs,
    getElapsedTime
  }
}