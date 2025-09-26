// Fast-load data utilities for instant above-the-fold rendering
import { supabase } from '@/integrations/supabase/client';

export interface FastLoadData {
  // Client basics
  restaurant_name: string;
  phone?: string;
  whatsapp?: string;
  theme?: string;
  
  // Critical admin content
  header_logo_url?: string;
  footer_logo_url?: string;
  footer_description?: string;
  homepage_hero_background_url?: string;
  homepage_hero_title?: string;
  homepage_hero_title_first_line?: string;
  homepage_hero_title_second_line?: string;
  homepage_hero_description?: string;
  
  // Critical settings
  primary_color?: string;
  primary_button_text_style?: string;
  header_background_enabled?: boolean;
  header_background_style?: string;
  
  // Navigation critical data
  has_reviews: boolean;
  delivery_services: Array<{
    name: string;
    url: string;
    show: boolean;
  }>;
  
  // Metadata
  generated_at: string;
  subdomain: string;
}

const FAST_LOAD_CACHE_KEY = 'fast_load_data_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getSubdomainFromUrl = (): string => {
  if (window.location.hostname === 'localhost' || 
      window.location.hostname.includes('lovable') ||
      window.location.hostname.includes('lovableproject.com')) {
    return 'demos';
  }
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  return parts.length > 2 ? parts[0] : 'demo';
};

export const getFastLoadData = async (): Promise<FastLoadData | null> => {
  const subdomain = getSubdomainFromUrl();
  const cacheKey = `${FAST_LOAD_CACHE_KEY}${subdomain}`;
  
  // Try memory cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (error) {
    console.warn('Failed to read fast-load cache:', error);
  }

  // Try to fetch from Supabase storage
  try {
    const { data, error } = await supabase.storage
      .from('client-assets')
      .download(`fast-load/${subdomain}.json`);

    if (error) {
      console.warn('Fast-load file not found, falling back to regular loading');
      return null;
    }

    const text = await data.text();
    const fastLoadData: FastLoadData = JSON.parse(text);
    
    // Cache in localStorage
    localStorage.setItem(cacheKey, JSON.stringify({
      data: fastLoadData,
      timestamp: Date.now()
    }));

    return fastLoadData;
  } catch (error) {
    console.warn('Failed to fetch fast-load data:', error);
    return null;
  }
};

export const generateFastLoadData = async (subdomain?: string): Promise<boolean> => {
  const targetSubdomain = subdomain || getSubdomainFromUrl();
  
  try {
    const { data, error } = await supabase.functions.invoke('prebuild-client-data', {
      body: { subdomain: targetSubdomain }
    });

    if (error) {
      console.error('Failed to generate fast-load data:', error);
      return false;
    }

    console.log('Fast-load data generated:', data);
    
    // Clear local cache to force refresh
    const cacheKey = `${FAST_LOAD_CACHE_KEY}${targetSubdomain}`;
    localStorage.removeItem(cacheKey);
    
    return true;
  } catch (error) {
    console.error('Error generating fast-load data:', error);
    return false;
  }
};