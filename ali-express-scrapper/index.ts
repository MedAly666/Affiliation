import { Browser } from 'puppeteer';

import supabase from "../supabase";

import { launchBrowser, closeBrowser } from './browser';
import getReviews from './reviews';
import getProducts from './products';
import getImages from './images';


const SUPERDEALS_URL = 'https://www.aliexpress.com/ssr/300000444/GSDWp3p6aC?disableNav=YES&pha_manifest=ssr&_immersiveMode=true&wh_offline=true';




async function getSuperDeals(browser: Browser): Promise<void> {
    if (!browser) {
        throw new Error('Browser instance is not provided');
    }
    // Open a new page and navigate to the super deals URL
    console.log('Opening page:', SUPERDEALS_URL);
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(SUPERDEALS_URL, { waitUntil: 'domcontentloaded', timeout: 100000 });
    await page.waitForNetworkIdle();

    let productData = await getProducts(page);

    console.log('Product data extracted:', productData.length, 'products found.');

    await page.close();


    //store the data to supabase postgress database

    for( let product of productData ){
        const { error } = await supabase 
            .from('products') 
            .upsert (product);
        
        if( error ) console.log(error);
    }
    
}

async function getSuperDealsReviews( browser: Browser ): Promise<void> {
    if (!browser) {
        throw new Error('Browser instance is not provided');
    }


    //Get Reviews for each product
    const { data, error } = await supabase
            .from('products')
            .select('product_id, url, title')
            .eq('is_reviewed', false)

    console.log(`Retrieved ${data?.length} products from the database.`);

    
    if (error) {
        console.error('Error fetching products from database:', error);
        await closeBrowser(browser);
        return; // Exit if there's an error
    }
    
            

    for( let product of data ){
        let reviews = await getReviews(browser, product.url)
        
        if (reviews.length > 0) {
            const { error: reviewError } = await supabase
                .from('reviews')
                .upsert(reviews.map(review => ({
                    rating: review.rating,
                    content: review.content,
                    product_id : product.product_id,
                })));

            if (reviewError) {
                console.error('Error inserting reviews:', reviewError);
            } else {
                console.log(`Inserted ${reviews.length} reviews for product: ${product.title}`);

                // Update the product to mark it as reviewed
                const { error: updateError } = await supabase
                    .from('products')
                    .update({ is_reviewed: true })
                    .eq('product_id', product.product_id);
                if (updateError) {
                    console.error('Error updating product as reviewed:', updateError);
                } 
            }
        }
    }
}

async function getSuperDealsImages(browser: Browser): Promise<void> {
    if (!browser) {
        throw new Error('Browser instance is not provided');
    }

    // Get images for each product
    const { data, error } = await supabase
        .from('products')
        .select('product_id, url, title')
        .eq('is_imaged', false);

    console.log(`Retrieved ${data?.length} products from the database.`);

    if (error) {
        console.error('Error fetching products from database:', error);
        await closeBrowser(browser);
        return; // Exit if there's an error
    }

    for (let product of data) {
        let images = await getImages(browser, product.url);

        if (images.length > 0) {
            const { error: imageError } = await supabase
                .from('images')
                .upsert(images.map(image => ({
                    image_url: image.url,
                    image_url_hash: image.hash,
                    image_alt: image.alt,
                    product_id: product.product_id,
                })));

            if (imageError) {
                console.error('Error inserting images:', imageError);
            } else {
                console.log(`Inserted ${images.length} images for product: ${product.title}`);

                // Update the product to mark it as imaged
                const { error: updateError } = await supabase
                    .from('products')
                    .update({ is_imaged: true })
                    .eq('product_id', product.product_id);
                if (updateError) {
                    console.error('Error updating product as imaged:', updateError);
                }
            }
        }
    }
}

(async () => {
    try {
        // Set a global timeout for the entire script (2 hours max)
        const scriptTimeout = setTimeout(() => {
            console.error("Script execution timed out after 2 hours");
            process.exit(1);
        }, 2 * 60 * 60 * 1000);

        // Launch the browser with the specified options
        console.log('Launching browser...');
        const browser = await launchBrowser();
        console.log('Browser launched successfully.');

        try {
            // Get super deals
            await getSuperDeals(browser);
            console.log('Super deals fetched and stored successfully.');
            
            console.log('Fetching reviews for super deals...');
            // Get reviews for super deals
            await getSuperDealsReviews(browser);
            console.log('Reviews fetched and stored successfully.');

            await getSuperDealsImages(browser);
            console.log('Images fetched and stored successfully.');
            
            console.log('All operations completed successfully.');
        } catch (error) {
            console.error('Error during scraping:', error);
        } finally {
            // Close browser always, especially in CI environments
            await closeBrowser(browser);
            // Clear the timeout
            clearTimeout(scriptTimeout);
        }
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
})();