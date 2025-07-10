import React, { useState } from 'react'
import { useTeam } from '../context/TeamContext'
import '../styles/TeamSetup.css'

interface TeamSetupProps {
  onClose: () => void
  isSwitch?: boolean // Add prop to indicate if this is a team switch
}

const TeamSetup: React.FC<TeamSetupProps> = ({ onClose, isSwitch = false }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('join') // Default to join for switch
  const [teamName, setTeamName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { createTeam, joinTeam, leaveTeam } = useTeam()

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!teamName.trim()) {
      setError('Team name is required')
      setLoading(false)
      return
    }

    try {
      // If switching teams, leave current team first
      if (isSwitch) {
        await leaveTeam()
      }
      
      await createTeam(teamName.trim())
      onClose()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!joinCode.trim()) {
      setError('Join code is required')
      setLoading(false)
      return
    }

    try {
      // If switching teams, leave current team first
      if (isSwitch) {
        await leaveTeam()
      }
      
      await joinTeam(joinCode.trim())
      onClose()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to join team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="team-setup-overlay" onClick={(e) => {
      // Close modal when clicking on overlay (not modal content)
      if (e.target === e.currentTarget) {
        onClose()
      }
    }}>
      <div className="team-setup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="team-setup-header">
          <h2>
            {isSwitch ? '🔄 Switch Team' : '🚀 Team Setup'}
          </h2>
          <button className="close-btn" onClick={onClose} type="button">×</button>
        </div>

        <div className="team-setup-tabs">
          <button 
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Team
          </button>
          <button 
            className={`tab-btn ${activeTab === 'join' ? 'active' : ''}`}
            onClick={() => setActiveTab('join')}
          >
            Join Team
          </button>
        </div>

        <div className="team-setup-content">
          {error && <div className="error-message">{error}</div>}

          {activeTab === 'create' ? (
            <div className="tab-content">
              <div className="tab-info">
                <h3>{isSwitch ? 'Create a New Team' : 'Create a New Team'}</h3>
                <p>
                  {isSwitch 
                    ? 'Create a new team to switch to. Your current team will be left when you create the new team.'
                    : 'Start a new team and invite others to collaborate on your Kanban board.'
                  }
                </p>
              </div>
              
              <form onSubmit={handleCreateTeam} className="team-form">
                <div className="form-group">
                  <label htmlFor="teamName" className="form-label">Team Name</label>
                  <input
                    type="text"
                    id="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="form-input"
                    placeholder="e.g., Development Team, Marketing Squad"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      ✨ Create Team
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="tab-content">
              <div className="tab-info">
                <h3>{isSwitch ? 'Join Another Team' : 'Join Existing Team'}</h3>
                <p>
                  {isSwitch 
                    ? 'Enter the team code for the team you want to join. Your current team will be left when you join the new team.'
                    : 'Enter the team code shared by your team leader to join an existing team.'
                  }
                </p>
              </div>
              
              <form onSubmit={handleJoinTeam} className="team-form">
                <div className="form-group">
                  <label htmlFor="joinCode" className="form-label">Team Code</label>
                  <input
                    type="text"
                    id="joinCode"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="form-input"
                    placeholder="e.g., ABC123"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Joining...
                    </>
                  ) : (
                    <>
                      🤝 Join Team
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeamSetup