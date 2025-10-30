interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.env;
  const request = context.request;
  
  // Extract host to identify tenant
  const host = request.headers.get('host') || '';
  const tenantDomain = host.replace(/^www\./, ''); // Remove www prefix
  
  try {
    // Fetch client data by domain or subdomain
    const clientResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/clients?select=id,subdomain,custom_domain,restaurant_name&or=(subdomain.eq.${encodeURIComponent(tenantDomain)},custom_domain.eq.${encodeURIComponent(tenantDomain)})&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    
    const clients = clientResponse.ok ? await clientResponse.json() : [];
    if (!clients || clients.length === 0) {
      throw new Error('Client not found');
    }
    
    const client = clients[0];
    const clientId = client.id;
    // Use client's custom domain if available, otherwise subdomain
    const clientDomain = client.custom_domain || client.subdomain;
    const baseUrl = `https://${clientDomain}`;
    
    // Fetch client's admin_content to check enabled sections
    const contentResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_content?select=*&client_id=eq.${clientId}&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    const contentData = contentResponse.ok ? await contentResponse.json() : [];
    const content = contentData[0] || {};
    
    // Fetch client's menu items
    const menuResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/menu_items?select=id,updated_at&client_id=eq.${clientId}&is_active=eq.true`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    const menuItems = menuResponse.ok ? await menuResponse.json() : [];
    
    // Fetch client's reviews
    const reviewsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/reviews?select=id,updated_at&client_id=eq.${clientId}&is_approved=eq.true`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    const reviews = reviewsResponse.ok ? await reviewsResponse.json() : [];
    
    // Build XML sitemap
    const today = new Date().toISOString().split('T')[0];
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Homepage
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += '  </url>\n';
    
    // Menu page - always include
    const menuLastMod = menuItems.length > 0 
      ? menuItems.reduce((latest, item) => {
          const itemDate = new Date(item.updated_at);
          return itemDate > latest ? itemDate : latest;
        }, new Date(0))
      : new Date();
    
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/menu</loc>\n`;
    xml += `    <lastmod>${menuLastMod.toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.9</priority>\n`;
    xml += '  </url>\n';
    
    // About page - always include
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/about</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += '  </url>\n';
    
    // Contact page - always include
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/contact</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += '  </url>\n';
    
    // Reviews page - always include
    const reviewsLastMod = reviews.length > 0
      ? reviews.reduce((latest, item) => {
          const itemDate = new Date(item.updated_at);
          return itemDate > latest ? itemDate : latest;
        }, new Date(0))
      : new Date();
    
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/reviews</loc>\n`;
    xml += `    <lastmod>${reviewsLastMod.toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += '  </url>\n';
    
    xml += '</urlset>';
    
    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800', // 30 min cache
        'X-Tenant-Domain': tenantDomain,
      },
    });
    
  } catch (err) {
    console.error('Sitemap generation error:', err);
    
    // Fallback minimal sitemap
    const today = new Date().toISOString().split('T')[0];
    const baseUrl = `https://${host.replace(/^www\./, '')}`;
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      `  <url>\n` +
      `    <loc>${baseUrl}/</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>weekly</changefreq>\n` +
      `    <priority>1.0</priority>\n` +
      `  </url>\n` +
      `</urlset>`;
    
    return new Response(fallback, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 5 min cache for fallback
        'X-Sitemap-Fallback': 'true',
      },
    });
  }
};
