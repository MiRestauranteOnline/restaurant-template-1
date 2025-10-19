import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🗺️ Generate sitemap request received');
    
    // Extract the host to determine which client this is for
    const host = req.headers.get('host') || '';
    console.log('📍 Host:', host);

    // Initialize Supabase client
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
      console.error('❌ Client not found:', clientError);
      return new Response('Client not found', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    console.log('✅ Client found:', client.id);

    // Check if subscription is active
    if (client.subscription_status !== 'active') {
      console.log('⚠️ Inactive subscription');
      return new Response('Site not available', { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Get admin content to check page visibility
    const { data: adminContent, error: adminError } = await supabase
      .from('admin_content')
      .select(`
        homepage_about_section_visible,
        homepage_menu_section_visible,
        homepage_contact_section_visible,
        homepage_reviews_section_visible
      `)
      .eq('client_id', client.id)
      .single();

    if (adminError) {
      console.error('❌ Error fetching admin content:', adminError);
    }

    console.log('📄 Admin content visibility:', adminContent);

    // Determine the base URL
    const baseUrl = client.domain && client.domain_verified 
      ? `https://${client.domain}` 
      : `https://${client.subdomain}.lovable.app`;

    console.log('🌐 Base URL:', baseUrl);

    // Build sitemap URLs based on visibility
    const urls = [
      {
        loc: baseUrl,
        changefreq: 'daily',
        priority: '1.0',
        visible: true // Homepage always visible
      },
      {
        loc: `${baseUrl}/menu`,
        changefreq: 'weekly',
        priority: '0.8',
        visible: adminContent?.homepage_menu_section_visible !== false
      },
      {
        loc: `${baseUrl}/about`,
        changefreq: 'monthly',
        priority: '0.7',
        visible: adminContent?.homepage_about_section_visible !== false
      },
      {
        loc: `${baseUrl}/contact`,
        changefreq: 'monthly',
        priority: '0.7',
        visible: adminContent?.homepage_contact_section_visible !== false
      },
      {
        loc: `${baseUrl}/reviews`,
        changefreq: 'weekly',
        priority: '0.6',
        visible: adminContent?.homepage_reviews_section_visible !== false
      }
    ].filter(url => url.visible); // Only include visible pages

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
