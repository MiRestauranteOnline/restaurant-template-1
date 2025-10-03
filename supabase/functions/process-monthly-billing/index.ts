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

    console.log('💰 Starting monthly billing process...');

    // Get last month (we bill on the 1st for the previous month)
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = lastMonth.toISOString().split('T')[0];

    console.log(`📅 Processing billing for month: ${lastMonthStr}`);

    // Get all unbilled usage records for last month
    const { data: usageRecords, error: fetchError } = await supabase
      .from('client_monthly_usage')
      .select('*, clients(id, restaurant_name, email, plan_type)')
      .eq('month', lastMonthStr)
      .eq('billed', false);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`📊 Found ${usageRecords?.length || 0} unbilled usage records`);

    const billingResults = [];

    for (const usage of usageRecords || []) {
      try {
        // Calculate overage charge
        // S/15 per 1,000 visits or 3GB (whichever is greater)
        const overageUnitsVisits = Math.ceil(usage.overage_visits / 1000);
        const overageUnitsBandwidth = Math.ceil(parseFloat(usage.overage_bandwidth_gb) / 3);
        const overageUnits = Math.max(overageUnitsVisits, overageUnitsBandwidth);
        const overageCharge = overageUnits * 15;

        if (overageCharge > 0) {
          console.log(`💸 Client ${usage.clients.restaurant_name}: S/${overageCharge} overage`);

          // Update usage record with billing info
          await supabase
            .from('client_monthly_usage')
            .update({
              overage_charge: overageCharge,
              billed: true,
              billing_date: new Date().toISOString(),
            })
            .eq('id', usage.id);

          // TODO: Trigger payment via MercadoPago/Rebill
          // This would integrate with your payment processor
          // For now, we just mark it as billed

          billingResults.push({
            client_id: usage.client_id,
            client_name: usage.clients.restaurant_name,
            month: lastMonthStr,
            total_visits: usage.total_visits,
            total_bandwidth_gb: usage.total_bandwidth_gb,
            overage_visits: usage.overage_visits,
            overage_bandwidth_gb: usage.overage_bandwidth_gb,
            overage_charge: overageCharge,
            status: 'billed',
          });
        } else {
          console.log(`✅ Client ${usage.clients.restaurant_name}: No overage`);

          // Mark as billed even if no charge
          await supabase
            .from('client_monthly_usage')
            .update({
              overage_charge: 0,
              billed: true,
              billing_date: new Date().toISOString(),
            })
            .eq('id', usage.id);

          billingResults.push({
            client_id: usage.client_id,
            client_name: usage.clients.restaurant_name,
            month: lastMonthStr,
            total_visits: usage.total_visits,
            total_bandwidth_gb: usage.total_bandwidth_gb,
            overage_visits: 0,
            overage_bandwidth_gb: 0,
            overage_charge: 0,
            status: 'no_overage',
          });
        }

        // TODO: Send email notification to client about billing
        // This would use Resend or similar email service
        
      } catch (error) {
        console.error(`❌ Error processing billing for client ${usage.client_id}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        billingResults.push({
          client_id: usage.client_id,
          status: 'error',
          error: errorMessage,
        });
      }
    }

    console.log(`✅ Billing process complete. Processed ${billingResults.length} records`);

    return new Response(
      JSON.stringify({
        success: true,
        month: lastMonthStr,
        processed: billingResults.length,
        results: billingResults,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error in monthly billing:', error);
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
