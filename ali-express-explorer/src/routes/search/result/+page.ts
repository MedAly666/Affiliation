import type { Product } from "$lib/types";
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
    const params = {
        page: 1,
        limit: 25,
        q: url.searchParams.get('q'),
        minPrice: url.searchParams.get('minPrice') ?? '',
        maxPrice: url.searchParams.get('maxPrice') ?? '',
        sortByType: url.searchParams.get('sortByType') ?? ''
    };

    let isAdvancedSearch = false;
    if (params.maxPrice || params.minPrice || params.sortByType) isAdvancedSearch = true

    const queryString = new URLSearchParams(params).toString();
    const res = await fetch(`/api/products?${queryString}`);


    const products: Product[] = await res.json();

    return {
        products,
        searchQuery: params.q,
        isAdvancedSearch,
        ...params
    };
};