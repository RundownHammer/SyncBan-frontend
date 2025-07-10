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
  members: User[]  // Changed from string[] to User[]
  codeExpiresAt: string  // Add this property
  isActive: boolean      // Add this property
  createdAt: string
  updatedAt: string
}

// Add this interface for creating new tasks
export interface CreateTaskData {
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'ToDo' | 'In Progress' | 'Done'
  assignedTo?: string
}

// Keep the full Cards interface as is
export interface Cards {
  _id?: string
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'ToDo' | 'In Progress' | 'Done'
  assignedTo?: string
  team?: string
  createdBy?: string
  createdAt?: Date
  updatedAt?: Date
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
  onSmartAssign?: (taskId: string) => void  // Add smart assign callback
  onMobileMove?: (taskId: string, newStatus: string) => void  // Add mobile move callback
  isMobile?: boolean  // Add mobile flag
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
  taskId?: string  // Add taskId prop
  onSmartAssign?: () => void  // Add smart assign callback
  onMobileMove?: (taskId: string, newStatus: string) => void  // Add mobile move callback
  isMobile?: boolean  // Add mobile flag
}