<template>
  <div class="login-container">
    <div class="login-card">
      <div class="text-center mb-4">
        <i class="bi bi-heart-pulse text-success" style="font-size: 3rem;"></i>
        <h2 class="mt-3 text-success fw-bold">HealthAI Coach</h2>
        <p class="text-muted">Connectez-vous à votre espace administrateur</p>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            v-model="form.email"
            placeholder="admin@healthai.com"
            required
          >
        </div>
        
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <input 
            type="password" 
            class="form-control" 
            id="password" 
            v-model="form.password"
            placeholder="••••••••"
            required
          >
        </div>
        
        <div class="mb-3 form-check">
          <input 
            type="checkbox" 
            class="form-check-input" 
            id="remember" 
            v-model="form.remember"
          >
          <label class="form-check-label" for="remember">
            Se souvenir de moi
          </label>
        </div>
        
        <div v-if="authStore.error" class="alert alert-danger mb-3">
          {{ authStore.error }}
        </div>
        
        <button 
          type="submit" 
          class="btn btn-success w-100"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
      
      <hr class="my-4">
      
      <div class="text-center">
        <small class="text-muted">
          Mot de passe oublié ? 
          <a href="#" class="text-success text-decoration-none">Réinitialiser</a>
        </small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
  remember: false
})

onMounted(() => {
  authStore.clearError()
  
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

const handleLogin = async () => {
  authStore.clearError()
  
  try {
    await authStore.login({
      User_mail: form.value.email,
      User_password: form.value.password
    })
    
    if (form.value.remember) {
      localStorage.setItem('healthai_remember', 'true')
    }
  } catch (error) {
    console.error('Erreur de connexion:', error)
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

.btn-success {
  background-color: #198754;
  border-color: #198754;
  border-radius: 8px;
  padding: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background-color: #157347;
  border-color: #146c43;
  transform: translateY(-1px);
}

.btn-success:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  transform: none;
}

.text-success {
  color: #198754 !important;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
  border-radius: 8px;
}

@media (max-width: 576px) {
  .login-card {
    padding: 30px 20px;
  }
}
</style>