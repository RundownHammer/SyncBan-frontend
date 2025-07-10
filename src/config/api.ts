const API_BASE_URL = import.meta.env.PROD 
  ? 'https://syncban-backend.onrender.com' 
  : 'http://localhost:5000'

console.log('🌐 API Base URL:', API_BASE_URL)
console.log('🔧 Environment:', import.meta.env.PROD ? 'production' : 'development')

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile'
  },
  TEAMS: {
    CREATE: '/api/teams/create',
    JOIN: '/api/teams/join',
    MY_TEAM: '/api/teams/my-team',
    LEAVE: '/api/teams/leave',
    REGENERATE_CODE: '/api/teams/regenerate-code'
  },
  TASKS: {
    BASE: '/api/tasks'
  },
  ACTIVITIES: '/api/activities'
}

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  console.log(`🌐 API Request: ${config.method || 'GET'} ${API_BASE_URL}${endpoint}`)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error(`❌ API Error (${endpoint}):`, error)
    throw error
  }
}