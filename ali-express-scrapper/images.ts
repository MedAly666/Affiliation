import { Browser } from 'puppeteer';
import { MD5, sleep } from "bun";

export type Image = {
    url: string;
    alt: string;
    hash: string;
};


const IMAGES_SELECTOR = 'div.slider--item--RpyeewA img';

async function extractImagesData(page: Page): Promise<Image[]> {
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
    await page.goto(productUrl, { waitUntil: 'networkidle2' });

    
    await sleep(10000); // Adjust the sleep time as needed
    // Wait for the reviews section to load
    try {
        // Wait for the images to appear
        await page.waitForSelector(IMAGES_SELECTOR, { timeout: 10000 });
    } catch (error) {
        console.log('Images not found, no images available.');
        await page.close();
        return [];
    }

    // Extract images
    const images = (await extractImagesData(page)).map(image => ({
        ...image,
        hash: new MD5().update(image.url).digest('hex') // Calculate MD5 hash of the image URL
    }));
    console.log(`Found ${images.length} images for product: ${productUrl}`);
    if (images.length === 0) {
        console.log('No images found for this product.');
    }

    // Close the page after extraction
    console.log('Closing the page after extracting images.');
    await page.close();
    
    return images;

}

export default getImages;