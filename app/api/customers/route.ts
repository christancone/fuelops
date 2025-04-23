import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's role and station ID
    const { data: userData, error: userDataError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', user.id)
      .single()

    if (userDataError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only managers can access this endpoint
    if (userData.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get all customers for the manager's station
    const { data: customers, error: customersError } = await supabase
      .from('User')
      .select('id, email, name, phone, stationId')
      .eq('role', 'CUSTOMER')
      .eq('stationId', userData.stationId)

    if (customersError) {
      console.error('Error fetching customers:', customersError)
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
    }

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error in GET /api/customers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('Auth error:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's role and station ID
    const { data: userData, error: userDataError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', user.id)
      .single()

    if (userDataError || !userData) {
      console.error('User data error:', userDataError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only managers can create customers
    if (userData.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { email, name, phone } = await request.json()

    // Validate required fields
    if (!email || !name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if email already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      console.error('Email check error:', existingUserError)
      return NextResponse.json({ error: 'Error checking email' }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    // Create the customer - let Supabase generate the UUID
    const { data: newCustomer, error: createError } = await supabase
      .from('User')
      .insert({
        id: crypto.randomUUID(),
        email,
        name,
        phone,
        role: 'CUSTOMER',
        stationId: userData.stationId,
        createdAt: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('Create customer error:', createError)
      return NextResponse.json({ 
        error: 'Failed to create customer',
        details: createError.message 
      }, { status: 500 })
    }

    if (!newCustomer) {
      console.error('No customer data returned')
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
    }

    return NextResponse.json(newCustomer)
  } catch (error) {
    console.error('Error in POST /api/customers:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 