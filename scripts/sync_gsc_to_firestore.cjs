const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

async function syncGSCToFirestore() {
  console.log("=== Starting GSC to Firestore Automated Telemetry Sync ===");

  // 1. Load Credentials (supports file or GSC_CREDENTIALS environment variable in GitHub Actions)
  let credentials;
  if (process.env.GSC_CREDENTIALS) {
    try {
      credentials = JSON.parse(process.env.GSC_CREDENTIALS);
      console.log("Loaded service account credentials from environment variable.");
    } catch (e) {
      console.error("Failed to parse GSC_CREDENTIALS environment variable:", e);
      process.exit(1);
    }
  } else {
    const credPath = path.join(__dirname, '..', '..', 'gsc-credentials.json');
    if (fs.existsSync(credPath)) {
      credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
      console.log("Loaded service account credentials from local file:", credPath);
    } else {
      console.error("No service account credentials found!");
      process.exit(1);
    }
  }

  // 2. Authenticate with Google APIs
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/datastore'
    ]
  });

  const authClient = await auth.getClient();
  const searchconsole = google.searchconsole({ version: 'v1', auth: authClient });

  // 3. Query Google Search Console API for sc-domain:koneacademy.io
  const siteUrl = 'sc-domain:koneacademy.io';
  const today = new Date();
  const endDate = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const startDate = new Date(today.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  console.log(`Querying GSC date range: ${startDate} to ${endDate}...`);

  // Query 1: Timeline by Date
  const dateRes = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['date'],
      rowLimit: 50
    }
  });

  // Query 2: Top Search Queries
  const queryRes = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 50
    }
  });

  // Query 3: Top Pages
  const pageRes = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 100
    }
  });

  const dateRows = (dateRes.data.rows || []).sort((a, b) => a.keys[0].localeCompare(b.keys[0]));
  const queryRows = queryRes.data.rows || [];
  const pageRows = pageRes.data.rows || [];

  const totalClicks = dateRows.reduce((acc, r) => acc + (r.clicks || 0), 0);
  const totalImpressions = dateRows.reduce((acc, r) => acc + (r.impressions || 0), 0);
  const avgCtr = totalImpressions > 0 ? +((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
  const avgPosition = dateRows.length > 0 ? +(dateRows.reduce((acc, r) => acc + (r.position || 0), 0) / dateRows.length).toFixed(1) : 0;

  // Aggregate subdomains
  const subdomainsMap = {};
  pageRows.forEach(p => {
    try {
      const url = new URL(p.keys[0]);
      const host = url.hostname;
      if (!subdomainsMap[host]) {
        subdomainsMap[host] = { domain: host, clicks: 0, impressions: 0 };
      }
      subdomainsMap[host].clicks += (p.clicks || 0);
      subdomainsMap[host].impressions += (p.impressions || 0);
    } catch (e) {}
  });

  const subdomains = Object.values(subdomainsMap).map(s => ({
    ...s,
    ctr: s.impressions > 0 ? +((s.clicks / s.impressions) * 100).toFixed(2) : 0
  })).sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);

  const payload = {
    summary: {
      totalClicks,
      totalImpressions,
      avgCtr,
      avgPosition,
      dateRange: `${startDate} to ${endDate}`,
      lastUpdated: new Date().toLocaleDateString('en-US')
    },
    timeline: dateRows.map(r => ({
      date: r.keys[0],
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: +((r.ctr || 0) * 100).toFixed(2),
      position: +(r.position || 0).toFixed(1)
    })),
    queries: queryRows.map(r => ({
      query: r.keys[0],
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: +((r.ctr || 0) * 100).toFixed(2),
      position: +(r.position || 0).toFixed(1)
    })),
    pages: pageRows.map(r => ({
      page: r.keys[0],
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: +((r.ctr || 0) * 100).toFixed(2),
      position: +(r.position || 0).toFixed(1)
    })),
    subdomains
  };

  // 4. Update local fallback JSON snapshot
  const localSnapshotPath = path.join(__dirname, '..', 'src', 'data', 'gsc_telemetry.json');
  fs.writeFileSync(localSnapshotPath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Updated local JSON snapshot at: ${localSnapshotPath}`);

  // 5. Write Single Aggregated Document to Firestore via REST API with JWT Auth
  const projectId = credentials.project_id || 'kone-academy-500817';
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/dashboard_data/global_stats`;

  try {
    const tokenResponse = await authClient.getAccessToken();
    const token = tokenResponse.token;

    const firestoreBody = {
      fields: {
        payload: { stringValue: JSON.stringify(payload) },
        lastUpdated: { stringValue: new Date().toISOString() },
        totalClicks: { integerValue: totalClicks.toString() },
        totalImpressions: { integerValue: totalImpressions.toString() }
      }
    };

    const res = await fetch(firestoreUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(firestoreBody)
    });

    if (res.ok) {
      console.log("Successfully synced aggregated telemetry document to Firestore: dashboard_data/global_stats");
    } else {
      const errText = await res.text();
      console.warn("Firestore sync returned status:", res.status, errText);
    }
  } catch (err) {
    console.error("Firestore sync error:", err);
  }

  console.log("=== Telemetry Sync Complete ===");
}

syncGSCToFirestore().catch(console.error);
