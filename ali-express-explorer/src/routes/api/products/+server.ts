import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import supabase from "$lib/supabase";



export const GET: RequestHandler = async ({ url }) => {
  // Get query parameters
  const limit = Number(url.searchParams.get('limit') || '20');
  const page = Number(url.searchParams.get('page') || '1');
  const offset = (page - 1) * limit;
  
  // Query products from Supabase
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
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
