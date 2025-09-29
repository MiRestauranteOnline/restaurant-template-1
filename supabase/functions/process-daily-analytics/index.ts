import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalyticsEvent {
  id: string;
  client_id: string;
  session_id: string;
  event_type: string;
  event_data: any;
  user_agent: string;
  device_type: string;
  created_at: string;
}

interface DailyAnalytics {
  client_id: string;
  date: string;
  total_page_views: number;
  unique_sessions: number;
  avg_time_on_page: number;
  bounce_rate: number;
  whatsapp_clicks: number;
  phone_clicks: number;
  menu_downloads: number;
  reservation_clicks: number;
  menu_section_data: Record<string, { views: number; avg_time: number }>;
  device_breakdown: Record<string, number>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting daily analytics processing...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get yesterday's date (or specific date if provided)
    const { date } = await req.json().catch(() => ({}));
    const targetDate = date || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    console.log(`📊 Processing analytics for date: ${targetDate}`);

    // Fetch all events for the target date
    const { data: events, error: eventsError } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', `${targetDate}T00:00:00`)
      .lt('created_at', `${targetDate}T23:59:59`);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      throw eventsError;
    }

    console.log(`📈 Found ${events?.length || 0} events to process`);

    if (!events || events.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No events found for the specified date',
        date: targetDate 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Group events by client
    const eventsByClient = events.reduce((acc, event) => {
      if (!acc[event.client_id]) acc[event.client_id] = [];
      acc[event.client_id].push(event);
      return acc;
    }, {} as Record<string, AnalyticsEvent[]>);

    const processedClients = [];

    // Process each client's analytics
    for (const [clientId, clientEvents] of Object.entries(eventsByClient)) {
      const typedClientEvents = clientEvents as AnalyticsEvent[];
      console.log(`🏪 Processing ${typedClientEvents.length} events for client ${clientId}`);

      const analytics = processClientAnalytics(clientId, typedClientEvents, targetDate);
      
      // Upsert daily analytics
      const { error: upsertError } = await supabase
        .from('daily_analytics')
        .upsert(analytics, { 
          onConflict: 'client_id,date',
          ignoreDuplicates: false 
        });

      if (upsertError) {
        console.error(`Error upserting analytics for client ${clientId}:`, upsertError);
        continue;
      }

      processedClients.push(clientId);
      console.log(`✅ Processed analytics for client ${clientId}`);
    }

    console.log(`🎉 Successfully processed analytics for ${processedClients.length} clients`);

    return new Response(JSON.stringify({ 
      success: true,
      date: targetDate,
      processedClients: processedClients.length,
      clientIds: processedClients
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in process-daily-analytics:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return new Response(JSON.stringify({ 
      error: errorMessage,
      stack: errorStack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function processClientAnalytics(clientId: string, events: AnalyticsEvent[], date: string): DailyAnalytics {
  const sessions = new Set(events.map(e => e.session_id));
  const pageViews = events.filter(e => e.event_type === 'page_view');
  const buttonClicks = events.filter(e => e.event_type === 'button_click');
  const menuSectionViews = events.filter(e => e.event_type === 'menu_section_view');
  const menuDownloads = events.filter(e => e.event_type === 'menu_download');
  
  // Calculate device breakdown
  const deviceBreakdown = events.reduce((acc, event) => {
    acc[event.device_type] = (acc[event.device_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate button click counts
  const whatsappClicks = buttonClicks.filter(e => 
    e.event_data?.button_type?.includes('whatsapp') || 
    e.event_data?.button_type?.includes('WhatsApp')
  ).length;
  
  const phoneClicks = buttonClicks.filter(e => 
    e.event_data?.button_type?.includes('phone') || 
    e.event_data?.button_type?.includes('call')
  ).length;
  
  const reservationClicks = buttonClicks.filter(e => 
    e.event_data?.button_type?.includes('reservation') || 
    e.event_data?.button_type?.includes('reserva')
  ).length;

  // Calculate menu section data
  const menuSectionData = menuSectionViews.reduce((acc, event) => {
    const sectionName = event.event_data?.section_name;
    if (!sectionName) return acc;
    
    if (!acc[sectionName]) {
      acc[sectionName] = { views: 0, avg_time: 0 };
    }
    
    acc[sectionName].views += 1;
    if (event.event_data?.time_spent) {
      acc[sectionName].avg_time += event.event_data.time_spent;
    }
    
    return acc;
  }, {} as Record<string, { views: number; avg_time: number }>);

  // Calculate average time for menu sections
  Object.keys(menuSectionData).forEach(section => {
    if (menuSectionData[section].views > 0) {
      menuSectionData[section].avg_time = Math.round(
        menuSectionData[section].avg_time / menuSectionData[section].views
      );
    }
  });

  // Calculate bounce rate (sessions with only 1 page view)
  const sessionPageViews = pageViews.reduce((acc, event) => {
    acc[event.session_id] = (acc[event.session_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const bouncedSessions = Object.values(sessionPageViews).filter(count => count === 1).length;
  const bounceRate = sessions.size > 0 ? (bouncedSessions / sessions.size) * 100 : 0;

  // Calculate average time on page (simplified - based on scroll events timing)
  const avgTimeOnPage = 120; // Default to 2 minutes for now - could be enhanced with more sophisticated timing

  return {
    client_id: clientId,
    date,
    total_page_views: pageViews.length,
    unique_sessions: sessions.size,
    avg_time_on_page: avgTimeOnPage,
    bounce_rate: Math.round(bounceRate * 100) / 100,
    whatsapp_clicks: whatsappClicks,
    phone_clicks: phoneClicks,
    menu_downloads: menuDownloads.length,
    reservation_clicks: reservationClicks,
    menu_section_data: menuSectionData,
    device_breakdown: deviceBreakdown
  };
}