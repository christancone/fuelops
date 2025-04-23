'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import Navigation from './components/Navigation'
import DashboardOverview from './components/DashboardOverview'

export default function ManagerDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initializeDashboard = async () => {
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

    initializeDashboard()

    return () => {
      mounted = false
    }
  }, [user, authLoading, router])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="flex items-center space-x-2 text-brand-primary">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-medium text-text-primary">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <DashboardOverview />
        </div>
      </main>
    </div>
  )
} 