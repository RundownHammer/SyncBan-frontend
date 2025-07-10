import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useTeam } from '../context/TeamContext'
import '../styles/Header.css'

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { team } = useTeam()

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-logo">📋 SyncBan</h1>
          {team && (
            <div className="header-team-info">
              <span className="team-badge">👥 {team.name}</span>
            </div>
          )}
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="user-name">👋 {user?.username}</span>
            <button className="btn btn-secondary btn-small" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header