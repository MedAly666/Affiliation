import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_KEY } from '$env/static/private';

const supabaseUrl = process.env.SUPABASE_URL || SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || SUPABASE_KEY || '';


if (!supabaseUrl || !supabaseKey) {
  throw new Error('scrapper : Supabase URL and Key must be provided');
}
if (supabaseUrl === '' || supabaseKey === '') {
  throw new Error('scrapper : Supabase URL and Key cannot be empty');
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;