import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'
import '../../styles/Auth.css'

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  const switchToRegister = () => setIsLogin(false)
  const switchToLogin = () => setIsLogin(true)

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {isLogin ? 'Welcome Back' : 'Join Live-ToDo'}
          </h1>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Create your account to get started'
            }
          </p>
        </div>

        {isLogin ? (
          <Login onSwitchToRegister={switchToRegister} />
        ) : (
          <Register onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  )
}

export default AuthPage