'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Plus, Search, Trash2, Edit2, Save } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface UserData {
  name: string
  role: string
  stationId: string
}

interface Manager {
  id: string
  email: string
  name: string
  phone: string
  stationId: string
}

const PAGE_SIZE = 5

const OwnerDashboard = () => {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user, loading: authLoading } = useAuth()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const [managerEmail, setManagerEmail] = useState('')
  const [managerName, setManagerName] = useState('')
  const [managerPhone, setManagerPhone] = useState('')
  const [responseMsg, setResponseMsg] = useState<string | null>(null)

  const [managers, setManagers] = useState<Manager[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingValues, setEditingValues] = useState<Record<string, { name: string; phone: string; email: string }>>({})

  const filteredManagers = managers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.toLowerCase().includes(search.toLowerCase())
  )

  const paginatedManagers = filteredManagers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const fetchManagers = useCallback(async () => {
    try {
      const response = await fetch('/api/managers')
      if (!response.ok) {
        throw new Error('Failed to fetch managers')
      }
      const data = await response.json()
      setManagers(data)
    } catch (error) {
      console.error('Error fetching managers:', error)
    }
  }, [])

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      if (authLoading) {
        return // Wait for auth to finish loading
      }

      if (!user) {
        // Check session before redirecting
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
        router.push('/login')
        return
      }
      }

      setLoading(true)
      try {
        setUserData({ name: user?.name || '', role: user?.role || '', stationId: user?.stationId || '' })
        await fetchManagers()
      } catch (error) {
        console.error('Error initializing dashboard:', error)
      } finally {
      setLoading(false)
      }
    }

    initializeDashboard()
  }, [user, authLoading, router, fetchManagers, supabase])

  const handleEditManager = useCallback(async (id: string) => {
    const manager = managers.find(m => m.id === id)
    if (!manager) return

    if (editingValues[id]) {
      // Save changes
      try {
        const response = await fetch(`/api/managers/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingValues[id].name,
            phone: editingValues[id].phone,
            email: editingValues[id].email,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update manager')
        }

        setEditingValues(prev => {
          const newState = { ...prev }
          delete newState[id]
          return newState
        })
        
        setResponseMsg('✅ Manager updated successfully')
        
        await fetchManagers()
      } catch (error) {
        setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : "Failed to update manager"}`)
      }
    } else {
      // Start editing
      setEditingValues(prev => ({
        ...prev,
        [id]: {
          name: manager.name,
          phone: manager.phone,
          email: manager.email,
        }
      }))
    }
  }, [editingValues, managers, fetchManagers])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }, [supabase, router])

  const handleAddManager = useCallback(async () => {
    setResponseMsg(null)

    if (!managerEmail || !managerName || !managerPhone) {
      setResponseMsg('❌ Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: managerEmail,
          password: 'angel123',
          name: managerName,
          phone: managerPhone,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create manager')
      }

      setResponseMsg('✅ Manager added successfully')
      setManagerEmail('')
      setManagerName('')
      setManagerPhone('')
      await fetchManagers()
    } catch (error) {
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    }
  }, [managerEmail, managerName, managerPhone, fetchManagers])

  const handleDeleteManager = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/managers/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete manager')
      }

      setResponseMsg('✅ Manager deleted successfully')
      await fetchManagers()
    } catch (error) {
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    }
  }, [fetchManagers])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white rounded-lg shadow p-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome, {userData?.name}</h1>
            <p className="text-muted-foreground">Owner Dashboard</p>
          </div>
          <Button variant="outline" className="text-foreground hover:bg-gray-100" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Separator />

        {/* Managers Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Station Managers</h2>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">{managers.length} Managers</Badge>
          </div>

          <Card className="mb-6 border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Email</Label>
                  <Input
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    placeholder="Enter manager email"
                    className="border-gray-200 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Name</Label>
                  <Input
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder="Enter manager name"
                    className="border-gray-200 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Phone</Label>
                  <Input
                    value={managerPhone}
                    onChange={(e) => setManagerPhone(e.target.value)}
                    placeholder="Enter manager phone"
                    className="border-gray-200 focus:border-primary"
                  />
                </div>
              </div>
              <Button onClick={handleAddManager} className="w-full md:w-auto bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Manager
              </Button>
            </CardContent>
          </Card>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search managers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-gray-200 focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-foreground font-semibold">Email</TableHead>
                  <TableHead className="text-foreground font-semibold">Name</TableHead>
                  <TableHead className="text-foreground font-semibold">Phone</TableHead>
                  <TableHead className="text-foreground font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedManagers.map((manager) => (
                  <TableRow key={manager.id} className="hover:bg-gray-50">
                    <TableCell className="text-foreground">
                      {editingValues[manager.id]?.email || manager.email}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {editingValues[manager.id]?.name || manager.name}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {editingValues[manager.id]?.phone || manager.phone}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditManager(manager.id)}
                          className="hover:bg-gray-100"
                        >
                          {editingValues[manager.id] ? (
                            <Save className="w-4 h-4 text-green-500" />
                          ) : (
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteManager(manager.id)}
                          className="hover:bg-gray-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredManagers.length > PAGE_SIZE && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-gray-200 hover:border-primary"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {Math.ceil(filteredManagers.length / PAGE_SIZE)}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * PAGE_SIZE >= filteredManagers.length}
                className="border-gray-200 hover:border-primary"
              >
                Next
      </Button>
            </div>
          )}
        </div>

        {/* Response Message */}
        {responseMsg && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            responseMsg.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {responseMsg}
          </div>
        )}
      </div>
    </div>
  )
} 

export default OwnerDashboard 