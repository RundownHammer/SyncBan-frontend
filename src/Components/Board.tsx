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

    socket.on('task:created', () => {
      fetchTasks() // Refresh all tasks
    })

    socket.on('task:updated', () => {
      fetchTasks() // Refresh all tasks
    })

    socket.on('task:deleted', () => {
      fetchTasks() // Refresh all tasks
    })

    socket.on('task:moved', () => {
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
    if (!socket || !team) {
      return
    }

    // Emit socket event to create task on server
    socket.emit('task:create', {
      ...newTask,
      team: team._id
    })
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
    
    if (!task || task.status === newStatus) {
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
      
      // Count tasks per team member (using user ID)
      team.members.forEach(member => {
        const memberTasks = allTasks.filter(task => task.assignedTo === member._id)
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
        assignedTo: leastBusyUser._id // Always use user ID for assignment
      })
      
    } catch (error) {
      console.error('❌ Error in smart assign:', error)
    }
  }

  const openDialog = () => {
    const dialog = document.querySelector('.add-tasks-dialog') as HTMLDialogElement
    
    if (dialog) {
      dialog.showModal()
    }
  }

  const copyTeamCode = async () => {
    if (!team) return
    
    try {
      await navigator.clipboard.writeText(team.code)
      // You could add a toast notification here
      console.log('Team code copied to clipboard')
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = team.code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      console.log('Team code copied to clipboard (fallback)')
    }
  }

  // Show team setup if user is not in a team
  if (!team) {
    return (
      <div className="board-container">
        <div className="team-info-bar">
          <div className="team-info-content">
            <div className="team-name-section">
              <span className="team-name">No Team Selected</span>
            </div>
          </div>
        </div>
        <div className="no-team-message">
          <p>Please join or create a team to start managing tasks.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="board-container">
      {/* Combined team info bar */}
      {team && (
        <div className="team-info-bar">
          <div className="team-info-content">
            <div className="team-name-section">
              <span className="team-name">{team.name}</span>
              <span 
                className="team-code" 
                onClick={copyTeamCode}
                title="Click to copy team code"
              >
                #{team.code}
              </span>
            </div>
            <div className="team-members-section">
              <span className="members-label">👥</span>
              <div className="members-list">
                {team.members.map((member) => (
                  <span key={member._id} className="member-badge">
                    {member.username || member._id}
                  </span>
                ))}
              </div>
              <span className="members-count">({team.members.length})</span>
            </div>
          </div>
        </div>
      )}

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

      <AddTasksForm 
        addTask={handleAddTask} 
        existingTasks={[...todoItems, ...inProgressItems, ...doneItems]}
      />
      <ActivityLog 
        isOpen={isActivityLogOpen} 
        onClose={() => setIsActivityLogOpen(false)} 
      />
    </div>
  )
}

export default Board
