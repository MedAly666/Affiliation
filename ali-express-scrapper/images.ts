import { Browser } from 'puppeteer';
import { MD5, sleep } from "bun";

export type Image = {
    url: string;
    alt: string;
    hash: string;
};


const IMAGES_SELECTOR = 'div.slider--item--RpyeewA img';

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
    await page.waitForSelector(IMAGES_SELECTOR, { timeout: 10000 });

    // Extract images
    const images = await page.evaluate(() => {
        const imageElements = document.querySelectorAll(IMAGES_SELECTOR);
        return Array.from(imageElements).map((element) => {
            const url = element.getAttribute('src') || '';
            const alt = element.getAttribute('alt') || '';
            const hash = new MD5()
                .update(url)
                .digest('hex');
            return { url, alt, hash };
        });
    });

    await page.close();
    return images;

}

export default getImages;