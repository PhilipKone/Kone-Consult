const fs = require('fs');
const p = './node_modules/react-snap/src/puppeteer_utils.js';
if (fs.existsSync(p)) {
    let c = fs.readFileSync(p, 'utf8');
    c = c.replace(/await page\._client\.send/g, 'await (typeof page.createCDPSession === "function" ? await page.createCDPSession() : page._client).send');
    
    // Patch skipThirdPartyRequests to also support skipResourceTypes
    const skipThirdPartyFunc = `const skipThirdPartyRequests = async opt => {
  const { page, options, basePath } = opt;
  const skipResources = options.skipResourceTypes || [];
  if (!options.skipThirdPartyRequests && skipResources.length === 0) return;
  await page.setRequestInterception(true);
  page.on("request", request => {
    const url = request.url();
    const type = request.resourceType();
    if (skipResources.includes(type)) {
      request.abort();
      return;
    }
    if (options.skipThirdPartyRequests && !url.startsWith(basePath)) {
      request.abort();
      return;
    }
    request.continue();
  });
};`;
    c = c.replace(/const skipThirdPartyRequests = async opt => \{[\s\S]*?\};/, skipThirdPartyFunc);

    // Patch crawl call to skipThirdPartyRequests to include skipResourceTypes check
    c = c.replace(/if \(options\.skipThirdPartyRequests\)\s+await skipThirdPartyRequests\(\{ page, options, basePath \}\);/, `if (options.skipThirdPartyRequests || (options.skipResourceTypes && options.skipResourceTypes.length > 0))
          await skipThirdPartyRequests({ page, options, basePath });`);

    fs.writeFileSync(p, c);
}
const trackerFile = './node_modules/react-snap/src/tracker.js';
if (fs.existsSync(trackerFile)) {
    let c = fs.readFileSync(trackerFile, 'utf8');
    c = c.replace(/page\.removeListener/g, '(page.off || page.removeListener).bind(page)');
    fs.writeFileSync(trackerFile, c);
}

