import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const VERCEL_BANDWIDTH_LIMIT_GB = 1000; // 1TB free tier limit
const WARNING_THRESHOLD = 0.8; // 80%

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vercelToken = Deno.env.get('VERCEL_API_TOKEN')!;
    const vercelTeamId = Deno.env.get('VERCEL_TEAM_ID')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔍 Checking Vercel bandwidth usage...');

    // Fetch all Vercel projects for our clients
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, restaurant_name, vercel_project, subdomain')
      .not('vercel_project', 'is', null);

    if (clientsError) {
      throw new Error(`Failed to fetch clients: ${clientsError.message}`);
    }

    let totalBandwidthGB = 0;

    // Get usage for each project
    for (const client of clients || []) {
      try {
        const projectId = client.vercel_project;
        const url = `https://api.vercel.com/v1/projects/${projectId}/bandwidth?teamId=${vercelTeamId}`;
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${vercelToken}`,
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch bandwidth for ${client.restaurant_name}: ${response.status}`);
          continue;
        }

        const data = await response.json();
        const bandwidthBytes = data.total || 0;
        const bandwidthGB = bandwidthBytes / (1024 ** 3);
        totalBandwidthGB += bandwidthGB;

        console.log(`📊 ${client.restaurant_name}: ${bandwidthGB.toFixed(2)} GB`);
      } catch (error) {
        console.error(`Error fetching bandwidth for ${client.restaurant_name}:`, error);
      }
    }

    const usagePercentage = (totalBandwidthGB / VERCEL_BANDWIDTH_LIMIT_GB) * 100;
    const isWarning = usagePercentage >= (WARNING_THRESHOLD * 100);

    console.log(`📈 Total Vercel Bandwidth: ${totalBandwidthGB.toFixed(2)} GB / ${VERCEL_BANDWIDTH_LIMIT_GB} GB (${usagePercentage.toFixed(1)}%)`);

    // Send alert if near limit
    if (isWarning) {
      console.warn(`⚠️ WARNING: Vercel bandwidth at ${usagePercentage.toFixed(1)}%!`);
      
      // Trigger alert email
      await supabase.functions.invoke('send-usage-alerts', {
        body: {
          alert_type: 'vercel_bandwidth',
          usage_percentage: usagePercentage,
          total_bandwidth_gb: totalBandwidthGB,
          limit_gb: VERCEL_BANDWIDTH_LIMIT_GB,
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_bandwidth_gb: totalBandwidthGB,
        limit_gb: VERCEL_BANDWIDTH_LIMIT_GB,
        usage_percentage: usagePercentage,
        is_warning: isWarning,
        clients_checked: clients?.length || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error monitoring Vercel usage:', error);
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
