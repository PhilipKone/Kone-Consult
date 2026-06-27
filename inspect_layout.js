import puppeteer from 'puppeteer';

async function run() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    const paths = ['/', '/services', '/about', '/protocols', '/contact'];
    for (const p of paths) {
        console.log(`\n--- Inspecting ${p} ---`);
        try {
            await page.goto(`http://localhost:3001${p}`, { waitUntil: 'networkidle2', timeout: 10000 });
            await new Promise(r => setTimeout(r, 500));

            const layoutInfo = await page.evaluate(() => {
                const mainEl = document.querySelector('main');
                const pageContainer = document.querySelector('.page-container') || document.querySelector('.hero') || document.querySelector('.home-page');
                const heading = document.querySelector('h1') || document.querySelector('.hero-title') || document.querySelector('.section-title');
                
                return {
                    main: mainEl ? {
                        rect: mainEl.getBoundingClientRect().toJSON(),
                        paddingTop: window.getComputedStyle(mainEl).paddingTop,
                        marginTop: window.getComputedStyle(mainEl).marginTop
                    } : null,
                    container: pageContainer ? {
                        className: pageContainer.className,
                        rect: pageContainer.getBoundingClientRect().toJSON(),
                        paddingTop: window.getComputedStyle(pageContainer).paddingTop,
                        marginTop: window.getComputedStyle(pageContainer).marginTop
                    } : null,
                    heading: heading ? {
                        text: heading.innerText.substring(0, 30),
                        rect: heading.getBoundingClientRect().toJSON(),
                        paddingTop: window.getComputedStyle(heading).paddingTop,
                        marginTop: window.getComputedStyle(heading).marginTop
                    } : null
                };
            });
            console.log("Layout Info:", JSON.stringify(layoutInfo, null, 2));
        } catch (e) {
            console.error(`Failed to inspect ${p}:`, e.message);
        }
    }
    await browser.close();
}

run();
