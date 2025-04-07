require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(`❌ Login failed for ${email}:`, error.message);
    return;
  }

  console.log(`✅ Logged in as ${email}`);
  console.log('Session:', data.session);

  const userId = data.user.id;
  console.log('🔍 Looking up user ID:', userId);

  const { data: userData, error: dbError } = await supabase
    .from('User')
    .select('id, email, role')
    .eq('id', userId)
    .maybeSingle();

  if (dbError) {
    console.error(`❌ DB error:`, dbError.message);
    return;
  }

  if (!userData) {
    console.error('❌ No matching row found in User table.');
    return;
  }

  console.log(`🔐 Role: ${userData.role}`);
}

testLogin('you@example.com', 'angel123');
