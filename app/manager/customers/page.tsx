'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Search, Edit2, Trash2 } from 'lucide-react'
import Navigation from '../dashboard/components/Navigation'

interface Customer {
  id: string
  email: string
  name: string
  phone: string
  stationId: string
}

export default function CustomersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [searchByPhone, setSearchByPhone] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null)
  const [editedName, setEditedName] = useState('')
  const [editedEmail, setEditedEmail] = useState('')
  const [editedPhone, setEditedPhone] = useState('')
  const [responseMsg, setResponseMsg] = useState<string | null>(null)
  const [isAddingCustomer, setIsAddingCustomer] = useState(false)
  const [newCustomerName, setNewCustomerName] = useState('')
  const [newCustomerEmail, setNewCustomerEmail] = useState('')
  const [newCustomerPhone, setNewCustomerPhone] = useState('')

  const PAGE_SIZE = 5

  const filteredCustomers = customers.filter(c =>
    (search === '' || 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())) &&
    (searchByPhone === '' || c.phone.includes(searchByPhone))
  )

  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchCustomers()
    }
  }, [user, loading, router])

  const handleAddCustomer = async () => {
    setResponseMsg(null)

    if (!newCustomerEmail || !newCustomerName || !newCustomerPhone) {
      setResponseMsg('❌ Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newCustomerEmail,
          name: newCustomerName,
          phone: newCustomerPhone,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create customer')
      }

      setResponseMsg('✅ Customer added successfully')
      setNewCustomerEmail('')
      setNewCustomerName('')
      setNewCustomerPhone('')
      setIsAddingCustomer(false)
      await fetchCustomers()
    } catch (error) {
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Failed to create customer'}`)
    }
  }

  const handleEditCustomer = async (customerId: string) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName,
          email: editedEmail,
          phone: editedPhone,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update customer')
      }

      setEditingCustomerId(null)
      setResponseMsg('✅ Customer updated successfully')
      await fetchCustomers()
    } catch (error) {
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Failed to update customer'}`)
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete customer')
      }

      setResponseMsg('✅ Customer deleted successfully')
      await fetchCustomers()
    } catch (error) {
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Failed to delete customer'}`)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium text-gray-900">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto p-6 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your station&apos;s customers
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="manage">Manage Customers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Customer Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900">Total Customers</h3>
                    <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900">Active Customers</h3>
                    <p className="text-3xl font-bold text-green-600">
                      {customers.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-900">Manage Customers</CardTitle>
                  <Button
                    onClick={() => setIsAddingCustomer(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add Customer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {responseMsg && (
                  <div className="mb-4 p-2 rounded" style={{ 
                    backgroundColor: responseMsg.includes('❌') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: responseMsg.includes('❌') ? '#DC2626' : '#059669'
                  }}>
                    {responseMsg}
                  </div>
                )}

                {isAddingCustomer && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium mb-4 text-gray-900">
                      Add New Customer
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Email"
                        value={newCustomerEmail}
                        onChange={(e) => setNewCustomerEmail(e.target.value)}
                        className="bg-white"
                      />
                      <Input
                        placeholder="Name"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        className="bg-white"
                      />
                      <Input
                        placeholder="Phone"
                        value={newCustomerPhone}
                        onChange={(e) => setNewCustomerPhone(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingCustomer(false)}
                        className="border-gray-300 hover:bg-gray-100"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddCustomer}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Add Customer
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-white"
                      />
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="Search by phone number..."
                        value={searchByPhone}
                        onChange={(e) => setSearchByPhone(e.target.value)}
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {paginatedCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="p-4 border rounded-lg bg-gray-50"
                    >
                      {editingCustomerId === customer.id ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Name"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="bg-white"
                          />
                          <Input
                            placeholder="Email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            className="bg-white"
                          />
                          <Input
                            placeholder="Phone"
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                            className="bg-white"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setEditingCustomerId(null)}
                              className="border-gray-300 hover:bg-gray-100"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleEditCustomer(customer.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {customer.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {customer.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              {customer.phone}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingCustomerId(customer.id)
                                setEditedName(customer.name)
                                setEditedEmail(customer.email)
                                setEditedPhone(customer.phone)
                              }}
                            >
                              <Edit2 className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCustomer(customer.id)}
                            >
                              <Trash2 className="w-4 h-4 text-gray-600" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredCustomers.length > PAGE_SIZE && (
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="border-gray-300 hover:bg-gray-100"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage * PAGE_SIZE >= filteredCustomers.length}
                        className="border-gray-300 hover:bg-gray-100"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 