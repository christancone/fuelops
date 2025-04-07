require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  const users = [
    { email: 'admin@example.com', password: 'angel123', role: 'ADMIN' },
    { email: 'superadmin@example.com', password: 'angel123', role: 'SUPERADMIN' },
    { email: 'employee@example.com', password: 'angel123', role: 'EMPLOYEE' },
    { email: 'you@example.com', password: 'angel123', role: 'SERVICE_PROVIDER' },
  ];

  for (const user of users) {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (authError) {
      console.error(`❌ Failed to create auth user ${user.email}:`, authError.message);
      continue;
    }

    const { data: dbUser, error: dbError } = await supabase
      .from('User')
      .insert([
        {
          id: authUser.user.id,
          email: user.email,
          role: user.role,
        },
      ]);

    if (dbError) {
      console.error(`❌ Failed to insert ${user.email} into User table:`, dbError.message);
    } else {
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }
  }
}

seed();
