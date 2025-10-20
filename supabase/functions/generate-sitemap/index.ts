import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-host',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🗺️ Generate sitemap request received');
    
    // Resolve target host: prefer explicit query param, then forwarded host, then host
    const urlObj = new URL(req.url);
    const domainParam = urlObj.searchParams.get('domain') || urlObj.searchParams.get('host');
    const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('X-Forwarded-Host');
    const host = (domainParam || forwardedHost || req.headers.get('host') || '').trim();
    console.log('📍 Host (resolved):', host);
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine subdomain or custom domain from host
    let clientQuery;
    if (host.includes('.lovable.app')) {
      // Extract subdomain (e.g., "demo-restaurante" from "demo-restaurante.lovable.app")
      const subdomain = host.split('.lovable.app')[0];
      console.log('🔍 Looking up client by subdomain:', subdomain);
      clientQuery = supabase
        .from('clients')
        .select('id, subdomain, domain, domain_verified, subscription_status')
        .eq('subdomain', subdomain)
        .single();
    } else {
      // Custom domain
      console.log('🔍 Looking up client by custom domain:', host);
      clientQuery = supabase
        .from('clients')
        .select('id, subdomain, domain, domain_verified, subscription_status')
        .eq('domain', host)
        .eq('domain_verified', true)
        .single();
    }

    const { data: client, error: clientError } = await clientQuery;

    if (clientError || !client) {
      console.warn('⚠️ Client not found; generating fallback sitemap. Error:', clientError?.message);
      // Proceed with fallback (no client-specific content)
    }

    if (client) {
      console.log('✅ Client found:', client.id);
    } else {
      console.log('ℹ️ No client matched host; using fallback sitemap');
    }

    // For inactive or missing clients, we will generate a minimal sitemap (only core pages)
    const isActiveClient = !!(client && client.subscription_status === 'active');

    // Check content existence only when client is identified and active
    let hasReviews = false;
    let hasMenuItems = false;

    if (isActiveClient) {
      const [reviewsResult, menuItemsResult] = await Promise.all([
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('client_id', client.id).eq('is_active', true),
        supabase.from('menu_items').select('id', { count: 'exact', head: true }).eq('client_id', client.id).eq('is_active', true),
      ]);

      hasReviews = (reviewsResult.count || 0) > 0;
      hasMenuItems = (menuItemsResult.count || 0) > 0;
    }

    console.log('📊 Content check:', { hasReviews, hasMenuItems });

    // Determine the base URL
    const fallbackBaseUrl = `https://${host}`;
    const baseUrl = client
      ? (client.domain && client.domain_verified
          ? `https://${client.domain}`
          : client.subdomain
            ? `https://${client.subdomain}.lovable.app`
            : fallbackBaseUrl)
      : fallbackBaseUrl;

    console.log('🌐 Base URL:', baseUrl);

    // Build sitemap URLs - always include core pages, conditionally include content pages
    const urls = [
      {
        loc: baseUrl,
        changefreq: 'daily',
        priority: '1.0',
      },
      {
        loc: `${baseUrl}/contact`,
        changefreq: 'monthly',
        priority: '0.7',
      },
    ];

    // Add menu page only if menu items exist
    if (hasMenuItems) {
      urls.push({
        loc: `${baseUrl}/menu`,
        changefreq: 'weekly',
        priority: '0.8',
      });
    }

    // Add reviews page only if reviews exist
    if (hasReviews) {
      urls.push({
        loc: `${baseUrl}/reviews`,
        changefreq: 'weekly',
        priority: '0.6',
      });
    }

    console.log(`✅ Generated ${urls.length} URLs for sitemap`);

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
