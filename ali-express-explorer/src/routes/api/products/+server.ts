import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Import the server-side Supabase client
import supabase from "$lib/supabase";

export const GET: RequestHandler = async ({ url }) => {
  // Get query parameters
  const limit = Number(url.searchParams.get('limit') || '20000');
  const page = Number(url.searchParams.get('page') || '1');
  const offset = (page - 1) * limit;

  // Calculate the time 48 hours ago
  // This will be used to filter products created in the last 48 hours
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  // Query products from Supabase using the server-side client
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .gte('updated_at', fortyEightHoursAgo)
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  

  return json(data);
};
