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

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', session.user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (userData.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { name, phone, email } = await req.json()

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
    }

    const { data: managerData, error: managerError } = await supabase
      .from('User')
      .select('id, role, stationId')
      .eq('id', id)
      .eq('role', 'MANAGER')
      .eq('stationId', userData.stationId)
      .single()

    if (managerError || !managerData) {
      return NextResponse.json({ error: 'Manager not found or unauthorized' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('User')
      .update({
        name,
        phone,
        ...(email && { email })
      })
      .eq('id', id)
      .eq('role', 'MANAGER')
      .eq('stationId', userData.stationId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (email) {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
      })

      if (resetError) {
        console.error('Error sending password reset email:', resetError.message)
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

export async function DELETE(req: Request, context: Context) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { id } = await context.params

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role, stationId')
      .eq('id', session.user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (userData.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data: managerData, error: managerError } = await supabase
      .from('User')
      .select('id, role, stationId')
      .eq('id', id)
      .eq('role', 'MANAGER')
      .eq('stationId', userData.stationId)
      .single()

    if (managerError || !managerData) {
      return NextResponse.json({ error: 'Manager not found or unauthorized' }, { status: 404 })
    }

    const { error } = await supabase
      .from('User')
      .delete()
      .eq('id', id)
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
