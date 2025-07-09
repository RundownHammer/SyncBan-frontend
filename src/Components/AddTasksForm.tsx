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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    const newTask: Omit<Cards, '_id'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      status: 'ToDo',
      priority,
      assignedTo: assignedTo.trim() || undefined,
      team: '', // Will be set by backend
      createdBy: '', // Will be set by backend
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

  const closeDialog = () => {
    const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement
    if (dialog) {
      dialog.close()
    }
  }

  return (
    <dialog className="add-tasks-dialog">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>Add New Task</h2>
          <button type="button" className="close-btn" onClick={closeDialog}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="add-task-form">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assigned To</label>
            <input
              type="text"
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Enter assignee name"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={closeDialog}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default AddTasksForm