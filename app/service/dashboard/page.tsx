// Enhanced version with edit, search, and pagination
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building2, Users, Plus, Search, Trash2, Edit2, ChevronDown, Save } from 'lucide-react'
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
import { cn } from "@/lib/utils"

interface UserData {
  name: string
  role: string
  stationId: string
}

interface Owner {
  id: string
  email: string
  name: string
  phone: string
  stationId: string
  isEditing?: boolean
  editedName?: string
  editedStationId?: string
}

interface Station {
  id: string
  name: string
  location: string
  isEditing?: boolean
  editedName?: string
  editedLocation?: string
}

const PAGE_SIZE = 5

const ServiceProviderDashboard = () => {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user, loading: authLoading } = useAuth()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const [ownerEmail, setOwnerEmail] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [stationId, setStationId] = useState('')
  const [responseMsg, setResponseMsg] = useState<string | null>(null)

  const [owners, setOwners] = useState<Owner[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingValues, setEditingValues] = useState<Record<string, Partial<Owner>>>({})

  const [stations, setStations] = useState<Station[]>([])
  const [newStationName, setNewStationName] = useState('')
  const [newStationLocation, setNewStationLocation] = useState('')

  const [open, setOpen] = useState(false)
  const [stationSearch, setStationSearch] = useState('')

  const [editingStations, setEditingStations] = useState<Record<string, { name: string; location: string }>>({})

  const filteredOwners = owners.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase()) ||
    o.stationId.toLowerCase().includes(search.toLowerCase())
  )

  const paginatedOwners = filteredOwners.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const filteredStations = stations.filter(station =>
    station.name.toLowerCase().includes(stationSearch.toLowerCase()) ||
    station.id.toLowerCase().includes(stationSearch.toLowerCase())
  )

  const fetchOwners = useCallback(async () => {
    try {
      const response = await fetch('/api/owners')
      if (!response.ok) {
        throw new Error('Failed to fetch owners')
      }
      const data = await response.json()
      setOwners(data)
    } catch (error) {
      console.error('Error fetching owners:', error)
    }
  }, [])

  const fetchStations = useCallback(async () => {
    try {
      const response = await fetch('/api/servicestations')
      if (!response.ok) {
        throw new Error('Failed to fetch stations')
      }
      const data = await response.json()
      setStations(data)
    } catch (error) {
      console.error('Error fetching stations:', error)
    }
  }, [])

  // Combine user and data fetching into a single effect
  useEffect(() => {
    const initializeDashboard = async () => {
      if (!user) {
        router.push('/login')
        return
      }

      setLoading(true)
      try {
        setUserData({ name: user.name || '', role: user.role, stationId: user.stationId || '' })
        await Promise.all([fetchOwners(), fetchStations()])
      } catch (error) {
        console.error('Error initializing dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [user, router, fetchOwners, fetchStations])

  const handleEditOwner = useCallback(async (id: string) => {
    const owner = owners.find(o => o.id === id)
    if (!owner) return

    if (editingValues[id]) {
      // Save changes
      try {
        const response = await fetch(`/api/owners/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingValues[id].name,
            stationId: editingValues[id].stationId,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update owner')
        }

        setEditingValues(prev => {
          const newState = { ...prev }
          delete newState[id]
          return newState
        })
        
        setResponseMsg('✅ Owner updated successfully')
        
        await fetchOwners()
      } catch (error) {
        setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : "Failed to update owner"}`)
      }
    } else {
      // Start editing
      setEditingValues(prev => ({
        ...prev,
        [id]: {
          name: owner.name,
          stationId: owner.stationId,
        }
      }))
    }
  }, [editingValues, owners, fetchOwners])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }, [supabase, router])

  const handleAddOwner = useCallback(async () => {
    setResponseMsg(null)

    if (!ownerEmail || !ownerName || !stationId) {
      setResponseMsg('❌ Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: ownerEmail, 
          password: 'angel123',
          name: ownerName, 
          phone: '+94700000000',
          stationId,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create owner')
      }
      
      setResponseMsg('✅ Owner added successfully')
        setOwnerEmail('')
        setOwnerName('')
        setStationId('')
      await fetchOwners()
    } catch (error) {
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    }
  }, [ownerEmail, ownerName, stationId, fetchOwners])

  const handleDeleteOwner = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/owners/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete owner')
      }

      await fetchOwners()
    } catch (error) {
      console.error('Error deleting owner:', error)
    }
  }, [fetchOwners])

  const handleAddStation = useCallback(async () => {
    if (!newStationName || !newStationLocation) {
      setResponseMsg('❌ Please fill in all fields')
      return
    }

    try {
      const response = await fetch('/api/servicestations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStationName,
          location: newStationLocation,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create station')
      }

      setResponseMsg('✅ Station added successfully')
      setNewStationName('')
      setNewStationLocation('')
      await fetchStations()
    } catch (error) {
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    }
  }, [newStationName, newStationLocation, fetchStations])

  const handleDeleteStation = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/servicestations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete station')
      }

      setResponseMsg('✅ Station deleted successfully')
      await fetchStations()
    } catch (error) {
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    }
  }, [fetchStations])

  const handleEditStation = useCallback(async (id: string) => {
    const station = stations.find(s => s.id === id)
    if (!station) return

    if (editingStations[id]) {
      // Save changes
      try {
        const response = await fetch(`/api/servicestations/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editingStations[id].name,
            location: editingStations[id].location,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update station')
        }

        setEditingStations(prev => {
          const newState = { ...prev }
          delete newState[id]
          return newState
        })
        
        setResponseMsg('✅ Station updated successfully')
        
        await fetchStations()
      } catch (error) {
        setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : "Failed to update station"}`)
      }
    } else {
      // Start editing
      setEditingStations(prev => ({
        ...prev,
        [id]: {
          name: station.name,
          location: station.location,
        }
      }))
    }
  }, [editingStations, stations, fetchStations])

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
            <p className="text-muted-foreground">Service Provider Dashboard</p>
          </div>
          <Button variant="outline" className="text-foreground hover:bg-gray-100" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Separator />

        {/* Service Stations Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Service Stations</h2>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">{stations.length} Stations</Badge>
          </div>

          <Card className="mb-6 border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Station Name</Label>
                  <Input
                    value={newStationName}
                    onChange={(e) => setNewStationName(e.target.value)}
                    placeholder="Enter station name"
                    className="border-gray-200 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Location</Label>
                  <Input
                    value={newStationLocation}
                    onChange={(e) => setNewStationLocation(e.target.value)}
                    placeholder="Enter station location"
                    className="border-gray-200 focus:border-primary"
                  />
                </div>
              </div>
              <Button onClick={handleAddStation} className="w-full md:w-auto bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Station
              </Button>
            </CardContent>
          </Card>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-foreground font-semibold">Name</TableHead>
                  <TableHead className="text-foreground font-semibold">Location</TableHead>
                  <TableHead className="text-foreground font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stations.map((station) => (
                  <TableRow key={station.id} className="hover:bg-gray-50">
                    <TableCell className="text-foreground">
                      {editingStations[station.id] ? (
                        <Input
                          value={editingStations[station.id].name}
                          onChange={(e) => setEditingStations(prev => ({
                            ...prev,
                            [station.id]: { ...prev[station.id], name: e.target.value }
                          }))}
                          className="border-0 focus:ring-0 p-0"
                        />
                      ) : (
                        station.name
                      )}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {editingStations[station.id] ? (
                        <Input
                          value={editingStations[station.id].location}
                          onChange={(e) => setEditingStations(prev => ({
                            ...prev,
                            [station.id]: { ...prev[station.id], location: e.target.value }
                          }))}
                          className="border-0 focus:ring-0 p-0"
                        />
                      ) : (
                        station.location
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStation(station.id)}
                          className="hover:bg-gray-100"
                        >
                          {editingStations[station.id] ? (
                            <Save className="w-4 h-4 text-green-500" />
                          ) : (
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStation(station.id)}
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
        </div>

        {/* Owners Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Station Owners</h2>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">{owners.length} Owners</Badge>
      </div>

          <Card className="mb-6 border-primary/20">
        <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Email</Label>
                  <Input
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="Enter owner email"
                    className="border-gray-200 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Name</Label>
                  <Input
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Enter owner name"
                    className="border-gray-200 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Station</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between border-gray-200 hover:border-primary"
                      >
                        {stationId
                          ? stations.find((station) => station.id === stationId)?.name
                          : "Select station..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search station..."
                          value={stationSearch}
                          onValueChange={setStationSearch}
                          className="border-0"
                        />
                        <CommandEmpty>No station found.</CommandEmpty>
                        <CommandGroup>
                          {filteredStations.map((station) => (
                            <CommandItem
                              key={station.id}
                              value={station.id}
                              onSelect={() => {
                                setStationId(station.id)
                                setOpen(false)
                              }}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              <div className="flex flex-col">
                                <span className="text-foreground">{station.name}</span>
                                <span className="text-xs text-muted-foreground">ID: {station.id}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button onClick={handleAddOwner} className="w-full md:w-auto bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Owner
              </Button>
        </CardContent>
      </Card>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search owners..."
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
                  <TableHead className="text-foreground font-semibold">Station ID</TableHead>
                  <TableHead className="text-foreground font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOwners.map((owner) => (
                  <TableRow key={owner.id} className="hover:bg-gray-50">
                    <TableCell className="text-foreground">
                      {editingValues[owner.id]?.email || owner.email}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {editingValues[owner.id]?.name || owner.name}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {editingValues[owner.id]?.phone || owner.phone}
                </TableCell>
                    <TableCell className="text-foreground">
                      {editingValues[owner.id]?.stationId || owner.stationId}
                </TableCell>
                <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditOwner(owner.id)}
                          className="hover:bg-gray-100"
                        >
                          {editingValues[owner.id] ? (
                            <Save className="w-4 h-4 text-green-500" />
                          ) : (
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOwner(owner.id)}
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

          {filteredOwners.length > PAGE_SIZE && (
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
                Page {currentPage} of {Math.ceil(filteredOwners.length / PAGE_SIZE)}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * PAGE_SIZE >= filteredOwners.length}
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

export default ServiceProviderDashboard