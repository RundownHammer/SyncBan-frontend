import React, { useState, useEffect, type ReactNode } from 'react'
import { TeamContext } from './TeamContext'
import type { TeamContextType, Team } from '../types'
import { useAuth } from './AuthContext'
import { API_ENDPOINTS, apiRequest } from '../config/api'

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
      const data = await apiRequest(API_ENDPOINTS.TEAMS.MY_TEAM)
      setTeam(data.team)
    } catch (error) {
      console.error('Error fetching team:', error)
      // Don't throw error if team not found (404)
      if (error instanceof Error && !error.message.includes('404')) {
        console.error('Unexpected error:', error)
      }
    }
  }

  const createTeam = async (name: string): Promise<void> => {
    if (!token) throw new Error('Not authenticated')

    setLoading(true)
    try {
      const data = await apiRequest(API_ENDPOINTS.TEAMS.CREATE, {
        method: 'POST',
        body: JSON.stringify({ name })
      })

      setTeam(data.team)
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
      const data = await apiRequest(API_ENDPOINTS.TEAMS.JOIN, {
        method: 'POST',
        body: JSON.stringify({ code })
      })

      setTeam(data.team)
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
      await apiRequest(API_ENDPOINTS.TEAMS.LEAVE, {
        method: 'POST'
      })

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
      const data = await apiRequest(API_ENDPOINTS.TEAMS.REGENERATE_CODE, {
        method: 'POST'
      })

      // Update team with new code
      if (team) {
        setTeam({
          ...team,
          code: data.code,
          codeExpiresAt: data.expiresAt
        })
      }
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