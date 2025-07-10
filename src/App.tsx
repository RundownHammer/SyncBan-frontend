import React from 'react'
import { AuthProvider } from './context/AuthProvider'
import { TeamProvider } from './context/TeamProvider'
import AuthPage from './Components/auth/AuthPage'
import Dashboard from './Components/Dashboard'
import { useAuth } from './context/AuthContext'
import './App.css'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return user ? <Dashboard /> : <AuthPage />
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TeamProvider>
        <AppContent />
      </TeamProvider>
    </AuthProvider>
  )
}

export default App