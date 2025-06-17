import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import supabase from "$lib/supabase";

export const GET: RequestHandler = async ({ url }) => {
  const productId = url.searchParams.get('productId');
  
  if (!productId) {
    return json({ error: 'Product ID is required' }, { status: 400 });
  }

  // Query reviews from Supabase
  const { data, error } = await supabase
    .from('reviews')
    .select('rating, content')
    .eq('product_id', productId);
  
  if (error) {
    console.error('Error fetching product reviews:', error);
    return json({ error: error.message }, { status: 500 });
  }

  return json(data || []);
};
