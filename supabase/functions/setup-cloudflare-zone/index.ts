import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SetupZoneRequest {
  client_id: string;
  custom_domain: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const cloudflareToken = Deno.env.get('CLOUDFLARE_API_TOKEN')!;
    const cloudflareAccountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID')!;

    if (!cloudflareToken || !cloudflareAccountId) {
      throw new Error('Cloudflare credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { client_id, custom_domain }: SetupZoneRequest = await req.json();

    if (!client_id || !custom_domain) {
      throw new Error('client_id and custom_domain are required');
    }

    console.log(`🌐 Setting up Cloudflare zone for ${custom_domain}`);

    // Step 1: Check if zone already exists
    const checkZoneResponse = await fetch(
      `https://api.cloudflare.com/client/v4/zones?name=${custom_domain}`,
      {
        headers: {
          'Authorization': `Bearer ${cloudflareToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const checkZoneData = await checkZoneResponse.json();
    let zoneId: string;
    let nameservers: string[];

    if (checkZoneData.result && checkZoneData.result.length > 0) {
      // Zone exists
      zoneId = checkZoneData.result[0].id;
      nameservers = checkZoneData.result[0].name_servers;
      console.log(`✅ Zone already exists: ${zoneId}`);
    } else {
      // Step 2: Create new zone
      const createZoneResponse = await fetch(
        'https://api.cloudflare.com/client/v4/zones',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cloudflareToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: custom_domain,
            account: { id: cloudflareAccountId },
            jump_start: true,
          }),
        }
      );

      const createZoneData = await createZoneResponse.json();

      if (!createZoneData.success) {
        throw new Error(`Failed to create Cloudflare zone: ${JSON.stringify(createZoneData.errors)}`);
      }

      zoneId = createZoneData.result.id;
      nameservers = createZoneData.result.name_servers;
      console.log(`✅ Created new zone: ${zoneId}`);
    }

    // Step 3: Get Vercel project IP (for A record)
    // Note: Vercel uses 76.76.21.21 for custom domains
    const vercelIp = '76.76.21.21';

    // Step 4: Create A record pointing to Vercel
    const createRecordResponse = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cloudflareToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'A',
          name: '@',
          content: vercelIp,
          ttl: 1, // Auto
          proxied: false, // Must be false for Vercel
        }),
      }
    );

    const recordData = await createRecordResponse.json();

    if (!recordData.success && !recordData.errors?.some((e: any) => e.code === 81057)) {
      // 81057 = record already exists, which is fine
      throw new Error(`Failed to create DNS record: ${JSON.stringify(recordData.errors)}`);
    }

    console.log(`✅ DNS A record created/verified for ${custom_domain}`);

    // Step 5: Create CNAME for www subdomain
    const createCnameResponse = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cloudflareToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'CNAME',
          name: 'www',
          content: 'cname.vercel-dns.com',
          ttl: 1,
          proxied: false,
        }),
      }
    );

    const cnameData = await createCnameResponse.json();
    
    if (!cnameData.success && !cnameData.errors?.some((e: any) => e.code === 81057)) {
      console.warn('Failed to create www CNAME:', cnameData.errors);
    }

    // Step 6: Update client record with DNS info
    await supabase
      .from('clients')
      .update({
        custom_domain,
        dns_records_status: {
          zone_id: zoneId,
          nameservers,
          a_record: vercelIp,
          cname_record: 'cname.vercel-dns.com',
          status: 'pending_ns_update',
        },
        last_domain_check: new Date().toISOString(),
      })
      .eq('id', client_id);

    console.log(`✅ Updated client ${client_id} with DNS configuration`);

    return new Response(
      JSON.stringify({
        success: true,
        zone_id: zoneId,
        nameservers,
        message: 'Cloudflare zone configured. Update nameservers at your registrar.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error setting up Cloudflare zone:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
