import type { PageLoad } from './$types';
import type { Product, Review } from '$lib/index';

export const load: PageLoad = async ({ params }) : Promise<{ products: Product[]; error?: string }> => {
    let products: Product[] = [];

	try {
      const response = await fetch('./api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      products = await response.json();
      console.log('Products fetched successfully:', products.length + ' products found');
      
      for (const product of products) {
        try {
            const response = await fetch(`./api/product-reviews?productId=${product.product_id}`);
            const reviews = await response.json();
            console.log(`Reviews for product ${product.product_id}:`, reviews);
            
            product.nb_reviews = reviews.length;
            product.avg_rating = reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length || 0;
        } catch (error) {
            console.error(`Error fetching reviews for product ${product.product_id}:`, error);
        }
      }
    } catch (err) {
        return {
            products: [] as Product[],
            error: 'Failed to load products'
        };
    }

    console.log('Products loaded: ', products.length + ' products found');
    
    return {
        products: products as Product[] || [],
    };
};