// Cloudflare Worker for wildcard subdomain routing with built-in bot SSR (SEO-friendly)

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

// --- Config for bot SSR using Supabase (public anon key only) ---
const SUPABASE_URL = 'https://ptzcetvcccnojdbzzlyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0emNldHZjY2Nub2pkYnp6bHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NjExNzksImV4cCI6MjA3NDMzNzE3OX0.2HS2wP06xe8PryWW_VdzTu7TDYg303BjwmzyA_5Ang8';

function isBot(ua) {
  if (!ua) return false;
  const s = ua.toLowerCase();
  const bots = [
    'googlebot','bingbot','slurp','duckduckbot','baiduspider','yandexbot',
    'facebookexternalhit','twitterbot','whatsapp','linkedinbot','slackbot',
    'telegrambot','applebot','ia_archiver','crawler','spider','bot','crawl',
    'lighthouse','pagespeed','gtmetrix','semrush','ahrefs','moz'
  ];
  return bots.some(b => s.includes(b));
}

function extractDomainFromHost(host) {
  if (!host) return null;
  if (host.includes('mirestaurante.online')) {
    const sub = host.split('.')[0];
    return sub;
  }
  return host; // custom domain
}

async function buildFallbackFromFastLoad(domain, pathname, host) {
  try {
    const fastLoadUrl = `${SUPABASE_URL}/storage/v1/object/public/client-assets/fast-load/${domain}.json`;
    const res = await fetch(fastLoadUrl, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const fast = await res.json();
    const restaurantName = fast.restaurant_name || 'Restaurante';
    const titleFirst = fast.homepage_hero_title_first_line || '';
    const titleSecond = fast.homepage_hero_title_second_line || restaurantName;
    const description = fast.homepage_hero_description || `Bienvenido a ${restaurantName}. Experiencia gastronómica excepcional.`;
    const baseUrl = host && host.includes('mirestaurante.online')
      ? `https://${domain}.mirestaurante.online`
      : `https://${host || domain}`;

    const aboutHtml = fast.about_hero_title ? `
      <section>
        <h2>${fast.about_hero_title}</h2>
        <p>${fast.about_hero_description || ''}</p>
      </section>` : '';

    const servicesHtml = fast.homepage_services_title ? `
      <section>
        <h2>${fast.homepage_services_title}</h2>
        <p>${fast.homepage_services_description || ''}</p>
      </section>` : '';

    const contactHtml = `
      <section>
        <h2>Contacto</h2>
        ${fast.address ? `<p><strong>Dirección:</strong> ${fast.address}</p>` : ''}
        ${fast.phone ? `<p><strong>Teléfono:</strong> ${fast.phone}</p>` : ''}
        ${fast.email ? `<p><strong>Email:</strong> ${fast.email}</p>` : ''}
        ${fast.opening_hours_text ? `<p><strong>Horario:</strong> ${fast.opening_hours_text}</p>` : ''}
      </section>`;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${restaurantName} - ${titleFirst || 'Restaurante'}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${baseUrl}${pathname}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${restaurantName}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
</head>
<body>
  <header>
    <h1>${restaurantName}</h1>
    <nav>
      <a href="${baseUrl}/">Inicio</a>
      <a href="${baseUrl}/menu">Menú</a>
      <a href="${baseUrl}/nosotros">Nosotros</a>
      <a href="${baseUrl}/contacto">Contacto</a>
    </nav>
  </header>
  <main>
    <section>
      <h2>${titleFirst} ${titleSecond}</h2>
      ${description ? `<p>${description}</p>` : ''}
    </section>
    ${aboutHtml}
    ${servicesHtml}
    ${contactHtml}
  </main>
  <footer>
    <p>© ${new Date().getFullYear()} ${restaurantName}. Todos los derechos reservados.</p>
    ${fast.address ? `<p>${fast.address}</p>` : ''}
    ${fast.phone ? `<p>Tel: ${fast.phone}</p>` : ''}
  </footer>
</body>
</html>`.trim();
  } catch (_) {
    return null;
  }
}

async function generateBotHTML(domain, pathname, host) {
  // 1) Try prebuilt fast-load JSON (fast and cache-friendly)
  const fastHtml = await buildFallbackFromFastLoad(domain, pathname, host);
  if (fastHtml) return fastHtml;

  // 2) Live lookups as fallback (reduced set for reliability)
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  // Determine if custom domain or subdomain
  const isCustomDomain = domain.includes('.');
  let client = null;

  try {
    if (isCustomDomain) {
      const url = `${SUPABASE_URL}/rest/v1/clients?select=*&custom_domain=eq.${encodeURIComponent(domain)}&limit=1`;
      const res = await fetch(url, { headers });
      if (res.ok) client = (await res.json())?.[0] || null;
    } else {
      const url = `${SUPABASE_URL}/rest/v1/clients?select=*&subdomain=eq.${encodeURIComponent(domain)}&limit=1`;
      const res = await fetch(url, { headers });
      if (res.ok) client = (await res.json())?.[0] || null;
    }
  } catch (_) {}

  if (!client) return null; // fall back to SPA

  const restaurantName = client.restaurant_name || 'Restaurant';
  const baseUrl = client.custom_domain
    ? `https://${client.custom_domain}`
    : `https://${client.subdomain}.mirestaurante.online`;

  const pageTitle = `${restaurantName} - ${client.city || 'Restaurante'}`;
  const pageDescription = client.short_description || `Bienvenido a ${restaurantName}.`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}">
  <link rel="canonical" href="${baseUrl}${pathname}">
  <meta name="robots" content="index, follow">
</head>
<body>
  <header>
    <h1>${restaurantName}</h1>
    <nav>
      <a href="${baseUrl}/">Inicio</a>
      <a href="${baseUrl}/menu">Menú</a>
      <a href="${baseUrl}/nosotros">Nosotros</a>
      <a href="${baseUrl}/contacto">Contacto</a>
    </nav>
  </header>
  <main>
    <section>
      <h2>${pageDescription}</h2>
      ${client.address ? `<p><strong>Dirección:</strong> ${client.address}</p>` : ''}
      ${client.phone ? `<p><strong>Teléfono:</strong> ${client.phone}</p>` : ''}
      ${client.email ? `<p><strong>Email:</strong> ${client.email}</p>` : ''}
    </section>
  </main>
  <footer>
    <p>© ${new Date().getFullYear()} ${restaurantName}. Todos los derechos reservados.</p>
  </footer>
</body>
</html>`.trim();
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const rid = (crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  const url = new URL(request.url);
  const hostHeader = request.headers.get('host') || url.hostname;
  const hostname = url.hostname || hostHeader;
  const subdomain = (hostname || '').split('.')[0] || '';
  const userAgent = request.headers.get('user-agent') || '';

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
      isBot: isBot(userAgent),
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
    // --- Bot SSR short-circuit for public pages ---
    const testSSR = url.searchParams.has('__bot');
    const isPublic = ['/', '', '/menu', '/nosotros', '/about', '/contacto', '/contact', '/resenas', '/reviews'].includes(url.pathname);
    const domain = extractDomainFromHost(hostHeader);

    if (domain && isPublic && (testSSR || isBot(userAgent))) {
      console.log('[WORKER-SSR] Generating bot HTML', { domain, path: url.pathname, testSSR, ua: userAgent.slice(0, 60) });
      const html = await generateBotHTML(domain, url.pathname, hostHeader);
      if (html) {
        return new Response(html, {
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'no-store',
            'x-ssr-bot': 'worker',
            'x-ssr-domain': domain,
          }
        });
      }
      console.log('[WORKER-SSR] SSR returned null, falling back to proxy');
    }

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
      init.body = request.body;
    }
    const modifiedRequest = new Request(targetUrl.toString(), init);
    const response = await fetch(modifiedRequest);
    // Return upstream response directly to preserve streaming/headers
    return response;
  } catch (err) {
    console.error('[WORKER-UNHANDLED]', { rid, message: err?.message, stack: err?.stack });
    return new Response(
      JSON.stringify({ ok: false, rid, error: err?.message || 'Unknown', stack: err?.stack || null }),
      { status: 500, headers: { 'content-type': 'application/json', 'x-debug-id': rid } }
    );
  }
}
