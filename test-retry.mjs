import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@ddestfp.bj',
    password: 'admin' // just seeing if admin login works
  });
  console.log(data, error);
}
test();
