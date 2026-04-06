<template>
  <div class="container-fluid mt-4">
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/exercises" class="text-decoration-none">Sessions d'Exercices</router-link>
        </li>
        <li class="breadcrumb-item active">{{ isEdit ? 'Modifier' : 'Nouvelle' }} session</li>
      </ol>
    </nav>

    <div class="alert alert-info" role="alert">
      <i class="bi bi-info-circle me-2"></i>
      <strong>Fonctionnalité en développement :</strong>
      L'édition des sessions d'exercices sera bientôt disponible. Pour le moment, vous pouvez consulter les sessions dans la liste des exercices.
    </div>

    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="bi bi-activity me-2"></i>
          {{ isEdit ? 'Modifier la session' : 'Nouvelle session' }}
        </h5>
      </div>
      <div class="card-body">
        <div class="text-center py-5">
          <i class="bi bi-tools fs-1 text-muted mb-3"></i>
          <h4 class="text-muted mb-3">Fonctionnalité en construction</h4>
          <p class="text-muted mb-4">Cette page utilisera bientôt les données de l'API pour l'édition des sessions d'exercices.</p>
          <router-link to="/exercises" class="btn btn-primary">
            <i class="bi bi-arrow-left me-2"></i>Retour à la liste
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Route
const route = useRoute()

// Détermine si on est en mode édition
const isEdit = computed(() => {
  return route.params.id !== undefined
})
</script>

<style scoped>
.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}
</style>