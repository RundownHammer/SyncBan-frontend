// API Configuration based on environment
const getBaseURL = (): string => {
    if (import.meta.env.PROD) {
      // Production URLs - update these when you deploy
      return import.meta.env.VITE_API_URL || 'https://your-backend-domain.com'
    } else {
      // Development URL
      return import.meta.env.VITE_API_URL || 'http://localhost:5000'
    }
  }
  
  export const API_BASE_URL = getBaseURL()
  export const SOCKET_URL = API_BASE_URL
  
  console.log(`🌐 API Base URL: ${API_BASE_URL}`)
  console.log(`📡 Socket URL: ${SOCKET_URL}`)