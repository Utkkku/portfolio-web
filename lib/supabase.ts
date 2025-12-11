import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. File system fallback will be used.')
}

// Public client for read operations (uses anon key, RLS enabled)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Admin client for write operations (uses service_role key, bypasses RLS)
// Only use this in API routes with admin authentication
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Database table types
export interface CertificateRow {
  id?: number
  name: string
  issuer: string
  date: string
  verify_url?: string
  image?: string
  created_at?: string
  updated_at?: string
}

export interface ProjectRow {
  id?: number
  title: string
  description: string
  technologies: string[]
  image?: string
  link?: string
  github?: string
  featured?: boolean
  created_at?: string
  updated_at?: string
}

export interface SkillRow {
  id?: number
  name: string
  level: number
  created_at?: string
  updated_at?: string
}

