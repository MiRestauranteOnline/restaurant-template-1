// Utility to access cached content immediately to prevent layout shifts
import { getFastLoadData, type FastLoadData } from '@/utils/fastLoadData';

const CACHE_PREFIX = 'client_styles_';

const getCacheKey = (domain: string) => `${CACHE_PREFIX}${domain}`;

const getDomainFromUrl = (): string => {
  // For development and Lovable platform, use demo domain
  if (window.location.hostname === 'localhost' || 
      window.location.hostname.includes('lovable') ||
      window.location.hostname.includes('lovableproject.com')) {
    return 'demo'; // Default domain for template
  }
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  return parts.length > 2 ? parts[0] : 'demo';
};

// Global fast-load data cache
let fastLoadDataCache: FastLoadData | null = null;
let fastLoadPromise: Promise<FastLoadData | null> | null = null;

export const getCachedContent = () => {
  try {
    const domain = getDomainFromUrl();
    const cacheKey = getCacheKey(domain);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
    
    // Check if cache is expired
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Failed to access cached content:', error);
    return null;
  }
};

// New fast-load data getter with instant synchronous access
export const getFastLoadCachedContent = (): FastLoadData | null => {
  return fastLoadDataCache;
};

// Initialize fast-load data (call this early in app lifecycle)
export const initializeFastLoadData = async (): Promise<void> => {
  if (fastLoadPromise) return fastLoadPromise.then(() => {});
  
  fastLoadPromise = getFastLoadData();
  fastLoadDataCache = await fastLoadPromise;
  fastLoadPromise = null;
};

export const getCachedAdminContent = () => {
  const cached = getCachedContent();
  return cached?.admin_content || null;
};

export const getCachedClientSettings = () => {
  const cached = getCachedContent();
  if (!cached) return null;
  
  return {
    header_background_enabled: cached.header_background_enabled,
    header_background_style: cached.header_background_style,
    primary_color: cached.primary_color,
    primary_button_text_style: cached.primary_button_text_style,
    hide_whatsapp_button_menu: cached.hide_whatsapp_button_menu,
    hide_phone_button_menu: cached.hide_phone_button_menu,
    custom_cta_button_link: cached.custom_cta_button_link,
    custom_cta_button_text: cached.custom_cta_button_text,
    show_whatsapp_popup: cached.show_whatsapp_popup,
  };
};

export const getCachedClientData = () => {
  const cached = getCachedContent();
  if (!cached) return null;
  
  return {
    restaurant_name: cached.restaurant_name,
    phone: cached.phone,
    phone_country_code: cached.phone_country_code,
    whatsapp: cached.whatsapp,
    whatsapp_country_code: cached.whatsapp_country_code,
    delivery: cached.delivery,
    theme: cached.theme,
    address: cached.address,
    coordinates: cached.coordinates,
    use_coordinates: cached.use_coordinates,
    title_size_scale: cached.title_size_scale || 0,
  };
};

export const getCachedNavigationData = () => {
  const cached = getCachedContent();
  if (!cached) return null;
  
  return {
    has_reviews: cached.has_reviews || false,
    delivery_services: cached.delivery_services || [],
  };
};