import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔵 Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
console.log('🔵 Supabase Key:', supabaseAnonKey ? '✅ Found' : '❌ Missing')

// Don't throw error - just create a dummy client if missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables. Using placeholder client.')
  console.warn('⚠️ Make sure .env file exists and restart dev server with: npm run dev')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Types for database tables
export type Profile = {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export type RoomListing = {
  id: string
  user_id: string | null
  title: string
  description: string | null
  location: string
  price: number
  bills_included: boolean | null
  room_type: string
  available_from: string | null
  minimum_stay: string | null
  amenities: string[] | null
  photos: string[] | null
  ai_score: number | null
  ai_analysis: any | null
  status: string | null
  created_at: string
  updated_at: string
}

export type Review = {
  id: string
  room_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  sender_id: string
  receiver_id: string
  room_id: string | null
  content: string
  read: boolean | null
  created_at: string
}

export type Booking = {
  id: string
  room_id: string | null
  user_id: string
  owner_id: string
  booking_type: string
  preferred_date: string
  preferred_time: string
  message: string | null
  status: string | null
  created_at: string
  updated_at: string
}

export type FlatmateProfile = {
  id: string
  user_id: string
  looking_for_room: boolean | null
  budget_min: number | null
  budget_max: number | null
  preferred_location: string | null
  move_in_date: string | null
  occupation: string | null
  age_range: string | null
  lifestyle_preferences: any | null
  bio: string | null
  created_at: string
  updated_at: string
}