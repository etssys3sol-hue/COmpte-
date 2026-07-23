import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Invoking establishment-login with LOKOSSA (or similar)");
  // Let's try cm_athieme
  const codes = ["ATHIEME", "LOKOSSA", "AKODEHA"];
  let data, error;
  for (const code of codes) {
     const res = await supabase.functions.invoke("establishment-login", { body: { identifier: code } });
     if (res.data?.token_hash) { data = res.data; break; }
  }
  
  if (data?.token_hash) {
    const { data: authData } = await supabase.auth.verifyOtp({ token_hash: data.token_hash, type: "email" });
    if (authData?.user) {
      console.log("User Meta:", authData.user.user_metadata);
      console.log("App Meta:", authData.user.app_metadata);
    }
  }
}
test();
