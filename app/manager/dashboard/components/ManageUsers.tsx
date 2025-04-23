'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Trash2, Edit2, ChevronDown, Save } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface StationUser {
  id: string
  email: string
  name: string
  phone: string
  role: string
  stationId: string
  isEditing?: boolean
  editedName?: string
  editedPhone?: string
  editedRole?: string
}

const VALID_ROLES = ['ACCOUNTANT', 'EMPLOYEE', 'CUSTOMER']

const ManageUsers = () => {
  const router = useRouter()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<StationUser[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingValues, setEditingValues] = useState<Record<string, { name: string; phone: string; role: string }>>({})
  const [responseMsg, setResponseMsg] = useState<string | null>(null)

  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserPhone, setNewUserPhone] = useState('')
  const [newUserRole, setNewUserRole] = useState('')
  const [open, setOpen] = useState(false)

  const PAGE_SIZE = 5

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/station-users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }, [])

  useEffect(() => {
    const initializeDashboard = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      setLoading(true)
      try {
        await fetchUsers()
      } catch (error) {
        console.error('Error initializing dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [user, router, fetchUsers])

  const handleEditUser = useCallback(async (id: string) => {
    const user = users.find(u => u.id === id)
    if (!user) return

    if (editingValues[id]) {
      // Save changes
      try {
        const response = await fetch(`/api/station-users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingValues[id].name,
            phone: editingValues[id].phone,
            role: editingValues[id].role,
          }),
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
      // Start editing
      setEditingValues(prev => ({
        ...prev,
        [id]: {
          name: user.name,
          phone: user.phone,
          role: user.role,
        }
      }))
    }
  }, [editingValues, users, fetchUsers])

  const handleAddUser = useCallback(async () => {
    setResponseMsg(null)

    if (!newUserEmail || !newUserName || !newUserPhone || !newUserRole) {
      setResponseMsg('❌ Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/station-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: newUserEmail, 
          name: newUserName, 
          phone: newUserPhone,
          role: newUserRole,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create user')
      }
      
      setResponseMsg('✅ User added successfully')
      setNewUserEmail('')
      setNewUserName('')
      setNewUserPhone('')
      setNewUserRole('')
      await fetchUsers()
    } catch (error) {
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    }
  }, [newUserEmail, newUserName, newUserPhone, newUserRole, fetchUsers])

  const handleDeleteUser = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/station-users/${id}`, {
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
  }, [fetchUsers])

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-gray-500">Add, edit, and manage station users</p>
        </div>
      </div>

      <Separator />

      {/* Add User Form */}
      <Card className="bg-background-secondary border-ui-border shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text-accent">Add New User</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text-primary">Email</Label>
                <Input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Enter email"
                  className="bg-background-primary border-ui-border text-text-primary placeholder:text-text-secondary focus:ring-1 focus:ring-brand-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary">Name</Label>
                <Input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Enter name"
                  className="bg-background-primary border-ui-border text-text-primary placeholder:text-text-secondary focus:ring-1 focus:ring-brand-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary">Phone</Label>
                <Input
                  type="tel"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="bg-background-primary border-ui-border text-text-primary placeholder:text-text-secondary focus:ring-1 focus:ring-brand-primary"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text-primary">Role</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between bg-background-primary border-ui-border text-text-primary hover:bg-background-accent"
                    >
                      {newUserRole || "Select role..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-background-secondary border-ui-border">
                    <Command className="bg-background-secondary">
                      <CommandInput 
                        placeholder="Search role..." 
                        className="bg-background-primary text-text-primary"
                      />
                      <CommandEmpty className="text-text-secondary">No role found.</CommandEmpty>
                      <CommandGroup>
                        {VALID_ROLES.map((role) => (
                          <CommandItem
                            key={role}
                            value={role}
                            onSelect={() => {
                              setNewUserRole(role)
                              setOpen(false)
                            }}
                            className="text-text-primary hover:bg-background-accent hover:text-text-accent"
                          >
                            {role}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <Button
              onClick={handleAddUser}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-text-accent transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
            {responseMsg && (
              <p className={`text-sm ${responseMsg.startsWith('✅') ? 'text-brand-success' : 'text-brand-error'}`}>
                {responseMsg}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and Table */}
      <Card className="bg-background-secondary border-ui-border shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-text-accent">Current Users</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-background-primary border-ui-border text-text-primary placeholder:text-text-secondary focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div className="rounded-md border border-ui-border overflow-hidden">
              <Table>
                <TableHeader className="bg-background-accent">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-text-primary">Name</TableHead>
                    <TableHead className="text-text-primary">Email</TableHead>
                    <TableHead className="text-text-primary">Phone</TableHead>
                    <TableHead className="text-text-primary">Role</TableHead>
                    <TableHead className="text-text-primary">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-background-accent border-t border-ui-border">
                      <TableCell className="text-text-primary">
                        {editingValues[user.id] ? (
                          <Input
                            value={editingValues[user.id].name}
                            onChange={(e) => setEditingValues(prev => ({
                              ...prev,
                              [user.id]: { ...prev[user.id], name: e.target.value }
                            }))}
                            className="bg-transparent border-0 focus:ring-0 p-0 text-text-primary"
                          />
                        ) : (
                          user.name
                        )}
                      </TableCell>
                      <TableCell className="text-text-primary">{user.email}</TableCell>
                      <TableCell className="text-text-primary">
                        {editingValues[user.id] ? (
                          <Input
                            value={editingValues[user.id].phone}
                            onChange={(e) => setEditingValues(prev => ({
                              ...prev,
                              [user.id]: { ...prev[user.id], phone: e.target.value }
                            }))}
                            className="bg-transparent border-0 focus:ring-0 p-0 text-text-primary"
                          />
                        ) : (
                          user.phone
                        )}
                      </TableCell>
                      <TableCell>
                        {editingValues[user.id] ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between bg-background-primary border-ui-border text-text-primary hover:bg-background-accent"
                              >
                                {editingValues[user.id].role || "Select role..."}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 bg-background-secondary border-ui-border">
                              <Command className="bg-background-secondary">
                                <CommandInput 
                                  placeholder="Search role..." 
                                  className="bg-background-primary text-text-primary"
                                />
                                <CommandEmpty className="text-text-secondary">No role found.</CommandEmpty>
                                <CommandGroup>
                                  {VALID_ROLES.map((role) => (
                                    <CommandItem
                                      key={role}
                                      value={role}
                                      onSelect={() => {
                                        setEditingValues(prev => ({
                                          ...prev,
                                          [user.id]: { ...prev[user.id], role }
                                        }))
                                      }}
                                      className="text-text-primary hover:bg-background-accent hover:text-text-accent"
                                    >
                                      {role}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <Badge className="bg-brand-primary/20 text-brand-primary">
                            {user.role}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user.id)}
                            className="hover:bg-background-accent text-text-primary hover:text-text-accent"
                          >
                            {editingValues[user.id] ? (
                              <Save className="w-4 h-4 text-brand-success" />
                            ) : (
                              <Edit2 className="w-4 h-4 text-brand-primary" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                            className="hover:bg-background-accent text-text-primary hover:text-text-accent"
                          >
                            <Trash2 className="w-4 h-4 text-brand-error" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {paginatedUsers.length === 0 && (
                <div className="text-center text-text-secondary py-8">
                  No users found
                </div>
              )}
            </div>

            {filteredUsers.length > PAGE_SIZE && (
              <div className="flex justify-center items-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-background-primary border-ui-border text-text-primary hover:bg-background-accent"
                >
                  Previous
                </Button>
                <span className="text-text-secondary">
                  Page {currentPage} of {Math.ceil(filteredUsers.length / PAGE_SIZE)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * PAGE_SIZE >= filteredUsers.length}
                  className="bg-background-primary border-ui-border text-text-primary hover:bg-background-accent"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Response Message */}
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

export default ManageUsers 