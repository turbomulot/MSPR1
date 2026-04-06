import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { config } from '../config'

export const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

export interface LoginCredentials {
  User_mail: string
  User_password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface User {
  User_ID: number
  User_mail: string
  User_Subscription: string | null
  User_age: number | null
  User_weight: number | null
  User_Height: number | null
  User_gender: string | null
  User_Goals: string | null
  User_Allergies: string | null
  User_Dietary_Preferences: string | null
  User_Budget_Level: string | null
  User_Injuries: string | null
  isAdmin: boolean
  created_at: string
  updated_at: string
}

export interface UserAnalyticsSummary {
  user_id: number
  meal_logs_count: number
  workout_sessions_count: number
  biometrics_logs_count: number
  total_logged_kcal: number
  avg_workout_duration_minutes: number | null
  avg_sleep_hours: number | null
  latest_weight: number | null
}

export interface Product {
  Product_ID: number
  Product_Name: string
  Product_Calories: number | null
  Product_Protein: number | null
  Product_Carbs: number | null
  Product_Fat: number | null
  Product_Fiber: number | null
  Product_Sugar: number | null
  Product_Sodium: number | null
  Product_Cholesterol: number | null
  Product_brand: string | null
  Product_category: string | null
  Product_Diet_Tags: string | null
  Product_Price_Category: string | null
  created_at: string
  updated_at: string
}

export interface WorkoutSession {
  Session_ID: number
  User_ID: number
  Session_Date: string
  Session_MaxBpm: number | null
  Session_AvgBpm: number | null
  Session_RestingBpm: number | null
  Session_Duration: number | null
  Session_Type: string | null
  User_Feedback_Score: number | null
  created_at: string
  updated_at: string
}

// Services API
class ApiService {
  // Authentification
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    const response = await apiClient.post('/users/login', credentials)
    return response.data
  }

  // Analytics
  async getMyAnalyticsSummary(): Promise<UserAnalyticsSummary> {
    const response = await apiClient.get('/analytics/me/summary')
    return response.data
  }

  // Utilisateurs
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get('/users')
    return response.data
  }

  async getUser(id: number): Promise<User> {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, userData)
    return response.data
  }

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  }

  // Produits
  async getAllProducts(): Promise<Product[]> {
    const response = await apiClient.get('/products')
    return response.data
  }

  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  }

  async createProduct(productData: Omit<Product, 'Product_ID' | 'created_at' | 'updated_at'>): Promise<Product> {
    const response = await apiClient.post('/products', productData)
    return response.data
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const response = await apiClient.put(`/products/${id}`, productData)
    return response.data
  }

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`)
  }

  // Sessions d'entraînement
  async getAllWorkoutSessions(): Promise<WorkoutSession[]> {
    const response = await apiClient.get('/workout_sessions')
    return response.data
  }

  async getWorkoutSession(id: number): Promise<WorkoutSession> {
    const response = await apiClient.get(`/workout_sessions/${id}`)
    return response.data
  }

  async getWorkoutSessionsByUser(userId: number): Promise<WorkoutSession[]> {
    const response = await apiClient.get(`/workout_sessions/user/${userId}`)
    return response.data
  }
}

export const apiService = new ApiService()