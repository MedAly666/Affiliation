import puppeteer, { Browser, Page} from 'puppeteer';

export async function launchBrowser(): Promise<Browser> {
    // Check if running in GitHub Actions or other CI environment
    const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
    
    const browser = await puppeteer.launch({
        headless: isCI ? true : false, // Use headless mode in CI, non-headless for local development
        timeout: 100000,
        defaultViewport: { width: 1024, height: 720 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            //--proxy-server=socks5://127.0.0.1:9050'
        ]
    });
    return browser;
}

export async function closeBrowser(browser: Browser ) {
    if (browser) {
        // Always close the browser in CI environments
        const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
        if (isCI) {
            await browser.close();
        }
        // In local development, we might want to keep it open for debugging
        // but you can uncomment the line below to always close it
        // await browser.close();
    }
}