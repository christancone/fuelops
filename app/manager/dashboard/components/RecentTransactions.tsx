'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Transaction {
  id: string
  date: string
  amount: number
  type: string
  status: string
}

export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [responseMsg, setResponseMsg] = useState<string | null>(null)

  const handleDeleteTransaction = async (id: string) => {
    try {
      // TODO: Implement API call to delete transaction
      // const response = await fetch('/api/transactions/${id}', {
      //   method: 'DELETE'
      // })

      // Simulating API call success
      setTransactions(prev => prev.filter(t => t.id !== id))
      setResponseMsg('✅ Transaction deleted successfully')
      setTimeout(() => setResponseMsg(null), 3000)
    } catch {
      setResponseMsg('❌ Failed to delete transaction')
      setTimeout(() => setResponseMsg(null), 3000)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {responseMsg && (
          <div className="mb-4 p-2 text-sm rounded-md bg-green-100 text-green-800">
            {responseMsg}
          </div>
        )}
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{transaction.type}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium">${transaction.amount}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTransaction(transaction.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 