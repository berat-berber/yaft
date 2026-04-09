'use client'

import useSWR from 'swr'
import { DashboardHeader } from '@/components/dashboard-header'
import { TransactionsTable } from '@/components/transactions/transactions-table'
import { apiClient } from '@/lib/api-client'
import type { Account, Transaction } from '@/lib/types'

export default function TransactionsPage() {
  const { data: transactions = [], isLoading: transactionsLoading } = useSWR<Transaction[]>(
    'transactions',
    () => apiClient.getTransactions()
  )

  const { data: accounts = [], isLoading: accountsLoading } = useSWR<Account[]>(
    'accounts',
    () => apiClient.getAccounts()
  )

  const isLoading = transactionsLoading || accountsLoading

  

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Transactions"
        description="View and search all your transactions"
      />
      <div className="flex-1 p-6">
        <TransactionsTable
          transactions={transactions}
          accounts={accounts}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
