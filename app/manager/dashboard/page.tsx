'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'

export default function ManagerDashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

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
        .select('name, role')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Failed to fetch user data:', error.message)
      } else {
        setUserData({ name: data.name, role: data.role })
      }

      setLoading(false)
    }

    fetchUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <p className="p-6">Loading your dashboard...</p>
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">👋 Welcome, {userData?.name || 'User'}</h1>
      <p className="text-gray-600">Your role: <strong>{userData?.role}</strong></p>
      <Button variant="destructive" onClick={handleLogout}>
        Log out
      </Button>
    </div>
  )
} 