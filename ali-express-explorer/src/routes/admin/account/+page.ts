import type { PageLoad } from './$types';
import type { Product } from "$lib/types";

export const load: PageLoad = async ({ params }): Promise<{ products: Product[]; error: string | null; loading: boolean }> => {
    let products: Product[] = [];
    let loading: boolean = true;

    try {
        const response = await fetch('./api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        products = await response.json();
        console.log('Products fetched successfully:', products.length + ' products found');

    } catch (err) {
        return {
            products: [] as Product[],
            error: 'Failed to load products',
            loading: false
        };
    }

    console.log('Products loaded: ', products.length + ' products found');
    console.log(products);


    return {
        products: products as Product[] || [],
        error: null,
        loading: false,
    };
};