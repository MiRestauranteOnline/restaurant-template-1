import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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