export interface User {
  _id: string
  username: string
  email: string
  currentTeam?: string
  createdAt: string
  updatedAt: string
}

export interface Team {
  _id: string
  name: string
  code: string  // Keep as 'code' (matches backend)
  createdBy: string  // Change from 'creator' to 'createdBy'
  members: string[]
  codeExpiresAt: string  // Add this property
  isActive: boolean      // Add this property
  createdAt: string
  updatedAt: string
}

export interface Cards {
  _id: string
  title: string
  description?: string
  status: 'ToDo' | 'In Progress' | 'Done'
  priority: 'Low' | 'Medium' | 'High'
  assignedTo?: string
  team: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

export interface TeamContextType {
  team: Team | null
  loading: boolean
  createTeam: (name: string) => Promise<void>
  joinTeam: (code: string) => Promise<void>
  leaveTeam: () => Promise<void>
  regenerateCode: () => Promise<void>
}

export interface ColumnProps {
  title: string
  items: Cards[]
  onRemoveTask?: (taskTitle: string, columnTitle: string) => void
}

export interface TaskProps {
  title: string
  description?: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'ToDo' | 'In Progress' | 'Done'
  assignedTo?: string
  index: number
  parent: string
  onRemove: () => void
}