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

  // Build comprehensive semantic content per page using fast-load fields
  let bodyContent = '';
  const heroImg = image ? `<img src="${image}" alt="${name} hero image" loading="lazy" style="width:100%;height:400px;object-fit:cover;border-radius:8px;" />` : '';

  if (pathname === '/' || pathname === '') {
    bodyContent = `
      <header>
        <nav style="padding:16px;background:#f8f9fa;border-bottom:1px solid #e9ecef;">
          <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
            <h1 style="margin:0;font-size:24px;font-weight:bold;color:#333;">${name}</h1>
            <div style="display:flex;gap:24px;">
              <a href="/" style="color:#333;text-decoration:none;font-weight:500;">Inicio</a>
              <a href="/menu" style="color:#333;text-decoration:none;font-weight:500;">Menú</a>
              <a href="/nosotros" style="color:#333;text-decoration:none;font-weight:500;">Nosotros</a>
              <a href="/contacto" style="color:#333;text-decoration:none;font-weight:500;">Contacto</a>
            </div>
          </div>
        </nav>
      </header>
      
      <main>
        <!-- Hero Section -->
        <section style="padding:80px 20px;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">
          <div style="max-width:800px;margin:0 auto;">
            <h1 style="font-size:48px;margin-bottom:24px;line-height:1.2;">
              ${fast?.homepage_hero_title_first_line || 'Descubre la Experiencia Gastronómica Única'}
              ${fast?.homepage_hero_title_second_line ? `<br><span style=\"color:#ffd700;\">${fast.homepage_hero_title_second_line}</span>` : ''}
            </h1>
            <p style="font-size:20px;margin-bottom:32px;line-height:1.6;opacity:0.9;">
              ${fast?.homepage_hero_description || 'En Tu Restaurante, ofrecemos una experiencia culinaria que deleitará todos tus sentidos con nuestros platos únicos y frescos.'}
            </p>
            ${heroImg}
          </div>
        </section>

        <!-- About Section -->
        <section style="padding:80px 20px;background:#f8f9fa;">
          <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;">
            <div>
              <h2 style="font-size:36px;margin-bottom:24px;color:#333;">
                ${fast?.homepage_about_section_title_first_line || 'Donde la Tradición'}
                ${fast?.homepage_about_section_title_second_line ? `<br><span style=\"color:#667eea;\">${fast.homepage_about_section_title_second_line}</span>` : '<br><span style=\"color:#667eea;\">Se Encuentra con la Innovación</span>'}
              </h2>
              <p style="font-size:18px;line-height:1.6;color:#666;margin-bottom:16px;">
                ${fast?.about_story || 'Desde 2010, nuestro restaurante ha sido un faro de excelencia culinaria, combinando técnicas tradicionales con un toque contemporáneo.'}
              </p>
              <p style="font-size:18px;line-height:1.6;color:#666;margin-bottom:16px;">
                ${fast?.about_chef_info || 'Dirigido por el Chef Ejecutivo Carlos Mendoza, nuestro equipo selecciona los mejores ingredientes de temporada de granjas locales.'}
              </p>
              <p style="font-size:18px;line-height:1.6;color:#666;">
                ${fast?.about_mission || 'Desde cenas íntimas hasta grandes celebraciones, creamos momentos que perduran en la memoria mucho después del último bocado.'}
              </p>
            </div>
            <div>
              <img src="${fast?.homepage_about_section_image_url || fast?.homepage_hero_background_url || '/placeholder-restaurant.jpg'}" 
                   alt="Interior elegante del restaurante" 
                   style="width:100%;height:400px;object-fit:cover;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.1);" />
            </div>
          </div>
        </section>

        <!-- Menu Preview Section -->
        <section style="padding:80px 20px;background:white;">
          <div style="max-width:1200px;margin:0 auto;text-align:center;">
            <h2 style="font-size:36px;margin-bottom:16px;color:#333;">
              ${fast?.homepage_menu_section_title_first_line || 'Explora nuestro menú'}
            </h2>
            <p style="font-size:20px;color:#666;margin-bottom:48px;">
              ${fast?.homepage_menu_section_description || 'Descubre platos destacados y sabores únicos en ' + name + '.'}
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:32px;margin-bottom:48px;">
              <div style="background:#f8f9fa;padding:24px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="font-size:24px;margin-bottom:12px;color:#333;">Platos Principales</h3>
                <p style="color:#666;line-height:1.6;">Sabores auténticos preparados con ingredientes frescos y técnicas tradicionales.</p>
              </div>
              <div style="background:#f8f9fa;padding:24px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="font-size:24px;margin-bottom:12px;color:#333;">Postres</h3>
                <p style="color:#666;line-height:1.6;">Dulces creaciones que coronan perfectamente tu experiencia gastronómica.</p>
              </div>
              <div style="background:#f8f9fa;padding:24px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.1);">
                <h3 style="font-size:24px;margin-bottom:12px;color:#333;">Bebidas</h3>
                <p style="color:#666;line-height:1.6;">Selección cuidada de vinos, cocteles y bebidas que complementan cada plato.</p>
              </div>
            </div>
            <a href="/menu" style="display:inline-block;background:#667eea;color:white;padding:12px 32px;text-decoration:none;border-radius:25px;font-weight:500;transition:all 0.3s;">Ver menú completo</a>
          </div>
        </section>

        <!-- Services Section -->
        <section style="padding:80px 20px;background:#f8f9fa;">
          <div style="max-width:1200px;margin:0 auto;text-align:center;">
            <h2 style="font-size:36px;margin-bottom:16px;color:#333;">
              ${fast?.homepage_services_section_title_first_line || 'Experiencias'}
              ${fast?.homepage_services_section_title_second_line ? `<br><span style=\"color:#667eea;\">${fast.homepage_services_section_title_second_line}</span>` : '<br><span style=\"color:#667eea;\">Auténticas</span>'}
            </h2>
            <p style="font-size:20px;color:#666;margin-bottom:48px;">
              ${fast?.homepage_services_section_description || 'Desde una comida íntima hasta celebraciones especiales, te ofrecemos sabores únicos y un servicio cálido.'}
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;">
              <div style="background:white;padding:32px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.1);text-align:center;">
                <h3 style="font-size:24px;margin-bottom:16px;color:#333;">${fast?.services_card1_title || 'Comida en el Local'}</h3>
                <p style="color:#666;line-height:1.6;">${fast?.services_card1_description || 'Disfruta de nuestros platos únicos en un ambiente acogedor y familiar.'}</p>
              </div>
              <div style="background:white;padding:32px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.1);text-align:center;">
                <h3 style="font-size:24px;margin-bottom:16px;color:#333;">${fast?.services_card2_title || 'Delivery'}</h3>
                <p style="color:#666;line-height:1.6;">${fast?.services_card2_description || 'Lleva los sabores de nuestro restaurante a tu hogar con nuestro servicio de delivery.'}</p>
              </div>
              <div style="background:white;padding:32px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.1);text-align:center;">
                <h3 style="font-size:24px;margin-bottom:16px;color:#333;">${fast?.services_card3_title || 'Eventos Pequeños'}</h3>
                <p style="color:#666;line-height:1.6;">${fast?.services_card3_description || 'Celebra tus momentos especiales con nosotros, perfecto para reuniones íntimas.'}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact Section -->
        <section style="padding:80px 20px;background:white;">
          <div style="max-width:1200px;margin:0 auto;">
            <div style="text-align:center;margin-bottom:48px;">
              <h2 style="font-size:36px;margin-bottom:16px;color:#333;">
                ${fast?.homepage_contact_section_title_first_line || 'Reserva Tu'}
                ${fast?.homepage_contact_section_title_second_line ? `<br><span style=\"color:#667eea;\">${fast.homepage_contact_section_title_second_line}</span>` : '<br><span style=\"color:#667eea;\">Experiencia</span>'}
              </h2>
              <p style="font-size:20px;color:#666;">
                ${fast?.homepage_contact_section_description || '¿Listo para disfrutar de sabores únicos? Te esperamos en ' + name + '.'}
              </p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:32px;">
              ${fast?.phone ? `<div style=\"text-align:center;padding:24px;\">
                <h3 style=\"font-size:20px;margin-bottom:8px;color:#333;\">Teléfono</h3>
                <p style=\"color:#666;\">${fast.phone_country_code || '+51'} ${fast.phone}</p>
              </div>` : ''}
              ${fast?.email ? `<div style=\"text-align:center;padding:24px;\">
                <h3 style=\"font-size:20px;margin-bottom:8px;color:#333;\">Email</h3>
                <p style=\"color:#666;\">${fast.email}</p>
              </div>` : ''}
              ${fast?.address ? `<div style=\"text-align:center;padding:24px;\">
                <h3 style=\"font-size:20px;margin-bottom:8px;color:#333;\">Ubicación</h3>
                <p style=\"color:#666;\">${fast.address}</p>
              </div>` : ''}
              <div style="text-align:center;padding:24px;">
                <h3 style="font-size:20px;margin-bottom:8px;color:#333;">Horarios</h3>
                <p style="color:#666;">Lunes a Domingo<br>12:00 PM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    `;
  } else if (pathname === '/menu' || pathname === '/carta') {
    bodyContent = `
      <header>
        <nav style="padding:16px;background:#f8f9fa;border-bottom:1px solid #e9ecef;">
          <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
            <h1 style="margin:0;font-size:24px;font-weight:bold;color:#333;">${name}</h1>
            <div style="display:flex;gap:24px;">
              <a href="/" style="color:#333;text-decoration:none;font-weight:500;">Inicio</a>
              <a href="/menu" style="color:#667eea;text-decoration:none;font-weight:500;">Menú</a>
              <a href="/nosotros" style="color:#333;text-decoration:none;font-weight:500;">Nosotros</a>
              <a href="/contacto" style="color:#333;text-decoration:none;font-weight:500;">Contacto</a>
            </div>
          </div>
        </nav>
      </header>
      
      <main>
        <section style="padding:80px 20px;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">
          <div style="max-width:800px;margin:0 auto;">
            <h1 style="font-size:48px;margin-bottom:24px;line-height:1.2;">${title}</h1>
            ${desc ? `<p style=\"font-size:20px;margin-bottom:32px;line-height:1.6;opacity:0.9;\">${desc}</p>` : ''}
            ${heroImg}
          </div>
        </section>
        <section style="padding:80px 20px;background:white;">
          <div style="max-width:1200px;margin:0 auto;">
            <h2 style="font-size:36px;text-align:center;margin-bottom:48px;color:#333;">Nuestras Especialidades</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;">
              <div style="background:#f8f9fa;padding:24px;border-radius:8px;">
                <h3 style="font-size:24px;margin-bottom:16px;color:#333;">Entradas</h3>
                <p style="color:#666;line-height:1.6;">Deliciosos aperitivos para comenzar tu experiencia gastronómica.</p>
              </div>
              <div style="background:#f8f9fa;padding:24px;border-radius:8px;">
                <h3 style="font-size:24px;margin-bottom:16px;color:#333;">Platos Principales</h3>
                <p style="color:#666;line-height:1.6;">Especialidades de la casa preparadas con ingredientes frescos.</p>
              </div>
              <div style="background:#f8f9fa;padding:24px;border-radius:8px;">
                <h3 style="font-size:24px;margin-bottom:16px;color:#333;">Postres</h3>
                <p style="color:#666;line-height:1.6;">Dulces creaciones para culminar tu comida perfectamente.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    `;
  } else if (pathname === '/about' || pathname === '/nosotros') {
    bodyContent = `
      <header>
        <nav style="padding:16px;background:#f8f9fa;border-bottom:1px solid #e9ecef;">
          <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
            <h1 style="margin:0;font-size:24px;font-weight:bold;color:#333;">${name}</h1>
            <div style="display:flex;gap:24px;">
              <a href="/" style="color:#333;text-decoration:none;font-weight:500;">Inicio</a>
              <a href="/menu" style="color:#333;text-decoration:none;font-weight:500;">Menú</a>
              <a href="/nosotros" style="color:#667eea;text-decoration:none;font-weight:500;">Nosotros</a>
              <a href="/contacto" style="color:#333;text-decoration:none;font-weight:500;">Contacto</a>
            </div>
          </div>
        </nav>
      </header>
      
      <main>
        <section style="padding:80px 20px;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">
          <div style="max-width:800px;margin:0 auto;">
            <h1 style="font-size:48px;margin-bottom:24px;line-height:1.2;">${title}</h1>
            ${desc ? `<p style=\"font-size:20px;margin-bottom:32px;line-height:1.6;opacity:0.9;\">${desc}</p>` : ''}
            ${heroImg}
          </div>
        </section>
        <section style="padding:80px 20px;background:white;">
          <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;">
            <div>
              <h2 style="font-size:36px;margin-bottom:24px;color:#333;">Nuestra Historia</h2>
              <p style="font-size:18px;line-height:1.6;color:#666;margin-bottom:16px;">
                ${fast?.about_story || name + ' combina ingredientes frescos con tradición culinaria local.'}
              </p>
              <p style="font-size:18px;line-height:1.6;color:#666;margin-bottom:16px;">
                ${fast?.about_chef_info || 'Nuestro equipo culinario está dedicado a crear experiencias gastronómicas memorables.'}
              </p>
              <p style="font-size:18px;line-height:1.6;color:#666;">
                ${fast?.about_mission || 'Cada plato cuenta una historia de pasión, calidad y dedicación culinaria.'}
              </p>
            </div>
            <div>
              <img src="${fast?.about_page_about_section_image_url || fast?.homepage_about_section_image_url || '/placeholder-restaurant.jpg'}" 
                   alt="Interior del restaurante" 
                   style="width:100%;height:400px;object-fit:cover;border-radius:8px;" />
            </div>
          </div>
        </section>
      </main>
    `;
  } else if (pathname === '/contact' || pathname === '/contacto') {
    bodyContent = `
      <header>
        <nav style="padding:16px;background:#f8f9fa;border-bottom:1px solid #e9ecef;">
          <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
            <h1 style="margin:0;font-size:24px;font-weight:bold;color:#333;">${name}</h1>
            <div style="display:flex;gap:24px;">
              <a href="/" style="color:#333;text-decoration:none;font-weight:500;">Inicio</a>
              <a href="/menu" style="color:#333;text-decoration:none;font-weight:500;">Menú</a>
              <a href="/nosotros" style="color:#333;text-decoration:none;font-weight:500;">Nosotros</a>
              <a href="/contacto" style="color:#667eea;text-decoration:none;font-weight:500;">Contacto</a>
            </div>
          </div>
        </nav>
      </header>
      
      <main>
        <section style="padding:80px 20px;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">
          <div style="max-width:800px;margin:0 auto;">
            <h1 style="font-size:48px;margin-bottom:24px;line-height:1.2;">${title}</h1>
            ${desc ? `<p style=\"font-size:20px;margin-bottom:32px;line-height:1.6;opacity:0.9;\">${desc}</p>` : ''}
            ${heroImg}
          </div>
        </section>
        <section style="padding:80px 20px;background:white;">
          <div style="max-width:1200px;margin:0 auto;">
            <h2 style="font-size:36px;text-align:center;margin-bottom:48px;color:#333;">Información de Contacto</h2>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:32px;">
              ${fast?.phone ? `<div style=\"text-align:center;padding:24px;background:#f8f9fa;border-radius:8px;\">
                <h3 style=\"font-size:20px;margin-bottom:8px;color:#333;\">Teléfono</h3>
                <p style=\"color:#666;\">${fast.phone_country_code || '+51'} ${fast.phone}</p>
              </div>` : ''}
              ${fast?.whatsapp ? `<div style=\"text-align:center;padding:24px;background:#f8f9fa;border-radius:8px;\">
                <h3 style=\"font-size:20px;margin-bottom:8px;color:#333;\">WhatsApp</h3>
                <p style=\"color:#666;\">${fast.whatsapp_country_code || '+51'} ${fast.whatsapp}</p>
              </div>` : ''}
              ${fast?.email ? `<div style=\"text-align:center;padding:24px;background:#f8f9fa;border-radius:8px;\">
                <h3 style=\"font-size:20px;margin-bottom:8px;color:#333;\">Email</h3>
                <p style=\"color:#666;\">${fast.email}</p>
              </div>` : ''}
              ${fast?.address ? `<div style=\"text-align:center;padding:24px;background:#f8f9fa;border-radius:8px;\">
                <h3 style=\"font-size:20px;margin-bottom:8px;color:#333;\">Dirección</h3>
                <p style=\"color:#666;\">${fast.address}</p>
              </div>` : ''}
            </div>
          </div>
        </section>
      </main>
    `;
  } else {
    bodyContent = `
      <header>
        <nav style="padding:16px;background:#f8f9fa;border-bottom:1px solid #e9ecef;">
          <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
            <h1 style="margin:0;font-size:24px;font-weight:bold;color:#333;">${name}</h1>
            <div style="display:flex;gap:24px;">
              <a href="/" style="color:#333;text-decoration:none;font-weight:500;">Inicio</a>
              <a href="/menu" style="color:#333;text-decoration:none;font-weight:500;">Menú</a>
              <a href="/nosotros" style="color:#333;text-decoration:none;font-weight:500;">Nosotros</a>
              <a href="/contacto" style="color:#333;text-decoration:none;font-weight:500;">Contacto</a>
            </div>
          </div>
        </nav>
      </header>
      
      <main>
        <section style="padding:80px 20px;text-align:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">
          <div style="max-width:800px;margin:0 auto;">
            <h1 style="font-size:48px;margin-bottom:24px;line-height:1.2;">${title}</h1>
            ${desc ? `<p style=\"font-size:20px;margin-bottom:32px;line-height:1.6;opacity:0.9;\">${desc}</p>` : ''}
            ${heroImg}
          </div>
        </section>
      </main>
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
  <meta property="og:url" content="${canonical}" />
  ${image ? `<meta property=\"og:image\" content=\"${image}\" />` : ''}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  ${image ? `<meta name=\"twitter:image\" content=\"${image}\" />` : ''}
  ${fast?.google_search_console_verification ? `<meta name=\"google-site-verification\" content=\"${fast.google_search_console_verification}\" />` : ''}
  ${fast?.favicon_url ? `<link rel=\"icon\" href=\"${fast.favicon_url}\" />` : ''}
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    @media (max-width: 768px) {
      .grid { grid-template-columns: 1fr !important; }
      h1 { font-size: 32px !important; }
      h2 { font-size: 28px !important; }
      section { padding: 40px 20px !important; }
      nav div { flex-direction: column !important; gap: 16px !important; }
    }
  </style>
</head>
<body>
  ${bodyContent}
  <footer style="background:#333;color:white;padding:40px 20px;text-align:center;">
    <div style="max-width:1200px;margin:0 auto;">
      <p style="margin-bottom:16px;">© ${new Date().getFullYear()} ${name}. Todos los derechos reservados.</p>
      <div style="display:flex;justify-content:center;gap:24px;flex-wrap:wrap;">
        <a href="/" style="color:#ccc;text-decoration:none;">Inicio</a>
        <a href="/menu" style="color:#ccc;text-decoration:none;">Menú</a>
        <a href="/nosotros" style="color:#ccc;text-decoration:none;">Nosotros</a>
        <a href="/contacto" style="color:#ccc;text-decoration:none;">Contacto</a>
      </div>
    </div>
  </footer>
</body>
</html>`;

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';

  const isTest = url.searchParams.has('__bot');
  const bot = isBot(userAgent) || isTest;

  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('X-Forwarded-Host');
  const domain = (forwardedHost || url.hostname).replace(/^www\./, '');

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
      'X-Bot-Mode': bot ? '1' : '0',
      'X-Resolved-Host': domain
    },
  });
}
