/**
 * This is a simple script to scrap super deals from AliExpress.
 * It uses the `puppeteer` library to navigate to the AliExpress website,
 * the data is stored in supabase.
 * It will:
 * 1. Open the AliExpress super deals page.
 * 2. extract all the products information.
 * 3. store the data in supabase.
 * 4. close the browser.
 */

import puppeteer from 'puppeteer';


const SUPERDEALS_URL = 'https://www.aliexpress.com/ssr/300000444/GSDWp3p6aC?disableNav=YES&pha_manifest=ssr&_immersiveMode=true&wh_offline=true';

const PRODUCT_SELECTOR = 'a.productContainer';
const PRODUCT_TITLE_SELECTOR = 'div.aec-view>div.AIC-ATM-container span.AIC-ATM-multiLine span';
const PRODUCT_IMAGE_SELECTOR = 'div.AIC-MI-container img';
const PRODUCT_CURRENT_PRICE_SELECTOR = 'div.aec-view.bottom_container_3b1b3a68 span.price_3b1b3a68';
const PRODUCT_ORIGINAL_PRICE_SELECTOR = 'div.aec-view.bottom_container_3b1b3a68 div span.ori_price_3b1b3a68';







(async () => {
    // Launch the browser with the specified options
    console.log('Launching browser...');    
    const browser = await puppeteer.launch({
        headless: false,
        timeout: 100000,
        defaultViewport: { width: 1024, height: 720 },
        //args: ['--proxy-server=socks5://127.0.0.1:9050']
    });
    const page = await browser.newPage();
    await page.goto(SUPERDEALS_URL);
    

    // Wait for the products to load
    console.log('Waiting for products to load...');
    await page.waitForSelector(PRODUCT_SELECTOR, {timeout: 100000});
    // Scroll to the bottom of the page to load all products
    console.log('Scrolling to the bottom of the page to load all products...');
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                window.scrollBy(0, window.innerHeight);
            }, 100);
            setTimeout(() => {
                clearInterval(interval);
                resolve();
            }, 10000);
        });
    });
    console.log('Products loaded successfully.');
    // Extract product information
    console.log('Extracting product information...');
    const products = await page.$$( PRODUCT_SELECTOR );
    const productData = await Promise.all(products.map(async (product) => {
        const titleElement = await product.$(PRODUCT_TITLE_SELECTOR);
        const imageElement = await product.$(PRODUCT_IMAGE_SELECTOR);
        const currentPriceElement = await product.$(PRODUCT_CURRENT_PRICE_SELECTOR);
        const originalPriceElement = await product.$(PRODUCT_ORIGINAL_PRICE_SELECTOR);
        const title = titleElement ? await page.evaluate(el => el.textContent, titleElement) : 'No title';
        const image = imageElement ? await page.evaluate(el => el.src, imageElement) : 'No image';
        const currentPrice = currentPriceElement ? await page.evaluate(el => el.textContent, currentPriceElement) : 'No current price';
        const originalPrice = originalPriceElement ? await page.evaluate(el => el.textContent, originalPriceElement) : 'No original price';
        return {
            title: title.trim(),
            image: image.trim(),
            currentPrice: currentPrice.trim(),
            originalPrice: originalPrice.trim()
        };
    }));
    console.log('Product information extracted successfully.');
    // Log the product data
    console.log('Product Data:', productData);
    
    //await browser.close();
})();