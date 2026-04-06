<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-primary">Gestion des Utilisateurs</h2>
      <button class="btn btn-primary" @click="openAddUserModal">
        <i class="bi bi-plus"></i> Ajouter un utilisateur
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="userStore.loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p class="mt-2">Chargement des utilisateurs...</p>
    </div>

    <!-- Error state -->
    <div v-if="userStore.error" class="alert alert-danger alert-dismissible" role="alert">
      {{ userStore.error }}
      <button type="button" class="btn-close" @click="userStore.clearError()"></button>
    </div>

    <!-- Content -->
    <div v-if="!userStore.loading">
      <!-- Statistics Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h5 class="card-title">Utilisateurs Total</h5>
                  <h3>{{ userStore.userStats.total }}</h3>
                </div>
                <i class="bi bi-people fs-2"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h5 class="card-title">Actifs</h5>
                  <h3>{{ userStore.userStats.active }}</h3>
                </div>
                <i class="bi bi-check-circle fs-2"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h5 class="card-title">Premium</h5>
                  <h3>{{ userStore.userStats.premium }}</h3>
                </div>
                <i class="bi bi-star fs-2"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-secondary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h5 class="card-title">Inactifs</h5>
                  <h3>{{ userStore.userStats.inactive }}</h3>
                </div>
                <i class="bi bi-pause-circle fs-2"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-3">
              <label class="form-label">Rechercher</label>
              <input 
                :value="userStore.filters.search" 
                @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
                type="text" 
                class="form-control" 
                placeholder="Email, objectifs..."
              >
            </div>
            <div class="col-md-2">
              <label class="form-label">Statut</label>
              <select 
                :value="userStore.filters.status"
                @change="updateFilter('status', ($event.target as HTMLSelectElement).value)"
                class="form-select"
              >
                <option value="">Tous</option>
                <option value="active">Actifs</option>
                <option value="inactive">Inactifs</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Âge</label>
              <select 
                :value="userStore.filters.age"
                @change="updateFilter('age', ($event.target as HTMLSelectElement).value)"
                class="form-select"
              >
                <option value="">Tous</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46+">46+</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Objectif</label>
              <select 
                :value="userStore.filters.goal"
                @change="updateFilter('goal', ($event.target as HTMLSelectElement).value)"
                class="form-select"
              >
                <option value="">Tous</option>
                <option value="perte de poids">Perte de poids</option>
                <option value="prise de masse">Prise de masse</option>
                <option value="maintien">Maintien</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">&nbsp;</label>
              <button class="btn btn-outline-secondary d-block" @click="resetFilters">Réinitialiser</button>
            </div>
          </div>
        </div>
      </div>


      <div class="card">
        <div class="card-body">
          <div v-if="userStore.paginatedUsers.length === 0" class="text-center py-4">
            <i class="bi bi-people fs-1 text-muted"></i>
            <p class="text-muted mt-2">Aucun utilisateur trouvé</p>
          </div>
          
          <div v-else class="table-responsive">
            <table class="table table-hover">
              <thead class="table-light">
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Âge</th>
                  <th>Objectifs</th>
                  <th>Abonnement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in userStore.paginatedUsers" :key="user.User_ID">
                  <td>{{ user.User_ID }}</td>
                  <td>{{ user.User_mail }}</td>
                  <td>
                    <span v-if="user.User_age" class="badge bg-info">{{ user.User_age }} ans</span>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td>{{ user.User_Goals || '-' }}</td>
                  <td>
                    <span :class="getSubscriptionBadgeClass(user.User_Subscription)">
                      {{ user.User_Subscription || 'Basic' }}
                    </span>
                  </td>
                  <td>
                    <div class="dropdown">
                      <button class="btn btn-outline-dark btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                        Actions
                      </button>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" @click="editUser(user)">
                          <i class="bi bi-pencil"></i> Modifier
                        </a></li>
                        <li><a class="dropdown-item" href="#" @click="viewUserDetails(user)">
                          <i class="bi bi-eye"></i> Voir détails
                        </a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" @click="deleteUserPrompt(user.User_ID)">
                          <i class="bi bi-trash"></i> Supprimer
                        </a></li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <nav class="mt-4" v-if="userStore.totalUsers > 0">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="text-muted">
                  Affichage de {{ (userStore.currentPage - 1) * userStore.itemsPerPage + 1 }} à 
                  {{ Math.min(userStore.currentPage * userStore.itemsPerPage, userStore.totalUsers) }} 
                  sur {{ userStore.totalUsers }} utilisateurs
                </span>
              </div>
              <div class="d-flex align-items-center">
                <label class="me-2">Éléments par page :</label>
                <select 
                  :value="userStore.itemsPerPage" 
                  @change="userStore.setItemsPerPage(parseInt(($event.target as HTMLSelectElement).value))"
                  class="form-select me-3" 
                  style="width: auto;"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <ul class="pagination mb-0">
                  <li class="page-item" :class="{ disabled: userStore.currentPage === 1 }">
                    <a class="page-link" @click="userStore.setPage(userStore.currentPage - 1)">&laquo;</a>
                  </li>
                  <li v-for="page in visiblePages" :key="page" 
                      class="page-item" :class="{ active: page === userStore.currentPage }">
                    <a class="page-link" @click="userStore.setPage(page)">{{ page }}</a>
                  </li>
                  <li class="page-item" :class="{ disabled: userStore.currentPage === userStore.totalPages }">
                    <a class="page-link" @click="userStore.setPage(userStore.currentPage + 1)">&raquo;</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div class="modal fade" id="detailsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Détails de l'utilisateur</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedUser">
            <div class="row">
              <div class="col-md-6">
                <h6 class="text-muted">Informations générales</h6>
                <p><strong>ID :</strong> {{ selectedUser.User_ID }}</p>
                <p><strong>Email :</strong> {{ selectedUser.User_mail }}</p>
                <p><strong>Âge :</strong> {{ selectedUser.User_age || 'Non spécifié' }}</p>
                <p><strong>Abonnement :</strong> 
                  <span :class="getSubscriptionBadgeClass(selectedUser.User_Subscription)">
                    {{ selectedUser.User_Subscription || 'Basic' }}
                  </span>
                </p>
              </div>
              <div class="col-md-6">
                <h6 class="text-muted">Objectifs</h6>
                <p>{{ selectedUser.User_Goals || 'Aucun objectif défini' }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '../stores/users'
import type { User } from '../services/api'

const userStore = useUserStore()

const selectedUser = ref<User | null>(null)
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, userStore.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(userStore.totalPages, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Méthodes
const updateFilter = (key: string, value: string) => {
  userStore.setFilters({ [key]: value })
}

const resetFilters = () => {
  userStore.setFilters({
    search: '',
    status: '',
    age: '',
    goal: ''
  })
}

const getSubscriptionBadgeClass = (subscription: string) => {
  if (!subscription) return 'badge bg-secondary'
  
  return subscription.toLowerCase() === 'premium' 
    ? 'badge bg-warning text-dark'
    : 'badge bg-secondary'
}

const openAddUserModal = () => {
  alert('Fonctionnalité d\'ajout d\'utilisateur à venir')
}

const editUser = (user: User) => {
  console.log('Edit user:', user)
  alert('Fonctionnalité de modification à venir')
}

const viewUserDetails = (user: User) => {
  selectedUser.value = user
  
  const modal = new (window as any).bootstrap.Modal(document.getElementById('detailsModal'))
  modal.show()
}

const deleteUserPrompt = async (userId: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    try {
      await userStore.deleteUser(userId)
      alert('Utilisateur supprimé avec succès')
    } catch (error) {
      alert('Erreur lors de la suppression de l\'utilisateur')
    }
  }
}

onMounted(async () => {
  await userStore.fetchUsers()
})
</script>