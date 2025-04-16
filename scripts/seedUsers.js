require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Verify service role key is present
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in .env file');
  process.exit(1);
}

console.log('Using Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Service role key starts with:', process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Define valid roles from Prisma schema
const VALID_ROLES = [
  'SERVICE_PROVIDER',
  'OWNER',
  'MANAGER',
  'ACCOUNTANT',
  'EMPLOYEE',
  'CUSTOMER'
];

async function seed() {
  // Test the connection with service role
  const { data: testData, error: testError } = await supabase
    .from('User')
    .select('count')
    .limit(1);

  if (testError) {
    console.error('❌ Test connection failed:', testError);
    console.error('Make sure you are using the correct service role key');
    return;
  }

  console.log('✅ Successfully connected with service role');

  const users = [
    {
      email: 'service@fuelops.com',
      password: 'angel123',
      role: 'SERVICE_PROVIDER',
      name: 'Service Provider',
      phone: '+94711234567',
    },
    {
      email: 'owner@fuelops.com',
      password: 'angel123',
      role: 'OWNER',
      name: 'Station Owner',
      phone: '+94719876543',
    },
    {
      email: 'manager@fuelops.com',
      password: 'angel123',
      role: 'MANAGER',
      name: 'Station Manager',
      phone: '+94700011223',
    },
    {
      email: 'accountant@fuelops.com',
      password: 'angel123',
      role: 'ACCOUNTANT',
      name: 'Station Accountant',
      phone: '+94700011224',
    },
    {
      email: 'employee@fuelops.com',
      password: 'angel123',
      role: 'EMPLOYEE',
      name: 'Station Employee',
      phone: '+94700011225',
    },
    {
      email: 'customer@fuelops.com',
      password: 'angel123',
      role: 'CUSTOMER',
      name: 'Customer',
      phone: '+94781122334',
    }
  ];

  // Verify all roles are valid
  const invalidRoles = users.filter(user => !VALID_ROLES.includes(user.role));
  if (invalidRoles.length > 0) {
    console.error('❌ Invalid roles found:', invalidRoles.map(u => u.role));
    return;
  }

  for (const user of users) {
    try {
      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('User')
        .select('*')
        .eq('email', user.email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error(`❌ Error checking user ${user.email}:`, fetchError.message);
        continue;
      }

      if (existingUser) {
        // Update existing user
        const { error: updateError } = await supabase
          .from('User')
          .update({
            role: user.role,
            name: user.name,
            phone: user.phone,
            stationId: null
          })
          .eq('id', existingUser.id);

        if (updateError) {
          console.error(`❌ Failed to update user ${user.email}:`, updateError.message);
        } else {
          console.log(`✅ Updated existing user: ${user.email}`);
        }
      } else {
        // Create new auth user
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          phone: user.phone,
          user_metadata: {
            name: user.name,
            role: user.role
          }
        });

        if (authError) {
          console.error(`❌ Failed to create auth user ${user.email}:`, authError.message);
          continue;
        }

        console.log(`✅ Created auth user: ${user.email}`);

        // Create user in User table
        const { error: dbError } = await supabase
          .from('User')
          .insert([
            {
              id: authUser.user.id,
              email: user.email,
              role: user.role,
              name: user.name,
              phone: user.phone,
              stationId: null
            }
          ]);

        if (dbError) {
          console.error(`❌ Failed to insert ${user.email} into User table:`, dbError.message);
        } else {
          console.log(`✅ Created user in User table: ${user.email}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing user ${user.email}:`, error.message);
    }
  }
}

seed();
