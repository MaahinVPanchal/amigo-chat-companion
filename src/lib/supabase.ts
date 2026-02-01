import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wanxzrrtvfofboowabkq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhbnh6cnJ0dmZvZmJvb3dhYmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MjE4NzAsImV4cCI6MjA1Mzk5Nzg3MH0.qa6px4nMTjIA8phxkSeOsA_fiKgct5_'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)