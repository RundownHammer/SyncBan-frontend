import React, { useState } from 'react'
import { useTeam } from '../context/TeamContext'
import '../styles/TeamSetup.css'

interface TeamSetupProps {
  onClose: () => void
}

const TeamSetup: React.FC<TeamSetupProps> = ({ onClose }) => {
  const [isCreating, setIsCreating] = useState(true)
  const [teamName, setTeamName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { createTeam, joinTeam } = useTeam()

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
      await joinTeam(joinCode.trim())
      onClose()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to join team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="team-setup">
      <div className="team-setup-header">
        <h2>Team Setup</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="team-setup-tabs">
        <button 
          className={`tab-btn ${isCreating ? 'active' : ''}`}
          onClick={() => setIsCreating(true)}
        >
          Create Team
        </button>
        <button 
          className={`tab-btn ${!isCreating ? 'active' : ''}`}
          onClick={() => setIsCreating(false)}
        >
          Join Team
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isCreating ? (
        <form onSubmit={handleCreateTeam} className="team-form">
          <div className="form-group">
            <label htmlFor="teamName" className="form-label">Team Name</label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="form-input"
              placeholder="Enter team name"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleJoinTeam} className="team-form">
          <div className="form-group">
            <label htmlFor="joinCode" className="form-label">Join Code</label>
            <input
              type="text"
              id="joinCode"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="form-input"
              placeholder="Enter team join code"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Joining...' : 'Join Team'}
          </button>
        </form>
      )}
    </div>
  )
}

export default TeamSetup