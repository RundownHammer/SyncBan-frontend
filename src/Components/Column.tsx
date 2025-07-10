import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import Task from './Task'
import { type ColumnProps } from '../types'
import '../styles/Column.css'

const Column: React.FC<ColumnProps> = ({ title, items, onRemoveTask, onSmartAssign, onMobileMove, isMobile }) => {
  // Map display title to status value for droppable ID
  const getStatusFromTitle = (title: string) => {
    switch (title) {
      case 'ToDo': return 'ToDo'
      case 'In Progress': return 'In Progress'
      case 'Done': return 'Done'
      default: return title
    }
  }

  const { setNodeRef, isOver } = useDroppable({ 
    id: getStatusFromTitle(title) 
  })

  const handleRemoveTask = (taskTitle: string) => {
    if (onRemoveTask) {
      onRemoveTask(taskTitle, title)
    }
  }

  return (
    <div className={`column ${isOver ? 'column-drag-over' : ''}`}>
      <h3 className="column-title">
        {title} 
        <span className="task-count">{items.length}</span>
      </h3>
      <div className="column-content" ref={setNodeRef}>
        {items.length === 0 ? (
          <div className="empty-column">
            No tasks yet
          </div>
        ) : (
          items.map((item, index) => (
            <Task 
              key={item._id || `${item.title}-${index}`} // Use _id if available
              title={item.title} 
              description={item.description} 
              priority={item.priority} 
              status={item.status} 
              assignedTo={item.assignedTo} 
              index={index} 
              parent={title}
              taskId={item._id} // Pass the actual task ID
              onRemove={() => handleRemoveTask(item.title)}
              onSmartAssign={item._id ? () => onSmartAssign?.(item._id!) : undefined}
              onMobileMove={isMobile ? onMobileMove : undefined}
              isMobile={isMobile}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Column