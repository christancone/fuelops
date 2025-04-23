import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const VALID_ROLES = ['ACCOUNTANT', 'EMPLOYEE']

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Session:', session) // Debug log

    if (!session) {
      console.log('No session found') // Debug log
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role and stationId
    const { data: managerData, error: managerError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', session.user.id)
      .single()

    console.log('Manager data:', managerData) // Debug log
    console.log('Manager error:', managerError) // Debug log

    if (managerError) {
      console.error('Error fetching manager data:', managerError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!managerData) {
      console.log('No manager data found') // Debug log
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only managers can view users
    if (managerData.role !== 'MANAGER') {
      console.log('User is not a manager, role:', managerData.role) // Debug log
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get users from the manager's station (excluding customers)
    const { data, error } = await supabase
      .from('User')
      .select('id, email, name, phone, role, stationId')
      .eq('stationId', managerData.stationId)
      .in('role', VALID_ROLES)

    console.log('Users data:', data) // Debug log
    console.log('Users error:', error) // Debug log

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/station-users:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the manager's data to verify role and get station ID
    const { data: managerData, error: managerError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', user.id)
      .single()

    if (managerError || !managerData) {
      return NextResponse.json({ error: 'Manager not found' }, { status: 404 })
    }

    if (managerData.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Only managers can create users' }, { status: 403 })
    }

    const { name, email, phone, role } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !role) {
      return NextResponse.json(
        { error: 'Name, email, phone, and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['EMPLOYEE', 'ACCOUNTANT'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be either EMPLOYEE or ACCOUNTANT' },
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
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    // Create a new Supabase client instance for user creation
    const createUserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Create user with default password
    const { data: authData, error: authError } = await createUserClient.auth.signUp({
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
      console.error('Error creating auth user:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
    }

    // Create user record in User table
    const { data: newUser, error: createError } = await supabase
      .from('User')
      .insert({
        id: authData.user.id,
        name,
        email,
        phone,
        role,
        stationId: managerData.stationId
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/station-users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 