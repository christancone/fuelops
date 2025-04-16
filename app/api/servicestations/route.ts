import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || (userData.role !== 'SERVICE_PROVIDER' && userData.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('Station')
      .select('*')

    if (error) {
      console.error('Error fetching stations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error in GET stations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { name, location } = await request.json()

    console.log('Creating station with:', { name, location })

    // Get the current session first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 })
    }

    if (!session) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 })
    }

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (userError) {
      console.error('User fetch error:', userError)
      return NextResponse.json({ error: 'Error fetching user data' }, { status: 500 })
    }

    if (!userData || (userData.role !== 'SERVICE_PROVIDER' && userData.role !== 'ADMIN')) {
      console.error('User is not authorized:', userData)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create station
    const { data, error } = await supabase
      .from('Station')
      .insert({
        name,
        location
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating station:', error)
      if (error.code === '42501') {
        return NextResponse.json({ 
          error: 'Permission denied. Please ensure your user has the correct database permissions.' 
        }, { status: 403 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Successfully created station:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error in POST stations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 