import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

export function useApi() {
  const settingsStore = useSettingsStore()

  const apiClient = computed((): AxiosInstance => {
    const client = axios.create({
      baseURL: settingsStore.settings.serverUrl,
      timeout: 30000,
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

  return {
    apiClient,
    get,
    post,
    put,
    patch,
    delete: del,
    baseDomain
  }
}