'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'

const ManageAccounts = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    setLoading(false)
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="flex items-center space-x-2 text-brand-primary">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium text-text-primary">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text-accent">Manage Accounts</h1>
          <p className="text-text-secondary">View and manage station accounts</p>
        </div>
      </div>

      <Separator className="bg-ui-border" />

      {/* Accounts Management Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-background-secondary border-ui-border">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-text-accent">Account Summary</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-text-primary">Total Sales</Label>
                <Input 
                  disabled 
                  value="0.00" 
                  className="bg-background-primary border-ui-border text-text-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary">Total Expenses</Label>
                <Input 
                  disabled 
                  value="0.00" 
                  className="bg-background-primary border-ui-border text-text-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary">Net Balance</Label>
                <Input 
                  disabled 
                  value="0.00" 
                  className="bg-background-primary border-ui-border text-text-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background-secondary border-ui-border">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-text-accent">Recent Transactions</h2>
            <div className="space-y-4">
              {/* Placeholder for transactions table */}
              <div className="text-center text-text-secondary">
                No recent transactions available
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ManageAccounts 