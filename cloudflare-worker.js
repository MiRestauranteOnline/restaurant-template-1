// Cloudflare Worker for wildcard subdomain routing (with robust proxying and diagnostics)

// Global error hooks for better diagnostics
self.addEventListener("error", (e) => {
  console.error("[WORKER-UNHANDLED:error]", e.message, e.error?.stack || null);
});
self.addEventListener("unhandledrejection", (e) => {
  console.error(
    "[WORKER-UNHANDLED:rejection]",
    e.reason?.message || String(e.reason),
    e.reason?.stack || null
  );
});

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const rid = (crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  const url = new URL(request.url);
  const hostHeader = request.headers.get('host') || url.hostname;
  const hostname = url.hostname || hostHeader;
  const subdomain = (hostname || '').split('.')[0] || '';

  // Minimal crash-proof debug route handled entirely in this worker
  if (url.pathname === '/__debug') {
    const debug = {
      ok: true,
      runtime: 'single-worker',
      ts: Date.now(),
      rid,
      url: url.toString(),
      host: hostHeader,
      parsedSubdomain: subdomain,
    };
    return new Response(JSON.stringify(debug, null, 2), {
      headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' }
    });
  }

  // Log first-line routing info
  console.log('[ROUTE]', JSON.stringify({ rid, url: url.toString(), host: hostHeader, parsedSubdomain: subdomain }));

  try {
    // Target Pages deployment for all client sites
    const TARGET_PAGES = 'restaurant-template-1.pages.dev';

    // Create new URL pointing to the Pages deployment
    const targetUrl = new URL(request.url);
    targetUrl.hostname = TARGET_PAGES;

    // Clone and augment headers
    const headers = new Headers(request.headers);
    headers.set('X-Forwarded-Host', hostHeader);

    // Build init without body for GET/HEAD to avoid exceptions
    const method = request.method || 'GET';
    const init = {
      method,
      headers,
      redirect: 'manual'
    };

    if (method !== 'GET' && method !== 'HEAD') {
      // Forward body only for non-GET/HEAD
      init.body = request.body;
    }

    const modifiedRequest = new Request(targetUrl.toString(), init);

    const response = await fetch(modifiedRequest);

    // Return response as-is while preserving headers
    return new Response(response.body, response);
  } catch (err) {
    console.error('[WORKER-UNHANDLED]', { rid, message: err?.message, stack: err?.stack });
    return new Response(
      JSON.stringify({ ok: false, rid, error: err?.message || 'Unknown', stack: err?.stack || null }),
      { status: 500, headers: { 'content-type': 'application/json', 'x-debug-id': rid } }
    );
  }
}
