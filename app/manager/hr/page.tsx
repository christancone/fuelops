'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Search, Edit2, Trash2 } from 'lucide-react'
import Navigation from '../dashboard/components/Navigation'

interface StationUser {
  id: string
  email: string
  name: string
  phone: string
  role: string
  stationId: string
}

const VALID_ROLES = ['ACCOUNTANT', 'EMPLOYEE']

export default function HRPage() {
  const { user, loading, refreshUser } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<StationUser[]>([])
  const [search, setSearch] = useState('')
  const [searchByPhone, setSearchByPhone] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [responseMsg, setResponseMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // New user form state
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserPhone, setNewUserPhone] = useState('')
  const [newUserRole, setNewUserRole] = useState('')
  const [isAddingUser, setIsAddingUser] = useState(false)

  // Edit user state
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [editedName, setEditedName] = useState('')
  const [editedEmail, setEditedEmail] = useState('')
  const [editedPhone, setEditedPhone] = useState('')
  const [editedRole, setEditedRole] = useState('')

  const PAGE_SIZE = 5

  const filteredUsers = users.filter(u => {
    const matchesSearch = search.toLowerCase() === '' || 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    
    const matchesPhone = searchByPhone === '' || 
      u.phone.includes(searchByPhone)
    
    const matchesRole = selectedRole === 'ALL' || 
      u.role === selectedRole

    return matchesSearch && matchesPhone && matchesRole
  })

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/station-users', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user && user.role !== 'MANAGER') {
      router.push('/manager/dashboard')
    } else if (user) {
      fetchUsers()
    }
  }, [user, loading, router, fetchUsers])

  const handleAddUser = async () => {
    if (!newUserName || !newUserEmail || !newUserPhone || !newUserRole) {
      setResponseMsg('❌ Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/station-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          phone: newUserPhone,
          role: newUserRole,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to add user')
      }

      const newUser = await response.json()
      setUsers([...users, newUser])
      setIsAddingUser(false)
      setNewUserName('')
      setNewUserEmail('')
      setNewUserPhone('')
      setNewUserRole('')
      setResponseMsg('✅ User added successfully')
      
      // Refresh the auth context to update the current user's role
      await refreshUser()
    } catch (err) {
      setResponseMsg(`❌ Error: ${err instanceof Error ? err.message : 'Failed to add user'}`)
    }
  }

  const handleEditUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/station-users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName,
          email: editedEmail,
          phone: editedPhone,
          role: editedRole,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update user')
      }

      setEditingUserId(null)
      await fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Failed to update user'}`)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/station-users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete user')
      }

      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
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
            HR Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your station&apos;s employees and accountants
          </p>
        </div>

        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gray-900">Employee Management</CardTitle>
                  <Button
                    onClick={() => setIsAddingUser(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isAddingUser && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium mb-4 text-gray-900">
                      Add New Employee
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="bg-white"
                      />
                      <Input
                        placeholder="Name"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="bg-white"
                      />
                      <Input
                        placeholder="Phone"
                        value={newUserPhone}
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        className="bg-white"
                      />
                      <select
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        className="bg-white border rounded-md px-3 py-2"
                      >
                        <option value="">Select Role</option>
                        {VALID_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingUser(false)}
                        className="border-gray-300 hover:bg-gray-100"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddUser}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Add Employee
                      </Button>
                    </div>
                  </div>
                )}

                {responseMsg && (
                  <div className="mb-4 p-2 rounded" style={{ 
                    backgroundColor: responseMsg.includes('❌') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: responseMsg.includes('❌') ? '#DC2626' : '#059669'
                  }}>
                    {responseMsg}
                  </div>
                )}

                <div className="mb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="bg-white border rounded-md px-3 py-2"
                    >
                      <option value="ALL">All Roles</option>
                      <option value="EMPLOYEE">Employees</option>
                      <option value="ACCOUNTANT">Accountants</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {paginatedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 border rounded-lg bg-gray-50"
                    >
                      {editingUserId === user.id ? (
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
                          <select
                            value={editedRole}
                            onChange={(e) => setEditedRole(e.target.value)}
                            className="bg-white border rounded-md px-3 py-2"
                          >
                            {VALID_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={() => setEditingUserId(null)}
                              className="border-gray-300 hover:bg-gray-100"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleEditUser(user.id)}
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
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.phone}
                            </p>
                            <span className="inline-block px-2 py-1 text-xs rounded-full mt-2" style={{ 
                              backgroundColor: user.role === 'ACCOUNTANT' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              color: user.role === 'ACCOUNTANT' ? '#059669' : '#2563EB'
                            }}>
                              {user.role}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingUserId(user.id)
                                setEditedName(user.name)
                                setEditedEmail(user.email)
                                setEditedPhone(user.phone)
                                setEditedRole(user.role)
                              }}
                            >
                              <Edit2 className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4 text-gray-600" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredUsers.length > PAGE_SIZE && (
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
                        disabled={currentPage * PAGE_SIZE >= filteredUsers.length}
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

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Attendance Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Attendance management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 