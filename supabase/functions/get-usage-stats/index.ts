import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { client_id } = await req.json();

    if (!client_id) {
      throw new Error('client_id is required');
    }

    // Get current month (first day)
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    // Get client limits
    const { data: client } = await supabase
      .from('clients')
      .select('monthly_visits_limit, monthly_bandwidth_limit_gb, plan_type')
      .eq('id', client_id)
      .single();

    if (!client) {
      throw new Error('Client not found');
    }

    // Get current month usage
    const { data: usage } = await supabase
      .from('client_monthly_usage')
      .select('*')
      .eq('client_id', client_id)
      .eq('month', currentMonth)
      .maybeSingle();

    const totalVisits = usage?.total_visits || 0;
    const totalBandwidthGb = parseFloat(usage?.total_bandwidth_gb || '0');
    const overageVisits = usage?.overage_visits || 0;
    const overageBandwidthGb = parseFloat(usage?.overage_bandwidth_gb || '0');

    // Calculate percentages
    const visitsPercentage = Math.round((totalVisits / client.monthly_visits_limit) * 100);
    const bandwidthPercentage = Math.round((totalBandwidthGb / client.monthly_bandwidth_limit_gb) * 100);

    // Calculate projected overage charge (S/15 per 1,000 visits or 3GB, whichever is greater)
    const overageUnitsVisits = Math.ceil(overageVisits / 1000);
    const overageUnitsBandwidth = Math.ceil(overageBandwidthGb / 3);
    const overageUnits = Math.max(overageUnitsVisits, overageUnitsBandwidth);
    const projectedCharge = overageUnits * 15; // S/15 per unit

    const stats = {
      currentMonth,
      plan_type: client.plan_type,
      limits: {
        visits: client.monthly_visits_limit,
        bandwidth_gb: client.monthly_bandwidth_limit_gb,
      },
      usage: {
        visits: totalVisits,
        bandwidth_gb: totalBandwidthGb,
        visits_percentage: visitsPercentage,
        bandwidth_percentage: bandwidthPercentage,
      },
      overage: {
        visits: overageVisits,
        bandwidth_gb: overageBandwidthGb,
        projected_charge: projectedCharge,
        currency: 'S/',
      },
      warnings: {
        visits_warning: visitsPercentage >= 80,
        visits_exceeded: visitsPercentage >= 100,
        bandwidth_warning: bandwidthPercentage >= 80,
        bandwidth_exceeded: bandwidthPercentage >= 100,
      },
    };

    console.log(`📊 Usage stats for ${client_id}:`, stats);

    return new Response(
      JSON.stringify(stats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error getting usage stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
