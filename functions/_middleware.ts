const SUPABASE_URL = 'https://ptzcetvcccnojdbzzlyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0emNldHZjY2Nub2pkYnp6bHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NjExNzksImV4cCI6MjA3NDMzNzE3OX0.2HS2wP06xe8PryWW_VdzTu7TDYg303BjwmzyA_5Ang8';

// Common bot user agents
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

function isBot(userAgent: string): boolean {
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

async function fetchFastLoad(hostname: string) {
  const normalized = hostname.replace(/^www\./, '');
  const labels = normalized.split('.');
  const subdomain = labels.length >= 3 ? labels[0] : '';
  const candidates = [normalized, ...(subdomain ? [subdomain] : [])];

  const tryFetch = async (key: string, bust = false) => {
    const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/client-assets/fast-load/${key}.json${bust ? `?ts=${Date.now()}` : ''}`;
    const res = await fetch(fileUrl, {
      headers: { 'Cache-Control': 'no-cache' }
    }).catch(() => null);
    if (res && res.ok) {
      const json = await res.json();
      return { json, key } as const;
    }
    return null;
  };

  // Try existing snapshots (hostname first, then subdomain)
  for (const key of candidates) {
    const hit = await tryFetch(key);
    if (hit) return { ...hit.json, __fast_key: key, __used_subdomain: subdomain || null };
  }

  // If absent, generate it once via edge function, then retry with both keys
  const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/prebuild-client-data`;
  const body = subdomain ? { subdomain } : { domain: normalized };
  await fetch(edgeFunctionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).catch(() => null);
  
  for (const key of candidates) {
    const hit = await tryFetch(key, true);
    if (hit) return { ...hit.json, __fast_key: key, __used_subdomain: subdomain || null };
  }

  return null;
}

function pageMetaFromFastLoad(pathname: string, fast: any) {
  const baseTitle = fast?.restaurant_name || 'Mi Restaurante Online';
  const canonical = `https://${fast?.domain || ''}${pathname}`;

  const pageMap: Record<string, { title?: string; desc?: string; image?: string }> = {
    '/': {
      title: fast?.homepage_hero_title || [fast?.homepage_hero_title_first_line, fast?.homepage_hero_title_second_line].filter(Boolean).join(' ') || baseTitle,
      desc: fast?.homepage_hero_description || '' ,
      image: fast?.homepage_hero_background_url,
    },
    '/menu': {
      title: [fast?.menu_page_hero_title_first_line, fast?.menu_page_hero_title_second_line].filter(Boolean).join(' ') || `${baseTitle} · Menú`,
      desc: fast?.menu_page_hero_description || '',
      image: fast?.menu_page_hero_background_url,
    },
    '/carta': {
      title: [fast?.menu_page_hero_title_first_line, fast?.menu_page_hero_title_second_line].filter(Boolean).join(' ') || `${baseTitle} · Carta`,
      desc: fast?.menu_page_hero_description || '',
      image: fast?.menu_page_hero_background_url,
    },
    '/about': {
      title: [fast?.about_page_hero_title_first_line, fast?.about_page_hero_title_second_line].filter(Boolean).join(' ') || `${baseTitle} · Sobre nosotros`,
      desc: fast?.about_page_hero_description || '',
      image: fast?.about_page_hero_background_url,
    },
    '/nosotros': {
      title: [fast?.about_page_hero_title_first_line, fast?.about_page_hero_title_second_line].filter(Boolean).join(' ') || `${baseTitle} · Nosotros`,
      desc: fast?.about_page_hero_description || '',
      image: fast?.about_page_hero_background_url,
    },
    '/contact': {
      title: [fast?.contact_page_hero_title_first_line, fast?.contact_page_hero_title_second_line].filter(Boolean).join(' ') || `${baseTitle} · Contacto`,
      desc: fast?.contact_page_hero_description || '',
      image: fast?.contact_page_hero_background_url,
    },
    '/contacto': {
      title: [fast?.contact_page_hero_title_first_line, fast?.contact_page_hero_title_second_line].filter(Boolean).join(' ') || `${baseTitle} · Contacto`,
      desc: fast?.contact_page_hero_description || '',
      image: fast?.contact_page_hero_background_url,
    },
  };

  const meta = pageMap[pathname] || pageMap['/'];
  return { title: meta.title || baseTitle, desc: meta.desc || '', image: meta.image, canonical };
}

function buildHTML(pathname: string, domain: string, fast: any) {
  const { title, desc, image, canonical } = pageMetaFromFastLoad(pathname, { ...fast, domain });
  const name = fast?.restaurant_name || 'Mi Restaurante Online';

  // Build simple semantic content per page using fast-load fields
  let bodyContent = '';
  const heroImg = image ? `<img src="${image}" alt="${name} hero image" loading="lazy" />` : '';

  if (pathname === '/' || pathname === '') {
    bodyContent = `
      <section>
        <h1>${title}</h1>
        ${desc ? `<p>${desc}</p>` : ''}
        ${heroImg}
      </section>
      <section>
        <h2>Explora nuestro menú</h2>
        <p>Descubre platos destacados y sabores únicos en ${name}.</p>
        <a href="/menu">Ver menú</a>
      </section>
    `;
  } else if (pathname === '/menu' || pathname === '/carta') {
    bodyContent = `
      <section>
        <h1>${title}</h1>
        ${desc ? `<p>${desc}</p>` : ''}
        ${heroImg}
      </section>
      <section>
        <h2>Platos populares</h2>
        <p>Sabores destacados seleccionados por nuestros clientes.</p>
      </section>
    `;
  } else if (pathname === '/about' || pathname === '/nosotros') {
    bodyContent = `
      <section>
        <h1>${title}</h1>
        ${desc ? `<p>${desc}</p>` : ''}
        ${heroImg}
      </section>
      <section>
        <h2>Nuestra historia</h2>
        <p>${name} combina ingredientes frescos con tradición culinaria local.</p>
      </section>
    `;
  } else if (pathname === '/contact' || pathname === '/contacto') {
    const phone = fast?.phone || '';
    const whatsapp = fast?.whatsapp || '';
    bodyContent = `
      <section>
        <h1>${title}</h1>
        ${desc ? `<p>${desc}</p>` : ''}
        ${heroImg}
      </section>
      <section>
        <h2>Contáctanos</h2>
        ${phone ? `<p>Teléfono: ${phone}</p>` : ''}
        ${whatsapp ? `<p>WhatsApp: ${whatsapp}</p>` : ''}
      </section>
    `;
  } else {
    bodyContent = `
      <section>
        <h1>${title}</h1>
        ${desc ? `<p>${desc}</p>` : ''}
        ${heroImg}
      </section>
    `;
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:type" content="website" />
  ${fast?.google_search_console_verification ? `<meta name="google-site-verification" content="${fast.google_search_console_verification}" />` : ''}
  ${fast?.favicon_url ? `<link rel="icon" href="${fast.favicon_url}" />` : ''}
</head>
<body>
  <nav>
    <a href="/">Inicio</a>
    <a href="/menu">Menú</a>
    <a href="/about">Nosotros</a>
    <a href="/contact">Contacto</a>
  </nav>
  <main>
    ${bodyContent}
  </main>
  <footer>
    <p>© ${new Date().getFullYear()} ${name}</p>
  </footer>
</body>
</html>`;
}

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  const isTest = url.searchParams.has('__bot');
  const bot = isBot(userAgent) || isTest;

  const domain = url.hostname.replace(/^www\./, '');

  if (!bot) {
    return context.next();
  }

  // Ensure we have fast-load snapshot and return semantic HTML
  const fast = await fetchFastLoad(domain);

  // Build HTML using fast data or fallback minimal info
  const html = buildHTML(url.pathname, domain, fast || { restaurant_name: 'Mi Restaurante Online', domain });
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'index, follow',
      ...(fast?.__fast_key ? { 'X-Fast-Key': String(fast.__fast_key) } : {}),
      ...(fast?.__used_subdomain ? { 'X-Fast-Used-Subdomain': String(fast.__used_subdomain) } : {}),
      'X-Bot-Mode': bot ? '1' : '0'
    },
  });
}
