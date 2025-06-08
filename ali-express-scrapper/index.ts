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

import puppeteer, { Browser, Page} from 'puppeteer';


const SUPERDEALS_URL = 'https://www.aliexpress.com/ssr/300000444/GSDWp3p6aC?disableNav=YES&pha_manifest=ssr&_immersiveMode=true&wh_offline=true';

const PRODUCT_SELECTOR = 'a.productContainer';
const PRODUCT_TITLE_SELECTOR = 'div.aec-view>div.AIC-ATM-container span.AIC-ATM-multiLine span';
const PRODUCT_IMAGE_SELECTOR = 'div.AIC-MI-container img';
const PRODUCT_CURRENT_PRICE_SELECTOR = 'div.aec-view.bottom_container_3b1b3a68 span.price_3b1b3a68';
const PRODUCT_ORIGINAL_PRICE_SELECTOR = 'div.aec-view.bottom_container_3b1b3a68 div span.ori_price_3b1b3a68';


async function launchBrowser(): Promise<Browser> {
    const browser = await puppeteer.launch({
        headless: false,
        timeout: 100000,
        defaultViewport: { width: 1024, height: 720 },
        //args: ['--proxy-server=socks5://127.0.0.1:9050']
    });
    return browser;
}

async function closeBrowser(browser: Browser ) {
    if (browser) {
        await browser.close();
    }
}

async function scrollToBottom(page: Page) {
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

async function changeCountryLanguageCurrency(page: Page) {
    // Click on the currency selector
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

async function extractProductData( page: Page ) {
    const products = await page.$$(PRODUCT_SELECTOR);
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
    return productData;
}




(async () => {
    // Launch the browser with the specified options
    console.log('Launching browser...');
    const browser = await launchBrowser();
    console.log('Browser launched successfully.');  

    // Open a new page and navigate to the super deals URL
    console.log('Opening page:', SUPERDEALS_URL);
    const page = await browser.newPage();
    await page.goto(SUPERDEALS_URL);
    
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
    
    //await browser.close();
})();