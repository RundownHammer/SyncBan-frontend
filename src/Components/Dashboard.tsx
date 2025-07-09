import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTeam } from '../context/TeamContext'
import TeamSetup from './TeamSetup'
import Board from './Board'
import '../styles/Dashboard.css'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const { team } = useTeam()
  const [showTeamSetup, setShowTeamSetup] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const handleTeamSetup = () => {
    setShowTeamSetup(true)
  }

  const handleTeamSetupClose = () => {
    setShowTeamSetup(false)
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">
            <span className="logo">🎯</span>
            Live-ToDo
          </h1>
          {team && (
            <div className="team-info">
              <span className="team-name">{team.name}</span>
              <span className="team-code">#{team.code}</span>
            </div>
          )}
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">👋 {user?.username}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          
          <div className="header-actions">
            <button 
              className="btn btn-secondary"
              onClick={handleTeamSetup}
            >
              {team ? 'Switch Team' : 'Join Team'}
            </button>
            <button 
              className="btn btn-outline"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {!team ? (
          <div className="no-team-state">
            <div className="no-team-card">
              <h2>🚀 Get Started</h2>
              <p>Create or join a team to start collaborating on tasks!</p>
              <button 
                className="btn btn-primary"
                onClick={handleTeamSetup}
              >
                Create or Join Team
              </button>
            </div>
          </div>
        ) : (
          <Board />
        )}
      </main>

      {/* Team Setup Modal */}
      {showTeamSetup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TeamSetup onClose={handleTeamSetupClose} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard