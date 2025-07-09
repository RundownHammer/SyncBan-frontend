import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Auth.css'

interface LoginProps {
  onSwitchToRegister: () => void
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Login failed')
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="auth-link"
              onClick={onSwitchToRegister}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login