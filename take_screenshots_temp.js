import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function run() {
    const paths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
    ];
    let executablePath = null;
    for (const p of paths) {
        if (fs.existsSync(p)) {
            executablePath = p;
            break;
        }
    }

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: executablePath || undefined,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set viewport to iPhone X size
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    // Emulate iPhone X User Agent
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');

    const artifactDir = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\124e2bef-384e-4c98-8997-832823bd164a';

    // 1. Kone Consult Mobile Screenshot
    const consultUrl = 'https://consult.koneacademy.io/';
    console.log(`Navigating to ${consultUrl}...`);
    try {
        await page.goto(consultUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    } catch (e) {
        console.log(`Consult load log: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 6000));
    try {
        const destPath = path.join(artifactDir, 'live_gh_consult_pwa_mobile.png');
        await page.screenshot({ path: destPath });
        console.log(`Consult screenshot saved to ${destPath}`);
    } catch (e) {
        console.error(`Failed to take consult screenshot:`, e);
    }

    // 2. Kone Academy Mobile Screenshot
    const academyUrl = 'https://www.koneacademy.io/';
    console.log(`Navigating to ${academyUrl}...`);
    try {
        await page.goto(academyUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    } catch (e) {
        console.log(`Academy load log: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 6000));
    try {
        const destPath = path.join(artifactDir, 'live_gh_academy_pwa_mobile.png');
        await page.screenshot({ path: destPath });
        console.log(`Academy screenshot saved to ${destPath}`);
    } catch (e) {
        console.error(`Failed to take academy screenshot:`, e);
    }

    await browser.close();
    console.log("Done.");
}

run();
