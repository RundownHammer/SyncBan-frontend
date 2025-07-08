import React, { useState } from 'react'
import { DndContext, rectIntersection, type DragEndEvent } from '@dnd-kit/core'
import Column from './Column'
import type { Cards } from '../types'
import AddTasksForm from './AddTasksForm'
import './Board.css'

const Board: React.FC = () => {
  const [todoItems, setTodoItems] = useState<Cards[]>([
    { title: 'Task 1', description: 'Description for Task 1', assignedTo: 'User A', status: 'ToDo', priority: 'High' },
    { title: 'Task 2', description: 'Description for Task 2', assignedTo: 'User B', status: 'ToDo', priority: 'Medium' },
    { title: 'Task 3', description: 'Description for Task 3', assignedTo: 'User C', status: 'ToDo', priority: 'Low' },
  ])
  const [doneItems, setDoneItems] = useState<Cards[]>([])
  const [inProgressItems, setInProgressItems] = useState<Cards[]>([])

  const addTask = (newItem: Cards) => {
    switch (newItem.status) {
      case 'ToDo':
        setTodoItems((prev) => [...prev, newItem])
        break
      case 'In Progress':
        setInProgressItems((prev) => [...prev, newItem])
        break
      case 'Done':
        setDoneItems((prev) => [...prev, newItem])
        break
      default:
        console.warn('Unknown status:', newItem.status)
    }
  }

  const removeTask = (title: string, column: string) => {
    const removeFromList = (list: Cards[]) => list.filter((item) => item.title !== title)

    switch (column) {
      case 'ToDo':
        setTodoItems(removeFromList)
        break
      case 'In Progress':
        setInProgressItems(removeFromList)
        break
      case 'Done':
        setDoneItems(removeFromList)
        break
      default:
        console.warn('Unknown column:', column)
    }
  }

  const showDialogModal = () => {
    const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement
    if (dialog) {
      dialog.showModal()
    }
  }

  const moveCard = (
    title: string,
    description: string,
    assignedTo: string,
    priority: string,
    from: string,
    to: string,
    index: number
  ) => {
    // Helper functions
    const removeFrom = (list: Cards[]) => [
      ...list.slice(0, index), 
      ...list.slice(index + 1)
    ]
    
    const addTo = (list: Cards[]) => [
      ...list, 
      { title, description, assignedTo, priority, status: to }
    ]

    // Get current state
    const getList = (key: string): Cards[] => {
      switch (key) {
        case 'ToDo': return todoItems
        case 'Done': return doneItems
        case 'In Progress': return inProgressItems
        default: 
          console.warn('Unknown column key:', key)
          return []
      }
    }

    // Update state
    const updateList = (key: string, newList: Cards[]) => {
      switch (key) {
        case 'ToDo':
          setTodoItems(newList)
          break
        case 'Done':
          setDoneItems(newList)
          break
        case 'In Progress':
          setInProgressItems(newList)
          break
        default:
          console.warn('Unknown column key:', key)
      }
    }

    // Perform the move
    const fromList = getList(from)
    const toList = getList(to)
    
    updateList(from, removeFrom(fromList))
    updateList(to, addTo(toList))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    // Check if active.data.current exists and has the expected properties
    if (!over || !active.data.current) return

    // Type guard for our expected data shape
    const data = active.data.current as Cards & { parent: string; index: number }

    const to = over.id
    const from = data.parent
    const index = data.index
    const { title, description, assignedTo, priority } = data

    // Only move if dropping on a different column
    if (to && from && to !== from) {
      moveCard(title, description, assignedTo, priority, from, to.toString(), index)
    }
  }

  return (
    <>
      <DndContext
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          <Column 
            title="ToDo" 
            items={todoItems} 
            onRemoveTask={removeTask}
          />
          <Column 
            title="In Progress" 
            items={inProgressItems} 
            onRemoveTask={removeTask}
          />
          <Column 
            title="Done" 
            items={doneItems} 
            onRemoveTask={removeTask}
          />
        </div>
      </DndContext>
      
      <AddTasksForm addTask={addTask} />
      
      <button className="add-task-button" onClick={showDialogModal}>
        Add Task
      </button>
    </>
  )
}

export default Board