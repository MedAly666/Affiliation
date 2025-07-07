import type { Product } from "$lib/types";
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {
    const params = {
        page: 1,
        page_size: 25,
        q: url.searchParams.get('q'),
        min_sale_price: url.searchParams.get('min_sale_price') ?? '',
        max_sale_price: url.searchParams.get('max_sale_price') ?? '',
        sortByType: url.searchParams.get('sortByType') ?? ''
    };

    let isAdvancedSearch = false;
    if (params.max_sale_price || params.min_sale_price || params.sortByType) isAdvancedSearch = true

    const queryString = new URLSearchParams(params).toString();
    const res = await fetch(`/api/products?${queryString}`);


    const products: Product[] = await res.json();

    return {
        products,
        keywords: params.q,
        isAdvancedSearch,
        ...params
    };
};