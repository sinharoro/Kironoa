import { createClient } from '@supabase/supabase-js'

// ⚠️  Move these to .env.local — never commit real keys
// NEXT_PUBLIC_SUPABASE_URL=your_url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? ''
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export type CalendarNote = {
  id?: string
  user_id: string
  date_key: string  // format: "YYYY-M-D"
  note_text: string
}
