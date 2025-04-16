'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  id: string
  email: string
  name: string
  phone: string
  role: string
  stationId: string
}

interface NewUserForm {
  email: string
  name: string
  phone: string
  role: string
}

const VALID_ROLES = ['ACCOUNTANT', 'EMPLOYEE', 'CUSTOMER']
const PAGE_SIZE = 5

export default function ManagerDashboard() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingValues, setEditingValues] = useState<Record<string, Partial<User>>>({})
  const [responseMsg, setResponseMsg] = useState<string | null>(null)
  const [newUser, setNewUser] = useState<NewUserForm>({
    email: '',
    name: '',
    phone: '',
    role: ''
  })

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => 
    users.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.toLowerCase().includes(search.toLowerCase())
    ),
    [users, search]
  )

  // Memoize paginated users
  const paginatedUsers = useMemo(() => 
    filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredUsers, currentPage]
  )

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/station-users')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Failed to fetch users'}`)
    }
  }, [])

  // Combined initialization and session handling
  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout | undefined

    const initializeDashboard = async () => {
      if (authLoading) return

      if (!user) {
        router.push('/login')
        return
      }

      if (user.role !== 'MANAGER') {
        if (mounted) setLoading(false)
        return
      }

      if (mounted) setLoading(true)
      try {
        await fetchUsers()
      } catch (error) {
        console.error('Error initializing dashboard:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initializeDashboard()

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [user, authLoading, router, fetchUsers])

  // Clear response message after 3 seconds
  useEffect(() => {
    if (!responseMsg) return

    const timer = setTimeout(() => {
      setResponseMsg(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [responseMsg])

  const handleEditUser = useCallback(async (id: string) => {
    const user = users.find(u => u.id === id)
    if (!user) return

    if (editingValues[id]) {
      try {
        const response = await fetch(`/api/station-users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingValues[id]),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update user')
        }

        setEditingValues(prev => {
          const newState = { ...prev }
          delete newState[id]
          return newState
        })
        
        setResponseMsg('✅ User updated successfully')
        await fetchUsers()
      } catch (error) {
        setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : "Failed to update user"}`)
      }
      } else {
      setEditingValues(prev => ({
        ...prev,
        [id]: {
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
        }
      }))
    }
  }, [editingValues, users, fetchUsers])

  const handleDeleteUser = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/station-users/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete user')
      }

      setResponseMsg('✅ User deleted successfully')
      await fetchUsers()
    } catch (error) {
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    }
  }, [fetchUsers])

  const handleAddUser = useCallback(async () => {
    setResponseMsg(null)

    if (!newUser.email || !newUser.name || !newUser.phone || !newUser.role) {
      setResponseMsg('❌ Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/station-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      setResponseMsg('✅ User added successfully')
      setNewUser({
        email: '',
        name: '',
        phone: '',
        role: ''
      })
      await fetchUsers()
    } catch (error) {
      console.error('Error adding user:', error)
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    }
  }, [newUser, fetchUsers])

  const handleNewUserChange = useCallback((field: keyof NewUserForm, value: string) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  if (user.role !== 'MANAGER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Unauthorized Access</h1>
          <p className="text-gray-600">You do not have permission to access this dashboard.</p>
          <p className="text-gray-500">Please contact your administrator if you believe this is an error.</p>
          <Button variant="outline" onClick={signOut}>
            Return to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <p className="text-gray-500">Manager Dashboard</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            Logout
          </Button>
        </div>

        <Separator />

        {/* Users Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Station Users</h2>
            </div>
            <Badge variant="outline">{users.length} Users</Badge>
          </div>

          {/* Add User Form */}
          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={newUser.email}
                    onChange={(e) => handleNewUserChange('email', e.target.value)}
                    placeholder="Enter user email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={newUser.name}
                    onChange={(e) => handleNewUserChange('name', e.target.value)}
                    placeholder="Enter user name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={newUser.phone}
                    onChange={(e) => handleNewUserChange('phone', e.target.value)}
                    placeholder="Enter user phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => handleNewUserChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {VALID_ROLES.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddUser} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </CardContent>
          </Card>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {editingValues[user.id] ? (
                        <Input
                          value={editingValues[user.id].name}
                          onChange={(e) => setEditingValues(prev => ({
                            ...prev,
                            [user.id]: { ...prev[user.id], name: e.target.value }
                          }))}
                          className="border-0 focus:ring-0 p-0"
                        />
                      ) : (
                        user.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingValues[user.id] ? (
                        <Input
                          value={editingValues[user.id].email}
                          onChange={(e) => setEditingValues(prev => ({
                            ...prev,
                            [user.id]: { ...prev[user.id], email: e.target.value }
                          }))}
                          className="border-0 focus:ring-0 p-0"
                        />
                      ) : (
                        user.email
                      )}
                    </TableCell>
                    <TableCell>
                      {editingValues[user.id] ? (
                        <Input
                          value={editingValues[user.id].phone}
                          onChange={(e) => setEditingValues(prev => ({
                            ...prev,
                            [user.id]: { ...prev[user.id], phone: e.target.value }
                          }))}
                          className="border-0 focus:ring-0 p-0"
                        />
                      ) : (
                        user.phone
                      )}
                    </TableCell>
                    <TableCell>
                      {editingValues[user.id] ? (
                        <Select
                          value={editingValues[user.id].role}
                          onValueChange={(value) => setEditingValues(prev => ({
                            ...prev,
                            [user.id]: { ...prev[user.id], role: value }
                          }))}
                        >
                          <SelectTrigger className="border-0 focus:ring-0 p-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {VALID_ROLES.map(role => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        user.role
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditUser(user.id)}
                        >
                          {editingValues[user.id] ? (
                            <Save className="w-4 h-4 text-green-500" />
                          ) : (
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
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

          {/* Pagination */}
          {filteredUsers.length > PAGE_SIZE && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {currentPage} of {Math.ceil(filteredUsers.length / PAGE_SIZE)}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * PAGE_SIZE >= filteredUsers.length}
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