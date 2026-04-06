<template>
  <div class="container-fluid mt-4">
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/users" class="text-decoration-none">Utilisateurs</router-link>
        </li>
        <li class="breadcrumb-item active">{{ isEdit ? 'Modifier' : 'Nouveau' }}</li>
      </ol>
    </nav>

    <div v-if="userStore.loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p class="mt-2">{{ isEdit ? 'Chargement de l\'utilisateur...' : 'Sauvegarde...' }}</p>
    </div>

    <div v-if="userStore.error" class="alert alert-danger alert-dismissible" role="alert">
      {{ userStore.error }}
      <button type="button" class="btn-close" @click="userStore.clearError()"></button>
    </div>

    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="bi bi-person-fill me-2"></i>
          {{ isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}
        </h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit" v-if="!userStore.loading">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="email" class="form-label">Email *</label>
              <input 
                type="email" 
                class="form-control" 
                id="email" 
                v-model="form.User_mail"
                :disabled="isEdit"
                required
              >
              <small class="text-muted" v-if="isEdit">L'email ne peut pas être modifié</small>
            </div>
            <div class="col-md-6 mb-3" v-if="!isEdit">
              <label for="password" class="form-label">Mot de passe *</label>
              <input 
                type="password" 
                class="form-control" 
                id="password" 
                v-model="form.User_password"
                :required="!isEdit"
                placeholder="Minimum 6 caractères"
              >
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="age" class="form-label">Âge</label>
              <input 
                type="number" 
                class="form-control" 
                id="age" 
                v-model="form.User_age"
                min="16" 
                max="100"
              >
            </div>
            <div class="col-md-4 mb-3">
              <label for="weight" class="form-label">Poids (kg)</label>
              <input 
                type="number" 
                class="form-control" 
                id="weight" 
                v-model="form.User_weight"
                min="30" 
                max="300"
                step="0.1"
              >
            </div>
            <div class="col-md-4 mb-3">
              <label for="height" class="form-label">Taille (cm)</label>
              <input 
                type="number" 
                class="form-control" 
                id="height" 
                v-model="form.User_Height"
                min="100" 
                max="250"
              >
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="gender" class="form-label">Sexe</label>
              <select class="form-select" id="gender" v-model="form.User_gender">
                <option value="">Non spécifié</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="subscription" class="form-label">Abonnement</label>
              <select class="form-select" id="subscription" v-model="form.User_Subscription">
                <option value="">Basic</option>
                <option value="Premium">Premium</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          <div class="mb-3">
            <label for="goals" class="form-label">Objectifs</label>
            <textarea 
              class="form-control" 
              id="goals" 
              v-model="form.User_Goals"
              rows="3" 
              placeholder="Décrivez vos objectifs fitness..."
            ></textarea>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="allergies" class="form-label">Allergies</label>
              <textarea 
                class="form-control" 
                id="allergies" 
                v-model="form.User_Allergies"
                rows="2" 
                placeholder="Allergies alimentaires..."
              ></textarea>
            </div>
            <div class="col-md-6 mb-3">
              <label for="dietary" class="form-label">Préférences alimentaires</label>
              <textarea 
                class="form-control" 
                id="dietary" 
                v-model="form.User_Dietary_Preferences"
                rows="2" 
                placeholder="Végétarien, végan, etc..."
              ></textarea>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="budget" class="form-label">Niveau de budget</label>
              <select class="form-select" id="budget" v-model="form.User_Budget_Level">
                <option value="">Non spécifié</option>
                <option value="low">Faible</option>
                <option value="medium">Moyen</option>
                <option value="high">Élevé</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label for="injuries" class="form-label">Blessures/Limitations</label>
              <textarea 
                class="form-control" 
                id="injuries" 
                v-model="form.User_Injuries"
                rows="2" 
                placeholder="Blessures actuelles ou limitations physiques..."
              ></textarea>
            </div>
          </div>

          <div class="mb-3" v-if="isEdit">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="isAdmin" 
                v-model="form.isAdmin"
              >
              <label class="form-check-label" for="isAdmin">
                Administrateur
              </label>
            </div>
          </div>

          <div class="d-flex gap-2">
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="userStore.loading || !form.User_mail"
            >
              <i class="bi bi-check-lg"></i>
              {{ isEdit ? 'Mettre à jour' : 'Créer' }}
            </button>
            <router-link to="/users" class="btn btn-secondary">
              <i class="bi bi-x-lg"></i>
              Annuler
            </router-link>
            <button 
              v-if="isEdit" 
              type="button" 
              class="btn btn-outline-danger ms-auto"
              @click="confirmDelete"
              :disabled="userStore.loading"
            >
              <i class="bi bi-trash"></i>
              Supprimer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/users'
import type { User } from '../services/api'

// Router & Route
const router = useRouter()
const route = useRoute()

// Stores
const userStore = useUserStore()

// État local
const userId = computed(() => {
  const id = route.params.id
  return id && !isNaN(Number(id)) ? Number(id) : null
})

const isEdit = computed(() => userId.value !== null)

// Formulaire réactif
const form = reactive({
  User_mail: '',
  User_password: '',
  User_age: null as number | null,
  User_weight: null as number | null,
  User_Height: null as number | null,
  User_gender: '',
  User_Goals: '',
  User_Allergies: '',
  User_Dietary_Preferences: '',
  User_Budget_Level: '',
  User_Injuries: '',
  User_Subscription: '',
  isAdmin: false
})

// Réinitialiser le formulaire
const resetForm = () => {
  Object.assign(form, {
    User_mail: '',
    User_password: '',
    User_age: null,
    User_weight: null,
    User_Height: null,
    User_gender: '',
    User_Goals: '',
    User_Allergies: '',
    User_Dietary_Preferences: '',
    User_Budget_Level: '',
    User_Injuries: '',
    User_Subscription: '',
    isAdmin: false
  })
}

// Charger les données de l'utilisateur
const loadUser = async () => {
  if (isEdit.value && userId.value) {
    const user = await userStore.fetchUser(userId.value)
    if (user) {
      // Remplir le formulaire avec les données de l'utilisateur
      Object.assign(form, {
        User_mail: user.User_mail || '',
        User_password: '', // Ne pas charger le mot de passe
        User_age: user.User_age,
        User_weight: user.User_weight,
        User_Height: user.User_Height,
        User_gender: user.User_gender || '',
        User_Goals: user.User_Goals || '',
        User_Allergies: user.User_Allergies || '',
        User_Dietary_Preferences: user.User_Dietary_Preferences || '',
        User_Budget_Level: user.User_Budget_Level || '',
        User_Injuries: user.User_Injuries || '',
        User_Subscription: user.User_Subscription || '',
        isAdmin: user.isAdmin || false
      })
    }
  }
}

// Gérer la soumission du formulaire
const handleSubmit = async () => {
  try {
    if (isEdit.value && userId.value) {
      // Mise à jour
      const updateData = { ...form }
      delete updateData.User_password // Ne pas envoyer le mot de passe pour la mise à jour
      
      await userStore.updateUser(userId.value, updateData)
      alert('Utilisateur mis à jour avec succès!')
      router.push('/users')
    } else {
      // Création - TODO: Implémenter quand l'API le permettra
      alert('Fonctionnalité de création d\'utilisateur à venir')
    }
  } catch (error) {
    console.error('Erreur:', error)
  }
}

// Confirmer la suppression
const confirmDelete = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
    try {
      if (userId.value) {
        await userStore.deleteUser(userId.value)
        alert('Utilisateur supprimé avec succès!')
        router.push('/users')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

// Lifecycle
onMounted(async () => {
  userStore.clearError()
  userStore.clearCurrentUser()
  
  if (isEdit.value) {
    await loadUser()
  } else {
    resetForm()
  }
})
</script>

<style scoped>
.form-label {
  font-weight: 500;
  color: #495057;
}

.required {
  color: #dc3545;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.btn {
  min-width: 100px;
}
</style>