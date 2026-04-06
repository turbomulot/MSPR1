import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService, type WorkoutSession } from '../services/api'

export const useExerciseStore = defineStore('exercises', () => {
  const workoutSessions = ref<WorkoutSession[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentSession = ref<WorkoutSession | null>(null)

  const filters = ref({
    search: '',
    type: '',
    dateRange: ''
  })

  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Getters
  const exerciseStats = computed(() => {
    const total = workoutSessions.value.length
    const avgDuration = workoutSessions.value.length > 0 
      ? Math.round(workoutSessions.value.reduce((sum, s) => sum + (s.Session_Duration || 0), 0) / total)
      : 0
    const totalDuration = workoutSessions.value.reduce((sum, s) => sum + (s.Session_Duration || 0), 0)
    const types = new Set(workoutSessions.value.map(s => s.Session_Type || 'Non spécifié')).size

    return {
      total,
      avgDuration,
      totalDuration: Math.round(totalDuration / 60),
      types
    }
  })

  const filteredSessions = computed(() => {
    let filtered = workoutSessions.value

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(session => 
        (session.Session_Type && session.Session_Type.toLowerCase().includes(search))
      )
    }

    if (filters.value.type) {
      filtered = filtered.filter(session => 
        (session.Session_Type || 'Non spécifié') === filters.value.type
      )
    }

    if (filters.value.dateRange) {
      const now = new Date()
      let cutoffDate: Date
      
      switch (filters.value.dateRange) {
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'quarter':
          cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        default:
          return filtered
      }
      
      filtered = filtered.filter(session => 
        new Date(session.Session_Date) >= cutoffDate
      )
    }

    return filtered.sort((a, b) => new Date(b.Session_Date).getTime() - new Date(a.Session_Date).getTime())
  })

  const totalSessions = computed(() => filteredSessions.value.length)
  const totalPages = computed(() => Math.ceil(totalSessions.value / itemsPerPage.value))
  
  const paginatedSessions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredSessions.value.slice(start, end)
  })

  const sessionTypes = computed(() => {
    const types = [...new Set(workoutSessions.value.map(s => s.Session_Type || 'Non spécifié'))]
    return types.sort()
  })

  const fetchWorkoutSessions = async () => {
    loading.value = true
    error.value = null
    
    try {
      workoutSessions.value = await apiService.getAllWorkoutSessions()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors du chargement des sessions'
      console.error('Erreur fetch workout sessions:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchWorkoutSession = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      currentSession.value = await apiService.getWorkoutSession(id)
      return currentSession.value
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors du chargement de la session'
      console.error('Erreur fetch workout session:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchUserSessions = async (userId: number) => {
    loading.value = true
    error.value = null
    
    try {
      const sessions = await apiService.getWorkoutSessionsByUser(userId)
      return sessions
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors du chargement des sessions utilisateur'
      console.error('Erreur fetch user sessions:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters: Partial<typeof filters.value>) => {
    Object.assign(filters.value, newFilters)
    currentPage.value = 1 // Reset pagination
  }

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const setItemsPerPage = (items: number) => {
    itemsPerPage.value = items
    currentPage.value = 1 // Reset pagination
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentSession = () => {
    currentSession.value = null
  }

  return {
    // State
    workoutSessions,
    currentSession,
    loading,
    error,
    filters,
    currentPage,
    itemsPerPage,
    // Getters
    exerciseStats,
    filteredSessions,
    totalSessions,
    totalPages,
    paginatedSessions,
    sessionTypes,
    // Actions
    fetchWorkoutSessions,
    fetchWorkoutSession,
    fetchUserSessions,
    setFilters,
    setPage,
    setItemsPerPage,
    clearError,
    clearCurrentSession
  }
})