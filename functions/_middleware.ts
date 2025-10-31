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

// Fetch fast-load data
async function fetchFastLoadData(domain: string) {
  try {
    const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/client-assets/fast-load/${domain}.json`;
    const response = await fetch(fileUrl);
    
    if (response.ok) {
      return await response.json();
    }
    
    // If not found, trigger generation
    await fetch(`${SUPABASE_URL}/functions/v1/prebuild-client-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ domain }),
    }).catch(() => null);
    
    // Try again
    const retryResponse = await fetch(fileUrl);
    if (retryResponse.ok) {
      return await retryResponse.json();
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching fast-load data:', error);
    return null;
  }
}

// Generate HTML from fast-load data
function generateHTMLFromData(domain: string, pathname: string, data: any): string {
  const name = data?.restaurant_name || 'Restaurant';
  const phone = data?.phone ? `${data.phone_country_code || '+51'} ${data.phone}` : '';
  const email = data?.email || '';
  const address = data?.address || '';
  
  // Page-specific content
  const pageContent = (() => {
    if (pathname === '/' || pathname === '') {
      const heroTitle = data?.homepage_hero_title_first_line || 'Welcome';
      const heroSubtitle = data?.homepage_hero_title_second_line || '';
      const heroDesc = data?.homepage_hero_description || '';
      const heroImg = data?.homepage_hero_background_url || '';
      
      const menuItems = (data?.menu_preview_items || []).slice(0, 6);
      const menuItemsHTML = menuItems.map((item: any) => `
        <div class="menu-item">
          ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" loading="lazy">` : ''}
          <h3>${item.name}</h3>
          ${item.description ? `<p>${item.description}</p>` : ''}
          ${item.price ? `<span class="price">S/ ${item.price.toFixed(2)}</span>` : ''}
        </div>
      `).join('');
      
      return `
        <section class="hero">
          ${heroImg ? `<img src="${heroImg}" alt="${name}" class="hero-bg">` : ''}
          <h1>${heroTitle}${heroSubtitle ? `<br><span>${heroSubtitle}</span>` : ''}</h1>
          ${heroDesc ? `<p>${heroDesc}</p>` : ''}
        </section>
        ${menuItemsHTML ? `
          <section class="menu-preview">
            <h2>Nuestro Menú</h2>
            <div class="menu-grid">${menuItemsHTML}</div>
            <a href="/menu" class="btn">Ver menú completo</a>
          </section>
        ` : ''}
      `;
    } else if (pathname === '/menu' || pathname === '/carta') {
      const title = [data?.menu_page_hero_title_first_line, data?.menu_page_hero_title_second_line].filter(Boolean).join(' ') || 'Menú';
      const menuCategories = data?.menu?.categories || [];
      const menuItems = data?.menu?.items || [];
      
      const menuHTML = menuCategories.map((cat: any) => {
        const catItems = menuItems.filter((item: any) => item.category_id === cat.id);
        return catItems.length > 0 ? `
          <div class="menu-category">
            <h3>${cat.name}</h3>
            ${catItems.map((item: any) => `
              <div class="menu-item">
                ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}">` : ''}
                <div><h4>${item.name}</h4>${item.description ? `<p>${item.description}</p>` : ''}</div>
                ${item.price ? `<span class="price">S/ ${item.price.toFixed(2)}</span>` : ''}
              </div>
            `).join('')}
          </div>
        ` : '';
      }).join('');
      
      return `
        <section class="hero">
          <h1>${title}</h1>
        </section>
        <section class="menu-content">${menuHTML}</section>
      `;
    } else if (pathname === '/about' || pathname === '/nosotros') {
      const title = [data?.about_page_hero_title_first_line, data?.about_page_hero_title_second_line].filter(Boolean).join(' ') || 'Sobre Nosotros';
      return `
        <section class="hero">
          <h1>${title}</h1>
        </section>
        <section class="about-content">
          <p>Descubre nuestra historia y pasión por la gastronomía.</p>
        </section>
      `;
    } else if (pathname === '/contact' || pathname === '/contacto') {
      const title = [data?.contact_page_hero_title_first_line, data?.contact_page_hero_title_second_line].filter(Boolean).join(' ') || 'Contacto';
      return `
        <section class="hero">
          <h1>${title}</h1>
        </section>
        <section class="contact-content">
          ${phone ? `<div><strong>Teléfono:</strong> ${phone}</div>` : ''}
          ${email ? `<div><strong>Email:</strong> ${email}</div>` : ''}
          ${address ? `<div><strong>Dirección:</strong> ${address}</div>` : ''}
        </section>
      `;
    }
    return '<section><h1>Página no encontrada</h1></section>';
  })();
  
  const title = (() => {
    if (pathname === '/') return data?.homepage_hero_title || name;
    if (pathname === '/menu' || pathname === '/carta') return `Menú - ${name}`;
    if (pathname === '/about' || pathname === '/nosotros') return `Sobre Nosotros - ${name}`;
    if (pathname === '/contact' || pathname === '/contacto') return `Contacto - ${name}`;
    return name;
  })();
  
  const desc = data?.homepage_hero_description || `Descubre ${name}`;
  const image = data?.homepage_hero_background_url || '';
  const canonical = `https://${domain}${pathname}`;
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  ${image ? `<meta property="og:image" content="${image}">` : ''}
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  ${image ? `<meta name="twitter:image" content="${image}">` : ''}
  <meta name="robots" content="index, follow">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#333}
    .hero{padding:80px 20px;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;position:relative}
    .hero-bg{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0.3}
    .hero h1{font-size:48px;margin-bottom:16px;position:relative;z-index:1}
    .hero p{font-size:20px;max-width:800px;margin:0 auto;position:relative;z-index:1}
    .menu-preview,.menu-content,.about-content,.contact-content{padding:60px 20px;max-width:1200px;margin:0 auto}
    .menu-preview h2,.menu-category h3{font-size:36px;margin-bottom:24px;text-align:center}
    .menu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;margin-bottom:32px}
    .menu-item{background:#f8f9fa;padding:20px;border-radius:8px}
    .menu-item img{width:100%;height:200px;object-fit:cover;border-radius:4px;margin-bottom:12px}
    .menu-item h3,.menu-item h4{margin-bottom:8px}
    .menu-item p{color:#666;margin-bottom:8px}
    .price{font-weight:bold;color:#667eea}
    .btn{display:inline-block;background:#667eea;color:#fff;padding:12px 32px;text-decoration:none;border-radius:25px;margin-top:16px}
    .contact-content div{margin-bottom:16px}
    nav{background:#fff;border-bottom:1px solid #e9ecef;padding:16px 20px}
    nav a{margin:0 16px;text-decoration:none;color:#333}
  </style>
</head>
<body>
  <nav>
    <a href="/">Inicio</a>
    <a href="/menu">Menú</a>
    <a href="/nosotros">Nosotros</a>
    <a href="/contacto">Contacto</a>
  </nav>
  <main>${pageContent}</main>
  <footer style="background:#f8f9fa;padding:40px 20px;text-align:center;margin-top:60px">
    <p>&copy; ${new Date().getFullYear()} ${name}. Todos los derechos reservados.</p>
  </footer>
</body>
</html>`;
}

// Cache HTML in storage
async function cacheHTML(domain: string, pathname: string, html: string): Promise<void> {
  try {
    const storageKey = `prerenders/${domain}${pathname === '/' ? '/index' : pathname}.html`;
    
    await fetch(
      `${SUPABASE_URL}/storage/v1/object/client-assets/${storageKey}`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'text/html',
        },
        body: html,
      }
    );
    
    console.log(`✅ Cached HTML for ${pathname}`);
  } catch (error) {
    console.error('Error caching HTML:', error);
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

    // Try to fetch pre-rendered HTML from cache
    const storageKey = `prerenders/${domain}${pathname === '/' ? '/index' : pathname}.html`;
    const cachedResponse = await fetch(
      `${SUPABASE_URL}/storage/v1/object/public/client-assets/${storageKey}`
    );

    if (cachedResponse.ok) {
      console.log(`✅ Serving cached HTML for ${pathname}`);
      return new Response(await cachedResponse.text(), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'X-Prerendered': 'cached',
          'X-Robots-Tag': 'index, follow',
        },
      });
    }

    // No cache - generate and cache HTML
    console.log(`⚠️ No cache, generating HTML for ${pathname}`);
    const fastLoadData = await fetchFastLoadData(domain);
    
    if (!fastLoadData) {
      console.error('Failed to fetch fast-load data');
      return context.next();
    }

    const html = generateHTMLFromData(domain, pathname, fastLoadData);
    
    // Cache for next time (fire and forget)
    cacheHTML(domain, pathname, html);

    // Serve the generated HTML
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Prerendered': 'generated',
        'X-Robots-Tag': 'index, follow',
      },
    });

  } catch (error) {
    console.error('Error in bot middleware:', error);
    // Fall through to the normal app
    return context.next();
  }
}
