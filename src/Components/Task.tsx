import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { type TaskProps } from '../types'
import './Task.css'

const Task: React.FC<TaskProps> = ({ 
  title, 
  index, 
  parent, 
  description, 
  assignedTo, 
  priority, 
  onRemove 
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${title}-${index}`, // More unique ID
    data: { title, index, parent, description, assignedTo, priority },
  })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 999 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault() // Add this line
    if (onRemove && window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onRemove()
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#ff4757'
      case 'medium': return '#ffa502'
      case 'low': return '#2ed573'
      default: return '#747d8c'
    }
  }

  return (
    <div
      ref={setNodeRef}
      className={`task ${isDragging ? 'task-dragging' : ''}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="task-header">
        <span className="task-title">{title}</span>
        <button 
          className="delete-button" 
          onClick={handleDelete}
          onPointerDown={(e) => e.stopPropagation()} // Add this line
          aria-label={`Delete task: ${title}`}
          title="Delete task"
        >
          ×
        </button>
      </div>
      
      {description && (
        <div className="task-description">{description}</div>
      )}
      
      <div className="task-meta">
        {assignedTo && (
          <span className="task-assigned">
            👤 {assignedTo}
          </span>
        )}
        {priority && (
          <span 
            className="task-priority" 
            style={{ backgroundColor: getPriorityColor(priority) }}
          >
            {priority}
          </span>
        )}
      </div>
    </div>
  )
}

export default Task