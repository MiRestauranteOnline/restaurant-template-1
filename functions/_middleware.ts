const SUPABASE_URL = 'https://ptzcetvcccnojdbzzlyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0emNldHZjY2Nub2pkYnp6bHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NjExNzksImV4cCI6MjA3NDMzNzE3OX0.2HS2wP06xe8PryWW_VdzTu7TDYg303BjwmzyA_5Ang8';

// Bot detection - comprehensive list of search engine crawlers and SEO tools
function isBot(userAgent: string): boolean {
  const botPatterns = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'facebookexternalhit', 'twitterbot', 'whatsapp',
    'linkedinbot', 'slackbot', 'telegrambot', 'applebot', 'ia_archiver',
    'crawler', 'spider', 'bot', 'crawl', 'scraper', 'simulator',
    'seo', 'check', 'test', 'monitor', 'validator', 'lighthouse',
    'pagespeed', 'pingdom', 'gtmetrix', 'semrush', 'ahrefs', 'moz'
  ];
  const ua = userAgent.toLowerCase();
  return botPatterns.some(bot => ua.includes(bot));
}

// Extract domain from request
function extractDomain(request: Request): string | null {
  const url = new URL(request.url);
  const host = request.headers.get('x-forwarded-host') || url.hostname;
  
  // Check if custom domain or subdomain
  if (host.includes('mirestaurante.online')) {
    // Extract subdomain: demo-2.mirestaurante.online -> demo-2
    const subdomain = host.split('.')[0];
    return subdomain;
  }
  
  // Custom domain
  return host;
}

