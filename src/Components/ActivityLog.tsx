import React, { useState, useEffect, useCallback } from 'react'
import { useTeam } from '../context/TeamContext'
import { useAuth } from '../context/AuthContext'
import { API_ENDPOINTS, apiRequest } from '../config/api'
import '../styles/ActivityLog.css'

interface ActivityLogEntry {
  _id: string
  type: 'task:created' | 'task:moved' | 'task:deleted' | 'task:assigned' | 'member:joined' | 'member:left'
  user: {
    _id: string
    username: string
  }
  taskTitle?: string
  fromStatus?: string
  toStatus?: string
  assignedToUser?: string
  memberName?: string
  createdAt: string
}

interface ActivityLogProps {
  isOpen: boolean
  onClose: () => void
}

const ActivityLog: React.FC<ActivityLogProps> = ({ isOpen, onClose }) => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const { team } = useTeam()
  const { token } = useAuth()

  const fetchActivities = useCallback(async () => {
    if (!token || !team) return

    setLoading(true)
    try {
      const data = await apiRequest(API_ENDPOINTS.ACTIVITIES)
      setActivities(data.activities || [])
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }, [token, team])

  useEffect(() => {
    if (isOpen && team) {
      fetchActivities()
    }
  }, [isOpen, team, fetchActivities])

  const formatActivity = (activity: ActivityLogEntry) => {    
    switch (activity.type) {
      case 'task:created':
        return `${activity.user.username} created task "${activity.taskTitle}"`
      case 'task:moved':
        return `${activity.user.username} moved "${activity.taskTitle}" from ${activity.fromStatus} to ${activity.toStatus}`
      case 'task:deleted':
        return `${activity.user.username} deleted task "${activity.taskTitle}"`
      case 'task:assigned':
        return `${activity.user.username} assigned "${activity.taskTitle}" to ${activity.assignedToUser}`
      case 'member:joined':
        return `${activity.memberName} joined the team`
      case 'member:left':
        return `${activity.memberName} left the team`
      default:
        return `${activity.user.username} performed an action`
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task:created': return '➕'
      case 'task:moved': return '🔄'
      case 'task:deleted': return '🗑️'
      case 'task:assigned': return '👤'
      case 'member:joined': return '🤝'
      case 'member:left': return '👋'
      default: return '📝'
    }
  }

  if (!isOpen) return null

  return (
    <div className="activity-log-overlay" onClick={onClose}>
      <div className="activity-log-modal" onClick={(e) => e.stopPropagation()}>
        <div className="activity-log-header">
          <h2>📊 Activity Log</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="activity-log-content">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner-circle"></div>
              <p className="loading-text">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="no-activities">
              <p>No recent activities in this team.</p>
            </div>
          ) : (
            <div className="activity-list">
              {activities.slice(0, 20).map((activity) => (
                <div key={activity._id} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-details">
                    <p className="activity-description">
                      {formatActivity(activity)}
                    </p>
                    <span className="activity-time">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityLog
