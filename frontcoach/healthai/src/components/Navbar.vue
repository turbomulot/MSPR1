<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <i class="bi bi-heart-pulse"></i> HealthAI Coach
      </router-link>
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <a
              class="nav-link" 
              href="#"
              :class="{ active: $route.name === 'dashboard' }"
              @click.prevent="navigateTo('/')"
            >
              Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link" 
              href="#"
              :class="{ active: $route.name === 'users' }"
              @click.prevent="navigateTo('/users')"
            >
              Utilisateurs
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link" 
              href="#"
              :class="{ active: $route.name === 'nutrition' }"
              @click.prevent="navigateTo('/nutrition')"
            >
              Nutrition
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link" 
              href="#"
              :class="{ active: $route.name === 'exercises' }"
              @click.prevent="navigateTo('/exercises')"
            >
              Exercices
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link" 
              href="#"
              :class="{ active: $route.name === 'data' }"
              @click.prevent="navigateTo('/data')"
            >
              Données
            </a>
          </li>
        </ul>
        <div class="navbar-nav ms-auto">
          <span class="navbar-text me-3">
            <i class="bi bi-person-circle"></i> {{ authStore.user?.User_mail || 'Utilisateur' }}
          </span>
          <button 
            class="btn btn-outline-light btn-sm"
            @click="handleLogout"
          >
            <i class="bi bi-box-arrow-right"></i> Déconnexion
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const navigateTo = (path: string) => {
  console.log('Navigation to:', path)
  router.push(path)
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.navbar-brand i {
  margin-right: 8px;
}

.navbar {
  width: 100% !important;
  min-height: 60px;
  max-height: 70px;
  padding: 0.5rem 0;
  position: relative;
  display: block !important;
  margin: 0 !important;
  float: none !important;
}

.navbar .container-fluid {
  max-width: 100% !important;
  width: 100% !important;
}

.navbar-brand {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
}

.navbar-nav .nav-link {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.75);
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-link.active {
  color: #ffffff;
}

.navbar-text {
  font-size: 1rem;
  display: flex;
  align-items: center;
}

.btn-outline-light {
  border-color: rgba(255, 255, 255, 0.5);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.75);
  color: #ffffff;
}

@media (min-width: 1200px) {
  .navbar .container-fluid {
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .navbar-brand {
    font-size: 1.4rem;
  }
  
  .navbar-nav .nav-link {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    min-height: 56px;
  }
  
  .navbar-brand {
    font-size: 1rem;
  }
  
  .navbar-nav .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>