import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import type { ProjectData, CalculationResults } from '@/types/api'

export const useAppStore = defineStore('app', () => {
  // Backend connection status
  const backendConnected = ref(false)
  const backendChecking = ref(false)
  
  // Global loading state
  const isLoading = ref(false)
  const loadingMessage = ref('')
  
  // Snackbar notifications
  const snackbar = ref({
    show: false,
    message: '',
    color: 'info',
    timeout: 4000
  })
  
  // Computed
  const backendStatus = computed(() => ({
    connected: backendConnected.value,
    checking: backendChecking.value
  }))
  
  // Actions
  const setLoading = (loading: boolean, message = '') => {
    isLoading.value = loading
    loadingMessage.value = message
  }
  
  const showSnackbar = (message: string, color = 'info', timeout = 4000) => {
    snackbar.value = {
      show: true,
      message,
      color,
      timeout
    }
  }
  
  const checkBackendStatus = async () => {
    if (backendChecking.value) return
    
    backendChecking.value = true
    try {
      const isHealthy = await invoke('check_backend_health')
      backendConnected.value = !!isHealthy
    } catch (error) {
      console.error('Backend health check failed:', error)
      backendConnected.value = false
    } finally {
      backendChecking.value = false
    }
  }
  
  const startBackend = async () => {
    try {
      setLoading(true, 'Backend wird gestartet...')
      await invoke('start_backend')
      await new Promise(resolve => setTimeout(resolve, 3000)) // Wait for startup
      await checkBackendStatus()
    } catch (error) {
      console.error('Failed to start backend:', error)
      showSnackbar('Backend-Start fehlgeschlagen', 'error')
    } finally {
      setLoading(false)
    }
  }
  
  return {
    // State
    backendConnected,
    backendChecking,
    isLoading,
    loadingMessage,
    snackbar,
    
    // Computed
    backendStatus,
    
    // Actions
    setLoading,
    showSnackbar,
    checkBackendStatus,
    startBackend
  }
})