import React from 'react'
import { type AddTasksProps } from '../types'
import '../styles/AddTasksForm.css'

const AddTasksForm: React.FC<AddTasksProps> = ({ addTask }) => {
    const [title, setTitle] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [status, setStatus] = React.useState('ToDo')
    const [priority, setPriority] = React.useState('Low')
    const [assignedTo, setAssignedTo] = React.useState('None')

    const handleClose = () => {
        const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement;
        if (dialog) {
            dialog.close();
        }
    }

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!title.trim() || !description.trim()) {
            alert('Title and description are required');
            return
        }

        const newItem = {
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            assignedTo: assignedTo.trim()
        }

        addTask(newItem)
        
        // Reset the form fields after adding the task
        setTitle('')
        setDescription('')
        setStatus('ToDo')
        setPriority('Low')
        setAssignedTo('')
        
        // Close the dialog after adding the task        
        handleClose()
    }

    return (
        <dialog className="add-tasks-dialog">
            <div className="form-container">
                <button className="close-button" onClick={handleClose}>
                    ×
                </button>
                
                <div className="form-header">
                    <h2 className="form-title">Add New Task</h2>
                    <p className="form-subtitle">Create a new task for your project</p>
                </div>

                <form onSubmit={handleAdd}>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Task Title *</label>
                        <input 
                            type="text" 
                            id="title"
                            className="form-input"
                            placeholder="Enter task title" 
                            required 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description *</label>
                        <textarea 
                            id="description"
                            className="form-textarea"
                            placeholder="Enter task description" 
                            required 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

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
                        <label htmlFor="status" className="form-label">Status</label>
                        <select 
                            id="status" 
                            name="status" 
                            className="form-select"
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="ToDo">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="priority" className="form-label">Priority</label>
                        <select 
                            id="priority" 
                            name="priority" 
                            className="form-select"
                            value={priority} 
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
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