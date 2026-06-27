import puppeteer from 'puppeteer';

async function run() {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: 'C:\\Users\\DELL\\.cache\\puppeteer\\chrome\\win64-148.0.7778.167\\chrome-win64\\chrome.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });

    try {
        console.log("Navigating to http://localhost:3001/services ...");
        await page.goto('http://localhost:3001/services', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));

        const elements = await page.evaluate(() => {
            const list = [];
            document.querySelectorAll('*').forEach(el => {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                if (rect.width > 375.5 || rect.right > 375.5) {
                    list.push({
                        tagName: el.tagName,
                        id: el.id,
                        className: el.className,
                        width: rect.width,
                        left: rect.left,
                        right: rect.right,
                        overflowX: style.overflowX,
                        position: style.position,
                        display: style.display
                    });
                }
            });
            return list;
        });

        console.log("Elements wider than 375px or extending past 375px on /services mobile:");
        elements.forEach(el => {
            console.log(`- <${el.tagName}> id="${el.id}" class="${el.className}" width=${el.width.toFixed(1)} left=${el.left.toFixed(1)} right=${el.right.toFixed(1)} pos=${el.position} disp=${el.display} overflowX=${el.overflowX}`);
        });

    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await browser.close();
    }
}

run();
