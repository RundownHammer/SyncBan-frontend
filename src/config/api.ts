export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development'
}

// Export individual constants for backward compatibility
export const API_BASE_URL = API_CONFIG.BASE_URL
export const SOCKET_URL = API_CONFIG.SOCKET_URL

// Log configuration for debugging
console.log('🌐 API Base URL:', API_CONFIG.BASE_URL)
console.log('📡 Socket URL:', API_CONFIG.SOCKET_URL)
console.log('🔧 Environment:', API_CONFIG.NODE_ENV)

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_CONFIG.BASE_URL}/api/auth/login`,
    REGISTER: `${API_CONFIG.BASE_URL}/api/auth/register`,
    LOGOUT: `${API_CONFIG.BASE_URL}/api/auth/logout`,
    PROFILE: `${API_CONFIG.BASE_URL}/api/auth/profile`
  },
  TEAMS: {
    CREATE: `${API_CONFIG.BASE_URL}/api/teams/create`,
    JOIN: `${API_CONFIG.BASE_URL}/api/teams/join`,
    LEAVE: `${API_CONFIG.BASE_URL}/api/teams/leave`,
    MY_TEAM: `${API_CONFIG.BASE_URL}/api/teams/my-team`,
    REGENERATE_CODE: `${API_CONFIG.BASE_URL}/api/teams/regenerate-code`
  },
  TASKS: {
    BASE: `${API_CONFIG.BASE_URL}/api/tasks`,
    CREATE: `${API_CONFIG.BASE_URL}/api/tasks`,
    UPDATE: (id: string) => `${API_CONFIG.BASE_URL}/api/tasks/${id}`,
    DELETE: (id: string) => `${API_CONFIG.BASE_URL}/api/tasks/${id}`
  }
}

// Create a fetch wrapper with proper error handling
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}