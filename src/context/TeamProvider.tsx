import React, { useState, useEffect, type ReactNode } from 'react'
import { TeamContext } from './TeamContext'
import type { TeamContextType, Team } from '../types'
import { useAuth } from './AuthContext'

interface TeamProviderProps {
  children: ReactNode
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(false)
  const { token, user } = useAuth()

  // Fetch user's current team on mount
  useEffect(() => {
    if (token && user) {
      fetchMyTeam()
    }
  }, [token, user])

  const fetchMyTeam = async () => {
    if (!token) return

    try {
      const response = await fetch('http://localhost:5000/api/teams/my-team', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTeam(data.team)
      } else if (response.status !== 404) {
        console.error('Error fetching team')
      }
    } catch (error) {
      console.error('Error fetching team:', error)
    }
  }

  const createTeam = async (name: string): Promise<void> => {
    if (!token) throw new Error('Not authenticated')

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/teams/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create team')
      }

      await fetchMyTeam() // Refresh team data
    } catch (error) {
      console.error('Create team error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const joinTeam = async (code: string): Promise<void> => {
    if (!token) throw new Error('Not authenticated')

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/teams/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join team')
      }

      await fetchMyTeam() // Refresh team data
    } catch (error) {
      console.error('Join team error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const leaveTeam = async (): Promise<void> => {
    if (!token) throw new Error('Not authenticated')

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/teams/leave', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to leave team')
      }

      setTeam(null)
    } catch (error) {
      console.error('Leave team error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const regenerateCode = async (): Promise<void> => {
    if (!token) throw new Error('Not authenticated')

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/teams/regenerate-code', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to regenerate code')
      }

      await fetchMyTeam() // Refresh team data
    } catch (error) {
      console.error('Regenerate code error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value: TeamContextType = {
    team,
    createTeam,
    joinTeam,
    leaveTeam,
    regenerateCode,
    loading,
  }

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>
}