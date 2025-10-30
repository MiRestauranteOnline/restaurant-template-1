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

    const body = await req.json()
    const domain = body?.domain ?? body?.subdomain

    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch all critical above-the-fold data
    // Handle both subdomain and custom domain queries
    const isSubdomain = domain.length < 20 && !domain.includes('.'); // Simple heuristic
    
    let clientQuery;
    if (isSubdomain) {
      // Query by subdomain for platform subdomains
      clientQuery = supabaseClient
        .from('clients')
        .select('*')
        .eq('subdomain', domain)
        .single();
    } else {
      // Query by domain for custom domains
      clientQuery = supabaseClient
        .from('clients')
        .select('*')
        .eq('domain', domain)
        .single();
    }
    
    const { data: client } = await clientQuery;

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

    // Fetch premium features (GA, GSC, etc.)
    const { data: premiumFeatures } = await supabaseClient
      .from('premium_features')
      .select('google_analytics_id, google_search_console_verification')
      .eq('client_id', client.id)
      .single()

    // Fetch reviews and full datasets needed for static snapshots
    const { data: reviews } = await supabaseClient
      .from('reviews')
      .select('*')
      .eq('client_id', client.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    // Fetch menu items and categories
    const { data: menuItems } = await supabaseClient
      .from('menu_items')
      .select('id,name,description,price,category,category_id,image_url,show_image_home,show_image_menu,show_on_homepage,display_order,is_active')
      .eq('client_id', client.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    const { data: menuCategories } = await supabaseClient
      .from('menu_categories')
      .select('id,name,display_order,is_active')
      .eq('client_id', client.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

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

    // Build the fast-load data object with comprehensive info for bot snapshots
    const fastLoadData = {
      // Client basics
      restaurant_name: client.restaurant_name,
      phone: client.phone,
      phone_country_code: client.phone_country_code,
      whatsapp: client.whatsapp,
      whatsapp_country_code: client.whatsapp_country_code,
      email: client.email,
      address: client.address,
      opening_hours_ordered: client.opening_hours_ordered,
      social_media_links: client.social_media_links,
      favicon_url: client.favicon_url,
      theme: client.theme,
      
      // Critical admin content
      header_logo_url: adminContent?.header_logo_url,
      footer_logo_url: adminContent?.footer_logo_url,
      footer_description: adminContent?.footer_description,
      
      // Homepage hero
      homepage_hero_background_url: adminContent?.homepage_hero_background_url,
      homepage_hero_title: adminContent?.homepage_hero_title,
      homepage_hero_title_first_line: (adminContent as any)?.homepage_hero_title_first_line,
      homepage_hero_title_second_line: (adminContent as any)?.homepage_hero_title_second_line,
      homepage_hero_description: adminContent?.homepage_hero_description,
      
      // Homepage sections
      homepage_menu_section_title_first_line: (adminContent as any)?.homepage_menu_section_title_first_line,
      homepage_menu_section_title_second_line: (adminContent as any)?.homepage_menu_section_title_second_line,
      homepage_menu_section_description: adminContent?.homepage_menu_section_description,
      homepage_about_section_title_first_line: (adminContent as any)?.homepage_about_section_title_first_line,
      homepage_about_section_title_second_line: (adminContent as any)?.homepage_about_section_title_second_line,
      homepage_about_section_description: adminContent?.homepage_about_section_description,
      homepage_services_section_title_first_line: (adminContent as any)?.homepage_services_section_title_first_line,
      homepage_services_section_title_second_line: (adminContent as any)?.homepage_services_section_title_second_line,
      homepage_services_section_description: adminContent?.homepage_services_section_description,
      
      // Services cards/features
      services_card1_title: (adminContent as any)?.services_card1_title,
      services_card1_description: (adminContent as any)?.services_card1_description,
      services_card1_button_text: (adminContent as any)?.services_card1_button_text,
      services_card1_button_link: (adminContent as any)?.services_card1_button_link,
      services_card2_title: (adminContent as any)?.services_card2_title,
      services_card2_description: (adminContent as any)?.services_card2_description,
      services_card2_button_text: (adminContent as any)?.services_card2_button_text,
      services_card2_button_link: (adminContent as any)?.services_card2_button_link,
      services_card3_title: (adminContent as any)?.services_card3_title,
      services_card3_description: (adminContent as any)?.services_card3_description,
      services_card3_button_text: (adminContent as any)?.services_card3_button_text,
      services_card3_button_link: (adminContent as any)?.services_card3_button_link,
      services_feature1_text: (adminContent as any)?.services_feature1_text,
      services_feature2_text: (adminContent as any)?.services_feature2_text,
      services_feature3_text: (adminContent as any)?.services_feature3_text,
      
      // Menu page hero
      menu_page_hero_title_first_line: (adminContent as any)?.menu_page_hero_title_first_line,
      menu_page_hero_title_second_line: (adminContent as any)?.menu_page_hero_title_second_line,
      menu_page_hero_description: adminContent?.menu_page_hero_description,
      menu_page_hero_background_url: adminContent?.menu_page_hero_background_url,
      downloadable_menu_url: adminContent?.downloadable_menu_url,
      
      // About page hero
      about_page_hero_title_first_line: (adminContent as any)?.about_page_hero_title_first_line,
      about_page_hero_title_second_line: (adminContent as any)?.about_page_hero_title_second_line,
      about_page_hero_description: adminContent?.about_page_hero_description,
      about_page_hero_background_url: adminContent?.about_page_hero_background_url,
      
      // Reviews page hero
      reviews_page_hero_title_first_line: (adminContent as any)?.reviews_page_hero_title_first_line,
      reviews_page_hero_title_second_line: (adminContent as any)?.reviews_page_hero_title_second_line,
      reviews_page_hero_description: adminContent?.reviews_page_hero_description,
      reviews_page_hero_background_url: adminContent?.reviews_page_hero_background_url,
      
      // Contact page hero
      contact_page_hero_title_first_line: (adminContent as any)?.contact_page_hero_title_first_line,
      contact_page_hero_title_second_line: (adminContent as any)?.contact_page_hero_title_second_line,
      contact_page_hero_description: adminContent?.contact_page_hero_description,
      contact_page_hero_background_url: adminContent?.contact_page_hero_background_url,
      
      // Critical settings
      primary_color: clientSettings?.primary_color,
      primary_button_text_style: clientSettings?.primary_button_text_style,
      header_background_enabled: clientSettings?.header_background_enabled,
      header_background_style: clientSettings?.header_background_style,
      title_font: clientSettings?.title_font,
      body_font: clientSettings?.body_font,
      title_font_weight: (clientSettings as any)?.title_font_weight,
      
      // Navigation critical data
      has_reviews: Array.isArray(reviews) && reviews.length > 0,
      delivery_services: deliveryServices,
      
      // Full datasets for SSR rendering
      admin_content_full: adminContent,
      client_settings_full: clientSettings,
      client_full: client,
      menu: {
        categories: menuCategories || [],
        items: menuItems || [],
      },
      menu_preview_items: (menuItems || []).filter((i: any) => i.show_on_homepage).slice(0, 6),
      reviews: reviews || [],
      
      // Analytics and SEO
      google_analytics_id: premiumFeatures?.google_analytics_id,
      google_search_console_verification: premiumFeatures?.google_search_console_verification,
      
      // Metadata
      generated_at: new Date().toISOString(),
      domain: domain
    }

    // Upload to storage bucket for immediate access
    const fileName = `fast-load/${domain}.json`
    
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