'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Save, TrendingUp } from 'lucide-react'

interface FuelPrice {
  id: string
  name: string
  code: string
  currentPrice: number
  lastUpdated: string
}

const initialFuelPrices: FuelPrice[] = [
  { id: '1', name: 'Lanka Petrol', code: 'LP', currentPrice: 366.00, lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Lanka Auto Diesel', code: 'LD', currentPrice: 363.00, lastUpdated: new Date().toISOString() },
  { id: '3', name: 'Lanka Super Diesel', code: 'LSD', currentPrice: 385.00, lastUpdated: new Date().toISOString() },
  { id: '4', name: 'Lanka Kerosene', code: 'LK', currentPrice: 275.00, lastUpdated: new Date().toISOString() },
  { id: '5', name: 'Lanka Super Petrol', code: 'LSP', currentPrice: 395.00, lastUpdated: new Date().toISOString() },
]

const FuelPricing = () => {
  const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>(initialFuelPrices)
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({})
  const [responseMsg, setResponseMsg] = useState<string | null>(null)

  const handlePriceChange = (id: string, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setEditedPrices(prev => ({
        ...prev,
        [id]: numValue
      }))
    }
  }

  const handleSavePrice = async (id: string) => {
    const newPrice = editedPrices[id]
    if (!newPrice) return

    try {
      // TODO: Implement API call to save price
      // const response = await fetch('/api/fuel-prices/${id}', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ price: newPrice })
      // })

      // Simulating API call success
      setFuelPrices(prev => prev.map(fuel => 
        fuel.id === id 
          ? { ...fuel, currentPrice: newPrice, lastUpdated: new Date().toISOString() }
          : fuel
      ))
      
      setEditedPrices(prev => {
        const newState = { ...prev }
        delete newState[id]
        return newState
      })

      setResponseMsg('✅ Price updated successfully')
      setTimeout(() => setResponseMsg(null), 3000)
    } catch {
      setResponseMsg('❌ Failed to update price')
      setTimeout(() => setResponseMsg(null), 3000)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fuelPrices.map((fuel) => (
          <Card key={fuel.id} className="bg-background-secondary border-ui-border shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-text-accent">{fuel.name}</h3>
                  <p className="text-sm text-text-secondary">{fuel.code}</p>
                </div>
                <div className="p-2 bg-brand-primary/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-text-primary">Current Price (LKR)</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={editedPrices[fuel.id] ?? fuel.currentPrice}
                      onChange={(e) => handlePriceChange(fuel.id, e.target.value)}
                      className="bg-background-primary border-ui-border text-text-primary placeholder:text-text-secondary focus:ring-1 focus:ring-brand-primary"
                    />
                    <Button
                      onClick={() => handleSavePrice(fuel.id)}
                      disabled={!editedPrices[fuel.id]}
                      className="bg-brand-primary hover:bg-brand-secondary text-text-accent transition-colors duration-200"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-text-secondary">
                  Last updated: {formatDate(fuel.lastUpdated)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {responseMsg && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
          responseMsg.startsWith('✅') 
            ? 'bg-brand-success/20 text-brand-success' 
            : 'bg-brand-error/20 text-brand-error'
        }`}>
          {responseMsg}
        </div>
      )}
    </div>
  )
}

export default FuelPricing 