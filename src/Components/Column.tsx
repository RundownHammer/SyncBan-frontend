import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import Task from './Task'
import { type ColumnProps } from '../types'
import '../styles/Column.css'

const Column: React.FC<ColumnProps> = ({ title, items, onRemoveTask }) => {
  const { setNodeRef, isOver } = useDroppable({ id: title })

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
              key={`${item.title}-${index}`} // Better key for React
              title={item.title} 
              description={item.description} 
              priority={item.priority} 
              status={item.status} 
              assignedTo={item.assignedTo} 
              index={index} 
              parent={title}
              onRemove={() => handleRemoveTask(item.title)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default Column