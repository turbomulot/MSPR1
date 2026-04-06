import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService, type User } from '../services/api'

export const useUserStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentUser = ref<User | null>(null)

  // Filters
  const filters = ref({
    search: '',
    status: '',
    age: '',
    goal: ''
  })

  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Getters
  const userStats = computed(() => {
    const total = users.value.length
    const premium = users.value.filter(user => 
      user.User_Subscription === 'premium' || user.User_Subscription === 'Premium'
    ).length
    const withAge = users.value.filter(user => user.User_age !== null).length
    const inactive = total - withAge // Approximation

    return {
      total,
      active: withAge,
      premium,
      inactive
    }
  })

  const filteredUsers = computed(() => {
    let filtered = users.value

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(user => 
        user.User_mail.toLowerCase().includes(search) ||
        (user.User_Goals && user.User_Goals.toLowerCase().includes(search))
      )
    }

    if (filters.value.status === 'premium') {
      filtered = filtered.filter(user => 
        user.User_Subscription === 'premium' || user.User_Subscription === 'Premium'
      )
    } else if (filters.value.status === 'active') {
      filtered = filtered.filter(user => user.User_age !== null)
    } else if (filters.value.status === 'inactive') {
      filtered = filtered.filter(user => user.User_age === null)
    }

    if (filters.value.age) {
      filtered = filtered.filter(user => {
        if (!user.User_age) return false
        const age = user.User_age
        switch (filters.value.age) {
          case '18-25': return age >= 18 && age <= 25
          case '26-35': return age >= 26 && age <= 35
          case '36-45': return age >= 36 && age <= 45
          case '46+': return age >= 46
          default: return true
        }
      })
    }

    if (filters.value.goal) {
      filtered = filtered.filter(user => 
        user.User_Goals && user.User_Goals.toLowerCase().includes(filters.value.goal.toLowerCase())
      )
    }

    return filtered
  })

  const totalUsers = computed(() => filteredUsers.value.length)
  const totalPages = computed(() => Math.ceil(totalUsers.value / itemsPerPage.value))
  
  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredUsers.value.slice(start, end)
  })

  // Actions
  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    
    try {
      users.value = await apiService.getAllUsers()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors du chargement des utilisateurs'
      console.error('Erreur fetch users:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      currentUser.value = await apiService.getUser(id)
      return currentUser.value
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors du chargement de l\'utilisateur'
      console.error('Erreur fetch user:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, userData: Partial<User>) => {
    loading.value = true
    error.value = null
    
    try {
      const updatedUser = await apiService.updateUser(id, userData)
      
      // Mettre à jour dans la liste
      const index = users.value.findIndex(u => u.User_ID === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }
      
      // Mettre à jour l'utilisateur courant si c'est le même
      if (currentUser.value && currentUser.value.User_ID === id) {
        currentUser.value = updatedUser
      }
      
      return updatedUser
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors de la mise à jour'
      console.error('Erreur update user:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      await apiService.deleteUser(id)
      
      // Supprimer de la liste locale
      users.value = users.value.filter(u => u.User_ID !== id)
      
      // Réinitialiser l'utilisateur courant si c'était lui
      if (currentUser.value && currentUser.value.User_ID === id) {
        currentUser.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors de la suppression'
      console.error('Erreur delete user:', err)
      throw err
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

  const clearCurrentUser = () => {
    currentUser.value = null
  }

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    filters,
    currentPage,
    itemsPerPage,
    // Getters
    userStats,
    filteredUsers,
    totalUsers,
    totalPages,
    paginatedUsers,
    // Actions
    fetchUsers,
    fetchUser,
    updateUser,
    deleteUser,
    setFilters,
    setPage,
    setItemsPerPage,
    clearError,
    clearCurrentUser
  }
})