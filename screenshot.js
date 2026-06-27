import puppeteer from 'puppeteer';

async function run() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log("Navigating to http://localhost:3001/ ...");
    await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' });
    
    // Wait for loader screen to finish (2.2s + fade out)
    console.log("Waiting for loader screen to finish...");
    await new Promise(r => setTimeout(r, 4000));
    
    console.log("Taking screenshot...");
    await page.screenshot({ path: 'local_home.png' });
    console.log("Screenshot saved to local_home.png");
    
    await browser.close();
}

run();
