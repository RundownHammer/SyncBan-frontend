import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import { SOCKET_URL } from '../config/api'

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const { token } = useAuth()

  useEffect(() => {
    if (token) {
      // Connect to socket with authentication
      socketRef.current = io(SOCKET_URL, {
        auth: {
          token
        }
      })

      socketRef.current.on('connect', () => {
        console.log('🟢 Connected to server')
      })

      socketRef.current.on('disconnect', () => {
        console.log('🔴 Disconnected from server')
      })

      socketRef.current.on('error', (error) => {
        console.error('❌ Socket error:', error)
      })

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect()
          socketRef.current = null
        }
      }
    }
  }, [token])

  return socketRef.current
}