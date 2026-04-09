// API Types based on YAFT OpenAPI spec

export interface User {
  id: string
  name: string
  email: string
}

export interface UserCreate {
  name: string
  email: string
  password: string
}

export interface UserUpdate {
  name?: string
  email?: string
  password?: string
}

export interface Account {
  id: string
  userId: string
  name: string
  balance: number
  currency: string
  category: string
}

export interface AccountCreate {
  name: string
  currency: string
  category: string
}

export interface AccountUpdate {
  name?: string
  currency?: string
  category?: string
}

export interface Transaction {
  id: string
  accountId: string
  date: string
  description: string
  amount: number
  balance: number
}

export interface TransactionCreate {
  accountId: string
  date: string
  description: string
  amount: number
  balance: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

// API Error response
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
