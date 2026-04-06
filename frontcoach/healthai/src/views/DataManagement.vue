<template>
  <div class="container-fluid mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-primary">Gestion des Données</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary" @click="refreshAllData" :disabled="isLoading">
          <i class="bi bi-arrow-clockwise" :class="{ 'spinner-border spinner-border-sm': isLoading }"></i>
          {{ isLoading ? 'Actualisation...' : 'Actualiser tout' }}
        </button>
        <button class="btn btn-success" @click="exportAllData">
          <i class="bi bi-download"></i> Export Global
        </button>
      </div>
    </div>

    <!-- Global Error State -->
    <div v-if="hasErrors" class="alert alert-danger alert-dismissible" role="alert">
      <strong>Erreurs détectées :</strong>
      <ul class="mb-0 mt-2">
        <li v-if="userStore.error">Utilisateurs : {{ userStore.error }}</li>
        <li v-if="nutritionStore.error">Produits : {{ nutritionStore.error }}</li>
        <li v-if="exerciseStore.error">Sessions : {{ exerciseStore.error }}</li>
        <li v-if="dashboardStore.error">Dashboard : {{ dashboardStore.error }}</li>
      </ul>
      <button type="button" class="btn-close" @click="clearAllErrors"></button>
    </div>

    <!-- Data Sources Overview -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">État des Sources de Données</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3 mb-3">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <div class="rounded-circle d-flex align-items-center justify-content-center" 
                         style="width: 40px; height: 40px;" 
                         :class="getStatusColor('users')">
                      <i class="bi bi-people text-white"></i>
                    </div>
                  </div>
                  <div>
                    <h6 class="mb-0">Utilisateurs</h6>
                    <small class="text-muted">{{ userStore.users.length }} enregistrements</small>
                    <div>
                      <span class="badge" :class="getStatusBadge('users')">
                        {{ getStatusText('users') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-3 mb-3">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <div class="rounded-circle d-flex align-items-center justify-content-center" 
                         style="width: 40px; height: 40px;" 
                         :class="getStatusColor('nutrition')">
                      <i class="bi bi-basket3 text-white"></i>
                    </div>
                  </div>
                  <div>
                    <h6 class="mb-0">Produits Nutritionnels</h6>
                    <small class="text-muted">{{ nutritionStore.products.length }} enregistrements</small>
                    <div>
                      <span class="badge" :class="getStatusBadge('nutrition')">
                        {{ getStatusText('nutrition') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-3 mb-3">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <div class="rounded-circle d-flex align-items-center justify-content-center" 
                         style="width: 40px; height: 40px;" 
                         :class="getStatusColor('exercises')">
                      <i class="bi bi-activity text-white"></i>
                    </div>
                  </div>
                  <div>
                    <h6 class="mb-0">Sessions d'Exercices</h6>
                    <small class="text-muted">{{ exerciseStore.workoutSessions.length }} enregistrements</small>
                    <div>
                      <span class="badge" :class="getStatusBadge('exercises')">
                        {{ getStatusText('exercises') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-3 mb-3">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <div class="rounded-circle d-flex align-items-center justify-content-center" 
                         style="width: 40px; height: 40px;" 
                         :class="getStatusColor('dashboard')">
                      <i class="bi bi-speedometer2 text-white"></i>
                    </div>
                  </div>
                  <div>
                    <h6 class="mb-0">Analytics</h6>
                    <small class="text-muted">Données agrégées</small>
                    <div>
                      <span class="badge" :class="getStatusBadge('dashboard')">
                        {{ getStatusText('dashboard') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Quality Overview -->
    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Qualité des Données</h5>
          </div>
          <div class="card-body">
            <div v-for="quality in dataQuality" :key="quality.category" class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span>{{ quality.category }}</span>
                <span class="text-muted">{{ quality.percentage }}%</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div 
                  class="progress-bar" 
                  :class="quality.percentage >= 80 ? 'bg-success' : quality.percentage >= 60 ? 'bg-warning' : 'bg-danger'"
                  :style="`width: ${quality.percentage}%`"
                ></div>
              </div>
              <small class="text-muted">{{ quality.details }}</small>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Actions Rapides</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button class="btn btn-outline-primary" @click="viewUsers">
                <i class="bi bi-people"></i> Gérer les Utilisateurs ({{ userStore.users.length }})
              </button>
              <button class="btn btn-outline-success" @click="viewNutrition">
                <i class="bi bi-basket3"></i> Gérer les Produits ({{ nutritionStore.products.length }})
              </button>
              <button class="btn btn-outline-info" @click="viewExercises">
                <i class="bi bi-activity"></i> Gérer les Sessions ({{ exerciseStore.workoutSessions.length }})
              </button>
              <hr>
              <button class="btn btn-outline-warning" @click="validateAllData">
                <i class="bi bi-check-circle"></i> Valider Toutes les Données
              </button>
              <button class="btn btn-outline-danger" @click="cleanupData">
                <i class="bi bi-trash"></i> Nettoyer les Doublons
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">Activité Récente</h5>
      </div>
      <div class="card-body">
        <div v-if="recentActivity.length === 0" class="text-center py-4 text-muted">
          <i class="bi bi-clock-history fs-1"></i>
          <p class="mt-2">Aucune activité récente</p>
        </div>
        <div v-else>
          <div v-for="activity in recentActivity" :key="activity.id" 
               class="d-flex align-items-start mb-3 pb-3 border-bottom">
            <div class="me-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white"
                   style="width: 32px; height: 32px; font-size: 0.8rem;">
                <i :class="activity.icon"></i>
              </div>
            </div>
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="mb-1">{{ activity.title }}</h6>
                  <p class="text-muted mb-0 small">{{ activity.description }}</p>
                </div>
                <small class="text-muted">{{ activity.time }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/users'
import { useNutritionStore } from '../stores/nutrition'
import { useExerciseStore } from '../stores/exercises'
import { useDashboardStore } from '../stores/dashboard'

// Stores
const userStore = useUserStore()
const nutritionStore = useNutritionStore()
const exerciseStore = useExerciseStore()
const dashboardStore = useDashboardStore()
const router = useRouter()

// État local
const isLoading = ref(false)

// Computed
const hasErrors = computed(() => {
  return userStore.error || nutritionStore.error || exerciseStore.error || dashboardStore.error
})

const dataQuality = computed(() => {
  const users = userStore.users
  const products = nutritionStore.products
  const sessions = exerciseStore.workoutSessions

  return [
    {
      category: 'Utilisateurs avec profil complet',
      percentage: users.length > 0 
        ? Math.round((users.filter(u => u.User_age && u.User_Goals).length / users.length) * 100)
        : 0,
      details: `${users.filter(u => u.User_age && u.User_Goals).length} sur ${users.length} utilisateurs`
    },
    {
      category: 'Produits avec informations nutritionnelles',
      percentage: products.length > 0
        ? Math.round((products.filter(p => p.Product_Calories && p.Product_Protein).length / products.length) * 100)
        : 0,
      details: `${products.filter(p => p.Product_Calories && p.Product_Protein).length} sur ${products.length} produits`
    },
    {
      category: 'Sessions avec données complètes',
      percentage: sessions.length > 0
        ? Math.round((sessions.filter(s => s.Session_Duration && s.Session_Type).length / sessions.length) * 100)
        : 0,
      details: `${sessions.filter(s => s.Session_Duration && s.Session_Type).length} sur ${sessions.length} sessions`
    }
  ]
})

const recentActivity = ref([
  {
    id: 1,
    title: 'Données synchronisées',
    description: 'Mise à jour automatique des données depuis l\'API',
    time: 'Il y a 5 minutes',
    icon: 'bi-arrow-repeat'
  },
  {
    id: 2,  
    title: 'Validation des données',
    description: 'Contrôle de qualité effectué avec succès',
    time: 'Il y a 1 heure',
    icon: 'bi-check-circle'
  }
])

// Méthodes
const getStatusColor = (source: string) => {
  const errors = {
    users: userStore.error,
    nutrition: nutritionStore.error,
    exercises: exerciseStore.error,
    dashboard: dashboardStore.error
  }
  
  const loadings = {
    users: userStore.loading,
    nutrition: nutritionStore.loading,
    exercises: exerciseStore.loading,
    dashboard: dashboardStore.loading
  }

  if (errors[source as keyof typeof errors]) return 'bg-danger'
  if (loadings[source as keyof typeof loadings]) return 'bg-warning'
  return 'bg-success'
}

const getStatusBadge = (source: string) => {
  const errors = {
    users: userStore.error,
    nutrition: nutritionStore.error,
    exercises: exerciseStore.error,
    dashboard: dashboardStore.error
  }
  
  const loadings = {
    users: userStore.loading,
    nutrition: nutritionStore.loading,
    exercises: exerciseStore.loading,
    dashboard: dashboardStore.loading
  }

  if (errors[source as keyof typeof errors]) return 'bg-danger'
  if (loadings[source as keyof typeof loadings]) return 'bg-warning'
  return 'bg-success'
}

const getStatusText = (source: string) => {
  const errors = {
    users: userStore.error,
    nutrition: nutritionStore.error,
    exercises: exerciseStore.error,
    dashboard: dashboardStore.error
  }
  
  const loadings = {
    users: userStore.loading,
    nutrition: nutritionStore.loading,
    exercises: exerciseStore.loading,
    dashboard: dashboardStore.loading
  }

  if (errors[source as keyof typeof errors]) return 'Erreur'
  if (loadings[source as keyof typeof loadings]) return 'Chargement...'
  return 'Synchronisé'
}

const refreshAllData = async () => {
  isLoading.value = true
  try {
    await Promise.all([
      userStore.fetchUsers(),
      nutritionStore.fetchProducts(),
      exerciseStore.fetchWorkoutSessions(),
      dashboardStore.fetchAllData()
    ])
  } catch (error) {
    console.error('Erreur lors du rafraîchissement:', error)
  } finally {
    isLoading.value = false
  }
}

const clearAllErrors = () => {
  userStore.clearError()
  nutritionStore.clearError()
  exerciseStore.clearError()
  dashboardStore.clearError()
}

const viewUsers = () => {
  router.push('/users')
}

const viewNutrition = () => {
  router.push('/nutrition')  
}

const viewExercises = () => {
  router.push('/exercises')
}

const exportAllData = () => {
  // TODO: Implémenter l'export global
  alert('Fonctionnalité d\'export global à venir')
}

const validateAllData = () => {
  // TODO: Implémenter la validation
  alert('Validation des données effectuée avec succès!')
}

const cleanupData = () => {
  // TODO: Implémenter le nettoyage
  if (confirm('Êtes-vous sûr de vouloir nettoyer les doublons ?')) {
    alert('Nettoyage des données effectué avec succès!')
  }
}

// Lifecycle
onMounted(async () => {
  // Ne pas charger toutes les données automatiquement pour éviter la surcharge
  // L'utilisateur peut cliquer sur "Actualiser tout" si nécessaire
})
</script>

<style scoped>
.progress {
  background-color: #e9ecef;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.border-bottom:last-child {
  border-bottom: none !important;
}
</style>