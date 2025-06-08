import type { PageLoad } from './$types';
import type { Product } from '$lib/index';

export const load: PageLoad = async ({ params }) : Promise<{ products: Product[]; error?: string }> => {
    let products: Product[] = [];

	try {
      const response = await fetch('./api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      products = await response.json();
    } catch (err) {
        return {
            products: [] as Product[],
            error: 'Failed to load products'
        };
    }

    console.log('Products loaded:', products);
    
    return {
        products : products as Product[] || [],
    };
};