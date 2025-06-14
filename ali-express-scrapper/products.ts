import type { Page } from "puppeteer";
import { MD5, sleep } from 'bun';

const PRODUCT_SELECTOR = 'a.productContainer';
const PRODUCT_TITLE_SELECTOR = 'div.aec-view>div.AIC-ATM-container span.AIC-ATM-multiLine span';
const PRODUCT_IMAGE_SELECTOR = 'div.AIC-MI-container img';
const PRODUCT_CURRENT_PRICE_SELECTOR = 'div.aec-view.bottom_container_3b1b3a68 span.price_3b1b3a68';
const PRODUCT_ORIGINAL_PRICE_SELECTOR = 'div.aec-view.bottom_container_3b1b3a68 div span.ori_price_3b1b3a68';
const PAGE_TIMEOUT = 60000; // 60 seconds timeout

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
            }, 30000); // Increased timeout for scrolling
        });
    });
}

/*export async function changeCountryLanguageCurrency(page: Page) {
    try {
        console.log('Attempting to change country, language, and currency...');
        
        // Try to wait for the network to be idle first
        try {
            await page.waitForNetworkIdle({ timeout: 30000 });
        } catch (error) {
            console.log('Network did not reach idle state, continuing anyway');
        }
        
        // Try to find the currency selector with different strategies
        let currencySelectorFound = false;
        
        // First attempt with the original selector
        try {
            console.log('Trying original currency selector...');
            const selectorExists = await page.evaluate(() => {
                return !!document.querySelector('div.ship-to--menuItem--WdBDsYl.ship-to--newMenuItem--2Rw-XvE');
            });
            
            if (selectorExists) {
                console.log('Original currency selector found, clicking it');
                await page.click('div.ship-to--menuItem--WdBDsYl.ship-to--newMenuItem--2Rw-XvE');
                currencySelectorFound = true;
            } else {
                console.log('Original currency selector not found');
            }
        } catch (error) {
            console.log('Error with original currency selector:', error.message);
        }
        
        if (!currencySelectorFound) {
            console.log('Skipping country/language/currency change, proceeding with default settings');
            return;
        }
        
        // Wait a bit for the dropdown to appear
        await sleep(5000);
        
        // Try to skip this part if it fails
        try {
            console.log('Waiting for currency dropdown...');
            await page.waitForSelector('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG', {timeout: 30000});
            console.log('Currency dropdown appeared');
            
            // Country - only try, don't fail if it doesn't work
            try {
                await sleep(2000); // Short pause
                console.log('Selecting country...');
                await page.click('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.select--text--1b85oDo');
                await sleep(2000);
                await page.click('div.select--popup--W2YwXWt.select--visiblePopup--VUtkTX2 div.select--item--32FADYB span.DZ');
                console.log('Country selected');
            } catch (error) {
                console.log('Failed to select country, continuing anyway:', error.message);
            }
            
            // Try to click the save button directly without further changes
            try {
                console.log('Attempting to save settings...');
                await page.click('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.es--saveBtn--w8EuBuy');
                console.log('Settings saved');
            } catch (error) {
                console.log('Failed to save settings, continuing anyway:', error.message);
            }
            
        } catch (error) {
            console.log('Currency dropdown not found or other error, continuing anyway:', error.message);
        }
        
        // Wait a bit for the page to update after settings change
        await sleep(5000);
        console.log('Proceeding with available settings');
        
    } catch (error) {
        console.error('Error in changeCountryLanguageCurrency:', error);
        console.log('Continuing without changing country/language/currency');
    }
}*/

export async function changeCountryLanguageCurrency(page: Page) {
    try {
        console.log('Attempting to change country, language, and currency...');

        await page.waitForNetworkIdle({ timeout: 30000 });

        // Click on the Country/Language/Currency selector
        await page.waitForSelector('div.ship-to--menuItem--WdBDsYl.ship-to--newMenuItem--2Rw-XvE', {timeout: 10000});
        await page.click('div.ship-to--menuItem--WdBDsYl.ship-to--newMenuItem--2Rw-XvE');
        // Wait for the Country/Language/Currency selector to appear
        await page.waitForSelector('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG', {timeout: 10000});
        await sleep(5000);

        // Country
        await page.waitForSelector('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.select--text--1b85oDo');
        await page.click('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.select--text--1b85oDo');
        await page.click('div.select--popup--W2YwXWt.select--visiblePopup--VUtkTX2 div.select--item--32FADYB span.DZ');
        await sleep(5000);

        //Language
        await page.waitForSelector('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.form-item--content--33yK8CE:nth-child(4)');
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
        await sleep(5000);

        // Currency
        await page.waitForSelector('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.form-item--content--33yK8CE:nth-child(6)');
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
        await sleep(5000);

        // Wait for the save button to be available and click it
        await page.waitForSelector('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.es--saveBtn--w8EuBuy', {timeout: 10000});
        await page.click('div.es--contentWrap--ypzOXHr.es--visible--12ePDdG div.es--saveBtn--w8EuBuy')
        await page.waitForNetworkIdle();
        await sleep(5000);

    } catch (error) {
        console.error('Error changing country, language, and currency:', error);
        throw new Error('Failed to change country, language, and currency');
    }
}

