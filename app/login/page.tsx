'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    const userId = data.user.id

    const { data: userMeta, error: userError } = await supabase
      .from('User')
      .select('role')
      .eq('id', userId)
      .single()

    if (userError) {
      setError(userError.message)
      setLoading(false)
      return
    }

    const role = userMeta.role

    setRedirecting(true)

    // ✅ Redirect based on role
    if (role === 'ADMIN') router.push('/admin/dashboard')
    else if (role === 'SUPERADMIN') router.push('/superadmin/dashboard')
    else if (role === 'EMPLOYEE') router.push('/employee/dashboard')
    else if (role === 'SERVICE_PROVIDER') router.push('/service/dashboard')
    else {
      setError('Unknown role')
      setRedirecting(false)
    }

    setLoading(false)
  }

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm text-gray-600">Redirecting to your dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-xl border border-gray-200">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">FuelOps Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
