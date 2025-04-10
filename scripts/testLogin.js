require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use the correct keys: use service role only for admin tasks
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testLogin(email, password) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error(`❌ Login failed for ${email}:`, authError.message);
    return;
  }

  console.log(`✅ Logged in as ${email}`);
  console.log('🪪 Session:', authData.session);

  const userId = authData.user.id;
  console.log('🔍 Looking up user ID:', userId);

  const { data: userData, error: dbError } = await supabase
    .from('User')
    .select('id, email, role, name, phone, stationId')
    .eq('id', userId)
    .maybeSingle();

  if (dbError) {
    console.error(`❌ DB error while fetching user details:`, dbError.message);
    return;
  }

  if (!userData) {
    console.error('❌ No matching user found in the User table.');
    return;
  }

  console.log(`🔐 Role: ${userData.role}`);
  console.log(`🧑 Name: ${userData.name}`);
  console.log(`📱 Phone: ${userData.phone}`);
  console.log(`🏪 Station ID: ${userData.stationId}`);
}

testLogin('owner@fuelops.com', 'angel123');
