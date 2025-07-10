import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { type TaskProps } from '../types'
import { useTeam } from '../context/TeamContext'
import '../styles/Task.css'

const Task: React.FC<TaskProps> = ({ 
  title, 
  index, 
  parent, 
  description, 
  assignedTo, 
  priority, 
  onRemove,
  taskId, // Add taskId prop
  onSmartAssign, // Add smart assign callback
  onMobileMove, // Add mobile move callback
  isMobile // Add mobile flag
}) => {
  const { team } = useTeam()
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: taskId || `${title}-${index}`, // Use actual taskId if available
    data: { title, index, parent, description, assignedTo, priority, taskId },
    disabled: isMobile, // Disable drag on mobile
  })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 999 : 'auto',
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  // Function to get username from user ID
  const getAssignedUsername = (userId: string): string => {
    if (!team || !userId) return ''
    
    // Look for user by ID first, then by username as fallback
    const user = team.members.find(member => member._id === userId)
    if (user) return user.username
    
    // Fallback: check if userId is already a username
    const userByName = team.members.find(member => member.username === userId)
    if (userByName) return userByName.username
    
    // If not found, return the original userId
    return userId
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault() // Add this line
    if (onRemove && window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onRemove()
    }
  }

  const handleMobileMove = (newStatus: string) => {
    if (onMobileMove && taskId) {
      onMobileMove(taskId, newStatus)
    }
  }

  const handleSmartAssign = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (onSmartAssign) {
      onSmartAssign()
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
      className={`task ${isMobile ? 'task-mobile' : ''} ${isDragging ? 'task-dragging' : ''}`}
      style={style}
      {...(!isMobile ? attributes : {})}
      {...(!isMobile ? listeners : {})}
    >
      <div className="task-header">
        <span className="task-title">{title}</span>
        <div className="task-actions">
          {!assignedTo && onSmartAssign && (
            <button 
              className="smart-assign-button" 
              onClick={handleSmartAssign}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Smart assign task"
              title="Auto-assign to user with least tasks"
            >
              🎯
            </button>
          )}
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
      </div>
      
      {description && (
        <div className="task-description">{description}</div>
      )}
      
      <div className="task-meta">
        {assignedTo && (
          <span className="task-assigned">
            👤 {getAssignedUsername(assignedTo)}
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

      {/* Mobile move buttons */}
      {isMobile && (
        <div className="mobile-move-buttons">
          {parent !== 'ToDo' && (
            <button 
              className="mobile-move-btn todo"
              onClick={() => handleMobileMove('ToDo')}
            >
              📝 ToDo
            </button>
          )}
          {parent !== 'In Progress' && (
            <button 
              className="mobile-move-btn in-progress"
              onClick={() => handleMobileMove('In Progress')}
            >
              ⏳ In Progress
            </button>
          )}
          {parent !== 'Done' && (
            <button 
              className="mobile-move-btn done"
              onClick={() => handleMobileMove('Done')}
            >
              ✅ Done
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Task