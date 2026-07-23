import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Invoking establishment-login with AKODEHA...");
  const { data, error } = await supabase.functions.invoke("establishment-login", {
    body: { identifier: "AKODEHA" }
  });
  console.log("Result:", data, error);
  
  if (data?.token_hash) {
    console.log("Got token hash, verifying...");
    const { data: authData, error: authError } = await supabase.auth.verifyOtp({
      token_hash: data.token_hash,
      type: "email"
    });
    console.log("Auth Data:", !!authData.session, "Error:", authError);
    
    if (authData.session) {
      console.log("Fetching context...");
      const { data: ctx, error: ctxErr } = await supabase.rpc("get_current_user_context");
      console.log("Context:", JSON.stringify(ctx, null, 2), "Error:", ctxErr);
    }
  }
}
test();
