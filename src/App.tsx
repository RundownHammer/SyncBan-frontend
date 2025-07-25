import React, { useState } from 'react'
import { AuthProvider } from './context/AuthProvider'
import { TeamProvider } from './context/TeamProvider'
import AuthPage from './Components/auth/AuthPage'
import Dashboard from './Components/Dashboard'
import LoadingScreen from './Components/LoadingScreen'
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
  const [isServerReady, setIsServerReady] = useState(false)

  const handleServerReady = () => {
    setIsServerReady(true)
  }

  return (
    <>
      {!isServerReady && (
        <LoadingScreen onServerReady={handleServerReady} />
      )}
      {isServerReady && (
        <AuthProvider>
          <TeamProvider>
            <AppContent />
          </TeamProvider>
        </AuthProvider>
      )}
    </>
  )
}

export default App