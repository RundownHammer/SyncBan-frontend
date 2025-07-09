import { useEffect } from 'react'
import { type Cards } from '../types'
import { Socket } from 'socket.io-client'

interface MovePayload {
  task: Cards
  from: string
  to: string
}

export const useBoardSocket = (
  socket: Socket,
  onCreate: (task: Cards) => void,
  onUpdate: (task: Cards) => void,
  onDelete: (title: string) => void,
  onMove: (payload: MovePayload) => void
) => {
  useEffect(() => {
    socket.on('task:created', onCreate)
    socket.on('task:updated', onUpdate)
    socket.on('task:deleted', onDelete)
    socket.on('task:moved', onMove)

    return () => {
      socket.off('task:created', onCreate)
      socket.off('task:updated', onUpdate)
      socket.off('task:deleted', onDelete)
      socket.off('task:moved', onMove)
    }
  }, [socket])
}
