import type { Page } from "puppeteer";
import { MD5 } from 'bun';

const PRODUCT_SELECTOR = 'a.productContainer';
const PRODUCT_TITLE_SELECTOR = 'div.aec-view>div.AIC-ATM-container span.AIC-ATM-multiLine span';
const PRODUCT_IMAGE_SELECTOR = 'div.AIC-MI-container img';
const PRODUCT_CURRENT_PRICE_SELECTOR = 'div.aec-view.bottom_container_3b1b3a68 span.price_3b1b3a68';
const PRODUCT_ORIGINAL_PRICE_SELECTOR = 'div.aec-view.bottom_container_3b1b3a68 div span.ori_price_3b1b3a68';


export type Product = {
    title: string;
    url: string;
    url_hash: string;
    original_price: number;
    price?: number;
    image: string;
};

export async function scrollToBottom(page: Page) {
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
}

export async function changeCountryLanguageCurrency(page: Page) {
    // Click on the currency selector
    await page.waitForSelector('div.ship-to--menuItem--WdBDsYl.ship-to--newMenuItem--2Rw-XvE', {timeout: 10000});
    await page.click('div.ship-to--menuItem--WdBDsYl.ship-to--newMenuItem--2Rw-XvE');
    // Wait for the currency selector to appear
    await page.waitForSelector('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG', {timeout: 10000});
    // Country
    await page.click('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.select--text--1b85oDo');
    await page.click('div.select--popup--W2YwXWt.select--visiblePopup--VUtkTX2 div.select--item--32FADYB span.DZ');

    //Language
    await page.click('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.form-item--content--33yK8CE:nth-child(4)');
    // Find and click element that contains العربية
    await page.evaluate(() => {
        const languageOptions = Array.from(document.querySelectorAll('div.select--popup--W2YwXWt.select--visiblePopup--VUtkTX2 div.select--item--32FADYB'));
        const arabicOption = languageOptions.find(option => option.textContent?.includes('العربية'));
        if (arabicOption) {
            (arabicOption as HTMLElement).click();
        } else {
            console.warn('Arabic option not found, selecting the first available language');
            const firstOption = document.querySelector('div.select--popup--W2YwXWt.select--visiblePopup--VUtkTX2 div.select--item--32FADYB') as HTMLElement;
            if (firstOption) firstOption.click();
        }
    });


    // Currency
    await page.click('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.form-item--content--33yK8CE:nth-child(6)');
    // Find and click element that contains EUR
    await page.evaluate(() => {
        const currencyOptions = Array.from(document.querySelectorAll('div.select--popup--W2YwXWt.select--visiblePopup--VUtkTX2 div.select--item--32FADYB'));
        const eurOption = currencyOptions.find(option => option.textContent?.includes('EUR'));
        if (eurOption) {
            (eurOption as HTMLElement).click();
        } else {
            console.warn('EUR option not found, selecting the first available currency');
            const firstOption = document.querySelector('div.select--popup--W2YwXWt.select--visiblePopup--VUtkTX2 div.select--item--32FADYB') as HTMLElement;
            if (firstOption) firstOption.click();
        }
    });


    await page.click('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.es--saveBtn--w8EuBuy')
    await page.waitForNetworkIdle();
}

export async function extractProductData( page: Page ) {
    const products = await page.$$(PRODUCT_SELECTOR);
    const productData = await Promise.all(products.map(async (product) => {
        const titleElement = await product.$(PRODUCT_TITLE_SELECTOR);
        const imageElement = await product.$(PRODUCT_IMAGE_SELECTOR);
        const currentPriceElement = await product.$(PRODUCT_CURRENT_PRICE_SELECTOR);
        const originalPriceElement = await product.$(PRODUCT_ORIGINAL_PRICE_SELECTOR);
        
        // Extract the product URL
        const url = (await page.evaluate(el => el.href, product)).split('?')[0]; // Remove query parameters if any
        
        // Calculate MD5 hash of the URL
        const urlHash = new MD5()
            .update(url)
            .digest('hex');
        
        const title = titleElement ? await page.evaluate(el => el.textContent, titleElement) : 'No title';
        const image = imageElement ? await page.evaluate(el => el.src, imageElement) : 'No image';
        const currentPrice = currentPriceElement ? await page.evaluate(el => el.textContent, currentPriceElement) : 'No current price';
        const originalPrice = originalPriceElement ? await page.evaluate(el => el.textContent, originalPriceElement) : 'No original price';
        
        return {
            title: title.trim(),
            image: image.trim(),
            url: url.trim(),
            url_hash: urlHash,
            price: parseFloat(currentPrice.replace('€', '').trim()),
            original_price: parseFloat(originalPrice.replace('€', '').trim()),

        };
    }));
    return productData;
}


async function getProducts(page: Page): Promise<Product[]> {
    // Change the country, language, and currency
    console.log('Changing country, language, and currency...');
    await changeCountryLanguageCurrency(page);
    console.log('Country, language, and currency changed successfully.');
    
    // Wait for the products to load
    console.log('Waiting for products to load...');
    await page.waitForSelector(PRODUCT_SELECTOR, {timeout: 100000});

    // Scroll to the bottom of the page to load all products
    console.log('Scrolling to the bottom of the page to load all products...');
    await scrollToBottom(page); 
    console.log('Products loaded successfully.');

    // Extract product information
    console.log('Extracting product information...');
    const productData = await extractProductData(page);
    console.log('Product information extracted successfully.');

    // Log the product data
    console.log('Product Data:', productData);
    return productData;
}

export default getProducts;