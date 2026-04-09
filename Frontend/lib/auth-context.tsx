'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from './api-client'
import type { User, LoginRequest, RegisterRequest } from './types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Parse JWT to get user info
function parseJwt(token: string): { userId: string; email: string; name: string } | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(jsonPayload)
    return {
      userId: parseInt(payload.nameid || payload.sub || payload.userId),
      email: payload.email || '',
      name: payload.unique_name || payload.name || '',
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      const payload = parseJwt(token)
      if (payload) {
        setUser({
          id: payload.userId,
          name: payload.name,
          email: payload.email,
        })
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    const token = await apiClient.login(credentials)
    localStorage.setItem('auth_token', token)
    
    const payload = parseJwt(token)
    if (payload) {
      setUser({
        id: payload.userId,
        name: payload.name,
        email: payload.email,
      })
    }
    
    navigate('/')
  }, [navigate])

  const register = useCallback(async (data: RegisterRequest) => {
    await apiClient.register(data)
    // After registration, log in automatically
    await login({ email: data.email, password: data.password })
  }, [login])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    setUser(null)
    navigate('/login')
  }, [navigate])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
