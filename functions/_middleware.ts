const SUPABASE_URL = 'https://ptzcetvcccnojdbzzlyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0emNldHZjY2Nub2pkYnp6bHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NjExNzksImV4cCI6MjA3NDMzNzE3OX0.2HS2wP06xe8PryWW_VdzTu7TDYg303BjwmzyA_5Ang8';

// Bot detection patterns
const BOT_PATTERNS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /rogerbot/i,
  /linkedinbot/i,
  /embedly/i,
  /quora link preview/i,
  /showyoubot/i,
  /outbrain/i,
  /pinterest/i,
  /slackbot/i,
  /vkShare/i,
  /W3C_Validator/i,
  /redditbot/i,
  /applebot/i,
  /whatsapp/i,
  /flipboard/i,
  /tumblr/i,
  /bitlybot/i,
  /skypeuripreview/i,
  /nuzzel/i,
  /discordbot/i,
  /qwantify/i,
  /pinterestbot/i,
  /lighthouse/i,
  /chrome-lighthouse/i,
  /telegrambot/i,
];

function isBot(userAgent: string | null): boolean {
  return userAgent ? BOT_PATTERNS.some(pattern => pattern.test(userAgent)) : false;
}

// Fetch pre-rendered HTML from storage
async function fetchPrerenderedHTML(domain: string, pathname: string): Promise<string | null> {
  try {
    const storageKey = `prerenders/${domain}${pathname === '/' ? '/index' : pathname}.html`;
    
    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/public/client-assets/${storageKey}`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
        },
      }
    );

    if (response.ok) {
      console.log(`✅ Serving pre-rendered HTML for ${pathname}`);
      return await response.text();
    }

    console.log(`⚠️ No pre-render found for ${pathname}`);
    return null;
  } catch (error) {
    console.error('Error fetching pre-rendered HTML:', error);
    return null;
  }
}

// Trigger async pre-render generation
async function triggerPrerenderGeneration(domain: string) {
  try {
    // Don't await - fire and forget
    fetch(`${SUPABASE_URL}/functions/v1/generate-prerender`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ domain }),
    }).catch(err => console.error('Failed to trigger pre-render:', err));
    
    console.log(`🚀 Triggered pre-render generation for ${domain}`);
  } catch (error) {
    console.error('Error triggering pre-render:', error);
  }
}

// Simple fallback HTML for when pre-render is not available
function generateFallbackHTML(domain: string, pathname: string): string {
  const title = `${pathname === '/' ? 'Home' : pathname.slice(1)} - Loading...`;
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="robots" content="index, follow">
  <meta http-equiv="refresh" content="3">
</head>
<body>
  <div id="root">
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:system-ui,-apple-system,sans-serif;">
      <p style="font-size:18px;color:#666;">Cargando contenido...</p>
    </div>
  </div>
</body>
</html>`;
}

// Main request handler
export async function onRequest(context: any) {
  const { request } = context;
  const userAgent = request.headers.get('user-agent');
  const url = new URL(request.url);
  const pathname = url.pathname;
  const hostname = url.hostname;

  // Skip static assets and API routes
  if (
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(js|css|json|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)
  ) {
    return context.next();
  }

  // Only handle bot requests with this middleware
  if (!isBot(userAgent)) {
    return context.next();
  }

  console.log(`🤖 Bot detected: ${userAgent?.slice(0, 50)}... for ${pathname}`);

  try {
    // Extract domain (subdomain or custom domain)
    const domain = hostname
      .replace('.lovable.app', '')
      .replace('.pages.dev', '')
      .replace(/^www\./, '');

    // Try to fetch pre-rendered HTML
    const prerenderedHTML = await fetchPrerenderedHTML(domain, pathname);

    if (prerenderedHTML) {
      // Serve the pre-rendered HTML with appropriate headers
      return new Response(prerenderedHTML, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'X-Prerendered': 'true',
          'X-Robots-Tag': 'index, follow',
        },
      });
    }

    // If no pre-render exists, trigger generation and serve fallback
    console.log(`⚠️ No pre-render available, triggering generation for ${domain}`);
    triggerPrerenderGeneration(domain);

    // Serve a simple fallback that will refresh
    const fallbackHTML = generateFallbackHTML(domain, pathname);
    
    return new Response(fallbackHTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Prerendered': 'fallback',
      },
    });

  } catch (error) {
    console.error('Error in bot middleware:', error);
    // Fall through to the normal app
    return context.next();
  }
}