// Generate SEO-optimized HTML for bots
async function generateBotHTML(domain: string, pathname: string): Promise<string | null> {
  // Fetch client data by subdomain or custom_domain using REST API (no joins to avoid FK requirements)
  const isCustomDomain = domain.includes('.');
  const filter = isCustomDomain 
    ? `custom_domain=eq.${encodeURIComponent(domain)}` 
    : `subdomain=eq.${encodeURIComponent(domain)}`;

  const clientRes = await fetch(
    `${SUPABASE_URL}/rest/v1/clients?select=*&${filter}&limit=1`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!clientRes.ok) {
    console.log('[BOT-SSR] Failed to fetch client base data:', domain, clientRes.status);
    return null;
  }

  const baseClients = await clientRes.json();
  const client: any = baseClients?.[0];
  if (!client) {
    console.log('[BOT-SSR] Client not found for domain:', domain);
    return null;
  }

  // Fetch related data in parallel by client_id
  const clientId = client.id;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  } as const;

  const [adminContentRes, settingsRes, itemsRes, categoriesRes, reviewsRes, faqsRes, teamRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/admin_content?client_id=eq.${clientId}`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/client_settings?client_id=eq.${clientId}`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/menu_items?client_id=eq.${clientId}`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/menu_categories?client_id=eq.${clientId}`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/reviews?client_id=eq.${clientId}`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/faqs?client_id=eq.${clientId}`, { headers }),
    fetch(`${SUPABASE_URL}/rest/v1/team_members?client_id=eq.${clientId}`, { headers }),
  ]);

  const [adminContentArr, settingsArr, menuItems, menuCategories, reviews, faqs, teamMembers] = await Promise.all([
    adminContentRes.ok ? adminContentRes.json() : Promise.resolve([]),
    settingsRes.ok ? settingsRes.json() : Promise.resolve([]),
    itemsRes.ok ? itemsRes.json() : Promise.resolve([]),
    categoriesRes.ok ? categoriesRes.json() : Promise.resolve([]),
    reviewsRes.ok ? reviewsRes.json() : Promise.resolve([]),
    faqsRes.ok ? faqsRes.json() : Promise.resolve([]),
    teamRes.ok ? teamRes.json() : Promise.resolve([]),
  ]);

  // Attach for downstream rendering (compatible with existing code)
  client.admin_content = adminContentArr;
  client.client_settings = settingsArr;
  client.menu_items = menuItems;
  client.menu_categories = menuCategories;
  client.reviews = reviews;
  client.faqs = faqs;
  client.team_members = teamMembers;
  
  const adminContent = client.admin_content?.[0] || {};
  const settings = client.client_settings?.[0] || {};
  
  // Determine page type
  let pageTitle = '';
  let pageDescription = '';
  let pageKeywords: string[] = [];
  let pageContent = '';
  
  const restaurantName = client.restaurant_name || 'Restaurant';
  const baseUrl = client.custom_domain 
    ? `https://${client.custom_domain}` 
    : `https://${client.subdomain}.mirestaurante.online`;
  
  // Build opening hours text
  const openingHoursText = client.opening_hours 
    ? Object.entries(client.opening_hours)
        .filter(([_, hours]) => hours && hours !== 'Cerrado')
        .map(([day, hours]) => `${day}: ${hours}`)
        .join(', ')
    : '';
  
  switch (pathname) {
    case '/':
    case '':
      pageTitle = `${restaurantName} - ${adminContent.homepage_hero_title || 'Restaurante'}`;
      pageDescription = adminContent.homepage_hero_description || `Bienvenido a ${restaurantName}. Experiencia gastronómica excepcional.`;
      pageKeywords = [restaurantName, 'restaurante', 'comida', 'gastronomía', client.address || ''];
      
      // Homepage content with proper structure
      pageContent = `
        <main>
          <section>
            <h1>${adminContent.homepage_hero_title_first_line || ''} ${adminContent.homepage_hero_title_second_line || restaurantName}</h1>
            <p>${adminContent.homepage_hero_description || ''}</p>
          </section>
          
          ${adminContent.homepage_about_section_visible !== false ? `
          <section>
            <h2>${adminContent.homepage_about_section_title || 'Nuestra Historia'}</h2>
            <p>${adminContent.homepage_about_section_description || adminContent.about_story || ''}</p>
          </section>
          ` : ''}
          
          ${adminContent.homepage_menu_section_visible !== false && client.menu_items?.length > 0 ? `
          <section>
            <h2>${adminContent.homepage_menu_section_title || 'Nuestro Menú'}</h2>
            <p>${adminContent.homepage_menu_section_description || ''}</p>
            ${client.menu_items.slice(0, 12).map((item: any) => `
              <article>
                <h3>${item.name}</h3>
                <p>${item.description || ''}</p>
                <p><strong>${item.price || ''}</strong></p>
                ${item.image_url ? `<img src="${item.image_url}" alt="${item.name} - ${restaurantName}" loading="lazy" />` : ''}
              </article>
            `).join('')}
          </section>
          ` : ''}
          
          ${adminContent.homepage_services_section_visible !== false ? `
          <section>
            <h2>${adminContent.homepage_services_section_title || 'Nuestros Servicios'}</h2>
            <p>${adminContent.homepage_services_section_description || ''}</p>
            <ul>
              ${adminContent.services_card1_title ? `<li><strong>${adminContent.services_card1_title}:</strong> ${adminContent.services_card1_description || ''}</li>` : ''}
              ${adminContent.services_card2_title ? `<li><strong>${adminContent.services_card2_title}:</strong> ${adminContent.services_card2_description || ''}</li>` : ''}
              ${adminContent.services_card3_title ? `<li><strong>${adminContent.services_card3_title}:</strong> ${adminContent.services_card3_description || ''}</li>` : ''}
            </ul>
          </section>
          ` : ''}
          
          ${adminContent.homepage_reviews_section_visible !== false && client.reviews?.length > 0 ? `
          <section>
            <h2>${adminContent.reviews_section_title_first_line || ''} ${adminContent.reviews_section_title_second_line || 'Testimonios'}</h2>
            <p>${adminContent.reviews_section_description || ''}</p>
            ${client.reviews.slice(0, 6).map((review: any) => `
              <article>
                <p><strong>${review.customer_name}</strong></p>
                <p>${review.review_text}</p>
                <p>Calificación: ${review.rating}/5</p>
              </article>
            `).join('')}
          </section>
          ` : ''}
          
          ${adminContent.homepage_contact_section_visible !== false ? `
          <section>
            <h2>${adminContent.homepage_contact_section_title || 'Contacto'}</h2>
            <p>${adminContent.homepage_contact_section_description || ''}</p>
            <address>
              ${client.address ? `<p><strong>Dirección:</strong> ${client.address}</p>` : ''}
              ${client.phone ? `<p><strong>Teléfono:</strong> <a href="tel:${client.phone_country_code || '+51'}${client.phone}">${client.phone_country_code || '+51'} ${client.phone}</a></p>` : ''}
              ${client.email ? `<p><strong>Email:</strong> <a href="mailto:${client.email}">${client.email}</a></p>` : ''}
              ${openingHoursText ? `<p><strong>Horario:</strong> ${openingHoursText}</p>` : ''}
            </address>
          </section>
          ` : ''}
        </main>
      `;
      break;
      
    case '/menu':
      pageTitle = `Menú - ${restaurantName}`;
      pageDescription = adminContent.menu_page_hero_description || `Explora el menú completo de ${restaurantName}. Platos únicos y especialidades.`;
      pageKeywords = [restaurantName, 'menú', 'carta', 'platos', 'comida'];
      
      pageContent = `
        <main>
          <h1>${adminContent.menu_page_hero_title_first_line || ''} ${adminContent.menu_page_hero_title_second_line || 'Nuestro Menú'}</h1>
          <p>${adminContent.menu_page_hero_description || ''}</p>
          
          ${client.menu_categories?.map((category: any) => {
            const categoryItems = client.menu_items?.filter((item: any) => item.category_id === category.id) || [];
            return `
              <section>
                <h2>${category.name}</h2>
                ${category.description ? `<p>${category.description}</p>` : ''}
                ${categoryItems.map((item: any) => `
                  <article>
                    <h3>${item.name}</h3>
                    <p>${item.description || ''}</p>
                    <p><strong>${item.price || ''}</strong></p>
                    ${item.image_url ? `<img src="${item.image_url}" alt="${item.name} - ${restaurantName}" loading="lazy" />` : ''}
                  </article>
                `).join('')}
              </section>
            `;
          }).join('') || ''}
        </main>
      `;
      break;
      
    case '/nosotros':
    case '/about':
      pageTitle = `Nosotros - ${restaurantName}`;
      pageDescription = adminContent.about_page_hero_description || `Conoce la historia de ${restaurantName}. Nuestra pasión por la gastronomía.`;
      pageKeywords = [restaurantName, 'nosotros', 'historia', 'equipo', 'chef'];
      
      pageContent = `
        <main>
          <h1>${adminContent.about_page_hero_title_first_line || ''} ${adminContent.about_page_hero_title_second_line || 'Nuestra Historia'}</h1>
          <p>${adminContent.about_page_hero_description || ''}</p>
          
          <section>
            <h2>Nuestra Historia</h2>
            <p>${adminContent.about_story || ''}</p>
          </section>
          
          <section>
            <h2>Nuestra Misión</h2>
            <p>${adminContent.about_mission || ''}</p>
          </section>
          
          ${adminContent.about_chef_info ? `
          <section>
            <h2>Nuestro Chef</h2>
            <p>${adminContent.about_chef_info}</p>
          </section>
          ` : ''}
          
          ${client.team_members?.length > 0 ? `
          <section>
            <h2>${adminContent.about_team_section_title_first_line || ''} ${adminContent.about_team_section_title_second_line || 'Nuestro Equipo'}</h2>
            <p>${adminContent.about_team_section_description || ''}</p>
            ${client.team_members.map((member: any) => `
              <article>
                <h3>${member.name}</h3>
                <p><strong>${member.role}</strong></p>
                <p>${member.bio || ''}</p>
                ${member.image_url ? `<img src="${member.image_url}" alt="${member.name} - ${member.role}" loading="lazy" />` : ''}
              </article>
            `).join('')}
          </section>
          ` : ''}
        </main>
      `;
      break;
      
    case '/contacto':
    case '/contact':
      pageTitle = `Contacto - ${restaurantName}`;
      pageDescription = `Contacta con ${restaurantName}. Reservas, consultas y ubicación.`;
      pageKeywords = [restaurantName, 'contacto', 'reservas', 'ubicación', 'teléfono'];
      
      pageContent = `
        <main>
          <h1>${adminContent.contact_page_hero_title_first_line || ''} ${adminContent.contact_page_hero_title_second_line || 'Contáctanos'}</h1>
          <p>${adminContent.contact_page_hero_description || ''}</p>
          
          <section>
            <h2>Información de Contacto</h2>
            <address>
              ${client.address ? `<p><strong>Dirección:</strong> ${client.address}</p>` : ''}
              ${client.phone ? `<p><strong>Teléfono:</strong> <a href="tel:${client.phone_country_code || '+51'}${client.phone}">${client.phone_country_code || '+51'} ${client.phone}</a></p>` : ''}
              ${client.email ? `<p><strong>Email:</strong> <a href="mailto:${client.email}">${client.email}</a></p>` : ''}
              ${client.whatsapp ? `<p><strong>WhatsApp:</strong> <a href="https://wa.me/${client.whatsapp_country_code || '+51'}${client.whatsapp}">Enviar mensaje</a></p>` : ''}
            </address>
          </section>
          
          ${openingHoursText ? `
          <section>
            <h2>Horario de Atención</h2>
            <p>${openingHoursText}</p>
          </section>
          ` : ''}
          
          ${adminContent.contact_reservation_title ? `
          <section>
            <h2>${adminContent.contact_reservation_title}</h2>
            <p>${adminContent.contact_reservation_description || ''}</p>
          </section>
          ` : ''}
        </main>
      `;
      break;
      
    case '/resenas':
    case '/reviews':
      pageTitle = `Testimonios - ${restaurantName}`;
      pageDescription = `Lee las opiniones de nuestros clientes sobre ${restaurantName}. Testimonios reales.`;
      pageKeywords = [restaurantName, 'testimonios', 'opiniones', 'reseñas', 'clientes'];
      
      pageContent = `
        <main>
          <h1>${adminContent.reviews_page_hero_title_first_line || ''} ${adminContent.reviews_page_hero_title_second_line || 'Testimonios'}</h1>
          <p>${adminContent.reviews_page_hero_description || ''}</p>
          
          <section>
            <h2>Lo que dicen nuestros clientes</h2>
            ${client.reviews?.map((review: any) => `
              <article>
                <h3>${review.customer_name}</h3>
                <p>${review.review_text}</p>
                <p><strong>Calificación:</strong> ${review.rating}/5 estrellas</p>
                ${review.created_at ? `<p><time>${new Date(review.created_at).toLocaleDateString('es')}</time></p>` : ''}
              </article>
            `).join('') || '<p>Aún no hay reseñas disponibles.</p>'}
          </section>
        </main>
      `;
      break;
      
    default:
      return null;
  }
  
  // Build full HTML document with proper SEO structure
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}">
  <meta name="keywords" content="${pageKeywords.join(', ')}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${baseUrl}${pathname}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDescription}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${baseUrl}${pathname}">
  ${adminContent.homepage_hero_background_url ? `<meta property="og:image" content="${adminContent.homepage_hero_background_url}">` : ''}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${pageDescription}">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "${restaurantName}",
    "description": "${pageDescription}",
    "url": "${baseUrl}",
    ${client.address ? `"address": {
      "@type": "PostalAddress",
      "streetAddress": "${client.address}",
      "addressCountry": "${client.country_code || 'PE'}"
    },` : ''}
    ${client.phone ? `"telephone": "${client.phone_country_code || '+51'}${client.phone}",` : ''}
    ${client.email ? `"email": "${client.email}",` : ''}
    "servesCuisine": "${settings.cuisine_type || 'International'}",
    "priceRange": "${settings.price_range || '$$'}"
  }
  </script>
