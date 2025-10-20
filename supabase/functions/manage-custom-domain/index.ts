import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DomainRequest {
  client_id: string;
  custom_domain: string;
  action: 'add' | 'verify' | 'remove';
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

    const { client_id, custom_domain, action }: DomainRequest = await req.json();

    const CF_API_TOKEN = Deno.env.get('CLOUDFLARE_API_TOKEN');
    const CF_ACCOUNT_ID = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');

    if (!CF_API_TOKEN || !CF_ACCOUNT_ID) {
      throw new Error('Cloudflare credentials not configured');
    }

    console.log(`Domain ${action} request for ${custom_domain} (client: ${client_id})`);

    // Verify client exists
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, subdomain')
      .eq('id', client_id)
      .single();

    if (clientError || !client) {
      throw new Error('Client not found');
    }

    if (action === 'add') {
      // Step 1: Check if zone exists in Cloudflare
      const zonesResponse = await fetch(
        `https://api.cloudflare.com/client/v4/zones?name=${custom_domain.replace('www.', '')}`,
        {
          headers: {
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const zonesData = await zonesResponse.json();
      let zoneId = zonesData.result?.[0]?.id;

      // Step 2: Create zone if it doesn't exist
      if (!zoneId) {
        console.log(`Creating new zone for ${custom_domain}`);
        const createZoneResponse = await fetch(
          `https://api.cloudflare.com/client/v4/zones`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${CF_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: custom_domain.replace('www.', ''),
              account: { id: CF_ACCOUNT_ID },
              jump_start: true,
            }),
          }
        );

        const createZoneData = await createZoneResponse.json();
        zoneId = createZoneData.result?.id;

        if (!zoneId) {
          throw new Error(`Failed to create zone: ${JSON.stringify(createZoneData)}`);
        }
      }

      console.log(`Using zone ID: ${zoneId}`);

      // Step 3: Cloudflare Pages deployment URL (used as CNAME target)
      const PAGES_DEPLOYMENT = 'mirestaurante-template.pages.dev';

      // Step 4: Create DNS records (CNAME to Cloudflare Pages)
      const recordsToCreate = [
        { type: 'CNAME', name: '@', content: PAGES_DEPLOYMENT },
        { type: 'CNAME', name: 'www', content: PAGES_DEPLOYMENT },
      ];

      const dnsResults = [];
      for (const record of recordsToCreate) {
        const createRecordResponse = await fetch(
          `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${CF_API_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: record.type,
              name: record.name,
              content: record.content,
              ttl: 3600,
              proxied: false,
            }),
          }
        );

        const recordData = await createRecordResponse.json();
        dnsResults.push({
          record: record.name,
          success: recordData.success,
          id: recordData.result?.id,
        });
      }

      // Step 5: Enable Universal SSL
      await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/settings/ssl`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: 'flexible' }),
        }
      );

      // Step 6: Update database
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          custom_domain,
          dns_records_status: {
            zone_id: zoneId,
            dns_records: dnsResults,
            created_at: new Date().toISOString(),
          },
          ssl_status: 'pending',
          last_domain_check: new Date().toISOString(),
        })
        .eq('id', client_id);

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Domain configured successfully',
          zone_id: zoneId,
          dns_records: dnsResults,
          next_steps: [
            'Update your domain nameservers to point to Cloudflare',
            'Wait for DNS propagation (up to 48 hours)',
            'SSL certificate will be issued automatically',
          ],
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'verify') {
      // Verify DNS and SSL status
      const { data: clientData } = await supabase
        .from('clients')
        .select('dns_records_status, custom_domain')
        .eq('id', client_id)
        .single();

      const zoneId = clientData?.dns_records_status?.zone_id;
      if (!zoneId) {
        throw new Error('No zone ID found. Please add domain first.');
      }

      // Check SSL status
      const sslResponse = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${zoneId}/ssl/verification`,
        {
          headers: {
            'Authorization': `Bearer ${CF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const sslData = await sslResponse.json();
      const sslActive = sslData.result?.[0]?.certificate_status === 'active';

      // Update database
      await supabase
        .from('clients')
        .update({
          domain_verified: sslActive,
          ssl_status: sslActive ? 'active' : 'pending',
          domain_verification_date: sslActive ? new Date().toISOString() : null,
          ssl_issued_date: sslActive ? new Date().toISOString() : null,
          last_domain_check: new Date().toISOString(),
        })
        .eq('id', client_id);

      return new Response(
        JSON.stringify({
          success: true,
          verified: sslActive,
          ssl_status: sslActive ? 'active' : 'pending',
          message: sslActive ? 'Domain verified and SSL active' : 'Waiting for DNS propagation',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'remove') {
      // Remove domain configuration
      await supabase
        .from('clients')
        .update({
          custom_domain: null,
          domain_verified: false,
          ssl_status: 'pending',
          dns_records_status: {},
        })
        .eq('id', client_id);

      return new Response(
        JSON.stringify({ success: true, message: 'Domain removed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Domain management error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
