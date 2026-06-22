import puppeteer from 'puppeteer';

async function run() {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: 'C:\\Users\\DELL\\.cache\\puppeteer\\chrome\\win64-148.0.7778.167\\chrome-win64\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    try {
        // Test Case 1: Load Homepage with ?tab=software
        console.log("Navigating to https://consult.koneacademy.io/?tab=software ...");
        await page.goto('https://consult.koneacademy.io/?tab=software', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 3000)); // wait for transitions/animations

        const homepageInfo = await page.evaluate(() => {
            const activeTabButton = document.querySelector('.hero-tab.active');
            const badge = document.querySelector('.badge');
            const trustLogos = Array.from(document.querySelectorAll('.trust-logo-card .inst-name')).map(el => el.innerText);
            const featuredTitle = document.querySelector('.hero-featured-section h2');
            
            return {
                activeTab: activeTabButton ? activeTabButton.innerText : null,
                badgeText: badge ? badge.innerText : null,
                logos: trustLogos,
                featuredHeader: featuredTitle ? featuredTitle.innerText : null
            };
        });

        console.log("--- HOMEPAGE (tab=software) RESULTS ---");
        console.log("Active Tab (Expected: SOFTWARE):", homepageInfo.activeTab);
        console.log("Badge Text (Expected: SOFTWARE ARCHITECTURE & LABS):", homepageInfo.badgeText);
        console.log("Trust Logos (Expected: Kone Code, Kone Lab):", homepageInfo.logos);
        console.log("Featured Section Title (Expected: Built with):", homepageInfo.featuredHeader);

        // Save a screenshot for manual preview
        const screenshotPathHome = 'C:/Users/DELL/.gemini/antigravity/brain/9dd08c4c-9279-4905-8f27-4dbbdcc45af1/scratch/homepage_verify.png';
        await page.screenshot({ path: screenshotPathHome });
        console.log("Homepage screenshot saved to:", screenshotPathHome);

        // Test Case 2: Load Protocols page with ?cat=software
        console.log("\nNavigating to https://consult.koneacademy.io/protocols?cat=software ...");
        await page.goto('https://consult.koneacademy.io/protocols?cat=software', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 3000));

        const protocolsInfo = await page.evaluate(() => {
            // Find active tab button in Protocols page nav-tabs-premium
            // Let's inspect buttons to find which one has background styling or color
            const buttons = Array.from(document.querySelectorAll('.nav-tabs-premium button'));
            const activeBtn = buttons.find(btn => {
                const style = window.getComputedStyle(btn);
                return style.background && style.background.includes('rgba');
            }) || buttons.find(btn => btn.style.background && btn.style.background.includes('rgba'));

            return {
                activeTab: activeBtn ? activeBtn.innerText : 'Unknown/None',
                allTabs: buttons.map(btn => btn.innerText)
            };
        });

        console.log("--- PROTOCOLS PAGE (cat=software) RESULTS ---");
        console.log("Active Tab on Protocols page (Expected: Software & Systems):", protocolsInfo.activeTab);

        const screenshotPathProto = 'C:/Users/DELL/.gemini/antigravity/brain/9dd08c4c-9279-4905-8f27-4dbbdcc45af1/scratch/protocols_verify.png';
        await page.screenshot({ path: screenshotPathProto });
        console.log("Protocols page screenshot saved to:", screenshotPathProto);

    } catch (err) {
        console.error("Verification failed:", err);
    } finally {
        await browser.close();
    }
}

run();
