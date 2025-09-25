import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Utility function to convert hex to HSL
const hexToHsl = (hex: string) => {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
};

// Apply dynamic colors immediately when settings are available
const applyDynamicColors = (primaryColor: string, textStyle?: 'bright' | 'dark') => {
  // Convert hex to HSL
  const hslColor = hexToHsl(primaryColor);
  
  // Update CSS custom properties
  document.documentElement.style.setProperty('--primary', hslColor);
  document.documentElement.style.setProperty('--accent', hslColor);
  
  // Set primary button text color based on text style
  const primaryButtonText = textStyle === 'dark' ? '0 0% 9%' : '0 0% 98%'; // dark or bright text
  document.documentElement.style.setProperty('--primary-foreground', primaryButtonText);
  
  // Update gradients to use the new primary color
  const [h, s, l] = hslColor.split(' ');
  const lighterL = Math.min(parseInt(l.replace('%', '')) + 10, 90);
  
  const gradientPrimary = `linear-gradient(135deg, hsl(${h} ${s} ${l}) 0%, hsl(${h} ${s} ${lighterL}%) 100%)`;
  document.documentElement.style.setProperty('--gradient-primary', gradientPrimary);
};

// LocalStorage cache management
const CACHE_PREFIX = 'client_styles_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

const getCacheKey = (subdomain: string) => `${CACHE_PREFIX}${subdomain}`;

const loadCachedStyles = (subdomain: string) => {
  try {
    const cacheKey = getCacheKey(subdomain);
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    
    // Check if cache is expired
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn('Failed to load cached styles:', error);
    return null;
  }
};

const saveCachedStyles = (subdomain: string, clientSettings: ClientSettings, client: ClientData) => {
  try {
    const cacheKey = getCacheKey(subdomain);
    const cacheData = {
      // Color and theme settings
      primary_color: clientSettings.primary_color || '#FFD700',
      primary_button_text_style: clientSettings.primary_button_text_style || 'bright',
      theme: client.theme || 'dark',
      
      // Navigation settings
      header_background_enabled: clientSettings.header_background_enabled || false,
      header_background_style: clientSettings.header_background_style || 'dark',
      
      // Restaurant basic info to prevent layout shifts
      restaurant_name: client.restaurant_name || '',
      phone: client.phone || null,
      whatsapp: client.whatsapp || null,
      
      // Delivery services info
      delivery: client.delivery || {},
      
      // Other customizations that might affect layout
      other_customizations: {
        ...client.other_customizations,
        ...clientSettings.other_customizations
      }
    };
    
    localStorage.setItem(cacheKey, JSON.stringify({
      data: cacheData,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to save cached styles:', error);
  }
};

const applyEarlyStyles = (subdomain: string) => {
  const cachedData = loadCachedStyles(subdomain);
  if (cachedData) {
    // Apply cached primary color immediately with text style
    applyDynamicColors(cachedData.primary_color, cachedData.primary_button_text_style);
    
    // Apply cached theme
    document.documentElement.classList.remove('dark', 'bright', 'light');
    if (cachedData.theme === 'bright') {
      document.documentElement.classList.add('bright');
    }
    
    // Set CSS variables for header background if cached
    if (cachedData.header_background_enabled !== undefined) {
      document.documentElement.style.setProperty(
        '--header-background-enabled', 
        cachedData.header_background_enabled ? '1' : '0'
      );
    }
    
    if (cachedData.header_background_style) {
      document.documentElement.style.setProperty(
        '--header-background-style', 
        cachedData.header_background_style
      );
    }
  }
};

export interface ClientData {
  id: string;
  subdomain: string;
  restaurant_name: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  coordinates?: any;
  opening_hours?: any;
  opening_hours_ordered?: any[];
  social_media_links?: any;
  brand_colors?: any;
  theme?: 'dark' | 'bright';
  other_customizations?: any;
  delivery?: any;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  client_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  is_active: boolean;
  show_image_home: boolean;
  show_image_menu: boolean;
  show_on_homepage: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuCategory {
  id: string;
  client_id: string;
  name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientSettings {
  id: string;
  client_id: string;
  whatsapp_messages?: any;
  delivery_info?: any;
  other_customizations?: any;
  header_background_enabled?: boolean;
  header_background_style?: 'dark' | 'bright';
  primary_color?: string;
  primary_button_text_style?: 'bright' | 'dark';
  created_at: string;
  updated_at: string;
}

export const useClientData = (subdomain?: string) => {
  const [client, setClient] = useState<ClientData | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [clientSettings, setClientSettings] = useState<ClientSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect subdomain from URL if not provided
  const detectedSubdomain = subdomain || getSubdomainFromUrl();

  // Apply cached styles immediately on hook initialization
  useEffect(() => {
    if (detectedSubdomain) {
      applyEarlyStyles(detectedSubdomain);
    }
  }, [detectedSubdomain]);

  function getSubdomainFromUrl(): string {
    // For development and Lovable platform, use demos subdomain
    if (window.location.hostname === 'localhost' || 
        window.location.hostname.includes('lovable') ||
        window.location.hostname.includes('lovableproject.com')) {
      return 'demos'; // Default subdomain for template
    }
    
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    return parts.length > 2 ? parts[0] : 'demo';
  }

  useEffect(() => {
    const fetchClientData = async () => {
      if (!detectedSubdomain) {
        setError('No subdomain detected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch client data
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('subdomain', detectedSubdomain)
          .single();

        if (clientError) {
          throw clientError;
        }

        setClient(clientData as ClientData);

        if (clientData?.id) {
          // Fetch menu items
          const { data: menuData, error: menuError } = await supabase
            .from('menu_items')
            .select('*')
            .eq('client_id', clientData.id)
            .eq('is_active', true)
            .order('category', { ascending: true });

          // Fetch menu categories
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('menu_categories')
            .select('*')
            .eq('client_id', clientData.id)
            .eq('is_active', true)
            .order('display_order', { ascending: true });

          if (menuError) {
            console.error('Error fetching menu items:', menuError);
          } else {
            setMenuItems(menuData || []);
          }

          if (categoriesError) {
            console.error('Error fetching menu categories:', categoriesError);
          } else {
            setMenuCategories(categoriesData || []);
          }

          // Fetch client settings
          const { data: settingsData, error: settingsError } = await supabase
            .from('client_settings')
            .select('*')
            .eq('client_id', clientData.id)
            .single();

          if (settingsError) {
            console.error('Error fetching client settings:', settingsError);
          } else {
            setClientSettings(settingsData as ClientSettings);
            
            // Apply dynamic colors immediately when settings are loaded
            const primaryColor = (settingsData as ClientSettings)?.primary_color || '#FFD700';
            const textStyle = (settingsData as ClientSettings)?.primary_button_text_style || 'bright';
            applyDynamicColors(primaryColor, textStyle);
            
            // Cache the styles for future visits
            saveCachedStyles(detectedSubdomain, settingsData as ClientSettings, clientData as ClientData);
          }
        }
      } catch (err: any) {
        console.error('Error fetching client data:', err);
        setError(err.message || 'Failed to load restaurant data');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [detectedSubdomain]);

  return {
    client,
    menuItems,
    menuCategories,
    clientSettings,
    loading,
    error,
    subdomain: detectedSubdomain
  };
};