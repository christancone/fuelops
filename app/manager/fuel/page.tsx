'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import Navigation from '../dashboard/components/Navigation'
import ManageFuel from '../dashboard/components/ManageFuel'
import FuelPricing from '../dashboard/components/FuelPricing'

export default function FuelManagementPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'orders', label: 'Orders' },
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

    return () => {
      mounted = false
    }
  }, [user, authLoading, router])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="flex items-center space-x-2 text-brand-primary">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-medium text-text-primary">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <h2 className="text-3xl font-bold text-text-accent mb-2">Manage Fuel</h2>
            <p className="text-text-secondary mb-6">Track and manage fuel inventory</p>
            <ManageFuel />
          </>
        )
      case 'inventory':
        return (
          <>
            <h2 className="text-3xl font-bold text-text-accent mb-2">Fuel Inventory</h2>
            <p className="text-text-secondary mb-6">Monitor and manage fuel stock levels</p>
            <div className="text-center text-text-secondary py-8">
              Inventory management coming soon
            </div>
          </>
        )
      case 'pricing':
        return (
          <>
            <h2 className="text-3xl font-bold text-text-accent mb-2">Fuel Pricing</h2>
            <p className="text-text-secondary mb-6">Set and update fuel prices</p>
            <FuelPricing />
          </>
        )
      case 'orders':
        return (
          <>
            <h2 className="text-3xl font-bold text-text-accent mb-2">Fuel Orders</h2>
            <p className="text-text-secondary mb-6">Manage fuel orders and deliveries</p>
            <div className="text-center text-text-secondary py-8">
              Order management coming soon
            </div>
          </>
        )
      default:
        return <ManageFuel />
    }
  }

  return (
    <div className="min-h-screen bg-background-primary text-text-primary">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-text-accent">Fuel Management</h1>
              <p className="text-text-secondary mt-2">Manage your station&apos;s fuel inventory and operations.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-ui-border">
              <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`
                      py-4 px-1 text-sm font-medium border-b-2 transition-colors duration-200
                      ${
                        activeTab === tab.value
                          ? 'border-brand-primary text-text-accent'
                          : 'border-transparent text-text-secondary hover:text-text-primary hover:border-ui-border'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="mt-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 