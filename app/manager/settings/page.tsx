'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, User, Building2, Bell, Shield } from 'lucide-react'
import Navigation from '../dashboard/components/Navigation'
import SubTabs from '../../components/SubTabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { value: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { value: 'station', label: 'Station Settings', icon: <Building2 className="w-4 h-4" /> },
    { value: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { value: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
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
      case 'profile':
        return (
          <Card className="shadow-lg border-none">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-brand-primary/10 p-3 rounded-full">
                  <User className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-text-accent">Profile Settings</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-text-primary font-medium">Name</Label>
                  <Input 
                    placeholder="Enter your name" 
                    defaultValue={user.name}
                    className="border-ui-border focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-text-primary font-medium">Email</Label>
                  <Input 
                    placeholder="Enter your email" 
                    defaultValue={user.email}
                    className="border-ui-border focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-text-primary font-medium">Phone</Label>
                  <Input 
                    placeholder="Enter your phone number" 
                    defaultValue={user.phone}
                    className="border-ui-border focus:border-brand-primary transition-colors"
                  />
                </div>
                <Button className="bg-brand-primary hover:bg-brand-secondary transition-colors w-full sm:w-auto">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      case 'station':
        return (
          <Card className="shadow-lg border-none">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-brand-primary/10 p-3 rounded-full">
                  <Building2 className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-text-accent">Station Settings</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-text-primary font-medium">Station Name</Label>
                  <Input 
                    placeholder="Enter station name"
                    className="border-ui-border focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-text-primary font-medium">Location</Label>
                  <Input 
                    placeholder="Enter station location"
                    className="border-ui-border focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-text-primary font-medium">Operating Hours</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-text-secondary">Opening Time</Label>
                      <Input 
                        type="time"
                        className="border-ui-border focus:border-brand-primary transition-colors"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-text-secondary">Closing Time</Label>
                      <Input 
                        type="time"
                        className="border-ui-border focus:border-brand-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <Button className="bg-brand-primary hover:bg-brand-secondary transition-colors w-full sm:w-auto">
                  Update Station
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      case 'notifications':
        return (
          <Card className="shadow-lg border-none">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-brand-primary/10 p-3 rounded-full">
                  <Bell className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-text-accent">Notification Preferences</h3>
              </div>
              <div className="space-y-8">
                <div className="flex items-start justify-between p-4 hover:bg-background-accent rounded-lg transition-colors">
                  <div className="space-y-1">
                    <Label className="text-lg font-medium text-text-primary">Email Notifications</Label>
                    <p className="text-sm text-text-secondary">
                      Receive important updates and alerts via email
                    </p>
                  </div>
                  <Switch className="mt-1" />
                </div>
                <div className="flex items-start justify-between p-4 hover:bg-background-accent rounded-lg transition-colors">
                  <div className="space-y-1">
                    <Label className="text-lg font-medium text-text-primary">SMS Notifications</Label>
                    <p className="text-sm text-text-secondary">
                      Get instant alerts via SMS for critical updates
                    </p>
                  </div>
                  <Switch className="mt-1" />
                </div>
                <div className="flex items-start justify-between p-4 hover:bg-background-accent rounded-lg transition-colors">
                  <div className="space-y-1">
                    <Label className="text-lg font-medium text-text-primary">Low Stock Alerts</Label>
                    <p className="text-sm text-text-secondary">
                      Be notified when fuel stock falls below threshold
                    </p>
                  </div>
                  <Switch className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 'security':
        return (
          <Card className="shadow-lg border-none">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-brand-primary/10 p-3 rounded-full">
                  <Shield className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-text-accent">Security Settings</h3>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-text-primary">Change Password</Label>
                  <div className="space-y-4">
                    <Input 
                      type="password" 
                      placeholder="Current password"
                      className="border-ui-border focus:border-brand-primary transition-colors"
                    />
                    <Input 
                      type="password" 
                      placeholder="New password"
                      className="border-ui-border focus:border-brand-primary transition-colors"
                    />
                    <Input 
                      type="password" 
                      placeholder="Confirm new password"
                      className="border-ui-border focus:border-brand-primary transition-colors"
                    />
                  </div>
                  <Button className="bg-brand-primary hover:bg-brand-secondary transition-colors w-full sm:w-auto mt-2">
                    Update Password
                  </Button>
                </div>
                <div className="flex items-start justify-between p-4 hover:bg-background-accent rounded-lg transition-colors">
                  <div className="space-y-1">
                    <Label className="text-lg font-medium text-text-primary">Two-Factor Authentication</Label>
                    <p className="text-sm text-text-secondary">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch className="mt-1" />
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
            <h2 className="text-3xl font-bold text-text-accent mb-2">Settings</h2>
            <p className="text-text-secondary">
              Customize your account and station preferences to optimize your workflow.
            </p>
          </div>
          
          <div className="mt-8">
            <SubTabs
              tabs={tabs}
              defaultValue="profile"
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