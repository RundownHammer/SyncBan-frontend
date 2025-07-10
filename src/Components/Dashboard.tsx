import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTeam } from '../context/TeamContext'
import TeamSetup from './TeamSetup'
import Board from './Board'
import '../styles/Dashboard.css'

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const { team, leaveTeam } = useTeam()
  const [showTeamSetup, setShowTeamSetup] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isTeamSwitch, setIsTeamSwitch] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
      }
    }

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMobileMenu])

  const handleLogout = () => {
    logout()
  }

  const handleTeamSetup = () => {
    setIsTeamSwitch(false)
    setShowTeamSetup(true)
    setShowMobileMenu(false) // Close mobile menu when opening team setup
  }

  const handleSwitchTeam = () => {
    // Only open team setup modal - don't leave team yet
    setIsTeamSwitch(true)
    setShowTeamSetup(true)
    setShowMobileMenu(false)
  }

  const handleLeaveTeam = async () => {
    if (team && window.confirm(`Are you sure you want to leave "${team.name}"?`)) {
      try {
        await leaveTeam()
        setShowMobileMenu(false)
      } catch (error) {
        console.error('Error leaving team:', error)
      }
    }
  }

  const handleTeamSetupClose = () => {
    setShowTeamSetup(false)
    setIsTeamSwitch(false)
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }

  return (
    <div className="dashboard">
      {/* Responsive Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <span className="logo">🎯</span>
              SyncBan
            </h1>
            {team && (
              <div className="team-info">
                <span className="team-name">{team.name}</span>
                <span className="team-code">#{team.code}</span>
              </div>
            )}
          </div>
          
          <div className="header-right">
            {/* Desktop Menu */}
            <div className="desktop-menu">
              <div className="user-info">
                <span className="user-name">👋 {user?.username}</span>
                <span className="user-email">{user?.email}</span>
              </div>
              
              <div className="header-actions">
                {team ? (
                  <>
                    <button 
                      className="btn btn-secondary"
                      onClick={handleSwitchTeam}
                    >
                      Switch Team
                    </button>
                    <button 
                      className="btn btn-outline"
                      onClick={handleLeaveTeam}
                    >
                      Leave Team
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn btn-secondary"
                    onClick={handleTeamSetup}
                  >
                    Join Team
                  </button>
                )}
                <button 
                  className="btn btn-outline"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="mobile-menu" ref={mobileMenuRef}>
              <div className="user-info-mobile">
                <span className="user-name">👋 {user?.username}</span>
              </div>
              <button 
                className="mobile-menu-btn"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <span className="hamburger-icon">☰</span>
              </button>
              
              {/* Mobile Dropdown */}
              {showMobileMenu && (
                <div className="mobile-dropdown">
                  <div className="mobile-dropdown-content">
                    <div className="mobile-user-info">
                      <span className="mobile-user-name">{user?.username}</span>
                      <span className="mobile-user-email">{user?.email}</span>
                    </div>
                    <div className="mobile-actions">
                      {team ? (
                        <>
                          <button 
                            className="mobile-btn"
                            onClick={handleSwitchTeam}
                          >
                            🔄 Switch Team
                          </button>
                          <button 
                            className="mobile-btn"
                            onClick={handleLeaveTeam}
                          >
                            🚪 Leave Team
                          </button>
                        </>
                      ) : (
                        <button 
                          className="mobile-btn"
                          onClick={handleTeamSetup}
                        >
                          👥 Join Team
                        </button>
                      )}
                      <button 
                        className="mobile-btn logout"
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
        <TeamSetup onClose={handleTeamSetupClose} isSwitch={isTeamSwitch} />
      )}
    </div>
  )
}

export default Dashboard