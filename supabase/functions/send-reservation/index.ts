import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { CustomerConfirmation } from "./_templates/customer-confirmation.tsx";
import { ClientNotification } from "./_templates/client-notification.tsx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    console.log("📝 Received reservation request:", {
      clientId: requestData.client_id,
      date: requestData.reservation_date,
      time: requestData.reservation_time,
      hasTurnstileToken: !!requestData.turnstile_token,
    });

    // 1. Validate required fields
    if (!requestData.client_id || !requestData.turnstile_token || !requestData.reservation_date || 
        !requestData.reservation_time || !requestData.party_size || !requestData.customer_name ||
        !requestData.customer_email || !requestData.customer_phone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 2. Fetch client data including Turnstile secret
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("restaurant_name, email, reservations_email, turnstile_secret_key, timezone")
      .eq("id", requestData.client_id)
      .single();

    if (clientError || !client) {
      console.error("❌ Client not found:", clientError);
      return new Response(
        JSON.stringify({ error: "Client not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!(client as any).turnstile_secret_key) {
      console.error("❌ Client missing Turnstile secret key");
      return new Response(
        JSON.stringify({ error: "Security configuration not found" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 3. Validate Turnstile token
    console.log("🔐 Validating Turnstile token...");
    const clientIp = req.headers.get("CF-Connecting-IP") || 
                     req.headers.get("X-Forwarded-For")?.split(",")[0];

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: (client as any).turnstile_secret_key,
          response: requestData.turnstile_token,
          remoteip: clientIp,
        }),
      }
    );

    const turnstileData = await turnstileResponse.json();

    if (!turnstileData.success) {
      console.error("❌ Turnstile validation failed:", turnstileData["error-codes"]);
      return new Response(
        JSON.stringify({
          error: "Security verification failed",
          details: turnstileData["error-codes"]?.join(", ") || "Validation failed",
        }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("✅ Turnstile validation successful");

    // 4. Rate limiting - Check recent reservations
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    // 4a. Check client-level rate limit (5 per hour)
    const { count: clientRecentCount } = await supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("client_id", requestData.client_id)
      .gte("created_at", oneHourAgo);

    if (clientRecentCount && clientRecentCount >= 5) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 4b. Check per-email pending limit (max 3 pending)
    const { count: emailPendingCount } = await supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("customer_email", requestData.customer_email)
      .eq("client_id", requestData.client_id)
      .in("status", ["pending"]);

    if (emailPendingCount && emailPendingCount >= 3) {
      return new Response(
        JSON.stringify({ error: "Ya tienes 3 reservas pendientes. Por favor espera la confirmación." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 5. Validate reservation schedule
    const [year, month, day] = requestData.reservation_date.split("-").map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const dayOfWeek = selectedDate.getDay();

    const { data: schedule, error: scheduleError } = await supabase
      .from("reservation_schedules")
      .select("*")
      .eq("client_id", requestData.client_id)
      .eq("day_of_week", dayOfWeek)
      .eq("is_active", true)
      .lte("start_time", requestData.reservation_time)
      .gte("end_time", requestData.reservation_time)
      .single();

    if (scheduleError || !schedule) {
      console.error("❌ No schedule found for this time:", scheduleError);
      return new Response(
        JSON.stringify({ error: "Este horario no está disponible para reservas" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 6. Validate party size
    const partySize = parseInt(requestData.party_size);
    if (partySize < (schedule as any).min_party_size || partySize > (schedule as any).max_party_size) {
      return new Response(
        JSON.stringify({
          error: `El número de personas debe estar entre ${(schedule as any).min_party_size} y ${(schedule as any).max_party_size}`,
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 7. Check capacity for this time slot
    const [hours, minutes] = requestData.reservation_time.split(":").map(Number);
    const slotStartMinutes = hours * 60 + minutes;
    const slotEndMinutes = slotStartMinutes + ((schedule as any).duration_minutes || 120);

    const { data: existingReservations } = await supabase
      .from("reservations")
      .select("reservation_time, party_size, duration_minutes")
      .eq("client_id", requestData.client_id)
      .eq("reservation_date", requestData.reservation_date)
      .in("status", ["pending", "confirmed"]);

    let totalPartySize = partySize;
    (existingReservations || []).forEach((res: any) => {
      const [resHours, resMinutes] = res.reservation_time.split(":").map(Number);
      const resStartMinutes = resHours * 60 + resMinutes;
      const resEndMinutes = resStartMinutes + (res.duration_minutes || 120);

      const overlaps = slotStartMinutes < resEndMinutes && slotEndMinutes > resStartMinutes;
      if (overlaps) {
        totalPartySize += res.party_size;
      }
    });

    if (totalPartySize > (schedule as any).capacity) {
      return new Response(
        JSON.stringify({ error: "Este horario ya no tiene capacidad disponible" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 8. Insert reservation
    const { data: reservation, error: insertError } = await supabase
      .from("reservations")
      .insert({
        client_id: requestData.client_id,
        reservation_date: requestData.reservation_date,
        reservation_time: requestData.reservation_time,
        party_size: partySize,
        customer_name: requestData.customer_name,
        customer_email: requestData.customer_email,
        customer_phone: requestData.customer_phone,
        special_requests: requestData.special_requests || null,
        table_config_id: requestData.table_config_id || null,
        duration_minutes: (schedule as any).duration_minutes || 120,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("❌ Reservation insert error:", insertError);
      throw insertError;
    }

    console.log("✅ Reservation created:", (reservation as any).id);

    // 9. Send emails
    const restaurantEmail = (client as any).reservations_email || client.email;

    // Customer confirmation email
    const customerHtml = await renderAsync(
      React.createElement(CustomerConfirmation, {
        restaurantName: client.restaurant_name,
        customerName: requestData.customer_name,
        reservationDate: requestData.reservation_date,
        reservationTime: requestData.reservation_time,
        partySize: partySize,
        specialRequests: requestData.special_requests,
      })
    );

    await resend.emails.send({
      from: "Reservas <onboarding@resend.dev>",
      to: [requestData.customer_email],
      subject: `Confirmación de Reserva - ${client.restaurant_name}`,
      html: customerHtml,
    });

    console.log("✅ Customer confirmation email sent");

    // Client notification email
    const clientHtml = await renderAsync(
      React.createElement(ClientNotification, {
        restaurantName: client.restaurant_name,
        customerName: requestData.customer_name,
        customerEmail: requestData.customer_email,
        customerPhone: requestData.customer_phone,
        reservationDate: requestData.reservation_date,
        reservationTime: requestData.reservation_time,
        partySize: partySize,
        specialRequests: requestData.special_requests,
        reservationId: (reservation as any).id,
      })
    );

    await resend.emails.send({
      from: "Sistema de Reservas <onboarding@resend.dev>",
      to: [restaurantEmail],
      subject: `Nueva Reserva - ${requestData.customer_name}`,
      html: clientHtml,
    });

    console.log("✅ Client notification email sent");

    return new Response(
      JSON.stringify({
        success: true,
        reservation_id: (reservation as any).id,
        message: "Reserva creada exitosamente",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("❌ Error processing reservation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
