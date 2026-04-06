export const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v0',
  
  APP_NAME: 'HealthAI Coach',
  VERSION: '1.0.0',
  
  AUTH: {
    TOKEN_KEY: 'healthai_token',
    TOKEN_TYPE: 'Bearer'
  }
}