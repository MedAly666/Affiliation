import { sleep } from "bun";
import { Browser } from "puppeteer";

type Review = {
    rating: number;
    content: string;
};

const MORE_REVIEWS_BUTTON_SELECTOR = 'button.comet-v2-btn.comet-v2-btn-slim.comet-v2-btn-large.v3--btn--KaygomA.comet-v2-btn-important';
const REVIEW_SELECTOR = 'div.comet-v2-modal-body div.list--itemContentTopLeft--jv7Zzf1';


async function getReviews(browser: Browser, productUrl: string): Promise<Review[]> {
    if (!browser) {
        throw new Error('Browser instance is not provided');
    }
    if (!productUrl) {
        throw new Error('Product URL is not provided');
    }
    console.log(`Fetching reviews for product: ${productUrl}`);
    
    const page = await browser.newPage();
    await page.goto(productUrl, { waitUntil: 'networkidle2' });

    try {
        // Wait for the "Load More" button to appear
        await page.waitForSelector(MORE_REVIEWS_BUTTON_SELECTOR, { timeout: 10000 });
    } catch (error) {
        console.log('Load More button not found, no reviews available.');
        await page.close();
        return [];
    }

    // Click the "Load More" button to load all reviews
    await page.click(MORE_REVIEWS_BUTTON_SELECTOR);
    console.log('Clicked "Load More" button to load reviews.');
    // Wait for the reviews to load after clicking "Load More"
    await sleep(10000); // Adjust the sleep time as needed
    // Wait for the reviews section to load
    await page.waitForSelector(REVIEW_SELECTOR, { timeout: 10000 });

    // Extract reviews
    const reviews = await page.evaluate(() => {
        const reviewElements = document.querySelectorAll('div.comet-v2-modal-body div.list--itemContentTopLeft--jv7Zzf1');
        return Array.from(reviewElements).map((element) => {
            const ratingElement = element.querySelector('div.stars--box--WrrveRu');
            const contentElement = element.querySelector('div.list--itemReview--d9Z9Z5Z');
            return {
                rating: ratingElement ? parseFloat(
                    ratingElement
                        .querySelectorAll('span.comet-icon.comet-icon-starreviewfilled')
                        ?.length
                    || 0 ) : 0,
                content: contentElement ? contentElement.textContent?.trim() : '',
            };
        });
    });

    await page.close();
    return reviews;

}

export default getReviews;