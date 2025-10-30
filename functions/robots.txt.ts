interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.env;
  const request = context.request;
  
  // Extract host to identify tenant
  const host = request.headers.get('host') || '';
  const tenantDomain = host.replace(/^www\./, '');
  
  try {
    // Fetch client to check status
    const clientResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/clients?select=subdomain,custom_domain,subscription_status,is_deactivated&or=(subdomain.eq.${encodeURIComponent(tenantDomain)},custom_domain.eq.${encodeURIComponent(tenantDomain)})&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    
    const clients = clientResponse.ok ? await clientResponse.json() : [];
    const client = clients[0];
    
    // Check if this is a demo/inactive/deactivated site (Option A)
    const isBlocked = !client || client.subscription_status !== 'active' || client.is_deactivated === true;
    
    let robotsTxt = '';
    
    if (isBlocked) {
      // Block all crawlers for demo/inactive/deactivated sites
      robotsTxt = `User-agent: *
Disallow: /

# This site is not active or is deactivated
`;
    } else {
      // Allow crawling for active sites
      robotsTxt = `User-agent: *
Allow: /

# Sitemap location
Sitemap: https://${tenantDomain}/sitemap.xml
`;
    }
    
    return new Response(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // 1 hour cache
      },
    });
    
  } catch (err) {
    console.error('Robots.txt generation error:', err);
    
    // Safe fallback - allow but be cautious
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://${tenantDomain}/sitemap.xml
`;
    
    return new Response(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
};
