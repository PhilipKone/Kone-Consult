import puppeteer from 'puppeteer';

const VIEWPORT = { width: 375, height: 812, isMobile: true, hasTouch: true };
const OUTPUT_DIR = 'C:/Users/DELL/.gemini/antigravity/brain/9dd08c4c-9279-4905-8f27-4dbbdcc45af1/';

async function capture(page, url, outputPath, name) {
    console.log(`Navigating to ${url} ...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000)); // wait for loader fadeout & framer motion animations
    
    // Check if loader is still present, if so hide it
    await page.evaluate(() => {
        const loader = document.querySelector('.loading-screen');
        if (loader) loader.style.display = 'none';
    });

    console.log(`Taking screenshot for ${name}...`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`Saved screenshot to ${outputPath}`);
}

async function run() {
    console.log("Starting screenshot capture...");
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: 'C:\\Users\\DELL\\.cache\\puppeteer\\chrome\\win64-148.0.7778.167\\chrome-win64\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    try {
        const BASE_URL = 'http://localhost:3001';
        
        await capture(page, `${BASE_URL}/?tab=academic`, `${OUTPUT_DIR}mobile_home_academic.png`, 'Academic Home');
        await capture(page, `${BASE_URL}/?tab=business`, `${OUTPUT_DIR}mobile_home_business.png`, 'Business Home');
        await capture(page, `${BASE_URL}/?tab=software`, `${OUTPUT_DIR}mobile_home_software.png`, 'Software Home');
        await capture(page, `${BASE_URL}/services`, `${OUTPUT_DIR}mobile_services.png`, 'Services Page');
        await capture(page, `${BASE_URL}/protocols`, `${OUTPUT_DIR}mobile_protocols.png`, 'Protocols Page');

    } catch (err) {
        console.error("Capture failed:", err);
    } finally {
        await browser.close();
    }
}

run();
