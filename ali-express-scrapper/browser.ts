import puppeteer, { Browser, Page} from 'puppeteer';

export async function launchBrowser(): Promise<Browser> {
    const browser = await puppeteer.launch({
        headless: true,
        timeout: 100000,
        defaultViewport: { width: 1024, height: 720 },
        //args: ['--proxy-server=socks5://127.0.0.1:9050']
    });
    return browser;
}

export async function closeBrowser(browser: Browser ) {
    if (browser) {
        await browser.close();
    }
}