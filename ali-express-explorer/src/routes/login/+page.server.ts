import type { Actions } from '../$types';
import type { PageServerLoad } from '../$types';
import supabase from "$lib/supabase";

import { redirect } from '@sveltejs/kit';


export const actions = {
    login: async ({}) => {
        console.log("Login action triggered");

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `http://localhost:5173/auth/callback`, // Adjust this URL as needed
            },
        });

        if (error) {
            console.error("Login failed:", error.message);
            return { success: false, error: error.message };
        }

        console.log(data);
        
        redirect(303, data.url); // Redirect to Google's OAuth page
    }
} satisfies Actions;