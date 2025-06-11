import { Browser } from 'puppeteer';

import supabase from "../supabase";

import { launchBrowser, closeBrowser } from './browser';
import getReviews from './reviews';
import getProducts from './products';


const SUPERDEALS_URL = 'https://www.aliexpress.com/ssr/300000444/GSDWp3p6aC?disableNav=YES&pha_manifest=ssr&_immersiveMode=true&wh_offline=true';




async function getSuperDeals(browser: Browser): Promise<void> {
    if (!browser) {
        throw new Error('Browser instance is not provided');
    }
    // Open a new page and navigate to the super deals URL
    console.log('Opening page:', SUPERDEALS_URL);
    const page = await browser.newPage();
    await page.goto(SUPERDEALS_URL);
    
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
            }
        }
    }
}

(async () => {
    // Launch the browser with the specified options
    console.log('Launching browser...');
    const browser = await launchBrowser();
    console.log('Browser launched successfully.');

    // Get super deals
    await getSuperDeals(browser);
    console.log('Super deals fetched and stored successfully.');
    // Note: The browser will not be closed automatically here to allow for debugging.
    console.log('Fetching reviews for super deals...');

    // Get reviews for super deals
    await getSuperDealsReviews(browser);
    console.log('Reviews fetched and stored successfully.');
    // Note: The browser will not be closed automatically here to allow for debugging.

    console.log('All operations completed successfully.');

    //close browser
    await closeBrowser(browser)


})();