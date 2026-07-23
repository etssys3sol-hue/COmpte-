import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Checking token and querying tables...");
  const { data, error } = await supabase.functions.invoke("establishment-login", {
    body: { identifier: "LOKOSSA" }
  });
  
  if (data?.token_hash) {
    const { data: authData } = await supabase.auth.verifyOtp({
      token_hash: data.token_hash,
      type: "email"
    });
    
    if (authData?.session) {
      // Let's query common table names
      const tables = ['users', 'profiles', 'establishments', 'user_roles', 'auth_context'];
      for (const t of tables) {
        const { data: td, error: te } = await supabase.from(t).select('*').limit(1);
        console.log(`Table ${t}:`, !!td, te?.message);
      }
    }
  }
}
test();
