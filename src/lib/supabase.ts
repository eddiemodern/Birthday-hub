import { createClient } from '@supabase/supabase-js'

const meta = import.meta as any
const supabaseUrl = meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
