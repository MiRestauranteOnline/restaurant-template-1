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
const applyDynamicColors = (primaryColor: string) => {
  // Convert hex to HSL
  const hslColor = hexToHsl(primaryColor);
  
  // Update CSS custom properties
  document.documentElement.style.setProperty('--primary', hslColor);
  document.documentElement.style.setProperty('--accent', hslColor);
  
  // Update gradients to use the new primary color
  const [h, s, l] = hslColor.split(' ');
  const lighterL = Math.min(parseInt(l.replace('%', '')) + 10, 90);
  
  const gradientPrimary = `linear-gradient(135deg, hsl(${h} ${s} ${l}) 0%, hsl(${h} ${s} ${lighterL}%) 100%)`;
  document.documentElement.style.setProperty('--gradient-primary', gradientPrimary);
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
  layout_type?: 'layout1' | 'layout2' | 'layout3' | 'layout4';
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
            applyDynamicColors(primaryColor);
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