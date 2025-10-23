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
  // Favicon fallback to avoid proxy errors causing 1101 during simple icon fetches
  if (url.pathname === '/favicon.ico') {
    const pngB64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
    const bytes = Uint8Array.from(atob(pngB64), (c) => c.charCodeAt(0));
    return new Response(bytes, { headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=86400' } });
  }

  // Log first-line routing info
  console.log('[ROUTE]', JSON.stringify({ rid, url: url.toString(), host: hostHeader, parsedSubdomain: subdomain }));

  try {
    // Target Pages deployment for all client sites
    const TARGET_PAGES = 'restaurant-template-1.pages.dev';

    // Create new URL pointing to the Pages deployment
    const targetUrl = new URL(request.url);
    targetUrl.protocol = 'https:';
    targetUrl.hostname = TARGET_PAGES;

    // Sanitize and copy headers (strip forbidden hop-by-hop and CF headers)
    const banned = new Set([
      'host', 'accept-encoding', 'content-length', 'connection', 'keep-alive',
      'transfer-encoding', 'cf-ray', 'cf-connecting-ip', 'cf-visitor', 'cf-ew-via'
    ]);
    const headers = new Headers();
    for (const [k, v] of request.headers) {
      const lk = k.toLowerCase();
      if (banned.has(lk)) continue;
      if (lk.startsWith('cf-')) continue;
      headers.set(k, v);
    }
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
