import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService, type LoginCredentials, type User } from '../services/api'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('healthai_token'))
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.isAdmin || false)
  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null
    
    try {
      const tokenResponse = await apiService.login(credentials)
      
      token.value = tokenResponse.access_token
      localStorage.setItem('healthai_token', tokenResponse.access_token)
      
      router.push('/')
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur de connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('healthai_token')
    router.push('/login')
  }

  const checkAuthStatus = () => {
    const storedToken = localStorage.getItem('healthai_token')
    if (storedToken) {
      token.value = storedToken
    }
  }

  const clearError = () => {
    error.value = null
  }

  checkAuthStatus()

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuthStatus,
    clearError
  }
})