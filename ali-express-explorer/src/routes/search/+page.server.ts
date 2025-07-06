import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    search: async ({ cookies, request }) => {
        const data = await request.formData();

        console.log('data.get(advancedFilterToggle)', data.get('advancedFilterToggle'));

        const params: Params = {
            q: data.get('searchQuery'),
        };

        if (data.get('advancedFilterToggle') == 'on') {
            params.minPrice = data.get('minPrice');
            params.maxPrice = data.get('maxPrice');
            params.sortByType = data.get('sortByType');
        }
        console.log(new URLSearchParams(params).toString())

        redirect(303, '/search/result?' + new URLSearchParams(params).toString())


    },

} satisfies Actions;