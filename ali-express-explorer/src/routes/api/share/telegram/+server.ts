import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID } from '$env/static/private';

import { Telegraf } from 'telegraf';

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Import the server-side Supabase client
import supabase from "$lib/supabase";

export const POST: RequestHandler = async ({ request }) => {
    console.log('Received request to share product to Telegram channel');

    const { product_id } = await request.json();

    if (!product_id) {
        console.error('Product ID is required');
        return json({ error: 'Product ID is required' }, { status: 400 });
    }

    console.log('Fetching product details for ID:', product_id);
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

    // Initialize the Telegram bot
    console.log('Launching Telegram bot...');
    const bot = launchTelegramBot();

    bot.telegram.sendPhoto(TELEGRAM_CHANNEL_ID, product.image, {
        caption: message        
    })
        .then(() => {
            console.log('Product shared successfully to Telegram channel');
        })
        .catch((error) => {
            console.error('Error sharing product to Telegram channel:', error);
        });

    // Here you would implement the logic to share the product to the Telegram channel
    // For example, you might call a service or API to perform the sharing action

    return json({ success: true });
};

function launchTelegramBot() {
    const bot = new Telegraf(TELEGRAM_BOT_TOKEN || '');
    console.log('Starting Telegram bot...');

    bot.launch()
        .then(() => {
            console.log('Telegram bot is running...');
        })
        .catch((error) => {
            console.error('Error launching Telegram bot:', error);
        });

    console.log('Telegram bot launched successfully');


    return bot;
}   
