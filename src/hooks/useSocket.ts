import { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

const SOCKET_URL = import.meta.env.VITE_NODE_ENV === 'production'
  ? 'https://planhive-backend.onrender.com'  // Updated to PlanHive backend URL
  : 'http://localhost:5000'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { token, user } = useAuth()

  useEffect(() => {
    if (token && user) {
      console.log('🔌 Connecting to socket:', SOCKET_URL)
      
      const newSocket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        withCredentials: true,
      })

      newSocket.on('connect', () => {
        console.log('✅ Socket connected')
      })

      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected')
      })

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error)
      })

      setSocket(newSocket)

      return () => {
        console.log('🔌 Cleaning up socket connection')
        newSocket.close()
      }
    } else {
      setSocket(null)
    }
  }, [token, user])

  return socket
}