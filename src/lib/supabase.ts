import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wanxzrrtvfofboowabkq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhbnh6cnJ0dmZvZmJvb3dhYmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjAyMjEsImV4cCI6MjA4NTQ5NjIyMX0.4rz8pL_-7RrhuKkEYiMVG13xV8rvl4FtIqppCSWo5vY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)