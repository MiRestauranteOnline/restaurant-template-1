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
  const isBrowser = typeof window !== 'undefined';

  // Generate or retrieve session ID (SSR-safe)
  const getSessionId = useCallback(() => {
    if (!isBrowser || typeof localStorage === 'undefined') {
      return `ssr-${Date.now()}`;
    }
    
    try {
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
    } catch (e) {
      console.error('[ANALYTICS-SESSION]', e);
      (globalThis as any).__ANALYTICS_ERRORS__ = ((globalThis as any).__ANALYTICS_ERRORS__ || 0) + 1;
      return `err-${Date.now()}`;
    }
  }, [isBrowser]);

  // Detect device type (SSR-safe)
  const getDeviceType = useCallback((): 'desktop' | 'mobile' | 'tablet' => {
    if (!isBrowser || typeof window === 'undefined') return 'desktop';
    
    try {
      const width = window.innerWidth;
      if (width <= 768) return 'mobile';
      if (width <= 1024) return 'tablet';
      return 'desktop';
    } catch (e) {
      console.error('[ANALYTICS-DEVICE]', e);
      return 'desktop';
    }
  }, [isBrowser]);

  // Store event in localStorage (SSR-safe)
  const storeEvent = useCallback((event: Omit<AnalyticsEvent, 'created_at'>) => {
    if (!isBrowser || typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const fullEvent: AnalyticsEvent = {
        ...event,
        created_at: new Date().toISOString()
      };
      events.push(fullEvent);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      (globalThis as any).__ANALYTICS_QUEUE__ = true;
    } catch (error) {
      console.warn('[ANALYTICS-STORE]', error);
      (globalThis as any).__ANALYTICS_ERRORS__ = ((globalThis as any).__ANALYTICS_ERRORS__ || 0) + 1;
    }
  }, [isBrowser]);

  // Upload events to Supabase (SSR-safe)
  const uploadEvents = useCallback(async () => {
    if (!isBrowser || typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (events.length === 0) return;

      const { error } = await (supabase as any)
        .from('analytics_events')
        .insert(events);

      if (error) {
        console.warn('[ANALYTICS-UPLOAD]', error);
        return;
      }

      // Clear uploaded events
      localStorage.removeItem(STORAGE_KEY);
      console.log(`✅ Uploaded ${events.length} analytics events`);
    } catch (error) {
      console.warn('[ANALYTICS-UPLOAD-ERROR]', error);
      (globalThis as any).__ANALYTICS_ERRORS__ = ((globalThis as any).__ANALYTICS_ERRORS__ || 0) + 1;
    }
  }, [isBrowser]);

  // Track event (SSR-safe)
  const track = useCallback((
    eventType: AnalyticsEvent['event_type'],
    eventData: AnalyticsEvent['event_data'] = {}
  ) => {
    if (!isBrowser) return;
    if (!client?.id) return;

    try {
      const event: Omit<AnalyticsEvent, 'created_at'> = {
        client_id: client.id,
        session_id: getSessionId(),
        event_type: eventType,
        event_data: eventData,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        device_type: getDeviceType()
      };

      storeEvent(event);
    } catch (e) {
      console.error('[ANALYTICS-TRACK]', e);
      (globalThis as any).__ANALYTICS_ERRORS__ = ((globalThis as any).__ANALYTICS_ERRORS__ || 0) + 1;
    }
  }, [isBrowser, client?.id, getSessionId, getDeviceType, storeEvent]);

  // Track page view
  const trackPageView = useCallback((page: string) => {
    track('page_view', { page });
    pageStartTimeRef.current = Date.now();
    scrollDepthRef.current = 0;

    // Track visit for usage/billing
    if (client?.id) {
      const estimatedPageSizeKb = 3000; // 3MB average page size
      supabase.functions.invoke('track-visit', {
        body: {
          client_id: client.id,
          page_size_kb: estimatedPageSizeKb,
        }
      }).catch(error => {
        console.warn('Failed to track visit for billing:', error);
      });
    }
  }, [track, client?.id]);

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

  // Set up automatic upload timer (SSR-safe)
  useEffect(() => {
    if (!isBrowser || typeof window === 'undefined') return;
    
    try {
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
    } catch (e) {
      console.error('[ANALYTICS-TIMER]', e);
      (globalThis as any).__ANALYTICS_ERRORS__ = ((globalThis as any).__ANALYTICS_ERRORS__ || 0) + 1;
    }
  }, [isBrowser, uploadEvents]);

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  // Set up scroll tracking (SSR-safe)
  useEffect(() => {
    if (!isBrowser || typeof window === 'undefined' || typeof document === 'undefined') return;
    
    try {
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
    } catch (e) {
      console.error('[ANALYTICS-SCROLL]', e);
      (globalThis as any).__ANALYTICS_ERRORS__ = ((globalThis as any).__ANALYTICS_ERRORS__ || 0) + 1;
    }
  }, [isBrowser, trackScrollDepth]);

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