</head>
<body>
  ${pageContent}
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${restaurantName}. Todos los derechos reservados.</p>
    ${client.address ? `<p>${client.address}</p>` : ''}
    ${client.phone ? `<p>Tel: ${client.phone_country_code || '+51'} ${client.phone}</p>` : ''}
  </footer>
</body>
</html>
  `.trim();
  
  return html;
}

export const onRequest: PagesFunction = async (ctx) => {
  try {
    const userAgent = ctx.request.headers.get('user-agent') || '';
    
    // Check if request is from a bot
    if (isBot(userAgent)) {
      console.log('[BOT-SSR] Bot detected:', userAgent);
      
      const domain = extractDomain(ctx.request);
      if (!domain) {
        console.log('[BOT-SSR] Could not extract domain');
        return await ctx.next();
      }
      
      const url = new URL(ctx.request.url);
      const pathname = url.pathname;
      
      // Generate bot-optimized HTML
      const botHTML = await generateBotHTML(domain, pathname);
      
      if (botHTML) {
        console.log('[BOT-SSR] Serving bot-optimized HTML for:', domain, pathname);
        return new Response(botHTML, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            'X-Robots-Tag': 'index, follow',
            'X-Bot-SSR': 'true'
          }
        });
      }
    }
    
    // Normal flow for human users
    return await ctx.next();
  } catch (err: any) {
    const id = crypto.randomUUID?.() || String(Date.now());
    console.error('[WORKER-UNHANDLED]', { 
      id, 
      message: err?.message, 
      stack: err?.stack,
      name: err?.name,
      url: ctx.request.url
    });
    
    return new Response(JSON.stringify({
      ok: false,
      id,
      error: err?.message || 'Unknown Worker Exception',
      stack: err?.stack || null,
      name: err?.name || 'Error',
      url: ctx.request.url
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json', 
        'X-Debug-Id': id 
      }
    });
  }
};
