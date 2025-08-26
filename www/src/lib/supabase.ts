import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

const supabaseUrl = PUBLIC_SUPABASE_URL || '';
const supabaseKey = PUBLIC_SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided');
}
if (supabaseUrl === '' || supabaseKey === '') {
  throw new Error('Supabase URL and Key cannot be empty');
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;