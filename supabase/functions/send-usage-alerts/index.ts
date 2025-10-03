import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClientUsageAlert {
  alert_type: 'client_bandwidth' | 'client_visits' | 'vercel_bandwidth';
  client_id?: string;
  usage_percentage?: number;
  total_bandwidth_gb?: number;
  total_visits?: number;
  limit_gb?: number;
  limit_visits?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    const alertData: ClientUsageAlert = await req.json();

    console.log('📧 Preparing to send usage alert:', alertData.alert_type);

    let emailContent = '';
    let subject = '';
    let recipientEmails: string[] = [];

    // Get admin emails
    const { data: adminUsers } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (adminUsers && adminUsers.length > 0) {
      const { data: adminProfiles } = await supabase.auth.admin.listUsers();
      recipientEmails = adminProfiles.users
        .filter(u => adminUsers.some(au => au.user_id === u.id))
        .map(u => u.email!)
        .filter(Boolean);
    }

    if (recipientEmails.length === 0) {
      throw new Error('No admin emails found');
    }

    // Build email based on alert type
    if (alertData.alert_type === 'vercel_bandwidth') {
      subject = '⚠️ Alerta: Uso de Vercel cerca del límite';
      emailContent = `
        <h1>Alerta de Uso de Vercel</h1>
        <p>El uso total de bandwidth de Vercel está en <strong>${alertData.usage_percentage?.toFixed(1)}%</strong> del límite.</p>
        <ul>
          <li>Uso actual: ${alertData.total_bandwidth_gb?.toFixed(2)} GB</li>
          <li>Límite: ${alertData.limit_gb} GB</li>
        </ul>
        <p>Considera optimizar el bandwidth o actualizar el plan de Vercel.</p>
      `;
    } else if (alertData.alert_type === 'client_bandwidth' || alertData.alert_type === 'client_visits') {
      const { data: client } = await supabase
        .from('clients')
        .select('restaurant_name, email, subdomain')
        .eq('id', alertData.client_id)
        .single();

      if (!client) {
        throw new Error('Client not found');
      }

      const metricType = alertData.alert_type === 'client_bandwidth' ? 'bandwidth' : 'visitas';
      const currentValue = alertData.alert_type === 'client_bandwidth' 
        ? `${alertData.total_bandwidth_gb?.toFixed(2)} GB`
        : `${alertData.total_visits} visitas`;
      const limit = alertData.alert_type === 'client_bandwidth'
        ? `${alertData.limit_gb} GB`
        : `${alertData.limit_visits} visitas`;

      subject = `⚠️ Alerta: Cliente ${client.restaurant_name} cerca del límite de ${metricType}`;
      emailContent = `
        <h1>Alerta de Uso de Cliente</h1>
        <p>El cliente <strong>${client.restaurant_name}</strong> está en <strong>${alertData.usage_percentage?.toFixed(1)}%</strong> del límite de ${metricType}.</p>
        <ul>
          <li>Cliente: ${client.restaurant_name}</li>
          <li>Sitio: ${client.subdomain}.lovable.app</li>
          <li>Uso actual: ${currentValue}</li>
          <li>Límite: ${limit}</li>
        </ul>
        <p>Considera contactar al cliente para informarle sobre posibles cargos por sobrepaso.</p>
      `;

      // Also send email to client if they have email
      if (client.email) {
        await resend.emails.send({
          from: 'Mi Restaurante Online <noreply@mirestauranteonline.com>',
          to: [client.email],
          subject: `Alerta de Uso: ${client.restaurant_name}`,
          html: `
            <h1>Alerta de Uso de Tu Sitio Web</h1>
            <p>Hola,</p>
            <p>Tu sitio web está utilizando <strong>${alertData.usage_percentage?.toFixed(1)}%</strong> del límite mensual de ${metricType}.</p>
            <ul>
              <li>Uso actual: ${currentValue}</li>
              <li>Límite: ${limit}</li>
            </ul>
            <p>Si superas el límite, se aplicarán cargos adicionales según tu plan.</p>
            <p>Puedes revisar tu uso en tu panel de control.</p>
            <p>Saludos,<br>El equipo de Mi Restaurante Online</p>
          `,
        });
      }
    }

    // Send alert to admins
    const emailResponse = await resend.emails.send({
      from: 'Mi Restaurante Online Alerts <alerts@mirestauranteonline.com>',
      to: recipientEmails,
      subject,
      html: emailContent,
    });

    console.log('✅ Alert email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ success: true, email_response: emailResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error sending usage alert:', error);
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
