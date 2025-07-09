import React, { useState } from 'react'
import type { AddTasksProps } from '../types'
import '../styles/Dialog.css'

const AddTasksForm: React.FC<AddTasksProps> = ({ addTask }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low')
  const [status, setStatus] = useState<'ToDo' | 'In Progress' | 'Done'>('ToDo')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter a task title')
      return
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      assignedTo: assignedTo.trim(),
      priority,
      status
    }

    addTask(newTask)
    
    // Reset form
    setTitle('')
    setDescription('')
    setAssignedTo('')
    setPriority('Low')
    setStatus('ToDo')

    // Close dialog
    const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement
    if (dialog) {
      dialog.close()
    }
  }

  const handleCancel = () => {
    // Reset form
    setTitle('')
    setDescription('')
    setAssignedTo('')
    setPriority('Low')
    setStatus('ToDo')

    // Close dialog
    const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement
    if (dialog) {
      dialog.close()
    }
  }

  return (
    <dialog className="add-tasks-dialog">
      <div className="dialog-content">
        <div className="dialog-header">
          <h3 className="dialog-title">📝 Add New Task</h3>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title *</label>
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
              className="form-input form-textarea"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignedTo" className="form-label">Assigned To</label>
              <input
                type="text"
                id="assignedTo"
                className="form-input"
                placeholder="Enter assignee name"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority" className="form-label">Priority</label>
              <select
                id="priority"
                className="form-input form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              className="form-input form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'ToDo' | 'In Progress' | 'Done')}
            >
              <option value="ToDo">📋 ToDo</option>
              <option value="In Progress">⚡ In Progress</option>
              <option value="Done">✅ Done</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              ➕ Add Task
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default AddTasksForm