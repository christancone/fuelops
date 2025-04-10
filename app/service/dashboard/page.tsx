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

interface UserData {
  name: string
  role: string
  stationId: string
}

interface Owner {
  id: string
  email: string
  name: string
  stationId: string
}

const PAGE_SIZE = 5

const ServiceProviderDashboard = () => {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const [ownerEmail, setOwnerEmail] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [stationId, setStationId] = useState('')
  const [responseMsg, setResponseMsg] = useState<string | null>(null)

  const [owners, setOwners] = useState<Owner[]>([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingValues, setEditingValues] = useState<Record<string, { name: string; stationId: string }>>({})

  const filteredOwners = owners.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase()) ||
    o.stationId.toLowerCase().includes(search.toLowerCase())
  )

  const paginatedOwners = filteredOwners.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const fetchOwners = useCallback(async () => {
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .eq('role', 'owner')
      .eq('stationId', userData?.stationId)

    if (error) {
      console.error('Error fetching owners:', error)
      return
    }

    if (data) {
      setOwners(data)
    }
  }, [supabase, userData?.stationId])

  const handleEditOwner = useCallback(async (id: string, field: 'name' | 'stationId', value: string) => {
    // Only update if the value has changed
    if (editingValues[id]?.[field] === value) return

    try {
      const { error } = await supabase
        .from('User')
        .update({ [field]: value })
        .eq('id', id)

      if (error) {
        console.error('Failed to update owner:', error.message)
      } else {
        // Update local state
        setEditingValues(prev => ({
          ...prev,
          [id]: { ...prev[id], [field]: value }
        }))
        // Refresh the owners list
        fetchOwners()
      }
    } catch (error) {
      console.error('Error updating owner:', error)
    }
  }, [supabase, fetchOwners, editingValues])

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error: sessionError,
      } = await supabase.auth.getUser()

      if (!user || sessionError) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('User')
        .select('name, role, stationId')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Failed to fetch user data:', error.message)
      } else {
        setUserData({ name: data.name, role: data.role, stationId: data.stationId })
        fetchOwners()
      }

      setLoading(false)
    }

    fetchUser()
  }, [supabase, router, fetchOwners])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleAddOwner = async () => {
    setResponseMsg(null)

    if (!ownerEmail || !ownerName || !stationId) {
      setResponseMsg('❌ Please fill in all fields')
      return
    }

    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: ownerEmail, 
          name: ownerName, 
          stationId,
          role: 'OWNER',
          password: 'angel123'
        })
      })
      
      const result = await res.json()
      
      if (!res.ok) {
        setResponseMsg(`❌ ${result.error || 'Failed to create owner'}`)
      } else {
        setResponseMsg(`✅ Successfully added owner: ${ownerEmail}`)
        setOwnerEmail('')
        setOwnerName('')
        setStationId('')
        fetchOwners()
      }
    } catch (error) {
      setResponseMsg(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    }
  }

  const handleDeleteOwner = async (id: string) => {
    try {
      const { error } = await supabase.from('User').delete().eq('id', id)
      if (error) {
        console.error('Failed to delete owner:', error.message)
      } else {
        fetchOwners()
      }
    } catch (error) {
      console.error('Error deleting owner:', error)
    }
  }

  if (loading) return <p className="p-6">Loading your dashboard...</p>

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">👋 Welcome, {userData?.name || 'User'}</h1>
        <p className="text-gray-600">Your role: <strong>{userData?.role}</strong></p>
        <Button variant="destructive" onClick={handleLogout}>Log out</Button>
      </div>

      <Card className="max-w-xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold mb-2">Add New Owner</h2>
          <Label>Email</Label>
          <Input type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} required />
          <Label>Name</Label>
          <Input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
          <Label>Station ID</Label>
          <Input type="text" value={stationId} onChange={(e) => setStationId(e.target.value)} required />
          <Button className="mt-4" onClick={handleAddOwner}>Add Owner</Button>
          {responseMsg && <p className="text-sm mt-2">{responseMsg}</p>}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Input
          placeholder="Search owners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Station ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOwners.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell>
                  <Input 
                    value={editingValues[owner.id]?.name || owner.name}
                    onChange={(e) => setEditingValues(prev => ({
                      ...prev,
                      [owner.id]: { ...prev[owner.id], name: e.target.value }
                    }))}
                    onBlur={(e) => handleEditOwner(owner.id, 'name', e.target.value)}
                  />
                </TableCell>
                <TableCell>{owner.email}</TableCell>
                <TableCell>
                  <Input 
                    value={editingValues[owner.id]?.stationId || owner.stationId}
                    onChange={(e) => setEditingValues(prev => ({
                      ...prev,
                      [owner.id]: { ...prev[owner.id], stationId: e.target.value }
                    }))}
                    onBlur={(e) => handleEditOwner(owner.id, 'stationId', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteOwner(owner.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center items-center gap-4 mt-4">
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</Button>
          <span>Page {currentPage}</span>
          <Button onClick={() => setCurrentPage((prev) => (currentPage * PAGE_SIZE < filteredOwners.length ? prev + 1 : prev))} disabled={currentPage * PAGE_SIZE >= filteredOwners.length}>Next</Button>
        </div>
      </div>
    </div>
  )
}

export default ServiceProviderDashboard