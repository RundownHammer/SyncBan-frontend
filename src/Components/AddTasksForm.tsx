import React, { useState } from 'react'
import type { CreateTaskData } from '../types'
import '../styles/AddTasksForm.css'

interface AddTasksFormProps {
  addTask: (task: CreateTaskData) => void  // Use simpler interface
}

const AddTasksForm: React.FC<AddTasksFormProps> = ({ addTask }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [assignedTo, setAssignedTo] = useState('')
  const [status] = useState<'ToDo' | 'In Progress' | 'Done'>('ToDo')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🚀 Form submitted!')
    console.log('📋 Form data:', { title, description, priority, assignedTo, status })
    
    if (!title.trim()) {
      console.error('❌ Title is required!')
      alert('Please enter a task title')
      return
    }

    const newTask: CreateTaskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assignedTo: assignedTo.trim() || undefined
    }

    console.log('✅ Calling addTask with:', newTask)
    addTask(newTask)
    
    // Reset form
    console.log('🔄 Resetting form...')
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setAssignedTo('')
    
    // Close dialog
    console.log('🔒 Closing dialog...')
    const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement
    if (dialog) {
      dialog.close()
      console.log('✅ Dialog closed')
    } else {
      console.error('❌ Could not find dialog to close')
    }
  }

  const handleClose = () => {
    console.log('❌ Close button clicked')
    const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement
    if (dialog) {
      dialog.close()
    }
  }

  console.log('🎨 AddTasksForm rendered')

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
              onChange={(e) => {
                console.log('📝 Title changed:', e.target.value)
                setTitle(e.target.value)
              }}
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