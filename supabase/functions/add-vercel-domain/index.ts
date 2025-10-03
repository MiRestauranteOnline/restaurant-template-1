import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AddDomainRequest {
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
    const vercelToken = Deno.env.get('VERCEL_API_TOKEN')!;
    const vercelTeamId = Deno.env.get('VERCEL_TEAM_ID');

    if (!vercelToken) {
      throw new Error('Vercel API token not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { client_id, custom_domain }: AddDomainRequest = await req.json();

    if (!client_id || !custom_domain) {
      throw new Error('client_id and custom_domain are required');
    }

    console.log(`🚀 Adding domain ${custom_domain} to Vercel`);

    // Get client's Vercel project
    const { data: client } = await supabase
      .from('clients')
      .select('vercel_project, vercel_team')
      .eq('id', client_id)
      .single();

    if (!client?.vercel_project) {
      throw new Error('Client does not have a Vercel project configured');
    }

    const vercelProject = client.vercel_project;
    const teamParam = client.vercel_team || vercelTeamId;
    const teamQuery = teamParam ? `?teamId=${teamParam}` : '';

    // Step 1: Add domain to Vercel project
    console.log(`📝 Adding domain to project: ${vercelProject}`);
    
    const addDomainResponse = await fetch(
      `https://api.vercel.com/v10/projects/${vercelProject}/domains${teamQuery}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: custom_domain,
        }),
      }
    );

    const addDomainData = await addDomainResponse.json();

    if (!addDomainResponse.ok) {
      // If domain already exists, that's okay
      if (addDomainData.error?.code !== 'domain_already_exists') {
        throw new Error(`Failed to add domain to Vercel: ${addDomainData.error?.message || 'Unknown error'}`);
      }
      console.log(`ℹ️ Domain already exists in Vercel project`);
    } else {
      console.log(`✅ Domain added to Vercel project`);
    }

    // Step 2: Also add www subdomain
    const addWwwResponse = await fetch(
      `https://api.vercel.com/v10/projects/${vercelProject}/domains${teamQuery}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `www.${custom_domain}`,
          redirect: custom_domain, // Redirect www to apex
        }),
      }
    );

    const wwwData = await addWwwResponse.json();
    
    if (!addWwwResponse.ok && wwwData.error?.code !== 'domain_already_exists') {
      console.warn(`⚠️ Failed to add www subdomain: ${wwwData.error?.message}`);
    } else {
      console.log(`✅ www subdomain configured with redirect`);
    }

    // Step 3: Verify domain configuration
    const verifyResponse = await fetch(
      `https://api.vercel.com/v9/projects/${vercelProject}/domains/${custom_domain}/verify${teamQuery}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();
    const isVerified = verifyData.verified === true;

    console.log(`🔍 Domain verification status: ${isVerified ? 'VERIFIED' : 'PENDING'}`);

    // Step 4: Update client record
    const updateData: any = {
      domain_verified: isVerified,
      ssl_status: isVerified ? 'provisioning' : 'pending',
      last_domain_check: new Date().toISOString(),
    };

    if (isVerified) {
      updateData.domain_verification_date = new Date().toISOString();
    }

    await supabase
      .from('clients')
      .update(updateData)
      .eq('id', client_id);

    console.log(`✅ Updated client ${client_id} with verification status`);

    return new Response(
      JSON.stringify({
        success: true,
        verified: isVerified,
        message: isVerified 
          ? 'Domain verified and SSL provisioning started'
          : 'Domain added. Waiting for DNS propagation.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error adding domain to Vercel:', error);
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
