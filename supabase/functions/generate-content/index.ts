import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
    const { briefing, clientId } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Call ChatGPT API to generate content based on briefing
    const chatGptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a content generator for restaurant websites. Generate comprehensive content based on the briefing provided. 
            
            Return a JSON object with the following structure (ALL fields must be filled):
            {
              "homepage_hero_title_first_line": "First line of homepage hero title",
              "homepage_hero_title_second_line": "Second line of homepage hero title", 
              "homepage_hero_description": "Homepage hero description",
              "homepage_hero_background_url": "URL for hero background image",
              "about_page_hero_title_first_line": "First line of about page hero",
              "about_page_hero_title_second_line": "Second line of about page hero",
              "about_page_hero_background_url": "URL for about page background",
              "menu_page_hero_title_first_line": "First line of menu page hero",
              "menu_page_hero_title_second_line": "Second line of menu page hero", 
              "menu_page_hero_background_url": "URL for menu page background",
              "contact_page_hero_title_first_line": "First line of contact page hero",
              "contact_page_hero_title_second_line": "Second line of contact page hero",
              "contact_page_hero_background_url": "URL for contact page background",
              "reviews_page_hero_title_first_line": "First line of reviews page hero",
              "reviews_page_hero_title_second_line": "Second line of reviews page hero", 
              "reviews_page_hero_background_url": "URL for reviews page background",
              "homepage_about_section_image_url": "URL for homepage about section image",
              "about_page_about_section_image_url": "URL for about page about section image",
              "homepage_about_section_title_first_line": "First line of about section title",
              "homepage_about_section_title_second_line": "Second line of about section title",
              "homepage_about_section_description": "About section description",
              "homepage_services_section_title_first_line": "First line of services section",
              "homepage_services_section_title_second_line": "Second line of services section",
              "homepage_services_section_description": "Services section description",
              "homepage_menu_section_title_first_line": "First line of menu section",
              "homepage_menu_section_title_second_line": "Second line of menu section",
              "homepage_menu_section_description": "Menu section description",
              "homepage_contact_section_title_first_line": "First line of contact section",
              "homepage_contact_section_title_second_line": "Second line of contact section",
              "homepage_contact_section_description": "Contact section description",
              "about_story": "Restaurant story/history",
              "about_mission": "Restaurant mission statement",
              "about_chef_info": "Information about the chef",
              "stats_experience_number": "Years of experience (e.g., '15+')",
              "stats_experience_label": "Experience label",
              "stats_clients_number": "Number of clients (e.g., '5K+')",
              "stats_clients_label": "Clients label", 
              "stats_awards_number": "Number of awards (e.g., '10+')",
              "stats_awards_label": "Awards label",
              "stats_item1_icon": "Lucide icon name (Clock, Users, Award, Star, etc.)",
              "stats_item2_icon": "Lucide icon name",
              "stats_item3_icon": "Lucide icon name",
              "services_card1_title": "First service title",
              "services_card1_description": "First service description",
              "services_card1_icon": "Lucide icon name",
              "services_card1_button_text": "Button text",
              "services_card1_button_link": "WhatsApp or contact link",
              "services_card2_title": "Second service title",
              "services_card2_description": "Second service description", 
              "services_card2_icon": "Lucide icon name",
              "services_card2_button_text": "Button text",
              "services_card2_button_link": "WhatsApp or contact link",
              "services_card3_title": "Third service title",
              "services_card3_description": "Third service description",
              "services_card3_icon": "Lucide icon name", 
              "services_card3_button_text": "Button text",
              "services_card3_button_link": "WhatsApp or contact link",
              "services_feature1_text": "First feature text",
              "services_feature1_icon": "Lucide icon name",
              "services_feature2_text": "Second feature text", 
              "services_feature2_icon": "Lucide icon name",
              "services_feature3_text": "Third feature text",
              "services_feature3_icon": "Lucide icon name"
            }
            
            Use appropriate Lucide icon names like: Clock, Users, Award, Star, MapPin, Utensils, Truck, Heart, Coffee, Zap.
            Make content engaging and restaurant-appropriate. Ensure all titles are split appropriately between first and second lines.`
          },
          {
            role: 'user',
            content: `Generate restaurant content based on this briefing: ${briefing}`
          }
        ],
        temperature: 0.7
      })
    })

    if (!chatGptResponse.ok) {
      throw new Error(`ChatGPT API error: ${chatGptResponse.status}`)
    }

    const chatGptData = await chatGptResponse.json()
    const generatedContent = JSON.parse(chatGptData.choices[0].message.content)

    // Update admin_content table with generated content
    const { error: updateError } = await supabaseClient
      .from('admin_content')
      .update(generatedContent)
      .eq('client_id', clientId)

    if (updateError) {
      throw new Error(`Database update error: ${updateError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Content generated and updated successfully',
        generatedContent 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})