'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { theme } from '@/app/styles/theme'
import { TrendingUp, Users, Droplet, Activity } from 'lucide-react'

// Sample data - replace with real data from your backend
const data = [
  { name: '1', value: 2500 },
  { name: '2', value: 3500 },
  { name: '3', value: 1800 },
  { name: '4', value: 5000 },
  { name: '5', value: 3800 },
  { name: '6', value: 1500 },
  { name: '7', value: 3200 },
  { name: '8', value: 4000 },
  { name: '9', value: 5500 },
  { name: '10', value: 1800 },
  { name: '11', value: 4200 },
]

const recentSales = [
  {
    code: 'LP',
    name: 'Lanka Petrol',
    amount: '1,500L @ LKR 366.00/L',
    total: '+LKR 549,000.00'
  },
  {
    code: 'LD',
    name: 'Lanka Diesel',
    amount: '2,000L @ LKR 358.00/L',
    total: '+LKR 716,000.00'
  },
  {
    code: 'LK',
    name: 'Lanka Kerosene',
    amount: '500L @ LKR 236.00/L',
    total: '+LKR 118,000.00'
  }
]

const DashboardOverview = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-text-accent mb-2">Dashboard</h2>
        <p className="text-text-secondary">
          Welcome to your fuel station management dashboard.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-background-secondary border border-ui-border">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-background-primary data-[state=active]:text-brand-primary data-[state=active]:border-b-2 data-[state=active]:border-brand-primary"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-background-primary data-[state=active]:text-brand-primary data-[state=active]:border-b-2 data-[state=active]:border-brand-primary"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="data-[state=active]:bg-background-primary data-[state=active]:text-brand-primary data-[state=active]:border-b-2 data-[state=active]:border-brand-primary"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-background-primary border border-ui-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-brand-primary/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-secondary font-medium">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-text-accent">LKR 45,231.89</h3>
                  <p className="text-xs text-brand-success font-medium flex items-center">
                    +20.1% from last month
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background-primary border border-ui-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-brand-primary/10 rounded-lg">
                    <Droplet className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-secondary font-medium">Fuel Sales</p>
                  <h3 className="text-2xl font-bold text-text-accent">+2350</h3>
                  <p className="text-xs text-brand-success font-medium flex items-center">
                    +180.1% from last month
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background-primary border border-ui-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-brand-primary/10 rounded-lg">
                    <Activity className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-secondary font-medium">Oil Sales</p>
                  <h3 className="text-2xl font-bold text-text-accent">+12,234</h3>
                  <p className="text-xs text-brand-success font-medium flex items-center">
                    +19% from last month
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background-primary border border-ui-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-brand-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-secondary font-medium">Active Users</p>
                  <h3 className="text-2xl font-bold text-text-accent">+573</h3>
                  <p className="text-xs text-brand-success font-medium flex items-center">
                    +201 since last hour
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart and Recent Sales */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-background-primary border border-ui-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div>
                  <h4 className="text-xl font-semibold mb-6 text-text-accent">Overview</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.ui.border} />
                        <XAxis dataKey="name" stroke={theme.colors.text.secondary} />
                        <YAxis stroke={theme.colors.text.secondary} />
                        <Bar
                          dataKey="value"
                          fill={theme.colors.brand.primary}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3 bg-background-primary border border-ui-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-6 text-text-accent">Recent Sales</h4>
                <div className="space-y-6">
                  {recentSales.map((sale, index) => (
                    <div key={index} className="flex items-center p-3 rounded-lg hover:bg-background-secondary transition-colors">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary font-semibold">
                        {sale.code}
                      </div>
                      <div className="ml-4 flex-1 space-y-1">
                        <p className="text-sm font-medium text-text-primary leading-none">{sale.name}</p>
                        <p className="text-sm text-text-secondary">{sale.amount}</p>
                      </div>
                      <div className="text-sm font-medium text-brand-success">
                        {sale.total}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardOverview 