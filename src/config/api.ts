const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

console.log('🌐 API Base URL:', API_BASE_URL)
console.log('🔧 Environment:', import.meta.env.VITE_NODE_ENV === 'production' ? 'production' : 'development')

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

// Health check function to test backend connectivity
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout for faster failure detection
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    
    if (response.ok) {
      console.log('✅ Server is healthy')
      return true
    } else {
      console.log('❌ Server health check failed:', response.status)
      return false
    }
  } catch (error) {
    console.log('❌ Server health check error:', error)
    return false
  }
}

// Wait for server to be ready with exponential backoff
export const waitForServer = async (maxRetries = 20, initialDelay = 1000): Promise<boolean> => {
  for (let i = 0; i < maxRetries; i++) {
    console.log(`🔄 Checking server health... (${i + 1}/${maxRetries})`)
    
    const isHealthy = await checkServerHealth()
    if (isHealthy) {
      return true
    }
    
    // Exponential backoff with jitter
    const delay = Math.min(initialDelay * Math.pow(1.5, i), 10000) + Math.random() * 1000
    console.log(`⏳ Waiting ${Math.round(delay)}ms before next attempt...`)
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  
  console.log('❌ Server health check failed after all retries')
  return false
}