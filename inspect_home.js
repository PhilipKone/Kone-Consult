import puppeteer from 'puppeteer';

async function run() {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log("Navigating to http://localhost:3001/services ...");
    try {
        await page.goto('http://localhost:3001/services', { waitUntil: 'networkidle2', timeout: 10000 });
        console.log("Page loaded successfully.");
        
        // Wait a bit
        await new Promise(r => setTimeout(r, 1000));

        // Get bounding rect of the main title or header
        const pageContainerInfo = await page.evaluate(() => {
            const el = document.querySelector('.page-container');
            if (!el) return { present: false };
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return {
                present: true,
                rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                paddingTop: style.paddingTop,
                marginTop: style.marginTop
            };
        });
        console.log("Page Container Info:", pageContainerInfo);

        const titleInfo = await page.evaluate(() => {
            const el = document.querySelector('h1') || document.querySelector('.section-title');
            if (!el) return { present: false };
            const rect = el.getBoundingClientRect();
            return {
                present: true,
                text: el.innerText,
                rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
            };
        });
        console.log("Title Info:", titleInfo);

        // Screenshot
        const screenshotPath = 'c:/Users/DELL/.gemini/antigravity/brain/9dd08c4c-9279-4905-8f27-4dbbdcc45af1/services_screenshot.png';
        await page.screenshot({ path: screenshotPath });
        console.log("Screenshot saved to:", screenshotPath);
    } catch (err) {
        console.error("Execution failed:", err);
    } finally {
        await browser.close();
    }
}

run();
