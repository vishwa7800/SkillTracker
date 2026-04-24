// ================================================

const SUPABASE_URL  = 'https://aqjtgiwivnqlbskvpjxo.supabase.co';   // e.g. https://xxxx.supabase.co
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxanRnaXdpdm5xbGJza3ZwanhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjkxNjAsImV4cCI6MjA5MjQ0NTE2MH0.quqHM3Ooy-uioVt2nIOSQvBwVsx4qTXLHU6QQPFctpA';       // starts with eyJ...

// Initialise the Supabase client (available globally as `sb`)
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    autoRefreshToken: true,
    persistSession:  true,          // keeps user logged in after page reload
    detectSessionInUrl: false       // we don't use email confirmation links
  }
});
