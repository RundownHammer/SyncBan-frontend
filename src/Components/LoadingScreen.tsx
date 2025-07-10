import React, { useState, useEffect } from 'react'
import '../styles/LoadingScreen.css'

interface LoadingScreenProps {
  onServerReady: () => void
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onServerReady }) => {
  const [loadingStage, setLoadingStage] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing SyncBan...')
  const [serverStatus, setServerStatus] = useState<'checking' | 'ready' | 'failed'>('checking')
  const [retryAttempt, setRetryAttempt] = useState(0)

  const loadingStages = React.useMemo(() => [
    'Initializing SyncBan...',
    'Connecting to server...',
    'Checking server health...',
    'Establishing connection...',
    'Preparing your workspace...',
    'Almost ready...',
    'Welcome to SyncBan! 🎯'
  ], [])

  useEffect(() => {
    let isMounted = true
    
    const checkServer = async () => {
      try {
        setServerStatus('checking')
        
        // Import the function dynamically to avoid circular dependencies
        const { waitForServer } = await import('../config/api')
        
        // Start the loading animation
        const stageInterval = setInterval(() => {
          if (isMounted) {
            setLoadingStage(prev => {
              const nextStage = Math.min(prev + 1, loadingStages.length - 2)
              setLoadingText(loadingStages[nextStage])
              return nextStage
            })
          }
        }, 2000)

        // Wait for server to be ready
        const isServerReady = await waitForServer(30, 1000) // 30 retries, 1 second initial delay
        
        if (isMounted) {
          clearInterval(stageInterval)
          
          if (isServerReady) {
            setServerStatus('ready')
            setLoadingStage(loadingStages.length - 1)
            setLoadingText(loadingStages[loadingStages.length - 1])
            
            // Show success message briefly before transitioning
            setTimeout(() => {
              if (isMounted) {
                // Add fade-out class
                const loadingElement = document.querySelector('.loading-screen')
                if (loadingElement) {
                  loadingElement.classList.add('fadeOut')
                }
                
                // Trigger the callback after animation
                setTimeout(() => {
                  if (isMounted) {
                    onServerReady()
                  }
                }, 500) // Match the CSS animation duration
              }
            }, 1500)
          } else {
            setServerStatus('failed')
            setLoadingText('Server connection failed. Retrying...')
            setRetryAttempt(prev => prev + 1)
            
            // Retry after a longer delay
            setTimeout(() => {
              if (isMounted) {
                checkServer()
              }
            }, 5000)
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Loading screen error:', error)
          setServerStatus('failed')
          setLoadingText('Connection error. Retrying...')
          setRetryAttempt(prev => prev + 1)
          
          setTimeout(() => {
            if (isMounted) {
              checkServer()
            }
          }, 5000)
        }
      }
    }

    checkServer()
    
    return () => {
      isMounted = false
    }
  }, [onServerReady, loadingStages])

  const getStatusColor = () => {
    switch (serverStatus) {
      case 'checking': return '#8b5cf6'
      case 'ready': return '#10b981'
      case 'failed': return '#ef4444'
      default: return '#8b5cf6'
    }
  }

  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* Animated Logo */}
        <div className="loading-logo">
          <div className="logo-circle">
            <span className="logo-emoji">🎯</span>
          </div>
          <div className="logo-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          <h1 className="loading-title">SyncBan</h1>
          <p className="loading-subtitle" style={{ color: getStatusColor() }}>
            {loadingText}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${((loadingStage + 1) / loadingStages.length) * 100}%`,
                backgroundColor: getStatusColor()
              }}
            />
          </div>
          <div className="progress-text">
            {Math.round(((loadingStage + 1) / loadingStages.length) * 100)}%
          </div>
        </div>

        {/* Status Indicator */}
        <div className="status-indicator">
          <div className={`status-dot ${serverStatus}`}></div>
          <span className="status-text">
            {serverStatus === 'checking' && 'Connecting...'}
            {serverStatus === 'ready' && 'Connected ✓'}
            {serverStatus === 'failed' && `Retrying... (${retryAttempt})`}
          </span>
        </div>

        {/* Floating Particles */}
        <div className="particles">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
