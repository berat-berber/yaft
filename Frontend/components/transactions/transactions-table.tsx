'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { ArrowUpDown, ArrowUpRight, ArrowDownRight, Search, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { Transaction, Account } from '@/lib/types'

interface TransactionsTableProps {
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

type SortField = 'date' | 'amount' | 'description'
type SortDirection = 'asc' | 'desc'

export function TransactionsTable({ transactions, accounts, isLoading }: TransactionsTableProps) {
  const [search, setSearch] = useState('')
  const [accountFilter, setAccountFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const accountMap = useMemo(() => {
    return accounts.reduce((acc, account) => {
      acc[account.id] = account
      return acc
    }, {} as Record<string, Account>)
  }, [accounts])

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions]

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter((t) =>
        t.description.toLowerCase().includes(searchLower)
      )
    }

    // Filter by account
    if (accountFilter !== 'all') {
      result = result.filter((t) => t.accountId === parseInt(accountFilter))
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        case 'description':
          comparison = a.description.localeCompare(b.description)
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [transactions, search, accountFilter, sortField, sortDirection])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const clearFilters = () => {
    setSearch('')
    setAccountFilter('all')
  }

  const hasFilters = search || accountFilter !== 'all'

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={accountFilter} onValueChange={setAccountFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All accounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All accounts</SelectItem>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id.toString()}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
      </p>

      {/* Table */}
      {filteredAndSortedTransactions.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{hasFilters ? 'No matching transactions' : 'No transactions yet'}</EmptyTitle>
            <EmptyDescription>
              {hasFilters
                ? 'Try adjusting your search or filters.'
                : 'Upload your bank statements to see your transactions here.'}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 font-medium"
                    onClick={() => toggleSort('date')}
                  >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 font-medium"
                    onClick={() => toggleSort('description')}
                  >
                    Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-mr-3 h-8 font-medium"
                    onClick={() => toggleSort('amount')}
                  >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTransactions.map((transaction) => {
                const account = accountMap[transaction.accountId]
                const isIncome = transaction.amount > 0
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          isIncome ? 'bg-primary/10' : 'bg-secondary'
                        }`}>
                          {isIncome ? (
                            <ArrowDownRight className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <span className="line-clamp-1">{transaction.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {account ? (
                        <Badge variant="secondary">{account.name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">Unknown</span>
                      )}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${isIncome ? 'text-primary' : ''}`}>
                      {isIncome ? '+' : ''}
                      {formatCurrency(transaction.amount, account?.currency)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(transaction.balance, account?.currency)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
