import puppeteer from 'puppeteer';

const VIEWPORTS = [
    { name: 'Desktop (1200px)', width: 1200, height: 800 },
    { name: 'Mobile (375px)', width: 375, height: 667, isMobile: true, hasTouch: true }
];

const TABS = ['academic', 'business', 'software'];

async function run() {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: 'C:\\Users\\DELL\\.cache\\puppeteer\\chrome\\win64-148.0.7778.167\\chrome-win64\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        for (const viewport of VIEWPORTS) {
            console.log(`\n=============================================`);
            console.log(`Testing viewport: ${viewport.name}`);
            console.log(`=============================================`);
            await page.setViewport({
                width: viewport.width,
                height: viewport.height,
                isMobile: viewport.isMobile || false,
                hasTouch: viewport.hasTouch || false
            });

            for (const tab of TABS) {
                console.log(`\n--- Tab: ${tab.toUpperCase()} ---`);
                const url = `http://localhost:3001/?tab=${tab}`;
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
                await new Promise(r => setTimeout(r, 2000)); // Let animations settle

                // Check horizontal overflow on the page
                const overflowData = await page.evaluate(() => {
                    const scrollWidth = document.documentElement.scrollWidth;
                    const clientWidth = document.documentElement.clientWidth;
                    const bodyScrollWidth = document.body.scrollWidth;
                    const bodyClientWidth = document.body.clientWidth;

                    const overflowingElements = [];
                    const allElements = document.querySelectorAll('*');
                    allElements.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        // If element extends beyond the viewport width
                        if (rect.right > window.innerWidth + 1) {
                            // Filter out background glow or decorations that might have overflow:hidden parent
                            // check if its ancestors clip it
                            let parent = el.parentElement;
                            let isClipped = false;
                            while (parent) {
                                const style = window.getComputedStyle(parent);
                                if (style.overflow === 'hidden' || style.overflowX === 'hidden') {
                                    isClipped = true;
                                    break;
                                }
                                parent = parent.parentElement;
                            }
                            
                            if (!isClipped) {
                                overflowingElements.push({
                                    tagName: el.tagName,
                                    id: el.id,
                                    className: el.className,
                                    rectRight: rect.right,
                                    rectWidth: rect.width,
                                    text: el.innerText ? el.innerText.substring(0, 30) : ''
                                });
                            }
                        }
                    });

                    return {
                        scrollWidth,
                        clientWidth,
                        bodyScrollWidth,
                        bodyClientWidth,
                        hasHtmlOverflow: scrollWidth > clientWidth,
                        hasBodyOverflow: bodyScrollWidth > bodyClientWidth,
                        overflowingElements
                    };
                });

                console.log("Page scrollWidth:", overflowData.scrollWidth, "clientWidth:", overflowData.clientWidth);
                console.log("Body scrollWidth:", overflowData.bodyScrollWidth, "clientWidth:", overflowData.bodyClientWidth);
                console.log("HTML/Body Has Overflow:", overflowData.hasHtmlOverflow || overflowData.hasBodyOverflow ? "YES" : "NO");
                
                if (overflowData.overflowingElements.length > 0) {
                    console.log("Unclipped overflowing elements extending beyond viewport width:");
                    overflowData.overflowingElements.forEach(el => {
                        console.log(`- <${el.tagName}> id="${el.id}" class="${el.className}" (width: ${el.rectWidth}px, right: ${el.rectRight}px): "${el.text}"`);
                    });
                } else {
                    console.log("No visible overflowing elements detected.");
                }

                // Let's capture a screenshot to verify visually
                const pathName = viewport.isMobile ? 'mobile' : 'desktop';
                const screenshotPath = `C:/Users/DELL/.gemini/antigravity/brain/9dd08c4c-9279-4905-8f27-4dbbdcc45af1/scratch/test_overflow_${pathName}_${tab}.png`;
                await page.screenshot({ path: screenshotPath });
                console.log(`Screenshot saved to: ${screenshotPath}`);
            }
        }
    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await browser.close();
    }
}

run();
