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
        // Test Case 1: Load Local Homepage with ?tab=software
        console.log("Navigating to http://localhost:3001/?tab=software ...");
        await page.goto('http://localhost:3001/?tab=software', { waitUntil: 'domcontentloaded', timeout: 30000 });
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

        console.log("--- LOCAL HOMEPAGE (tab=software) RESULTS ---");
        console.log("Active Tab (Expected: SOFTWARE):", homepageInfo.activeTab);
        console.log("Badge Text (Expected: SOFTWARE ARCHITECTURE & LABS):", homepageInfo.badgeText);
        console.log("Trust Logos (Expected: Kone Code, Kone Lab):", homepageInfo.logos);
        console.log("Featured Section Title (Expected: Built with):", homepageInfo.featuredHeader);

        // Save a screenshot for manual preview
        const screenshotPathHome = 'C:/Users/DELL/.gemini/antigravity/brain/9dd08c4c-9279-4905-8f27-4dbbdcc45af1/scratch/local_homepage_verify.png';
        await page.screenshot({ path: screenshotPathHome });
        console.log("Local Homepage screenshot saved to:", screenshotPathHome);

        // Test Case 2: Load Local Protocols page with ?cat=software
        console.log("\nNavigating to http://localhost:3001/protocols?cat=software ...");
        await page.goto('http://localhost:3001/protocols?cat=software', { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(r => setTimeout(r, 3000));

        const protocolsInfo = await page.evaluate(() => {
            // Find active tab button in Protocols page nav-tabs-premium
            const buttons = Array.from(document.querySelectorAll('.nav-tabs-premium button'));
            const activeBtn = buttons.find(btn => {
                const style = window.getComputedStyle(btn);
                const color = style.color || '';
                // rgb(88, 166, 255) is the primary accent color #58a6ff
                return color.includes('88') || color.includes('166') || color.includes('255');
            });

            return {
                activeTab: activeBtn ? activeBtn.innerText : 'Unknown/None',
                allTabs: buttons.map(btn => btn.innerText)
            };
        });

        console.log("--- LOCAL PROTOCOLS PAGE (cat=software) RESULTS ---");
        console.log("Active Tab on Protocols page (Expected: Software & Systems):", protocolsInfo.activeTab);

        const screenshotPathProto = 'C:/Users/DELL/.gemini/antigravity/brain/9dd08c4c-9279-4905-8f27-4dbbdcc45af1/scratch/local_protocols_verify.png';
        await page.screenshot({ path: screenshotPathProto });
        console.log("Local Protocols page screenshot saved to:", screenshotPathProto);

    } catch (err) {
        console.error("Verification failed:", err);
    } finally {
        await browser.close();
    }
}

run();
