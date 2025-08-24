// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iirswnbvfmkydfebwtoa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcnN3bmJ2Zm1reWRmZWJ3dG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMTEwMTUsImV4cCI6MjA3MTU4NzAxNX0.OU8GyEf5OZGrFMlHiewMLBl1ecbfnwnq55Ink7Be6OU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
