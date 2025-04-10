import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, name, stationId } = body

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: 'default123',
    email_confirm: true
  })

  if (authError) {
    return new Response(JSON.stringify({ error: authError.message }), { status: 400 })
  }

  const { error: dbError } = await supabase.from('User').insert({
    id: authData.user.id,
    email,
    name,
    role: 'OWNER',
    stationId
  })

  if (dbError) {
    return new Response(JSON.stringify({ error: dbError.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}
