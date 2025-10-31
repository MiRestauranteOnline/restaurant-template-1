import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { generateRestaurantEmail, generateCustomerEmail } from "./_templates/email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendApiKey);

    const requestData = await req.json();
    console.log("📝 Received reclamación request:", { 
      clientId: requestData.clientId,
      email: requestData.email,
      hasTurnstileToken: !!requestData.turnstile_token
    });

    // Validate required fields
    if (!requestData.clientId || !requestData.turnstile_token) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: clientId and turnstile_token' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch client data including turnstile_secret_key
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("restaurant_name, email, turnstile_secret_key")
      .eq("id", requestData.clientId)
      .single();

    if (clientError || !client) {
      console.error("❌ Client not found:", clientError);
      return new Response(
        JSON.stringify({ error: 'Client not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!(client as any).turnstile_secret_key) {
      console.error("❌ Client missing Turnstile secret key");
      return new Response(
        JSON.stringify({ error: 'Security configuration not found' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate Turnstile token
    console.log("🔐 Validating Turnstile token...");
    const clientIp = req.headers.get('CF-Connecting-IP') || 
                     req.headers.get('X-Forwarded-For')?.split(',')[0];

    const turnstileResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: (client as any).turnstile_secret_key,
          response: requestData.turnstile_token,
          remoteip: clientIp,
        }),
      }
    );

    const turnstileData = await turnstileResponse.json();

    if (!turnstileData.success) {
      console.error("❌ Turnstile validation failed:", turnstileData['error-codes']);
      return new Response(
        JSON.stringify({ 
          error: 'Security verification failed',
          details: turnstileData['error-codes']?.join(', ') || 'Validation failed'
        }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("✅ Turnstile validation successful");

    // Fetch client policies for reclamaciones_email
    const { data: policies } = await supabase
      .from("client_policies")
      .select("reclamaciones_email")
      .eq("client_id", requestData.clientId)
      .single();

    const restaurantEmail = policies?.reclamaciones_email || client.email;

    console.log("📧 Restaurant email:", restaurantEmail);

    // Generate unique claim code
    const claimCode = `RECLAM-${Math.floor(100000 + Math.random() * 900000)}`;

    // Store in database
    const { error: insertError } = await supabase
      .from("reclamaciones")
      .insert({
        client_id: requestData.clientId,
        claim_code: claimCode,
        person_type: requestData.personType,
        dni: requestData.dni || null,
        ruc: requestData.ruc || null,
        business_name: requestData.businessName || null,
        full_name: requestData.fullName,
        email: requestData.email,
        phone: requestData.phone || null,
        address: requestData.address || null,
        purchase_amount: requestData.purchaseAmount || null,
        product_description: requestData.productDescription,
        purchase_date: requestData.purchaseDate,
        claim_type: requestData.claimType,
        description: requestData.description,
      });

    if (insertError) {
      console.error("❌ Database insert error:", insertError);
      throw insertError;
    }

    console.log("✅ Claim stored with code:", claimCode);

    // Generate HTML email content
    const restaurantHtml = generateRestaurantEmail({
      restaurantName: client.restaurant_name,
      claimCode,
      claimData: requestData,
      submittedAt: new Date().toLocaleString("es-PE", {
        timeZone: "America/Lima",
      }),
    });

    const customerHtml = generateCustomerEmail({
      restaurantName: client.restaurant_name,
      claimCode,
      claimData: requestData,
      restaurantEmail,
    });

    // Send email to restaurant
    const { error: restaurantEmailError } = await resend.emails.send({
      from: "Libro de Reclamaciones <onboarding@resend.dev>",
      replyTo: restaurantEmail,
      to: [restaurantEmail],
      subject: `Nueva Reclamación - ${client.restaurant_name}`,
      html: restaurantHtml,
    });

    if (restaurantEmailError) {
      console.error("❌ Restaurant email error:", restaurantEmailError);
      throw restaurantEmailError;
    }

    console.log("✅ Restaurant email sent");

    // Send confirmation to customer
    const { error: customerEmailError } = await resend.emails.send({
      from: "Libro de Reclamaciones <onboarding@resend.dev>",
      replyTo: restaurantEmail,
      to: [requestData.email],
      subject: `Confirmación de Reclamación - ${client.restaurant_name}`,
      html: customerHtml,
    });

    if (customerEmailError) {
      console.error("❌ Customer email error:", customerEmailError);
      throw customerEmailError;
    }

    console.log("✅ Customer email sent");

    return new Response(
      JSON.stringify({ success: true, claimCode }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("❌ Error processing reclamación:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
