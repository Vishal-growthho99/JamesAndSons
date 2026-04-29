require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@jamesandsons.com',
    password: 'password123',
    email_confirm: true
  });
  
  if (error) {
    console.error('Error creating user:', error);
  } else {
    console.log('User created successfully:', data.user.id);
  }
}

createAdmin();
