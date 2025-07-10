import type { Cards } from '../types'

export const COLUMN_NAMES = ['ToDo', 'In Progress', 'Done']

export interface ValidationResult {
  isValid: boolean
  message?: string
}

export const validateTaskTitle = (
  title: string, 
  existingTasks: Cards[], 
  excludeTaskId?: string
): ValidationResult => {
  const trimmedTitle = title.trim()
  
  // Check if title is empty
  if (!trimmedTitle) {
    return {
      isValid: false,
      message: 'Task title cannot be empty'
    }
  }
  
  // Check if title matches column names
  if (COLUMN_NAMES.some(columnName => 
    columnName.toLowerCase() === trimmedTitle.toLowerCase()
  )) {
    return {
      isValid: false,
      message: 'Task title cannot match column names (ToDo, In Progress, Done)'
    }
  }
  
  // Check for duplicate titles (case-insensitive)
  const isDuplicate = existingTasks.some(task => 
    task._id !== excludeTaskId && 
    task.title.toLowerCase() === trimmedTitle.toLowerCase()
  )
  
  if (isDuplicate) {
    return {
      isValid: false,
      message: 'A task with this title already exists'
    }
  }
  
  return { isValid: true }
}

export const validateTaskData = (
  title: string,
  description: string,
  existingTasks: Cards[],
  excludeTaskId?: string
): ValidationResult => {
  // Validate title
  const titleValidation = validateTaskTitle(title, existingTasks, excludeTaskId)
  if (!titleValidation.isValid) {
    return titleValidation
  }
  
  // Validate description length
  if (description.length > 500) {
    return {
      isValid: false,
      message: 'Description cannot exceed 500 characters'
    }
  }
  
  return { isValid: true }
}
