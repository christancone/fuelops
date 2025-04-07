'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      // Get role from your custom User table
      const { data: userData } = await supabase
        .from('User')
        .select('role')
        .eq('email', email)
        .single()

      switch (userData?.role) {
        case 'SUPERADMIN':
          router.push('/superadmin/dashboard')
          break
        case 'ADMIN':
          router.push('/admin/dashboard')
          break
        case 'EMPLOYEE':
          router.push('/employee/dashboard')
          break
        case 'SERVICE_PROVIDER':
          router.push('/service/dashboard')
          break
        default:
          setError('Unknown role')
      }
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-xl font-semibold">Login</h1>
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white w-full py-2 rounded"
      >
        Log In
      </button>
    </div>
  )
}
