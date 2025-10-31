import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PrerenderRequest {
  domain: string;
  routes?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { domain, routes = ['/', '/menu', '/about', '/contact'] }: PrerenderRequest = await req.json();

    console.log(`🎨 Generating pre-renders for domain: ${domain}, routes:`, routes);

    // Determine the base URL for the site
    const baseUrl = domain.includes('.') && !domain.includes('lovable.app') && !domain.includes('localhost')
      ? `https://${domain}`
      : `https://${domain}.lovable.app`;

    const results = [];

    for (const route of routes) {
      try {
        console.log(`📄 Pre-rendering ${route}...`);

        // Fetch the actual rendered page using a headless approach
        // We'll fetch the page with a special header to get the full rendered HTML
        const response = await fetch(`${baseUrl}${route}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; PrerendererBot/1.0; +https://lovable.app)',
            'X-Prerender': 'true',
          },
        });

        if (!response.ok) {
          console.error(`❌ Failed to fetch ${route}: ${response.status}`);
          continue;
        }

        let html = await response.text();

        // Store the pre-rendered HTML in Supabase Storage
        const storageKey = `prerenders/${domain}${route === '/' ? '/index' : route}.html`;
        
        const { error: uploadError } = await supabase.storage
          .from('client-assets')
          .upload(storageKey, html, {
            contentType: 'text/html',
            upsert: true,
            cacheControl: '3600',
          });

        if (uploadError) {
          console.error(`❌ Failed to upload ${route}:`, uploadError);
          results.push({ route, success: false, error: uploadError.message });
        } else {
          console.log(`✅ Successfully pre-rendered and cached ${route}`);
          results.push({ route, success: true, storageKey });
        }

      } catch (error) {
        console.error(`❌ Error pre-rendering ${route}:`, error);
        results.push({ route, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`🎉 Pre-render complete: ${successCount}/${routes.length} successful`);

    return new Response(
      JSON.stringify({
        success: true,
        domain,
        results,
        message: `Pre-rendered ${successCount}/${routes.length} routes`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Pre-render generation failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
