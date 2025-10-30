import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const SUPABASE_URL = 'https://ptzcetvcccnojdbzzlyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0emNldHZjY2Nub2pkYnp6bHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NjExNzksImV4cCI6MjA3NDMzNzE3OX0.2HS2wP06xe8PryWW_VdzTu7TDYg303BjwmzyA_5Ang8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Bot user agents that need SSR
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
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

async function generateBotHTML(domain: string, pathname: string): Promise<string | null> {
  try {
    // Fetch fast-load data
    const { data: fastLoadData } = await supabase.functions.invoke('prebuild-client-data', {
      body: { domain }
    });

    if (!fastLoadData?.data) {
      console.log('No fast-load data found for domain:', domain);
      return null;
    }

    const {
      client,
      adminContent,
      menuItems,
      menuCategories,
      clientSettings,
      reviews,
      faqs,
      teamMembers,
      pageMetadata
    } = fastLoadData.data;

    // Get page-specific metadata
    const currentPageMeta = pageMetadata?.find((meta: any) => {
      const metaPath = meta.page_type === 'home' ? '/' : `/${meta.page_type}`;
      return metaPath === pathname;
    });

    const pageTitle = currentPageMeta?.title || client?.restaurant_name || 'Restaurant';
    const pageDescription = currentPageMeta?.description || client?.description || '';

    // Generate rich HTML content
    let contentHTML = '';

    // Homepage content
    if (pathname === '/' || pathname === '') {
      const heroTitle = adminContent?.hero_title || client?.restaurant_name || '';
      const heroSubtitle = adminContent?.hero_subtitle || '';
      const aboutTitle = adminContent?.about_title || 'About Us';
      const aboutText = adminContent?.about_text || '';

      contentHTML = `
        <main>
          <section>
            <h1>${heroTitle}</h1>
            ${heroSubtitle ? `<p>${heroSubtitle}</p>` : ''}
          </section>
          
          ${aboutText ? `
          <section>
            <h2>${aboutTitle}</h2>
            <p>${aboutText}</p>
          </section>
          ` : ''}
          
          ${menuItems?.length > 0 ? `
          <section>
            <h2>Our Menu</h2>
            ${menuCategories?.map((cat: any) => {
              const catItems = menuItems.filter((item: any) => item.category_id === cat.id);
              return `
                <div>
                  <h3>${cat.name}</h3>
                  ${catItems.map((item: any) => `
                    <article>
                      <h4>${item.name}</h4>
                      ${item.description ? `<p>${item.description}</p>` : ''}
                      ${item.price ? `<p>$${item.price}</p>` : ''}
                      ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" />` : ''}
                    </article>
                  `).join('')}
                </div>
              `;
            }).join('')}
          </section>
          ` : ''}
          
          ${reviews?.length > 0 ? `
          <section>
            <h2>Customer Reviews</h2>
            ${reviews.slice(0, 3).map((review: any) => `
              <article>
                <p>"${review.review_text}"</p>
                <p><strong>${review.customer_name}</strong> - ${review.rating} stars</p>
              </article>
            `).join('')}
          </section>
          ` : ''}
        </main>
      `;
    }

    // Menu page
    if (pathname === '/menu' || pathname === '/carta') {
      contentHTML = `
        <main>
          <h1>Our Menu</h1>
          ${menuCategories?.map((cat: any) => {
            const catItems = menuItems.filter((item: any) => item.category_id === cat.id);
            return `
              <section>
                <h2>${cat.name}</h2>
                ${catItems.map((item: any) => `
                  <article>
                    <h3>${item.name}</h3>
                    ${item.description ? `<p>${item.description}</p>` : ''}
                    ${item.price ? `<p>Price: $${item.price}</p>` : ''}
                    ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" />` : ''}
                  </article>
                `).join('')}
              </section>
            `;
          }).join('')}
        </main>
      `;
    }

    // About page
    if (pathname === '/about' || pathname === '/nosotros') {
      const aboutTitle = adminContent?.about_title || 'About Us';
      const aboutText = adminContent?.about_text || '';

      contentHTML = `
        <main>
          <h1>${aboutTitle}</h1>
          ${aboutText ? `<p>${aboutText}</p>` : ''}
          
          ${teamMembers?.length > 0 ? `
          <section>
            <h2>Our Team</h2>
            ${teamMembers.map((member: any) => `
              <article>
                <h3>${member.name}</h3>
                ${member.role ? `<p><strong>${member.role}</strong></p>` : ''}
                ${member.bio ? `<p>${member.bio}</p>` : ''}
                ${member.image_url ? `<img src="${member.image_url}" alt="${member.name}" />` : ''}
              </article>
            `).join('')}
          </section>
          ` : ''}
        </main>
      `;
    }

    // Contact page
    if (pathname === '/contact' || pathname === '/contacto') {
      contentHTML = `
        <main>
          <h1>Contact Us</h1>
          ${client?.address ? `
          <section>
            <h2>Location</h2>
            <p>${client.address}</p>
          </section>
          ` : ''}
          
          ${client?.phone ? `
          <section>
            <h2>Phone</h2>
            <p>${client.phone}</p>
          </section>
          ` : ''}
          
          ${client?.email ? `
          <section>
            <h2>Email</h2>
            <p>${client.email}</p>
          </section>
          ` : ''}
        </main>
      `;
    }

    // Reviews page
    if (pathname === '/reviews' || pathname === '/resenas') {
      contentHTML = `
        <main>
          <h1>Customer Reviews</h1>
          ${reviews?.map((review: any) => `
            <article>
              <h2>${review.customer_name}</h2>
              <p><strong>Rating:</strong> ${review.rating} / 5</p>
              <p>"${review.review_text}"</p>
              ${review.date ? `<p><small>${new Date(review.date).toLocaleDateString()}</small></p>` : ''}
            </article>
          `).join('')}
        </main>
      `;
    }

    // Build complete HTML
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDescription}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDescription}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${pageDescription}">
  ${clientSettings?.favicon_url ? `<link rel="icon" type="image/x-icon" href="${clientSettings.favicon_url}">` : ''}
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/menu">Menu</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    ${reviews?.length > 0 ? '<a href="/reviews">Reviews</a>' : ''}
  </nav>
  
  ${contentHTML}
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${client?.restaurant_name || 'Restaurant'}. All rights reserved.</p>
    ${client?.address ? `<p>${client.address}</p>` : ''}
    ${client?.phone ? `<p>Phone: ${client.phone}</p>` : ''}
  </footer>
</body>
</html>`;

    return html;
  } catch (error) {
    console.error('Error generating bot HTML:', error);
    return null;
  }
}

export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check if this is a bot or test request
  const isTestBot = url.searchParams.has('__bot');
  const isBotRequest = isBot(userAgent) || isTestBot;

  // Extract domain
  const hostname = url.hostname;
  const domain = hostname.replace(/^www\./, '');

  console.log('🤖 Bot detection:', {
    hostname,
    domain,
    userAgent,
    isBot: isBotRequest,
    isTest: isTestBot,
    pathname: url.pathname
  });

  // If bot, serve SSR HTML
  if (isBotRequest) {
    console.log('🤖 Serving SSR for bot');
    const html = await generateBotHTML(domain, url.pathname);
    
    if (html) {
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'X-Robots-Tag': 'index, follow',
        },
      });
    }
  }

  // For regular users, continue to app
  return context.next();
}
