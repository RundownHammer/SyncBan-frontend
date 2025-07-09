import { createContext, useContext } from 'react'
import type { TeamContextType } from '../types'

export const TeamContext = createContext<TeamContextType | undefined>(undefined)

export const useTeam = () => {
  const context = useContext(TeamContext)
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider')
  }
  return context
}