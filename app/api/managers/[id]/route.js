import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PUT(request, context) {
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

    // Only owners can update managers
    if (userData.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { name, phone, email } = await request.json()

    // Validate input data
    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    // Check if the manager exists and belongs to the owner's station
    const { data: managerData, error: managerError } = await supabase
      .from('User')
      .select('id, role, stationId')
      .eq('id', context.params.id)
      .eq('role', 'MANAGER')
      .eq('stationId', userData.stationId)
      .single()

    if (managerError || !managerData) {
      return NextResponse.json({ error: 'Manager not found or unauthorized' }, { status: 404 })
    }

    // Update the manager's details in the User table
    const { data, error } = await supabase
      .from('User')
      .update({ 
        name, 
        phone,
        ...(email && { email }) // Only include email if it's being updated
      })
      .eq('id', context.params.id)
      .eq('role', 'MANAGER')
      .eq('stationId', userData.stationId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // If email is being updated, send a password reset email to the manager
    if (email) {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
      })

      if (resetError) {
        console.error('Error sending password reset email:', resetError)
        // Don't fail the request if password reset email fails
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, context) {
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

    // Only owners can delete managers
    if (userData.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if the manager exists and belongs to the owner's station
    const { data: managerData, error: managerError } = await supabase
      .from('User')
      .select('id, role, stationId')
      .eq('id', context.params.id)
      .eq('role', 'MANAGER')
      .eq('stationId', userData.stationId)
      .single()

    if (managerError || !managerData) {
      return NextResponse.json({ error: 'Manager not found or unauthorized' }, { status: 404 })
    }

    // Delete the manager from User table
    const { error } = await supabase
      .from('User')
      .delete()
      .eq('id', context.params.id)
      .eq('role', 'MANAGER')
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