<template>
  <div>
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">Tableau de Bord</h1>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-6 col-md-3 mb-3">
        <div class="card text-white bg-primary">
          <div class="card-body metric-card">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Utilisateurs</h5>
                <h2>{{ dashboardStore.metrics.totalUsers }}</h2>
              </div>
              <i class="bi bi-people fs-1 d-none d-sm-block"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3 mb-3">
        <div class="card text-white bg-success">
          <div class="card-body metric-card">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Abonnés Premium</h5>
                <h2>{{ dashboardStore.metrics.premiumUsers }}</h2>
              </div>
              <i class="bi bi-star fs-1 d-none d-sm-block"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3 mb-3">
        <div class="card text-white bg-warning">
          <div class="card-body metric-card">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Sessions</h5>
                <h2>{{ dashboardStore.metrics.totalExercises }}</h2>
              </div>
              <i class="bi bi-activity fs-1 d-none d-sm-block"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3 mb-3">
        <div class="card text-white bg-info">
          <div class="card-body metric-card">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title">Aliments</h5>
                <h2>{{ dashboardStore.metrics.totalFoods }}</h2>
              </div>
              <i class="bi bi-egg fs-1 d-none d-sm-block"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-12 col-lg-8 mb-3">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Évolution des utilisateurs</h5>
          </div>
          <div class="card-body">
            <UserChart />
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4 mb-3">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Répartition par âge</h5>
          </div>
          <div class="card-body">
            <AgeChart />
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-12 col-lg-6 mb-3">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Objectifs de santé</h5>
          </div>
          <div class="card-body">
            <GoalChart />
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-6 mb-3">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Activités populaires</h5>
          </div>
          <div class="card-body">
            <div class="list-group list-group-flush">
              <div 
                v-for="activity in dashboardStore.popularActivities" 
                :key="activity.name"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <span class="fw-medium">{{ activity.name }}</span>
                <span class="badge bg-primary">{{ activity.sessions }} sessions</span>
              </div>
              <div v-if="dashboardStore.popularActivities.length === 0" class="list-group-item text-center text-muted">
                Aucune donnée d'activité disponible
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="dashboardStore.loading" class="row">
      <div class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-2">Chargement des données...</p>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-if="dashboardStore.error" class="row">
      <div class="col-12">
        <div class="alert alert-danger" role="alert">
          {{ dashboardStore.error }}
          <button @click="dashboardStore.clearError()" class="btn-close float-end" aria-label="Close"></button>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Qualité des données</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div 
                v-for="quality in dashboardStore.dataQuality" 
                :key="quality.name"
                class="col-md-3"
              >
                <h6>{{ quality.name }}</h6>
                <div class="progress mb-2">
                  <div 
                    class="progress-bar"
                    :class="quality.color"
                    :style="{ width: quality.percentage + '%' }"
                  >
                    {{ quality.percentage }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '../stores/dashboard'
import UserChart from '../components/charts/UserChart.vue'
import AgeChart from '../components/charts/AgeChart.vue'
import GoalChart from '../components/charts/GoalChart.vue'

const dashboardStore = useDashboardStore()

onMounted(async () => {
  console.log('Dashboard loaded')
  // Charger toutes les données du dashboard
  await dashboardStore.fetchAllData()
})
</script>

<style scoped>
.metric-card {
  padding: 20px;
  min-height: 100px;
}

.metric-card h5 {
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.metric-card h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.card {
  border: none;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.list-group-item {
  border: none;
  padding: 0.75rem 0;
}

.progress {
  height: 20px;
}
</style>