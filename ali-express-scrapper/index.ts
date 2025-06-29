import { Browser, Page } from 'puppeteer';

import supabase from "../supabase";

import { launchBrowser, closeBrowser } from './browser';
import getReviews from './reviews';
import getProducts from './products';
import getImages from './images';
import { sleep } from './utils';

// Increased timeout values for better reliability
const PAGE_TIMEOUT = 50000; // 50 seconds
const SUPERDEALS_URL = 'https://ar.aliexpress.com/ssr/300000444/GSDWp3p6aC?disableNav=YES&pha_manifest=ssr&_immersiveMode=true&wh_offline=true';

// Helper function to retry operations with exponential backoff
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3, initialDelay = 5000): Promise<T> {
    let retries = 0;
    let delay = initialDelay;
    
    while (true) {
        try {
            return await operation();
        } catch (error) {
            retries++;
            console.log(`Operation failed. Retry ${retries}/${maxRetries} in ${delay/1000}s...`);
            
            if (retries >= maxRetries) {
                throw error;
            }
            
            await sleep(delay);
            delay *= 2; // Exponential backoff
        }
    }
}

export async function getSuperDeals(browser: Browser): Promise<void> {
    if (!browser) {
        throw new Error('Browser instance is not provided');
    }
    // Open a new page and navigate to the super deals URL
    console.log('Opening page:', SUPERDEALS_URL);
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log('Navigating to the page...');
        
        await page.goto(SUPERDEALS_URL, { 
            waitUntil: 'domcontentloaded', 
            timeout: PAGE_TIMEOUT 
        });
        console.log('Page loaded successfully, waiting for content...');
        

        console.log('Starting to extract product data...');
        let productData = await getProducts(page);

        console.log('Product data extracted:', productData.length, 'products found.');

        await page.close();

        //store the data to supabase postgress database
        console.log('Storing product data to database...');
        for (let product of productData) {
            // First check if the product already exists in the database
            const { data, error: checkError } = await supabase
                .from('products')
                .select('product_id')
                .eq('url_hash', product.url_hash)
                .maybeSingle();
            
            if (checkError) {
                console.log('Error checking for existing product:', checkError);
                continue;
            }
            
            if (data) {
                // Product exists, only update the updated_at field
                const { error: updateError } = await supabase
                    .from('products')
                    .update({ updated_at: new Date().toISOString() })
                    .eq('product_id', data.product_id);
                
                if (updateError) {
                    console.log('Error updating product timestamp:', updateError);
                } else {
                    console.log(`Updated timestamp for existing product: ${product.title}`);
                }
            } else {
                // Product doesn't exist, insert the full record                
                const { error: insertError } = await supabase
                    .from('products')
                    .insert(product);
                
                if (insertError) {
                    console.log('Error inserting new product:', insertError);
                } else {
                    console.log(`Inserted new product: ${product.title}`);
                }
            }
        }
        console.log('Product data stored successfully.');
    } catch (error) {
        console.error('Error in getSuperDeals:', error);
        await page.close();
        throw error;
    }
}

export async function getSuperDealsReviews(browser: Browser): Promise<void> {
    if (!browser) {
        throw new Error('Browser instance is not provided');
    }

    try {
        console.log('Fetching products that need reviews...');
        //Get Reviews for each product
        const { data, error } = await supabase
                .from('products')
                .select('product_id, url, title')
                .eq('is_reviewed', false)
                .order('created_at', { ascending: false });

        console.log(`Retrieved ${data?.length} products from the database.`);

        if (error) {
            console.error('Error fetching products from database:', error);
            return; // Exit if there's an error
        }
                
        for (let product of data) {
            console.log(`Processing reviews for product: ${product.title} (${product.url})`);
            try {
                let reviews = await withRetry(() => getReviews(browser, product.url));
                
                if (reviews.length > 0) {
                    console.log(`Found ${reviews.length} reviews for product: ${product.title}`);
                    const { error: reviewError } = await supabase
                        .from('reviews')
                        .upsert(reviews.map(review => ({
                            rating: review.rating,
                            content: review.content,
                            product_id: product.product_id,
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
            } catch (error) {
                console.error(`Failed to process reviews for product: ${product.title}`, error);
                // Continue with the next product
            }
        }
    } catch (error) {
        console.error('Error in getSuperDealsReviews:', error);
        throw error;
    }
}

export async function getSuperDealsImages(browser: Browser): Promise<void> {
    if (!browser) {
        throw new Error('Browser instance is not provided');
    }

    try {
        console.log('Fetching products that need images...');
        // Get images for each product
        const { data, error } = await supabase
            .from('products')
            .select('product_id, url, title')
            .eq('is_imaged', false)
            .order('created_at', { ascending: false });

        console.log(`Retrieved ${data?.length} products from the database.`);

        if (error) {
            console.error('Error fetching products from database:', error);
            return; // Exit if there's an error
        }

        for (let product of data) {
            console.log(`Processing images for product: ${product.title} (${product.url})`);
            try {
                let images = await withRetry(() => getImages(browser, product.url));

                if (images.length > 0) {
                    console.log(`Found ${images.length} images for product: ${product.title}`);
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
            } catch (error) {
                console.error(`Failed to process images for product: ${product.title}`, error);
                // Continue with the next product
            }
        }
    } catch (error) {
        console.error('Error in getSuperDealsImages:', error);
        throw error;
    }
}

export async function getSuperDealsReviewsAndImages(browser: Browser): Promise<void> {
    if (!browser) {
        throw new Error('Browser instance is not provided');
    }

    try {
        console.log('Fetching reviews and images for super deals...');
        // Get reviews
        await getSuperDealsReviews(browser);
        console.log('Reviews fetched successfully.');

        // Get images
        await getSuperDealsImages(browser);
        console.log('Images fetched successfully.');
    } catch (error) {
        console.error('Error in getSuperDealsReviewsAndImages:', error);
        throw error;
    }
    
}

(async () => {
    let browser;
    try {
        // Set a global timeout for the entire script (5 hours max)
        const scriptTimeout = setTimeout(() => {
            console.error("Script execution timed out after 5 hours");
            process.exit(1);
        }, 5 * 60 * 60 * 1000);

        // Launch the browser with the specified options
        console.log('Launching browser...');
        browser = await withRetry(() => launchBrowser());
        console.log('Browser launched successfully.');

        try {
            // Get super deals
            console.log('Starting to fetch super deals...');
            //await getSuperDeals(browser);
            console.log('Super deals fetched and stored successfully.');
            
            console.log('Starting to fetch reviews for super deals...');
            // Get reviews for super deals
            getSuperDealsReviews(browser);
            console.log('Reviews fetched and stored successfully.');

            console.log('Starting to fetch images for super deals...');
            getSuperDealsImages(browser);
            console.log('Images fetched and stored successfully.');
            
            console.log('All operations completed successfully.');
        } catch (error) {
            console.error('Error during scraping:', error);
        } finally {
            // Clear the timeout
            clearTimeout(scriptTimeout);
        }
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    } finally {
        // Close browser always, especially in CI environments
        if (browser) {
            console.log('Closing browser...');
            await closeBrowser(browser);
            console.log('Browser closed successfully.');
        }
    }
})();