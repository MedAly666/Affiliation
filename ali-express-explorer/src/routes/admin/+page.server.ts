import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import supabase from '$lib/supabase';



export const actions: Actions = {
    login: async ({ request, cookies }) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options : {
                redirectTo : 'http://localhost:5173/admin/account'
            }
        });

        if (error) {
            console.error(error);
            return fail(500, { error: 'Something went wrong' });
        
        }        

        throw redirect(303, data.url);
    }

        

} satisfies Actions;