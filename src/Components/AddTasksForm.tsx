import React, { useState } from 'react'
import type { Cards } from '../types'
import '../styles/AddTasksForm.css'

interface AddTasksFormProps {
  addTask: (task: Omit<Cards, '_id'>) => void
}

const AddTasksForm: React.FC<AddTasksFormProps> = ({ addTask }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [assignedTo, setAssignedTo] = useState('')
  const [status] = useState<'ToDo' | 'In Progress' | 'Done'>('ToDo')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    const newTask: Omit<Cards, '_id'> = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assignedTo: assignedTo.trim() || undefined,
      team: '',
      createdBy: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    addTask(newTask)
    
    // Reset form
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setAssignedTo('')
    
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
        <button className="close-btn" onClick={handleClose} type="button">
          ×
        </button>

        <div className="form-header">
          <h2 className="form-title">➕ Add New Task</h2>
          <p className="form-subtitle">Create a new task for your team</p>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
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

          <div className="form-group">
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
            <input
              type="text"
              id="assignedTo"
              className="form-input"
              placeholder="Enter assignee name (optional)"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
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
    </dialog>
  )
}

export default AddTasksForm