export async function extractProductData(page: Page) {
    console.log('Finding products on the page...');
    const products = await page.$$(PRODUCT_SELECTOR);
    console.log(`Found ${products.length} products on the page`);
    
    const productData = [];
    
    for (let i = 0; i < products.length; i++) {
        try {
            const product = products[i];
            console.log(`Processing product ${i + 1}/${products.length}`);
            
            const titleElement = await product.$(PRODUCT_TITLE_SELECTOR);
            const imageElement = await product.$(PRODUCT_IMAGE_SELECTOR);
            const currentPriceElement = await product.$(PRODUCT_CURRENT_PRICE_SELECTOR);
            const originalPriceElement = await product.$(PRODUCT_ORIGINAL_PRICE_SELECTOR);
            
            // Extract the product URL
            const url = await page.evaluate(el => el.href || '', product).then(href => {
                // Remove query parameters if any
                return (href || '').split('?')[0]; 
            });
            
            if (!url) {
                console.log(`Skipping product ${i + 1} - no URL found`);
                continue;
            }
            
            // Calculate MD5 hash of the URL
            const urlHash = new MD5().update(url).digest('hex');
            
            // Extract other data
            const title = titleElement ? await page.evaluate(el => el.textContent || '', titleElement) : 'No title';
            const image = imageElement ? await page.evaluate(el => el.src || '', imageElement) : 'No image';
            const currentPrice = currentPriceElement ? await page.evaluate(el => el.textContent || '', currentPriceElement) : '0';
            const originalPrice = originalPriceElement ? await page.evaluate(el => el.textContent || '', originalPriceElement) : '0';
            
            // Process price strings safely
            let processedCurrentPrice = '0';
            let processedOriginalPrice = '0';
            
            try {
                processedCurrentPrice = currentPrice.replace('€', '').trim();
            } catch (e) {
                console.log(`Error processing current price for product ${i + 1}:`, e.message);
            }
            
            try {
                processedOriginalPrice = originalPrice.replace('€', '').trim();
            } catch (e) {
                console.log(`Error processing original price for product ${i + 1}:`, e.message);
            }
            
            // Create product data object
            const productInfo = {
                title: title.trim(),
                image: image.trim(),
                url: url.trim(),
                url_hash: urlHash,
                price: parseFloat(processedCurrentPrice) || 0,
                original_price: parseFloat(processedOriginalPrice) || 0,
            };
            
            productData.push(productInfo);
            console.log(`Successfully processed product ${i + 1}`);
            
        } catch (error) {
            console.error(`Error processing product ${i + 1}:`, error);
            // Continue with next product
        }
    }
    
    return productData;
}


async function getProducts(page: Page): Promise<Product[]> {
    try {
        // Change the country, language, and currency
        console.log('Changing country, language, and currency...');
        await changeCountryLanguageCurrency(page);
        console.log('Country, language, and currency settings processed.');
        
        // Wait for the products to load
        console.log('Waiting for products to load...');
        try {
            await page.waitForSelector(PRODUCT_SELECTOR, { timeout: PAGE_TIMEOUT });
            console.log('Product selector found');
        } catch (error) {
            console.log('Product selector not found, but continuing anyway:', error.message);
        }

        // Scroll to the bottom of the page to load all products
        console.log('Scrolling to the bottom of the page to load all products...');
        await scrollToBottom(page); 
        console.log('Scrolling completed');
        
        try {
            await page.waitForNetworkIdle({ timeout: 30000 });
            console.log('Network is idle');
        } catch (error) {
            console.log('Network did not reach idle state, continuing anyway:', error.message);
        }

        // Extract product information
        console.log('Extracting product information...');
        const productData = await extractProductData(page);
        console.log(`Product information extracted successfully. Found ${productData.length} products.`);

        return productData;
    } catch (error) {
        console.error('Error getting products:', error);
        return []; // Return empty array instead of throwing
    }
}

export default getProducts;
