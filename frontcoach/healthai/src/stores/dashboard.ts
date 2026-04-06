import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService, type UserAnalyticsSummary, type User, type Product, type WorkoutSession } from '../services/api'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const analytics = ref<UserAnalyticsSummary | null>(null)
  const users = ref<User[]>([])
  const products = ref<Product[]>([])
  const workoutSessions = ref<WorkoutSession[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const metrics = computed(() => {
    if (!analytics.value || users.value.length === 0) {
      return {
        totalUsers: 0,
        premiumUsers: 0,
        totalExercises: analytics.value?.workout_sessions_count || 0,
        totalFoods: products.value.length
      }
    }

    const premiumUsersCount = users.value.filter(user => 
      user.User_Subscription === 'premium' || user.User_Subscription === 'Premium'
    ).length

    return {
      totalUsers: users.value.length,
      premiumUsers: premiumUsersCount,
      totalExercises: analytics.value.workout_sessions_count,
      totalFoods: products.value.length
    }
  })

  const popularActivities = computed(() => {
    const activityCounts = workoutSessions.value.reduce((acc, session) => {
      const type = session.Session_Type || 'Non spécifié'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(activityCounts)
      .map(([name, sessions]) => ({ name, sessions }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5)
  })

  const userChartData = computed(() => {
    // Grouper les utilisateurs par mois de création
    const usersByMonth = users.value.reduce((acc, user) => {
      const date = new Date(user.created_at)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      acc[monthKey] = (acc[monthKey] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Générer les données pour les 12 derniers mois
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    const now = new Date()
    const data = []
    const premiumData = []

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`
      
      data.push(usersByMonth[monthKey] || 0)
      
      // Calculer les utilisateurs premium pour ce mois
      const premiumCount = users.value.filter(user => {
        const userDate = new Date(user.created_at)
        return userDate.getFullYear() === date.getFullYear() && 
               userDate.getMonth() === date.getMonth() &&
               (user.User_Subscription === 'premium' || user.User_Subscription === 'Premium')
      }).length
      
      premiumData.push(premiumCount)
    }

    return {
      labels: months,
      newUsers: data,
      premiumUsers: premiumData
    }
  })

  const ageDistribution = computed(() => {
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '55+': 0
    }

    users.value.forEach(user => {
      if (user.User_age) {
        if (user.User_age <= 25) ageGroups['18-25']++
        else if (user.User_age <= 35) ageGroups['26-35']++
        else if (user.User_age <= 45) ageGroups['36-45']++
        else if (user.User_age <= 55) ageGroups['46-55']++
        else ageGroups['55+']++
      }
    })

    return Object.entries(ageGroups).map(([label, value]) => ({ label, value }))
  })

  const goalDistribution = computed(() => {
    const goals = users.value.reduce((acc, user) => {
      const goal = user.User_Goals || 'Non spécifié'
      acc[goal] = (acc[goal] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(goals).map(([label, value]) => ({ label, value }))
  })

  const dataQuality = computed(() => {
    const totalUsers = users.value.length
    const usersWithCompleteProfile = users.value.filter(user => 
      user.User_age && user.User_weight && user.User_Height && user.User_gender
    ).length

    const usersWithBiometrics = analytics.value?.biometrics_logs_count || 0
    const totalWorkouts = analytics.value?.workout_sessions_count || 0

    return [
      { 
        name: 'Données utilisateur', 
        percentage: totalUsers > 0 ? Math.round((usersWithCompleteProfile / totalUsers) * 100) : 0,
        color: 'bg-success' 
      },
      { 
        name: 'Base nutritionnelle', 
        percentage: products.value.length > 0 ? 95 : 0,
        color: 'bg-success' 
      },
      { 
        name: 'Sessions d\'entraînement', 
        percentage: totalWorkouts > 0 ? 87 : 0,
        color: 'bg-warning' 
      },
      { 
        name: 'Données biométriques', 
        percentage: usersWithBiometrics > 0 ? Math.min(Math.round((usersWithBiometrics / totalUsers) * 100), 100) : 0,
        color: usersWithBiometrics > (totalUsers * 0.8) ? 'bg-success' : 'bg-danger'
      }
    ]
  })


  const fetchAnalytics = async () => {
    loading.value = true
    error.value = null
    
    try {
      analytics.value = await apiService.getMyAnalyticsSummary()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors du chargement des analytics'
      console.error('Erreur analytics:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchUsers = async () => {
    try {
      users.value = await apiService.getAllUsers()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors du chargement des utilisateurs'
      console.error('Erreur utilisateurs:', err)
    }
  }

  const fetchProducts = async () => {
    try {
      products.value = await apiService.getAllProducts()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors du chargement des produits'
      console.error('Erreur produits:', err)
    }
  }

  const fetchWorkoutSessions = async () => {
    try {
      workoutSessions.value = await apiService.getAllWorkoutSessions()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Erreur lors du chargement des sessions'
      console.error('Erreur sessions:', err)
    }
  }

  const fetchAllData = async () => {
    loading.value = true
    error.value = null
    
    try {
      await Promise.all([
        fetchAnalytics(),
        fetchUsers(),
        fetchProducts(),
        fetchWorkoutSessions()
      ])
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err)
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    analytics,
    users,
    products,
    workoutSessions,
    loading,
    error,
    // Getters
    metrics,
    popularActivities,
    userChartData,
    ageDistribution,
    goalDistribution,
    dataQuality,
    // Actions
    fetchAnalytics,
    fetchUsers,
    fetchProducts,
    fetchWorkoutSessions,
    fetchAllData,
    clearError
  }
})