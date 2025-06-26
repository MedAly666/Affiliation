import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_KEY } from '$env/static/private';

const supabaseUrl = SUPABASE_URL || '';
const supabaseKey = SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided');
}
if (supabaseUrl === '' || supabaseKey === '') {
  throw new Error('Supabase URL and Key cannot be empty');
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;