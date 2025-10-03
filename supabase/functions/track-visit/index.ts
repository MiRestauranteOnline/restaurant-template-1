import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VisitData {
  client_id: string;
  page_size_kb: number; // Estimated page size in KB
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { client_id, page_size_kb }: VisitData = await req.json();

    if (!client_id) {
      throw new Error('client_id is required');
    }

    console.log(`📊 Tracking visit for client: ${client_id}, page size: ${page_size_kb}KB`);

    // Get current month (first day)
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    // Get client's usage limits
    const { data: client } = await supabase
      .from('clients')
      .select('monthly_visits_limit, monthly_bandwidth_limit_gb')
      .eq('id', client_id)
      .single();

    if (!client) {
      throw new Error('Client not found');
    }

    // Upsert usage data
    const { data: usage, error: upsertError } = await supabase
      .from('client_monthly_usage')
      .select('*')
      .eq('client_id', client_id)
      .eq('month', currentMonth)
      .maybeSingle();

    const bandwidthMb = (page_size_kb || 3000) / 1024; // Convert KB to MB, default 3MB per page
    const bandwidthGb = bandwidthMb / 1024; // Convert MB to GB

    if (!usage) {
      // Create new usage record
      const newTotalVisits = 1;
      const newTotalBandwidthGb = bandwidthGb;
      const overageVisits = Math.max(0, newTotalVisits - client.monthly_visits_limit);
      const overageBandwidthGb = Math.max(0, newTotalBandwidthGb - client.monthly_bandwidth_limit_gb);

      await supabase.from('client_monthly_usage').insert({
        client_id,
        month: currentMonth,
        total_visits: newTotalVisits,
        total_bandwidth_gb: newTotalBandwidthGb,
        overage_visits: overageVisits,
        overage_bandwidth_gb: overageBandwidthGb,
        overage_charge: 0, // Will be calculated during billing
      });

      console.log(`✅ Created new usage record for ${client_id}`);
    } else {
      // Update existing usage record
      const newTotalVisits = usage.total_visits + 1;
      const newTotalBandwidthGb = parseFloat(usage.total_bandwidth_gb) + bandwidthGb;
      const overageVisits = Math.max(0, newTotalVisits - client.monthly_visits_limit);
      const overageBandwidthGb = Math.max(0, newTotalBandwidthGb - client.monthly_bandwidth_limit_gb);

      await supabase
        .from('client_monthly_usage')
        .update({
          total_visits: newTotalVisits,
          total_bandwidth_gb: newTotalBandwidthGb,
          overage_visits: overageVisits,
          overage_bandwidth_gb: overageBandwidthGb,
        })
        .eq('id', usage.id);

      console.log(`✅ Updated usage for ${client_id}: ${newTotalVisits} visits, ${newTotalBandwidthGb.toFixed(2)}GB`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Visit tracked' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error tracking visit:', error);
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
