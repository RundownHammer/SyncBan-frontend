import React from 'react'
import type { TaskConflict, ConflictResolution } from '../utils/conflictManager'
import '../styles/ConflictDialog.css'

interface ConflictDialogProps {
  conflict: TaskConflict
  onResolve: (resolution: ConflictResolution) => void
  onClose: () => void
}

const ConflictDialog: React.FC<ConflictDialogProps> = ({ conflict, onResolve, onClose }) => {
  const { localVersion, remoteVersion } = conflict

  const handleResolve = (action: ConflictResolution['action']) => {
    onResolve({ action })
    onClose()
  }

  const formatDate = (dateString?: Date | string) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="conflict-overlay">
      <div className="conflict-dialog">
        <div className="conflict-header">
          <h3>⚠️ Task Conflict Detected</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="conflict-content">
          <p className="conflict-message">
            This task has been modified by another user while you were editing it. 
            Please choose how to resolve the conflict:
          </p>

          <div className="versions-container">
            <div className="version-card local">
              <h4>🖥️ Your Version</h4>
              <div className="version-details">
                <div className="detail-row">
                  <strong>Title:</strong> {localVersion.title}
                </div>
                <div className="detail-row">
                  <strong>Description:</strong> {localVersion.description || 'No description'}
                </div>
                <div className="detail-row">
                  <strong>Status:</strong> {localVersion.status}
                </div>
                <div className="detail-row">
                  <strong>Priority:</strong> {localVersion.priority}
                </div>
                <div className="detail-row">
                  <strong>Assigned To:</strong> {localVersion.assignedTo || 'Unassigned'}
                </div>
                <div className="detail-row">
                  <strong>Modified:</strong> {formatDate(localVersion.updatedAt)}
                </div>
              </div>
            </div>

            <div className="version-card remote">
              <h4>🌐 Server Version</h4>
              <div className="version-details">
                <div className="detail-row">
                  <strong>Title:</strong> {remoteVersion.title}
                </div>
                <div className="detail-row">
                  <strong>Description:</strong> {remoteVersion.description || 'No description'}
                </div>
                <div className="detail-row">
                  <strong>Status:</strong> {remoteVersion.status}
                </div>
                <div className="detail-row">
                  <strong>Priority:</strong> {remoteVersion.priority}
                </div>
                <div className="detail-row">
                  <strong>Assigned To:</strong> {remoteVersion.assignedTo || 'Unassigned'}
                </div>
                <div className="detail-row">
                  <strong>Modified:</strong> {formatDate(remoteVersion.updatedAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="resolution-actions">
            <button 
              className="btn btn-merge"
              onClick={() => handleResolve('merge')}
            >
              🔀 Merge Changes
            </button>
            <button 
              className="btn btn-overwrite"
              onClick={() => handleResolve('overwrite')}
            >
              💾 Use My Version
            </button>
            <button 
              className="btn btn-cancel"
              onClick={() => handleResolve('cancel')}
            >
              🔄 Use Server Version
            </button>
          </div>

          <div className="resolution-help">
            <p><strong>Merge:</strong> Combines both versions (your content + server status/assignment)</p>
            <p><strong>Use My Version:</strong> Overwrites server with your changes</p>
            <p><strong>Use Server Version:</strong> Discards your changes, keeps server version</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConflictDialog
