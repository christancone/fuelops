import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const VALID_ROLES = ['ACCOUNTANT', 'EMPLOYEE', 'CUSTOMER']

interface UserData {
  id: string
  email: string
  name: string
  phone: string
  role: string
  stationId: string
}

interface AuthResponse {
  user: {
    id: string
  } | null
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role and stationId
    const { data: managerData, error: userError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', session.user.id)
      .single()

    if (userError || !managerData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only managers can view users
    if (managerData.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get users from the manager's station
    const { data, error } = await supabase
      .from('User')
      .select('id, email, name, phone, role, stationId')
      .eq('stationId', managerData.stationId)
      .in('role', VALID_ROLES)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// Add email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role and stationId
    const { data: managerData, error: userError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', session.user.id)
      .single()

    if (userError || !managerData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only managers can create users
    if (managerData.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { email, name, phone, role } = await request.json()

    // Validate input data
    if (!email || !name || !phone || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      )
    }

    // Create user with default password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: 'angel123',
      options: {
        data: {
          name,
          phone,
          role,
          stationId: managerData.stationId
        }
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
    }

    // Create user record in User table
    const { data, error } = await supabase
      .from('User')
      .insert({
        id: authData.user.id,
        email,
        name,
        phone,
        role,
        stationId: managerData.stationId
      })
      .select()
      .single()

    if (error) {
      // If User table insert fails, we can't delete the auth user without admin privileges
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 