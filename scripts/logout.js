require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // or use ANON key if it's from client
)

async function logoutUser() {
  // Note: This only works client-side for session-based auth.
  // Server-side logout has no effect unless tied to a session token.

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('❌ Logout failed:', error.message)
  } else {
    console.log('✅ Logged out successfully.')
  }
}

logoutUser()
