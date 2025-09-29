import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useClient } from '@/contexts/ClientContext';

interface AnalyticsEvent {
  client_id: string;
  session_id: string;
  event_type: 'page_view' | 'button_click' | 'menu_section_view' | 'menu_download' | 'scroll_depth';
  event_data: {
    page?: string;
    button_type?: string;
    section_name?: string;
    scroll_percentage?: number;
    [key: string]: any;
  };
  user_agent: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  created_at: string;
}

const STORAGE_KEY = 'analytics_events';
const SESSION_KEY = 'analytics_session';
const UPLOAD_INTERVAL = 30 * 60 * 1000; // 30 minutes
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

export const useAnalytics = () => {
  const location = useLocation();
  const { client } = useClient();
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pageStartTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);

  // Generate or retrieve session ID
  const getSessionId = useCallback(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const { id, timestamp } = JSON.parse(stored);
      if (Date.now() - timestamp < SESSION_TIMEOUT) {
        return id;
      }
    }
    
    const newSessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      id: newSessionId,
      timestamp: Date.now()
    }));
    return newSessionId;
  }, []);

  // Detect device type
  const getDeviceType = useCallback((): 'desktop' | 'mobile' | 'tablet' => {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }, []);

  // Store event in localStorage
  const storeEvent = useCallback((event: Omit<AnalyticsEvent, 'created_at'>) => {
    try {
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const fullEvent: AnalyticsEvent = {
        ...event,
        created_at: new Date().toISOString()
      };
      events.push(fullEvent);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }
  }, []);

  // Upload events to Supabase
  const uploadEvents = useCallback(async () => {
    try {
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (events.length === 0) return;

      const { error } = await (supabase as any)
        .from('analytics_events')
        .insert(events);

      if (error) {
        console.warn('Failed to upload analytics events:', error);
        return;
      }

      // Clear uploaded events
      localStorage.removeItem(STORAGE_KEY);
      console.log(`Uploaded ${events.length} analytics events`);
    } catch (error) {
      console.warn('Error uploading analytics events:', error);
    }
  }, []);

  // Track event
  const track = useCallback((
    eventType: AnalyticsEvent['event_type'],
    eventData: AnalyticsEvent['event_data'] = {}
  ) => {
    if (!client?.id) return;

    const event: Omit<AnalyticsEvent, 'created_at'> = {
      client_id: client.id,
      session_id: getSessionId(),
      event_type: eventType,
      event_data: eventData,
      user_agent: navigator.userAgent,
      device_type: getDeviceType()
    };

    storeEvent(event);
  }, [client?.id, getSessionId, getDeviceType, storeEvent]);

  // Track page view
  const trackPageView = useCallback((page: string) => {
    track('page_view', { page });
    pageStartTimeRef.current = Date.now();
    scrollDepthRef.current = 0;
  }, [track]);

  // Track button click
  const trackButtonClick = useCallback((buttonType: string, additionalData: Record<string, any> = {}) => {
    track('button_click', { 
      button_type: buttonType,
      page: location.pathname,
      ...additionalData 
    });
  }, [track, location.pathname]);

  // Track menu section view
  const trackMenuSectionView = useCallback((sectionName: string, timeSpent?: number) => {
    track('menu_section_view', { 
      section_name: sectionName,
      page: location.pathname,
      time_spent: timeSpent
    });
  }, [track, location.pathname]);

  // Track menu download
  const trackMenuDownload = useCallback(() => {
    track('menu_download', { 
      page: location.pathname 
    });
  }, [track, location.pathname]);

  // Track scroll depth
  const trackScrollDepth = useCallback((percentage: number) => {
    if (percentage > scrollDepthRef.current) {
      scrollDepthRef.current = percentage;
      // Only track major scroll milestones
      if (percentage >= 25 && percentage % 25 === 0) {
        track('scroll_depth', { 
          scroll_percentage: percentage,
          page: location.pathname 
        });
      }
    }
  }, [track, location.pathname]);

  // Set up automatic upload timer
  useEffect(() => {
    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current);
    }

    uploadTimerRef.current = setInterval(uploadEvents, UPLOAD_INTERVAL);

    // Upload on page unload
    const handleBeforeUnload = () => {
      uploadEvents();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (uploadTimerRef.current) {
        clearInterval(uploadTimerRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [uploadEvents]);

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  // Set up scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (!isNaN(scrollPercent)) {
        trackScrollDepth(scrollPercent);
      }
    };

    const debouncedScroll = debounce(handleScroll, 100);
    window.addEventListener('scroll', debouncedScroll);

    return () => {
      window.removeEventListener('scroll', debouncedScroll);
    };
  }, [trackScrollDepth]);

  return {
    track,
    trackPageView,
    trackButtonClick,
    trackMenuSectionView,
    trackMenuDownload,
    trackScrollDepth,
    uploadEvents
  };
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}