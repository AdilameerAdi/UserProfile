// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jgeddimrwlbrnuzvmyhx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnZWRkaW1yd2xicm51enZteWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjQ3MjAsImV4cCI6MjA3MTYwMDcyMH0.xRICvuyenpBFsbLe_isBODmUQf2VwYO5ZrpkOlAgVQ0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      // Custom storage that doesn't persist anything
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    },
    persistSession: false // Don't persist sessions
  }
});
