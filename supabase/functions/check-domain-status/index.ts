import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckStatusRequest {
  client_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vercelToken = Deno.env.get('VERCEL_API_TOKEN')!;

    if (!vercelToken) {
      throw new Error('Vercel API token not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { client_id }: CheckStatusRequest = await req.json();

    if (!client_id) {
      throw new Error('client_id is required');
    }

    console.log(`🔍 Checking domain status for client: ${client_id}`);

    // Get client data
    const { data: client } = await supabase
      .from('clients')
      .select('custom_domain, vercel_project, vercel_team, domain_verified, ssl_status, dns_records_status')
      .eq('id', client_id)
      .single();

    if (!client?.custom_domain) {
      throw new Error('Client does not have a custom domain configured');
    }

    if (!client.vercel_project) {
      throw new Error('Client does not have a Vercel project configured');
    }

    const { custom_domain, vercel_project, vercel_team } = client;
    const teamQuery = vercel_team ? `?teamId=${vercel_team}` : '';

    // Check domain configuration in Vercel
    const domainResponse = await fetch(
      `https://api.vercel.com/v9/projects/${vercel_project}/domains/${custom_domain}${teamQuery}`,
      {
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
        },
      }
    );

    if (!domainResponse.ok) {
      throw new Error(`Failed to fetch domain info from Vercel: ${domainResponse.statusText}`);
    }

    const domainData = await domainResponse.json();

    // Determine status
    const isVerified = domainData.verified === true;
    const sslStatus = domainData.verified 
      ? (domainData.sslCertificate?.status === 'issued' ? 'issued' : 'provisioning')
      : 'pending';

    console.log(`📊 Domain status: Verified=${isVerified}, SSL=${sslStatus}`);

    // Check DNS propagation using a DNS lookup
    let dnsConfigured = false;
    try {
      const dnsResponse = await fetch(`https://dns.google/resolve?name=${custom_domain}&type=A`);
      const dnsData = await dnsResponse.json();
      
      // Check if A record points to Vercel
      if (dnsData.Answer) {
        const hasVercelIP = dnsData.Answer.some((record: any) => 
          record.type === 1 && record.data === '76.76.21.21'
        );
        dnsConfigured = hasVercelIP;
      }
    } catch (error) {
      console.warn('Could not check DNS propagation:', error);
    }

    // Update client record
    const updateData: any = {
      domain_verified: isVerified,
      ssl_status: sslStatus,
      last_domain_check: new Date().toISOString(),
    };

    if (isVerified && !client.domain_verified) {
      updateData.domain_verification_date = new Date().toISOString();
    }

    if (sslStatus === 'issued' && client.ssl_status !== 'issued') {
      updateData.ssl_issued_date = new Date().toISOString();
    }

    const dnsRecordsStatus = {
      ...(typeof client.dns_records_status === 'object' ? client.dns_records_status : {}),
      dns_propagated: dnsConfigured,
      last_check: new Date().toISOString(),
    };

    updateData.dns_records_status = dnsRecordsStatus;

    await supabase
      .from('clients')
      .update(updateData)
      .eq('id', client_id);

    console.log(`✅ Updated client ${client_id} with latest status`);

    // Determine overall status
    let overallStatus = 'pending';
    let statusMessage = 'Waiting for DNS configuration';

    if (dnsConfigured && !isVerified) {
      overallStatus = 'dns_configured';
      statusMessage = 'DNS configured, waiting for verification';
    } else if (isVerified && sslStatus === 'provisioning') {
      overallStatus = 'verified';
      statusMessage = 'Domain verified, SSL provisioning in progress';
    } else if (isVerified && sslStatus === 'issued') {
      overallStatus = 'active';
      statusMessage = 'Domain active with SSL certificate';
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: overallStatus,
        verified: isVerified,
        ssl_status: sslStatus,
        dns_configured: dnsConfigured,
        message: statusMessage,
        details: {
          domain: custom_domain,
          verification_method: domainData.verification,
          ssl_certificate: domainData.sslCertificate,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error checking domain status:', error);
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
