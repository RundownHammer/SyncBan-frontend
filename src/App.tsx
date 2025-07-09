import React, { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { TeamProvider } from './context/TeamProvider'
import Login from './Components/auth/Login'
import Register from './Components/auth/Register'
import Board from './Components/Board'
import Header from './Components/Header'
import './App.css'

const App: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true)
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="app">
        {showLogin ? (
          <Login onSwitchToRegister={() => setShowLogin(false)} />
        ) : (
          <Register onSwitchToLogin={() => setShowLogin(true)} />
        )}
      </div>
    )
  }

  return (
    <TeamProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Board />
        </main>
      </div>
    </TeamProvider>
  )
}

export default App