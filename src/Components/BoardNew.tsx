import React, { useState, useEffect, useCallback } from 'react'
import { DndContext, rectIntersection, type DragEndEvent } from '@dnd-kit/core'
import Column from './Column'
import type { Cards, CreateTaskData } from '../types'
import AddTasksForm from './AddTasksForm'
import ActivityLog from './ActivityLog'
import { useSocket } from '../hooks/useSocket'
import { useAuth } from '../context/AuthContext'
import { useTeam } from '../context/TeamContext'
import { API_ENDPOINTS, apiRequest } from '../config/api'
import '../styles/Board.css'

const Board: React.FC = () => {
  const [todoItems, setTodoItems] = useState<Cards[]>([])
  const [doneItems, setDoneItems] = useState<Cards[]>([])
  const [inProgressItems, setInProgressItems] = useState<Cards[]>([])
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const handleAddTask = (newTask: CreateTaskData) => {
    console.log('🔥 handleAddTask called with:', newTask)
    
    if (!socket || !team) {
      console.error('❌ Socket or team not available')
      return
    }

    // Emit socket event to create task on server
    socket.emit('task:create', {
      ...newTask,
      team: team._id
    })
    
    console.log('✅ Task creation request sent to server')
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

    console.log('🔄 Drag end - Task ID:', taskId, 'New Status:', newStatus)

    // Find the task being moved
    const allTasks = [...todoItems, ...inProgressItems, ...doneItems]
    const task = allTasks.find(t => t._id === taskId)
    
    console.log('📋 Found task:', task)
    console.log('📋 All tasks:', allTasks.map(t => ({ id: t._id, title: t.title })))
    
    if (!task || task.status === newStatus) {
      console.log('❌ Task not found or status unchanged')
      return
    }

    // Emit socket event for real-time sync
    socket.emit('task:move', {
      taskId,
      newStatus,
      newIndex: 0 // You can calculate proper index if needed
    })
  }

  // Mobile task movement function
  const handleMobileTaskMove = (taskId: string, newStatus: string) => {
    if (!socket) return

    console.log('📱 Mobile task move:', taskId, '→', newStatus)
    
    socket.emit('task:move', {
      taskId,
      newStatus,
      newIndex: 0
    })
  }

  // Smart assign functionality
  const handleSmartAssign = async (taskId: string) => {
    if (!socket || !team) return

    try {
      // Get all tasks to count assignments per user
      const allTasks = [...todoItems, ...inProgressItems, ...doneItems]
      const taskCounts = new Map<string, number>()
      
      // Count tasks per team member
      team.members.forEach(member => {
        const memberTasks = allTasks.filter(task => task.assignedTo === member._id || task.assignedTo === member.username)
        taskCounts.set(member._id, memberTasks.length)
      })
      
      // Find user with least tasks
      let leastBusyUser = team.members[0]
      let minTasks = taskCounts.get(team.members[0]._id) || 0
      
      team.members.forEach(member => {
        const memberTaskCount = taskCounts.get(member._id) || 0
        if (memberTaskCount < minTasks) {
          minTasks = memberTaskCount
          leastBusyUser = member
        }
      })
      
      // Emit socket event to assign task
      socket.emit('task:assign', {
        taskId,
        assignedTo: leastBusyUser._id
      })
      
      console.log(`🎯 Smart assigned task to ${leastBusyUser.username} (${minTasks} tasks)`)
    } catch (error) {
      console.error('❌ Error in smart assign:', error)
    }
  }

  const openDialog = () => {
    console.log('🎯 Opening dialog...')
    const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement
    console.log('📋 Dialog element:', dialog)
    
    if (dialog) {
      dialog.showModal()
      console.log('✅ Dialog opened')
    } else {
      console.error('❌ Dialog not found!')
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
      {/* Mobile-friendly header */}
      <div className="board-header">
        <h1 className="board-title">📋 SyncBan</h1>
        {team && (
          <div className="board-team-info">
            <span className="team-name">{team.name}</span>
            <span className="team-members-count">{team.members.length} members</span>
          </div>
        )}
      </div>

      {/* Mobile and Desktop Board */}
      {isMobile ? (
        // Mobile: Stack columns vertically with easier navigation
        <div className="mobile-board">
          <div className="mobile-columns">
            <Column
              title="ToDo"
              items={todoItems}
              onRemoveTask={(title) => {
                const task = todoItems.find(t => t.title === title)
                if (task?._id) handleDelete(task._id)
              }}
              onSmartAssign={handleSmartAssign}
              onMobileMove={handleMobileTaskMove}
              isMobile={true}
            />
            <Column
              title="In Progress"
              items={inProgressItems}
              onRemoveTask={(title) => {
                const task = inProgressItems.find(t => t.title === title)
                if (task?._id) handleDelete(task._id)
              }}
              onSmartAssign={handleSmartAssign}
              onMobileMove={handleMobileTaskMove}
              isMobile={true}
            />
            <Column
              title="Done"
              items={doneItems}
              onRemoveTask={(title) => {
                const task = doneItems.find(t => t.title === title)
                if (task?._id) handleDelete(task._id)
              }}
              onSmartAssign={handleSmartAssign}
              onMobileMove={handleMobileTaskMove}
              isMobile={true}
            />
          </div>
        </div>
      ) : (
        // Desktop: Original drag and drop
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
              onSmartAssign={handleSmartAssign}
            />
            <Column
              title="In Progress"
              items={inProgressItems}
              onRemoveTask={(title) => {
                const task = inProgressItems.find(t => t.title === title)
                if (task?._id) handleDelete(task._id)
              }}
              onSmartAssign={handleSmartAssign}
            />
            <Column
              title="Done"
              items={doneItems}
              onRemoveTask={(title) => {
                const task = doneItems.find(t => t.title === title)
                if (task?._id) handleDelete(task._id)
              }}
              onSmartAssign={handleSmartAssign}
            />
          </div>
        </DndContext>
      )}

      {/* Improved floating action menu */}
      <div className="floating-action-menu">
        <button 
          className="fab-main"
          onClick={openDialog}
          title="Add Task"
        >
          ➕
        </button>
        <button 
          className="fab-secondary" 
          onClick={() => setIsActivityLogOpen(true)}
          title="View Activity Log"
        >
          📊
        </button>
      </div>

      <AddTasksForm addTask={handleAddTask} />
      <ActivityLog 
        isOpen={isActivityLogOpen} 
        onClose={() => setIsActivityLogOpen(false)} 
      />
    </div>
  )
}

export default Board
