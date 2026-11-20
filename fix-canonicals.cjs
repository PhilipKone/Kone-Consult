const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const origin = 'https://consult.codkon.com';

function walk(dir) {
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(walk(full));
        } else if (entry.name.endsWith('.html')) {
            results.push(full);
        }
    }
    return results;
}

if (fs.existsSync(buildDir)) {
    for (const file of walk(buildDir)) {
        let html = fs.readFileSync(file, 'utf8');
        const rel = path.relative(buildDir, file).replace(/\\/g, '/');

        // Strip static canonicals from SPA fallback shells so dynamic routes (e.g. /blog/:slug) don't inherit '/'
        if (rel === '200.html' || rel === '404.html') {
            html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*>\s*/gi, '');
            fs.writeFileSync(file, html, 'utf8');
            continue;
        }

        if (path.basename(file) === 'index.html') {
            const routePath = rel === 'index.html' ? '/' : '/' + rel.replace(/\/index\.html$/, '');
            const expectedHref = `${origin}${routePath}`;
            const canonicalRegex = /<link[^>]+rel=["']canonical["'][^>]*>/gi;
            const matches = html.match(canonicalRegex) || [];

            if (matches.length > 1) {
                let kept = false;
                html = html.replace(canonicalRegex, (tag) => {
                    if (!kept && tag.includes(`href="${expectedHref}"`)) {
                        kept = true;
                        return tag;
                    }
                    return '';
                });
                if (!kept) {
                    html = html.replace('</head>', `<link rel="canonical" href="${expectedHref}"></head>`);
                }
                fs.writeFileSync(file, html, 'utf8');
            }
        }
    }
    console.log('[OK] Deduplicated canonical tags in Kone-Consult/build');
}