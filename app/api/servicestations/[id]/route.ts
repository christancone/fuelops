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
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user role
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is a service provider
    if (userData.role !== 'SERVICE_PROVIDER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { name, location } = await req.json()

    // Update the station
    const { data, error } = await supabase
      .from('Station')
      .update({ name, location })
      .eq('id', id)
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