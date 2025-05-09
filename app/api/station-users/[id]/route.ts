import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type Context = {
  params: Promise<{ id: string }>
}

export async function PUT(req: Request, context: Context) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { id } = await context.params
    const { name, email, phone, role } = await req.json()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

    if (!userData || userData.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if email is already in use by another user
    const { data: existingUser } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .neq('id', id)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase
      .from('User')
      .update({ name, email, phone, role })
      .eq('id', id)
      .eq('stationId', userData.stationId)

    if (updateError) {
      console.error('Error updating user:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'User updated successfully' })
  } catch (error) {
    console.error('Unexpected error in PUT /station-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, context: Context) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { id } = await context.params

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

    if (!userData || userData.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if the user exists and belongs to the manager's station
    const { data: userToDelete, error: userCheckError } = await supabase
      .from('User')
      .select('id')
      .eq('id', id)
      .eq('stationId', userData.stationId)
      .single()

    if (userCheckError || !userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create a new Supabase client instance with service role key for auth operations
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Delete user from auth table
    const { error: authError } = await authClient.auth.admin.deleteUser(id)
    if (authError) {
      console.error('Error deleting user from auth:', authError)
      return NextResponse.json({ error: 'Failed to delete user from auth' }, { status: 500 })
    }

    const { error: deleteError } = await supabase
      .from('User')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Unexpected error in DELETE /station-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 