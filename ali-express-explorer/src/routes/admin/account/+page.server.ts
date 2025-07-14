import supabase from "$lib/supabase";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({params}) => {
    let accessToken = await supabase.auth.getSession();
    console.log(accessToken);

    //let user = supabase.auth.getUser();

    return {
        
    }


};