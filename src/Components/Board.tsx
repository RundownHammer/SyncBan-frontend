import React, { useState, useEffect, useCallback } from 'react'
import { DndContext, rectIntersection, type DragEndEvent } from '@dnd-kit/core'
import Column from './Column'
import type { Cards } from '../types'
import AddTasksForm from './AddTasksForm'
import { useSocket } from '../hooks/useSocket'
import { useAuth } from '../context/AuthContext'
import { useTeam } from '../context/TeamContext'
import { API_ENDPOINTS, apiRequest } from '../config/api'
import '../styles/Board.css'

const Board: React.FC = () => {
  const [todoItems, setTodoItems] = useState<Cards[]>([])
  const [doneItems, setDoneItems] = useState<Cards[]>([])
  const [inProgressItems, setInProgressItems] = useState<Cards[]>([])

  const socket = useSocket()
  const { token } = useAuth()
  const { team } = useTeam()

  // Unified function to set tasks based on status
  const setTasks = useCallback((tasks: Cards[]) => {
    const todo = tasks.filter(task => task.status === 'ToDo')
    const inProgress = tasks.filter(task => task.status === 'In Progress')
    const done = tasks.filter(task => task.status === 'Done')
    
    setTodoItems(todo)
    setInProgressItems(inProgress)
    setDoneItems(done)
  }, [])

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    if (!token || !team) return

    try {
      const data = await apiRequest(API_ENDPOINTS.TASKS.BASE)
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }, [token, team, setTasks])

  // Load tasks when team changes
  useEffect(() => {
    if (team) {
      fetchTasks()
    } else {
      setTasks([]) // Clear tasks if no team
    }
  }, [team, fetchTasks, setTasks])

  // WebSocket event listeners
  useEffect(() => {
    if (!socket) return

    socket.on('task:created', (task: Cards) => {
      console.log('📝 Task created:', task)
      fetchTasks() // Refresh all tasks
    })

    socket.on('task:updated', (task: Cards) => {
      console.log('✏️ Task updated:', task)
      fetchTasks() // Refresh all tasks
    })

    socket.on('task:deleted', (taskId: string) => {
      console.log('🗑️ Task deleted:', taskId)
      fetchTasks() // Refresh all tasks
    })

    socket.on('task:moved', ({ task }: { task: Cards }) => {
      console.log('🔄 Task moved:', task)
      fetchTasks() // Refresh all tasks
    })

    return () => {
      socket.off('task:created')
      socket.off('task:updated')
      socket.off('task:deleted')
      socket.off('task:moved')
    }
  }, [socket, fetchTasks])

  const handleAddTask = async (newTask: Omit<Cards, '_id'>) => {
    if (!socket) return

    // Emit to socket for real-time sync
    socket.emit('task:create', newTask)
  }
  
  const handleDelete = async (taskId: string) => {
    if (!socket) return

    socket.emit('task:delete', taskId)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over || !socket) return

    const taskId = active.id as string
    const newStatus = over.id as string

    // Find the task being moved
    const allTasks = [...todoItems, ...inProgressItems, ...doneItems]
    const task = allTasks.find(t => t._id === taskId)
    
    if (!task || task.status === newStatus) return

    // Emit socket event for real-time sync
    socket.emit('task:move', {
      taskId,
      newStatus,
      newIndex: 0 // You can calculate proper index if needed
    })
  }

  const openDialog = () => {
    const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement
    if (dialog) {
      dialog.showModal()
    }
  }

  // Show team setup if user is not in a team
  if (!team) {
    return (
      <div className="board-container">
        <div className="board-header">
          <h1 className="board-title">📋 SyncBan</h1>
        </div>
        <div className="no-team-message">
          <p>Please join or create a team to start managing tasks.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="board-container">
      <div className="board-header">
        <h1 className="board-title">📋 SyncBan</h1>
      </div>

      <DndContext
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
      >
        <div className="board-columns">
          <Column
            title="ToDo"
            items={todoItems}
            onRemoveTask={(title) => {
              const task = todoItems.find(t => t.title === title)
              if (task?._id) handleDelete(task._id)
            }}
          />
          <Column
            title="In Progress"
            items={inProgressItems}
            onRemoveTask={(title) => {
              const task = inProgressItems.find(t => t.title === title)
              if (task?._id) handleDelete(task._id)
            }}
          />
          <Column
            title="Done"
            items={doneItems}
            onRemoveTask={(title) => {
              const task = doneItems.find(t => t.title === title)
              if (task?._id) handleDelete(task._id)
            }}
          />
        </div>
      </DndContext>

      {/* Fixed positioned Add Task button */}
      <button className="add-task-button" onClick={openDialog}>
        ➕ Add Task
      </button>

      <AddTasksForm addTask={handleAddTask} />
    </div>
  )
}

export default Board