// This file defines the types and interfaces used in the Kanban board application
export type Id = string | number;

// This type defines the structure of an ID, which can be a string or a number
export type Column = {
    id: Id;
    title: string;
}

// This interface defines the structure of a column in the Kanban board
export interface ColumnProps {
  title: string
  items: Cards[]
  onRemoveTask?: (title: string, column: string) => void
}

// This interface defines the structure of a task card
export interface Cards {
  title: string
  description: string
  assignedTo: string
  status: string
  priority: string
}

// This interface defines the properties for a task component
export interface TaskProps {
  title: string
  index: number
  parent: string
  description: string
  assignedTo: string
  status: string
  priority: string
  onRemove?: () => void
}

// This interface defines the properties for the AddTasksForm component
export interface AddTasksProps {
  addTask: (newItem: Cards) => void
}