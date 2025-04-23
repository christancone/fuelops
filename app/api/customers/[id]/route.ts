import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type Context = {
  params: Promise<{ id: string }>
}

export async function PUT(req: Request, context: Context) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { id } = await context.params
    const { name, email, phone } = await req.json()

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
      .update({ name, email, phone })
      .eq('id', id)
      .eq('stationId', userData.stationId)

    if (updateError) {
      console.error('Error updating customer:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Customer updated successfully' })
  } catch (error) {
    console.error('Unexpected error in PUT /customers/[id]:', error)
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

    // Check if the customer exists and belongs to the manager's station
    const { data: customerToDelete, error: customerCheckError } = await supabase
      .from('User')
      .select('id')
      .eq('id', id)
      .eq('stationId', userData.stationId)
      .single()

    if (customerCheckError || !customerToDelete) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const { error: deleteError } = await supabase
      .from('User')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting customer:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Unexpected error in DELETE /customers/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 