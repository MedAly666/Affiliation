import type { RequestHandler } from '@sveltejs/kit';
import { launchBrowser, closeBrowser } from '../../../../../ali-express-scrapper/browser';
import { getSuperDeals, getSuperDealsReviews, getSuperDealsImages } from '../../../../../ali-express-scrapper/index';

async function scrapeAliExpressSuperDeals() {
    let browser;
    const summary = {
        deals: false,
        reviews: false,
        images: false,
        errors: [] as string[]
    };

    try {
        browser = await launchBrowser();

        // Scrape super deals
        try {
            await getSuperDeals(browser);
            summary.deals = true;
        } catch (err) {
            summary.errors.push('getSuperDeals: ' + String(err));
        }

        // Scrape reviews
        try {
            await getSuperDealsReviews(browser);
            summary.reviews = true;
        } catch (err) {
            summary.errors.push('getSuperDealsReviews: ' + String(err));
        }
        

        // Scrape images
        try {
            await getSuperDealsImages(browser);
            summary.images = true;
        } catch (err) {
            summary.errors.push('getSuperDealsImages: ' + String(err));
        }

    } finally {
        if (browser) {
            await closeBrowser(browser);
        }
    }

    return summary;
}

export const GET: RequestHandler = async () => {
    try {
        const result = await scrapeAliExpressSuperDeals();
        return new Response(JSON.stringify({ success: result.errors.length === 0, result }), {
            status: result.errors.length === 0 ? 200 : 207, // 207: Multi-Status (partial success)
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};