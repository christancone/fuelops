'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, LineChart, Receipt, FileText, BarChart3 } from 'lucide-react'
import Navigation from '../dashboard/components/Navigation'
import SubTabs from '../../components/SubTabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SalesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { value: 'overview', label: 'Overview', icon: <LineChart className="w-4 h-4" /> },
    { value: 'transactions', label: 'Transactions', icon: <Receipt className="w-4 h-4" /> },
    { value: 'invoices', label: 'Invoices', icon: <FileText className="w-4 h-4" /> },
    { value: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
  ]

  useEffect(() => {
    let mounted = true

    const initializePage = async () => {
      if (authLoading) return
      if (!user) {
        router.push('/login')
        return
      }
      if (user.role !== 'MANAGER') {
        router.push('/login')
        return
      }
      if (mounted) setLoading(false)
    }

    initializePage()
    return () => { mounted = false }
  }, [user, authLoading, router])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="flex items-center space-x-2 text-brand-primary">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) return null

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-lg border-none hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-secondary font-medium">Daily Sales</p>
                    <div className="bg-brand-primary/10 p-2 rounded-full">
                      <LineChart className="w-4 h-4 text-brand-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-accent">LKR 145,231.89</h3>
                  <p className="text-xs text-brand-success font-medium flex items-center">
                    +15.2% from yesterday
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-none hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-secondary font-medium">Weekly Sales</p>
                    <div className="bg-brand-primary/10 p-2 rounded-full">
                      <BarChart3 className="w-4 h-4 text-brand-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-accent">LKR 892,143.00</h3>
                  <p className="text-xs text-brand-success font-medium flex items-center">
                    +8.4% from last week
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-none hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-secondary font-medium">Monthly Sales</p>
                    <div className="bg-brand-primary/10 p-2 rounded-full">
                      <LineChart className="w-4 h-4 text-brand-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-accent">LKR 3,567,890.00</h3>
                  <p className="text-xs text-brand-success font-medium flex items-center">
                    +12.1% from last month
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-none hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-secondary font-medium">Pending Invoices</p>
                    <div className="bg-brand-warning/10 p-2 rounded-full">
                      <FileText className="w-4 h-4 text-brand-warning" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-text-accent">24</h3>
                  <p className="text-xs text-brand-warning font-medium flex items-center">
                    Requires attention
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'transactions':
        return (
          <Card className="shadow-lg border-none">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-brand-primary/10 p-3 rounded-full">
                    <Receipt className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-text-accent">Recent Transactions</h3>
                </div>
                <Button className="bg-brand-primary hover:bg-brand-secondary transition-colors">
                  Export
                </Button>
              </div>
              <div className="text-center text-text-secondary py-12 bg-background-secondary rounded-lg">
                Transaction history will be displayed here
              </div>
            </CardContent>
          </Card>
        )
      case 'invoices':
        return (
          <Card className="shadow-lg border-none">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-brand-primary/10 p-3 rounded-full">
                    <FileText className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-text-accent">Invoices</h3>
                </div>
                <Button className="bg-brand-primary hover:bg-brand-secondary transition-colors">
                  Generate Invoice
                </Button>
              </div>
              <div className="text-center text-text-secondary py-12 bg-background-secondary rounded-lg">
                Invoice management interface will be displayed here
              </div>
            </CardContent>
          </Card>
        )
      case 'reports':
        return (
          <Card className="shadow-lg border-none">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-brand-primary/10 p-3 rounded-full">
                  <BarChart3 className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-text-accent">Sales Reports</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-4 bg-background-secondary p-6 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-lg font-medium text-text-primary">Date Range</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-text-secondary">Start Date</Label>
                        <Input 
                          type="date" 
                          className="border-ui-border focus:border-brand-primary transition-colors mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-text-secondary">End Date</Label>
                        <Input 
                          type="date" 
                          className="border-ui-border focus:border-brand-primary transition-colors mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  <Button className="bg-brand-primary hover:bg-brand-secondary transition-colors w-full sm:w-auto">
                    Generate Report
                  </Button>
                </div>
                <div className="text-center text-text-secondary py-12 bg-background-secondary rounded-lg">
                  Generated reports will be displayed here
                </div>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-text-accent mb-2">Sales Management</h2>
            <p className="text-text-secondary">
              Monitor and analyze your station&apos;s sales performance and revenue metrics.
            </p>
          </div>
          
          <div className="mt-8">
            <SubTabs
              tabs={tabs}
              defaultValue="overview"
              onChange={setActiveTab}
            />
            <div className="mt-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 