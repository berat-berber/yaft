'use client'

import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Transaction, Account } from '@/lib/types'
import { format } from 'date-fns'

interface RecentTransactionsProps {
  transactions: Transaction[]
  accounts: Account[]
  isLoading?: boolean
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function RecentTransactions({ transactions, accounts, isLoading }: RecentTransactionsProps) {
  const accountMap = accounts.reduce((acc, account) => {
    acc[account.id] = account
    return acc
  }, {} as Record<string, Account>)

  // Sort by date descending and take first 10
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/transactions" className="flex items-center gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {recentTransactions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No transactions yet. Upload your bank statements to get started.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {recentTransactions.map((transaction) => {
              const account = accountMap[transaction.accountId]
              const isIncome = transaction.amount > 0
              return (
                <div key={transaction.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isIncome ? 'bg-primary/10' : 'bg-secondary'
                    }`}>
                      {isIncome ? (
                        <ArrowDownRight className="h-4 w-4 text-primary" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                        {account && ` • ${account.name}`}
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${isIncome ? 'text-primary' : ''}`}>
                    {isIncome ? '+' : ''}
                    {formatCurrency(transaction.amount, account?.currency || 'USD')}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
