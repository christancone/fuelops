'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ManageUsers from './ManageUsers'
import ManageFuel from './ManageFuel'
import ManageAccounts from './ManageAccounts'

const DashboardTabs = () => {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-background-secondary border border-ui-border">
        <TabsTrigger 
          value="users" 
          className="data-[state=active]:bg-background-primary data-[state=active]:text-brand-primary data-[state=active]:border-b-2 data-[state=active]:border-brand-primary text-text-secondary"
        >
          Manage Users
        </TabsTrigger>
        <TabsTrigger 
          value="fuel" 
          className="data-[state=active]:bg-background-primary data-[state=active]:text-brand-primary data-[state=active]:border-b-2 data-[state=active]:border-brand-primary text-text-secondary"
        >
          Manage Fuel
        </TabsTrigger>
        <TabsTrigger 
          value="accounts" 
          className="data-[state=active]:bg-background-primary data-[state=active]:text-brand-primary data-[state=active]:border-b-2 data-[state=active]:border-brand-primary text-text-secondary"
        >
          Manage Accounts
        </TabsTrigger>
      </TabsList>
      <TabsContent value="users" className="mt-6">
        <ManageUsers />
      </TabsContent>
      <TabsContent value="fuel" className="mt-6">
        <ManageFuel />
      </TabsContent>
      <TabsContent value="accounts" className="mt-6">
        <ManageAccounts />
      </TabsContent>
    </Tabs>
  )
}

export default DashboardTabs 