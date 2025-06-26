import { Browser, Page } from 'puppeteer';
import { sleep } from "./utils";
import md5 from 'md5';

export type Image = {
    url: string;
    alt: string;
    hash: string;
};


const IMAGES_SELECTOR = 'div.slider--item--RpyeewA img';
const PAGE_TIMEOUT = 60000; // 60 seconds timeout

async function extractImagesData(page: Page): Promise<{ url: string; alt: string; }[]> {
    const images = await page.evaluate(() => {
        const imageElements = document.querySelectorAll('div.slider--item--RpyeewA img');
        return Array.from(imageElements).map((element) => {
            const url = element.getAttribute('src') || '';
            const alt = element.getAttribute('alt') || '';
            return { url, alt };
        });
    });
    return images;
}


async function getImages(browser: Browser, productUrl: string): Promise<Image[]> {
    if (!browser) {
        throw new Error('Browser instance is not provided');
    }
    if (!productUrl) {
        throw new Error('Product URL is not provided');
    }
    console.log(`Fetching images for product: ${productUrl}`);


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
        await sleep(15000); // Increased sleep time for better reliability
        
        // Wait for the images section to load
        try {
            // Wait for the images to appear
            console.log('Looking for images on the page...');
            await page.waitForSelector(IMAGES_SELECTOR, { timeout: PAGE_TIMEOUT });
            console.log('Images found on the page.');
        } catch (error) {
            console.log('Images not found, no images available.');
            await page.close();
            return [];
        }

        // Extract images
        console.log('Extracting image data...');
        const images = (await extractImagesData(page)).map(image => ({
            ...image,
            hash: md5(image.url) // Calculate MD5 hash of the image URL
        }));
        console.log(`Found ${images.length} images for product: ${productUrl}`);
        if (images.length === 0) {
            console.log('No images found for this product.');
        }

        // Close the page after extraction
        console.log('Closing the page after extracting images.');
        await page.close();
        
        return images;
    } catch (error) {
        console.error(`Error while fetching images for ${productUrl}:`, error);
        await page.close();
        throw error;
    }
}

export default getImages;