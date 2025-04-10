require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
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

  for (const user of users) {
    try {
      // Create auth user
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
        console.error('Error details:', dbError);
      } else {
        console.log(`✅ Created user in User table: ${user.email}`);
      }
    } catch (error) {
      console.error(`❌ Error processing user ${user.email}:`, error.message);
    }
  }
}

seed();
