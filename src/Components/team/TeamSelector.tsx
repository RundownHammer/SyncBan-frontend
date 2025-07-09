import React, { useState } from 'react'
import { useTeam } from '../../context/TeamContext'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Team.css'

const TeamSelector: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [teamCode, setTeamCode] = useState('')
  const [error, setError] = useState('')
  const { team, createTeam, joinTeam, leaveTeam, regenerateCode, loading } = useTeam()
  const { user } = useAuth()

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!teamName.trim()) {
      setError('Team name is required')
      return
    }

    try {
      await createTeam(teamName.trim())
      setTeamName('')
      setShowCreateForm(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!teamCode.trim()) {
      setError('Team code is required')
      return
    }

    try {
      await joinTeam(teamCode.trim().toUpperCase())
      setTeamCode('')
      setShowJoinForm(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const handleLeaveTeam = async () => {
    if (window.confirm('Are you sure you want to leave this team?')) {
      try {
        await leaveTeam()
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      }
    }
  }

  const handleRegenerateCode = async () => {
    if (window.confirm('Are you sure you want to regenerate the team code? The old code will become invalid.')) {
      try {
        await regenerateCode()
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Team code copied to clipboard!')
  }

  if (team) {
    return (
      <div className="team-info">
        <div className="team-header">
          <h3 className="team-name">📋 {team.name}</h3>
          <div className="team-members">
            👥 {team.members.length} member{team.members.length !== 1 ? 's' : ''}
          </div>
        </div>

        {team.code && (
          <div className="team-code-section">
            <label className="team-code-label">Team Code:</label>
            <div className="team-code-display">
              <span className="team-code">{team.code}</span>
              <button
                className="btn btn-secondary btn-small"
                onClick={() => copyToClipboard(team.code!)}
                title="Copy team code"
              >
                📋
              </button>
            </div>
            {team.creator === user?._id && (
              <button
                className="btn btn-secondary btn-small"
                onClick={handleRegenerateCode}
                disabled={loading}
              >
                🔄 Regenerate Code
              </button>
            )}
          </div>
        )}

        <div className="team-actions">
          <button
            className="btn btn-danger btn-small"
            onClick={handleLeaveTeam}
            disabled={loading}
          >
            🚪 Leave Team
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    )
  }

  return (
    <div className="team-selector">
      <div className="team-selector-header">
        <h3>👥 Team Management</h3>
        <p>Create a new team or join an existing one</p>
      </div>

      <div className="team-actions">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowCreateForm(true)
            setShowJoinForm(false)
            setError('')
          }}
        >
          ➕ Create Team
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setShowJoinForm(true)
            setShowCreateForm(false)
            setError('')
          }}
        >
          🔗 Join Team
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateTeam} className="team-form">
          <div className="form-group">
            <label htmlFor="teamName" className="form-label">Team Name</label>
            <input
              type="text"
              id="teamName"
              className="form-input"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      )}

      {showJoinForm && (
        <form onSubmit={handleJoinTeam} className="team-form">
          <div className="form-group">
            <label htmlFor="teamCode" className="form-label">Team Code</label>
            <input
              type="text"
              id="teamCode"
              className="form-input"
              placeholder="Enter team code"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowJoinForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Joining...' : 'Join Team'}
            </button>
          </div>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default TeamSelector