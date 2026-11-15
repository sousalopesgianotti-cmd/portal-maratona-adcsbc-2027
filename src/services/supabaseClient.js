import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xutstrsdancxczbtsnxt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1dHN0cnNkYW5jeGN6YnRzbnh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3NTk0MzMsImV4cCI6MjEwNzMzNTQzM30.jlHUSN-NuMqfOTW2EP3-t_kQ84QbLKzxAnlXX1JrTiI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
