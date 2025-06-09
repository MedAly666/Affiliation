import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';


if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided');
}
if (supabaseUrl === '' || supabaseKey === '') {
  throw new Error('Supabase URL and Key cannot be empty');
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;