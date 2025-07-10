import type { Cards } from '../types'

export interface TaskConflict {
  taskId: string
  localVersion: Cards
  remoteVersion: Cards
  conflictType: 'edit' | 'delete'
  timestamp: number
}

export interface ConflictResolution {
  action: 'merge' | 'overwrite' | 'cancel'
  resolvedTask?: Cards
}

export class ConflictManager {
  private conflicts: Map<string, TaskConflict> = new Map()
  private onConflictCallback?: (conflict: TaskConflict) => Promise<ConflictResolution>

  setConflictHandler(handler: (conflict: TaskConflict) => Promise<ConflictResolution>) {
    this.onConflictCallback = handler
  }

  async detectConflict(
    taskId: string,
    localVersion: Cards,
    remoteVersion: Cards
  ): Promise<boolean> {
    // Check if there's a meaningful difference
    const hasConflict = this.hasSignificantChanges(localVersion, remoteVersion)
    
    if (hasConflict) {
      const conflict: TaskConflict = {
        taskId,
        localVersion,
        remoteVersion,
        conflictType: 'edit',
        timestamp: Date.now()
      }
      
      this.conflicts.set(taskId, conflict)
      
      if (this.onConflictCallback) {
        const resolution = await this.onConflictCallback(conflict)
        return this.resolveConflict(taskId, resolution)
      }
    }
    
    return false
  }

  private hasSignificantChanges(local: Cards, remote: Cards): boolean {
    return (
      local.title !== remote.title ||
      local.description !== remote.description ||
      local.status !== remote.status ||
      local.priority !== remote.priority ||
      local.assignedTo !== remote.assignedTo
    )
  }

  private async resolveConflict(
    taskId: string,
    resolution: ConflictResolution
  ): Promise<boolean> {
    const conflict = this.conflicts.get(taskId)
    if (!conflict) return false

    switch (resolution.action) {
      case 'merge': {
        // Merge the changes - prioritize local changes for most fields
        // but you could implement more sophisticated merging logic
        const mergedTask: Cards = {
          ...conflict.remoteVersion,
          title: conflict.localVersion.title || conflict.remoteVersion.title,
          description: conflict.localVersion.description || conflict.remoteVersion.description,
          priority: conflict.localVersion.priority || conflict.remoteVersion.priority,
          // For status and assignedTo, prefer remote (most recent server state)
          status: conflict.remoteVersion.status,
          assignedTo: conflict.remoteVersion.assignedTo
        }
        // You would emit this merged task to the server
        console.log('Merged task:', mergedTask)
        this.conflicts.delete(taskId)
        return true
      }

      case 'overwrite': {
        // Use local version, overwrite remote
        this.conflicts.delete(taskId)
        return true
      }

      case 'cancel': {
        // Keep remote version, discard local changes
        this.conflicts.delete(taskId)
        return false
      }
    }
  }

  getActiveConflicts(): TaskConflict[] {
    return Array.from(this.conflicts.values())
  }

  clearConflict(taskId: string): void {
    this.conflicts.delete(taskId)
  }

  clearAllConflicts(): void {
    this.conflicts.clear()
  }
}

export const conflictManager = new ConflictManager()
