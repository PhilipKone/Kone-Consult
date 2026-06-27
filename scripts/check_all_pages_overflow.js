import puppeteer from 'puppeteer';

const PAGES = ['/', '/services', '/about', '/protocols', '/contact', '/blog'];

async function run() {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: 'C:\\Users\\DELL\\.cache\\puppeteer\\chrome\\win64-148.0.7778.167\\chrome-win64\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });

    for (const p of PAGES) {
        console.log(`\n--- Page: ${p} ---`);
        try {
            await page.goto(`http://localhost:3001${p}`, { waitUntil: 'networkidle2', timeout: 15000 });
            await new Promise(r => setTimeout(r, 2000));

            const overflowData = await page.evaluate(() => {
                const scrollWidth = document.documentElement.scrollWidth;
                const clientWidth = document.documentElement.clientWidth;
                
                const overflowing = [];
                document.querySelectorAll('*').forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.right > window.innerWidth + 1) {
                        // Check if parent has overflow hidden
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
                            overflowing.push({
                                tagName: el.tagName,
                                className: el.className,
                                width: rect.width,
                                right: rect.right
                            });
                        }
                    }
                });

                return {
                    scrollWidth,
                    clientWidth,
                    overflowing
                };
            });

            console.log(`scrollWidth: ${overflowData.scrollWidth}, clientWidth: ${overflowData.clientWidth}`);
            console.log(`Has Overflow: ${overflowData.scrollWidth > overflowData.clientWidth ? "YES" : "NO"}`);
            if (overflowData.overflowing.length > 0) {
                console.log("Overflowing elements:");
                overflowData.overflowing.forEach(el => {
                    console.log(`- <${el.tagName}> class="${el.className}" width=${el.width.toFixed(1)} right=${el.right.toFixed(1)}`);
                });
            }
        } catch (e) {
            console.error(`Failed to load ${p}:`, e.message);
        }
    }

    await browser.close();
}

run();
