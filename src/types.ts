export type Id = string | number;

export type Column = {
    id: Id;
    title: string;
}

export interface ColumnProps {
  title: string
  items: Cards[]
  onRemoveTask?: (title: string, column: string) => void
}

export interface Cards {
  _id?: string
  title: string
  description: string
  assignedTo: string
  status: string
  priority: string
  team?: string
  createdBy?: {
    _id: string
    username: string
    email: string
  }
}

export interface TaskProps {
  title: string
  index: number
  parent: string
  description?: string
  assignedTo?: string
  status?: string
  priority?: string
  onRemove?: () => void
}

export interface AddTasksProps {
  addTask: (newItem: Cards) => void
}

// New interfaces for authentication and teams
export interface User {
  _id: string
  username: string
  email: string
  currentTeam?: Team
}

export interface Team {
  _id: string
  name: string
  code?: string
  createdBy: string
  members: User[]
  codeExpiresAt?: Date
  isActive: boolean
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export interface TeamContextType {
  team: Team | null
  createTeam: (name: string) => Promise<void>
  joinTeam: (code: string) => Promise<void>
  leaveTeam: () => Promise<void>
  regenerateCode: () => Promise<void>
  loading: boolean
}