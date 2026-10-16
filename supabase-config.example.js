// ================================================
//  supabase-config.example.js
//  Copy this file to `supabase-config.js` for local development.
//  Do NOT commit `supabase-config.js` to git (it is ignored by .gitignore).
// ================================================

const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY_HERE';
const SUPABASE_ANON_KEY = SUPABASE_ANON; // alias for compatibility
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';

// Initialize the Supabase client globally as `sb` if supabase-js library is loaded
if (typeof supabase !== 'undefined' && SUPABASE_URL && SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE') {
  window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });
}
