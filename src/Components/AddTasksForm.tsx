import React, { useState } from 'react'
import type { CreateTaskData, Cards } from '../types'
import { useTeam } from '../context/TeamContext'
import { validateTaskData } from '../utils/validation'
import '../styles/AddTasksForm.css'

interface AddTasksFormProps {
  addTask: (task: CreateTaskData) => void
  existingTasks?: Cards[]
}

const AddTasksForm: React.FC<AddTasksFormProps> = ({ addTask, existingTasks = [] }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [assignedTo, setAssignedTo] = useState('')
  const [status] = useState<'ToDo' | 'In Progress' | 'Done'>('ToDo')
  const [error, setError] = useState('')
  
  const { team } = useTeam()

  // Get team members for assignment dropdown
  const getTeamMembers = () => {
    if (!team || !team.members) return []
    return team.members
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate the task data
    const validation = validateTaskData(title, description, existingTasks)
    if (!validation.isValid) {
      setError(validation.message || 'Invalid task data')
      return
    }

    const newTask: CreateTaskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assignedTo: assignedTo.trim() || undefined
    }

    addTask(newTask)
    
    // Reset form
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setAssignedTo('')
    setError('')
    
    // Close dialog
    const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement
    if (dialog) {
      dialog.close()
    }
  }

  const handleClose = () => {
    const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement
    if (dialog) {
      dialog.close()
    }
  }

  return (
    <dialog className="add-tasks-dialog">
      <div className="form-container">
        <div className="dialog-header">
          <h2 className="dialog-title">➕ Add New Task</h2>
          <button className="close-btn" onClick={handleClose} type="button">
            ×
          </button>
        </div>

        <div className="form-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group full-width">
              <label htmlFor="title" className="form-label">Task Title *</label>
              <input
                type="text"
                id="title"
                className="form-input"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

          <div className="form-group full-width">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              className="form-textarea"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority" className="form-label">Priority</label>
              <select
                id="priority"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assignedTo" className="form-label">Assigned To</label>
              <select
                id="assignedTo"
                className="form-select"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">None</option>
                {getTeamMembers().map((member, index) => (
                  <option key={member._id || index} value={member._id || member.username}>
                    {member.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default AddTasksForm