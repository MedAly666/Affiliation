import { Browser, Page } from "puppeteer";
import { sleep } from "./utils";

type Review = {
    rating: number;
    content: string;
};

const MORE_REVIEWS_BUTTON_SELECTOR = 'button.comet-v2-btn.comet-v2-btn-slim.comet-v2-btn-large.v3--btn--KaygomA.comet-v2-btn-important';
const REVIEW_SELECTOR = 'div.comet-v2-modal-body div.list--itemContentTopLeft--jv7Zzf1';
const PAGE_TIMEOUT = 60000; // 60 seconds timeout


async function getReviews(browser: Browser, productUrl: string): Promise<Review[]> {
    if (!browser) {
        throw new Error('Browser instance is not provided');
    }
    if (!productUrl) {
        throw new Error('Product URL is not provided');
    }
    console.log(`Fetching reviews for product: ${productUrl}`);
    
    const page = await browser.newPage();
    try {
        await page.setDefaultNavigationTimeout(PAGE_TIMEOUT);
        await page.setDefaultTimeout(PAGE_TIMEOUT);
        
        console.log(`Navigating to product page: ${productUrl}`);
        await page.goto(productUrl, { 
            waitUntil: 'networkidle2',
            timeout: PAGE_TIMEOUT
        });

        console.log('Product page loaded, waiting for content...');
        await sleep(15000); // Increased sleep time

        try {
            // Wait for the "Load More" button to appear
            console.log('Looking for "Load More" button...');
            await page.waitForSelector(MORE_REVIEWS_BUTTON_SELECTOR, { timeout: PAGE_TIMEOUT });
            console.log('"Load More" button found, clicking to load reviews...');
            
            // Click the "Load More" button to load all reviews
            await page.click(MORE_REVIEWS_BUTTON_SELECTOR);
            await page.waitForNetworkIdle({ timeout: PAGE_TIMEOUT });
            console.log('Clicked "Load More" button to load reviews.');
            // Wait for the reviews to load after clicking "Load More"
            await sleep(15000); // Increased wait time
            
            // Wait for the reviews section to load
            console.log('Waiting for reviews to load...');
            await page.waitForSelector(REVIEW_SELECTOR, { timeout: PAGE_TIMEOUT });
            await page.waitForNetworkIdle({ timeout: PAGE_TIMEOUT });
            console.log('Reviews loaded successfully.');

            // Extract reviews
            console.log('Extracting review data...');
            const reviews = await page.evaluate(() => {
                const reviewElements = document.querySelectorAll('div.comet-v2-modal-body div.list--itemContentTopLeft--jv7Zzf1');
                return Array.from(reviewElements).map((element: Element) => {
                    const ratingElement = element.querySelector('div.stars--box--WrrveRu');
                    const contentElement = element.querySelector('div.list--itemReview--d9Z9Z5Z');
                    return {
                        rating: ratingElement ? parseFloat(
                            String(ratingElement
                                .querySelectorAll('span.comet-icon.comet-icon-starreviewfilled')
                                ?.length)
                            || '0' ) : 0,
                        content: contentElement ? contentElement.textContent?.trim() || '' : '',
                    };
                });
            });

            console.log(`Found ${reviews.length} reviews.`);
            await page.close();
            return reviews;

        } catch (error) {
            console.log('Load More button not found or other error occurred:', error);
            console.log('No reviews available for this product.');
            await page.close();
            return [];
        }
    } catch (error) {
        console.error(`Error while fetching reviews for ${productUrl}:`, error);
        await page.close();
        throw error;
    }
}

export default getReviews;