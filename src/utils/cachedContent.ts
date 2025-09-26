// Utility to access cached content immediately to prevent layout shifts
const CACHE_PREFIX = 'client_styles_';

const getCacheKey = (subdomain: string) => `${CACHE_PREFIX}${subdomain}`;

const getSubdomainFromUrl = (): string => {
  // For development and Lovable platform, use demos subdomain
  if (window.location.hostname === 'localhost' || 
      window.location.hostname.includes('lovable') ||
      window.location.hostname.includes('lovableproject.com')) {
    return 'demos'; // Default subdomain for template
  }
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  return parts.length > 2 ? parts[0] : 'demo';
};

export const getCachedContent = () => {
  try {
    const subdomain = getSubdomainFromUrl();
    const cacheKey = getCacheKey(subdomain);
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
  };
};

export const getCachedClientData = () => {
  const cached = getCachedContent();
  if (!cached) return null;
  
  return {
    restaurant_name: cached.restaurant_name,
    phone: cached.phone,
    whatsapp: cached.whatsapp,
    delivery: cached.delivery,
    theme: cached.theme,
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