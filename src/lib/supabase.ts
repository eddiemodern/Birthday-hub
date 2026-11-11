import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as Record<string, any>).env?.VITE_SUPABASE_URL || ''
const supabaseAnonKey = (import.meta as Record<string, any>).env?.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
