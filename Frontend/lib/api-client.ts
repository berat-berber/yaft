import type {
  User,
  Account,
  AccountCreate,
  AccountUpdate,
  Transaction,
  TransactionCreate,
  LoginRequest,
  RegisterRequest,
} from './types'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
const API_DEBUG = import.meta.env.DEV

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!API_BASE_URL) {
      throw new Error(
        'API base URL is not configured. Set VITE_API_BASE_URL (for example http://localhost:5134).'
      )
    }

    const token = this.getToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      ;(headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
    }

    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = `${API_BASE_URL}${normalizedEndpoint}`
    const method = options.method || 'GET'
    if (API_DEBUG) {
      console.debug('[api] request', { method, url, body: options.body })
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (API_DEBUG) {
      console.debug('[api] response', { method, url, status: response.status })
    }

    if (!response.ok) {
      const errorText = await response.text()
      if (API_DEBUG) {
        console.error('[api] error', { method, url, status: response.status, errorText })
      }
      let errorMessage = `API Error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorJson.title || errorMessage
      } catch {
        if (errorText) errorMessage = errorText
      }
      throw new Error(errorMessage)
    }

    const text = await response.text()
    if (!text) return {} as T

    try {
      return JSON.parse(text) as T
    } catch {
      // Some endpoints (e.g. auth/login) return plain text values.
      return text as T
    }
  }

  private normalizeAccount(account: any): Account {
  return {
    id: String(account.accountId ?? account.id ?? account.Id ?? ''),
    userId: String(account.userId ?? account.UserId ?? ''),
    name: String(account.accountName ?? account.name ?? account.Name ?? ''),
    balance: Number(account.balance ?? account.Balance ?? 0),
    currency: String(account.currency ?? account.Currency ?? 'USD'),
    category: String(
      account.category ??
        account.accountCategory ??
        account.Category ??
        account.AccountCategory ??
        'Other'
    ),
  }
}

  private normalizeTransaction(transaction: any): Transaction {
    return {
      id: String(transaction.id ?? transaction.Id ?? ''),
      accountId: String(transaction.accountId ?? transaction.AccountId ?? 0),
      date: String(transaction.date ?? transaction.Date ?? transaction.dateTime ?? transaction.DateTime ?? ''),
      description: String(transaction.description ?? transaction.desc ?? transaction.Description ?? transaction.Desc ?? ''),
      amount: Number(transaction.amount ?? transaction.Amount ?? 0),
      balance: Number(transaction.balance ?? transaction.Balance ?? 0),
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<string> {
    return this.request<string>('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(data: RegisterRequest): Promise<void> {
    await this.request<void>('/api/Auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // User endpoints
  async getUser(id: number): Promise<User> {
    return this.request<User>(`/api/Users/${id}`)
  }

  async updateUser(id: number, data: Partial<User>): Promise<void> {
    await this.request<void>(`/api/Users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: number): Promise<void> {
    await this.request<void>(`/api/Users/${id}`, { method: 'DELETE' })
  }

  // Account endpoints
  async getAccounts(): Promise<Account[]> {
    const accounts = await this.request<any[]>('/api/Accounts')
    return (accounts ?? []).map((account) => this.normalizeAccount(account))
  }

  async getAccount(id: number): Promise<Account> {
    return this.request<Account>(`/api/Accounts/${id}`)
  }

  async createAccount(data: AccountCreate): Promise<Account> {
    const account = await this.request<any>('/api/Accounts', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        accountCategory: data.category,
        currency: data.currency,
      }),
    })
    return this.normalizeAccount(account)
  }

  async updateAccount(id: number, data: AccountUpdate): Promise<void> {
    await this.request<void>(`/api/Accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.category !== undefined ? { accountCategory: data.category } : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
      }),
    })
  }

  async deleteAccount(id: string): Promise<void> {
    await this.request<void>(`/api/Accounts/${id}`, { method: 'DELETE' })
  }

  // Transaction endpoints
  async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.request<any[]>('/api/Transactions')
    return (transactions ?? []).map((transaction) => this.normalizeTransaction(transaction))
  }

  async getTransaction(id: number): Promise<Transaction> {
    return this.request<Transaction>(`/api/Transactions/${id}`)
  }

  async createTransaction(data: TransactionCreate): Promise<Transaction> {
    return this.request<Transaction>('/api/Transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.request<void>(`/api/Transactions/${id}`, { method: 'DELETE' })
  }

  // File upload endpoint
  async uploadTransactions(accountName: string, file: File, bankName = ''): Promise<void> {
    const token = this.getToken()
    const formData = new FormData()
    formData.append('File', file)
    formData.append('AccountName', accountName)
    formData.append('BankName', bankName)

    const headers: HeadersInit = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(`${API_BASE_URL}/api/Summaries`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || `Upload failed: ${response.status}`)
    }
  }
}

export const apiClient = new ApiClient()
