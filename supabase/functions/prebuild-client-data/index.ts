import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { subdomain } = await req.json()

    if (!subdomain) {
      return new Response(
        JSON.stringify({ error: 'Subdomain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch all critical above-the-fold data
    const { data: client } = await supabaseClient
      .from('clients')
      .select('*')
      .eq('subdomain', subdomain)
      .single()

    if (!client) {
      return new Response(
        JSON.stringify({ error: 'Client not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch admin content (logos, hero images, etc.)
    const { data: adminContent } = await supabaseClient
      .from('admin_content')
      .select('*')
      .eq('client_id', client.id)
      .single()

    // Fetch client settings (colors, header style, etc.)
    const { data: clientSettings } = await supabaseClient
      .from('client_settings')
      .select('*')
      .eq('client_id', client.id)
      .single()

    // Check if reviews exist
    const { data: reviews } = await supabaseClient
      .from('reviews')
      .select('id')
      .eq('client_id', client.id)
      .eq('is_active', true)
      .limit(1)

    // Get delivery services info
    const deliveryServices = []
    const clientDelivery = client.delivery
    const settingsDelivery = clientSettings?.delivery_info

    if (clientDelivery || settingsDelivery) {
      const services = [
        {
          name: 'Rappi',
          url: clientDelivery?.rappi || settingsDelivery?.rappi?.url,
          show: clientDelivery ? !!clientDelivery.rappi : settingsDelivery?.rappi?.show_in_nav !== false,
        },
        {
          name: 'PedidosYa', 
          url: clientDelivery?.pedidos_ya || settingsDelivery?.pedidosya?.url,
          show: clientDelivery ? !!clientDelivery.pedidos_ya : settingsDelivery?.pedidosya?.show_in_nav !== false,
        },
        {
          name: 'DiDi Food',
          url: clientDelivery?.didi_food || settingsDelivery?.didi?.url,
          show: clientDelivery ? !!clientDelivery.didi_food : settingsDelivery?.didi?.show_in_nav !== false,
        },
      ]
      
      deliveryServices.push(...services.filter(service => service.url && service.show))
    }

    // Build the fast-load data object with only critical above-the-fold info
    const fastLoadData = {
      // Client basics
      restaurant_name: client.restaurant_name,
      phone: client.phone,
      whatsapp: client.whatsapp,
      theme: client.theme,
      
      // Critical admin content
      header_logo_url: adminContent?.header_logo_url,
      footer_logo_url: adminContent?.footer_logo_url,
      footer_description: adminContent?.footer_description,
      homepage_hero_background_url: adminContent?.homepage_hero_background_url,
      homepage_hero_title: adminContent?.homepage_hero_title,
      homepage_hero_title_first_line: adminContent?.homepage_hero_title_first_line,
      homepage_hero_title_second_line: adminContent?.homepage_hero_title_second_line,
      homepage_hero_description: adminContent?.homepage_hero_description,
      
      // Critical settings
      primary_color: clientSettings?.primary_color,
      primary_button_text_style: clientSettings?.primary_button_text_style,
      header_background_enabled: clientSettings?.header_background_enabled,
      header_background_style: clientSettings?.header_background_style,
      
      // Navigation critical data
      has_reviews: reviews && reviews.length > 0,
      delivery_services: deliveryServices,
      
      // Metadata
      generated_at: new Date().toISOString(),
      subdomain: subdomain
    }

    // Upload to storage bucket for immediate access
    const fileName = `fast-load/${subdomain}.json`
    
    const { error: uploadError } = await supabaseClient.storage
      .from('client-assets')
      .upload(fileName, JSON.stringify(fastLoadData, null, 2), {
        contentType: 'application/json',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to save fast-load data', details: uploadError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Fast-load data generated successfully',
        url: `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/client-assets/${fileName}`,
        dataSize: JSON.stringify(fastLoadData).length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})