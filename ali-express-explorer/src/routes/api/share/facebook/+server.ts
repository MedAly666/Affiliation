import { FACEBOOK_PAGE_ID } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Import the server-side Supabase client
import supabase from "$lib/supabase";
import type { page } from '$app/state';

export const POST: RequestHandler = async ({ request }) => {
    console.log('Received request to share product to Facebook page');

    const { product_id } = await request.json();

    if (!product_id) {
        console.error('Product ID is required');
        return json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Fetch the product details from Supabase
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', product_id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return json({ error: error.message }, { status: 500 });
    }
    if (!product) {
        console.log('Product not found for ID:', product_id);
        return json({ error: 'Product not found' }, { status: 404 });
    }

    // Construct the message to be sent to the Telegram channel
    const message = `
    🟢 ${product.title} 🟢
🔥🔥تخفيض كبير 💲💲💲💲
سعر : ${product.price}€
السعر الاصلي : ${product.original_price}€

${product.affiliation_link}

🔴 اسرع قبل نهاية العرض 🔴`;

    let response = await fetch(`https://graph.facebook.com/${FACEBOOK_PAGE_ID}/photos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getFacebookPageAccessToken()}`
        },
        body: JSON.stringify({
            message,
            url: product.image.replace(
                "_220x220",
                "_960x960",
            ),
            access_token: await getFacebookPageAccessToken(),
            published: true,

        })
    });

    if (!response.ok) {
        console.error('Failed to share product to Facebook page:', response.statusText);
        return json({ error: 'Failed to share product to Facebook page' }, { status: response.status });
    }

    console.log('Product shared to Facebook page successfully:', product_id);
    return json({ success: true });
};


async function getFacebookPageAccessToken() {
    const res = await fetch('https://graph.facebook.com/v18.0/me/accounts?access_token=EAAKvxnqwEC4BOykeZA0ZA6bmG5SjTOgKOp8dXa9B73maNMHESxexa7qnm2X5MRoZBnmZAjCN3etrFmdVQKoQoBSkgZBk0N5ZANloyRfKQlfE4WggxSvJlrOW3pUInQwsoiMZAR8pati8ZCakharscAnbcKl4dArgIYE9c3FNKpKAWFm4PvtpJksVpGjHfrwy1agWJ6xQxADwhGV7l3llsQlRgW2041wq1S4h');
    const data = await res.json();

    if (!data.data || !data.data.length) {
        console.error("No pages found or token expired.");
        throw new Error("No pages found or token expired.");
    }

    const page = data.data.find(page => page.id === FACEBOOK_PAGE_ID);
    return page.access_token;
}
