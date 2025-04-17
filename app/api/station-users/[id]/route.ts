import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const VALID_ROLES = ['ACCOUNTANT', 'EMPLOYEE', 'CUSTOMER']

type Context = {
  params: Promise<{ id: string }>
}

export async function PUT(req: Request, context: Context) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role and stationId
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', session.user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only managers can update users
    if (userData.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { name, phone, email, role } = await req.json()

    // Validate input data
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    // Validate role if provided
    if (role && !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if the user exists and belongs to the manager's station
    const { data: targetUser, error: targetError } = await supabase
      .from('User')
      .select('id, role, stationId')
      .eq('id', await context.params)
      .eq('stationId', userData.stationId)
      .in('role', VALID_ROLES)
      .single()

    if (targetError || !targetUser) {
      return NextResponse.json({ error: 'User not found or unauthorized' }, { status: 404 })
    }

    // Update the user's details
    const { data, error } = await supabase
      .from('User')
      .update({ 
        name, 
        phone,
        ...(email && { email }),
        ...(role && { role })
      })
      .eq('id', await context.params)
      .eq('stationId', userData.stationId)
      .select()
      .single()

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

export async function DELETE(req: Request, context: Context) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role and stationId
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', session.user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only managers can delete users
    if (userData.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if the user exists and belongs to the manager's station
    const { data: targetUser, error: targetError } = await supabase
      .from('User')
      .select('id, role, stationId')
      .eq('id', await context.params)
      .eq('stationId', userData.stationId)
      .in('role', VALID_ROLES)
      .single()

    if (targetError || !targetUser) {
      return NextResponse.json({ error: 'User not found or unauthorized' }, { status: 404 })
    }

    // Delete the user from User table
    const { error } = await supabase
      .from('User')
      .delete()
      .eq('id', await context.params)
      .eq('stationId', userData.stationId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
} 