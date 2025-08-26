import type { Product, QueryOptions } from "$lib/types";
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
    // Extract search parameters
    const keywords = url.searchParams.get('keywords') || '';
    const min_sale_price = url.searchParams.get('min_sale_price');
    const max_sale_price = url.searchParams.get('max_sale_price');
    const sortByType = url.searchParams.get('sortByType');

    // Build query parameters - only include defined values
    const params: QueryOptions = {
        page_no: 1,
        page_size: 25,
        sort: (() => {
            const allowedSorts = ['SALE_PRICE_ASC', 'SALE_PRICE_DESC', 'LAST_VOLUME_ASC', 'LAST_VOLUME_DESC'] as const;
            if (sortByType && allowedSorts.includes(sortByType as typeof allowedSorts[number])) {
                return sortByType as typeof allowedSorts[number];
            }
            return 'SALE_PRICE_DESC';
        })()
    };

    // Only add optional parameters if they have values
    if (min_sale_price && !isNaN(Number(min_sale_price))) {
        params.min_sale_price = Number(min_sale_price);
    }

    if (max_sale_price && !isNaN(Number(max_sale_price))) {
        params.max_sale_price = Number(max_sale_price);
    }

    if (keywords) {
        params.keywords = keywords;
    }

    // Determine if this is an advanced search
    const isAdvancedSearch = !!(min_sale_price || max_sale_price || (sortByType && sortByType !== 'SALE_PRICE_DESC'));



    // API fetch function that uses the passed fetch parameter
    async function fetchProducts(queryParams: QueryOptions): Promise<Product[]> {
        try {

            const response = await fetch('./api/products?' + new URLSearchParams(queryParams as Record<string, string>));

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.products || data || []; // Handle different response structures
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    async function fetchHotProducts(queryParams: QueryOptions): Promise<Product[]> {
        try {
            const response = await fetch('./api/hot-products?' + new URLSearchParams(queryParams as Record<string, string>));


            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            return data.products || data || []; // Handle different response structures
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    let products: Product[] = [];
    let hotProducts: Product[] = [];

    try {


        if (keywords) {
            // Load search results
            products = await fetchProducts(params);

        } else {
            // Load hot products for homepage
            hotProducts = await fetchHotProducts({
                page_no: 1,
                page_size: 25,
                keywords: 'watch,xiaomi,poco',
                sort: 'LAST_VOLUME_DESC'
            });

        }

        return {
            streamed: {
                products,
                hotProducts
            },
            keywords,
            isAdvancedSearch,
            min_sale_price: params.min_sale_price,
            max_sale_price: params.max_sale_price,
            sort: params.sort,
            hasResults: products.length > 0,
            totalResults: products.length,
            // Pass the fetch function to be used in components
            loadMoreProducts: async (page: number) => {
                return await fetchProducts({
                    ...params,
                    page_no: page
                });
            }
        };
    } catch (error) {
        console.error('Error in load function:', error);

        return {
            streamed: {
                products,
                hotProducts
            },
            keywords,
            isAdvancedSearch,
            min_sale_price: params.min_sale_price,
            max_sale_price: params.max_sale_price,
            sort: params.sort,
            hasResults: false,
            totalResults: 0,
            error: 'Failed to load products. Please try again.',
            loadMoreProducts: async (page: number) => {
                return await fetchHotProducts({
                    ...params,
                    page_no: page
                });
            }
        };
    }
};