'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'

const ManageFuel = () => {
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


      <Separator className="bg-ui-border" />

      {/* Fuel Management Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-background-secondary border-ui-border shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-text-accent">Add Fuel Stock</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-text-primary">Fuel Type</Label>
                <Input 
                  placeholder="Enter fuel type" 
                  className="bg-background-primary border-ui-border text-text-primary placeholder:text-text-secondary focus:ring-1 focus:ring-brand-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary">Quantity (Liters)</Label>
                <Input 
                  type="number" 
                  placeholder="Enter quantity" 
                  className="bg-background-primary border-ui-border text-text-primary placeholder:text-text-secondary focus:ring-1 focus:ring-brand-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary">Price per Liter</Label>
                <Input 
                  type="number" 
                  placeholder="Enter price" 
                  className="bg-background-primary border-ui-border text-text-primary placeholder:text-text-secondary focus:ring-1 focus:ring-brand-primary"
                />
              </div>
              <Button 
                className="w-full bg-brand-primary hover:bg-brand-secondary text-text-accent transition-colors duration-200"
              >
                Add Stock
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background-secondary border-ui-border shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-text-accent">Current Inventory</h2>
            <div className="space-y-4">
              {/* Placeholder for inventory table */}
              <div className="text-center text-text-secondary py-8">
                No fuel inventory data available
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ManageFuel 