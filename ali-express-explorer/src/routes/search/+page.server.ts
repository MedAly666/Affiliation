import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    search: async ({ request, url }) => {
        const formData = await request.formData();

        // Extract form data
        const keywords = formData.get('keywords')?.toString() || '';
        const min_sale_price = formData.get('min_sale_price')?.toString();
        const max_sale_price = formData.get('max_sale_price')?.toString();
        const sortByType = formData.get('sortByType')?.toString();

        // Build search URL
        const searchUrl = new URL(url.origin + url.pathname);

        // Add search parameters
        if (keywords) {
            searchUrl.searchParams.set('keywords', keywords);
        }

        if (min_sale_price && Number(min_sale_price) > 0) {
            searchUrl.searchParams.set('min_sale_price', min_sale_price);
        }

        if (max_sale_price && Number(max_sale_price) < Infinity) {
            searchUrl.searchParams.set('max_sale_price', max_sale_price);
        }

        if (sortByType && sortByType !== 'SALE_PRICE_DESC') {
            searchUrl.searchParams.set('sortByType', sortByType);
        }

        // Redirect to search results
        throw redirect(302, searchUrl.toString());
    }
};