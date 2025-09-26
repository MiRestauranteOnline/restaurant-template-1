import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getFastLoadData, generateFastLoadData } from '@/utils/fastLoadData';
import { ensureFastLoadDataExists } from '@/utils/triggerFastLoad';
import { loadAndApplyFonts, cacheFonts, applyEarlyFonts, type FontSettings } from '@/utils/fontManager';

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

const getCacheKey = (domain: string) => `${CACHE_PREFIX}${domain}`;

const loadCachedStyles = (domain: string) => {
  try {
    const cacheKey = getCacheKey(domain);
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

const saveCachedStyles = (domain: string, clientSettings: ClientSettings, client: ClientData, adminContent?: AdminContent, reviews?: Review[], deliveryServices?: any[]) => {
  try {
    const cacheKey = getCacheKey(domain);
    const cacheData = {
      // Color and theme settings
      primary_color: clientSettings.primary_color || '#FFD700',
      primary_button_text_style: clientSettings.primary_button_text_style || 'bright',
      theme: client.theme || 'dark',
      
      // Font settings
      title_font: clientSettings.title_font || 'Cormorant Garamond',
      body_font: clientSettings.body_font || 'Inter',
      title_font_weight: (clientSettings as any).title_font_weight || '400',
      
      // Navigation settings
      header_background_enabled: clientSettings.header_background_enabled || false,
      header_background_style: clientSettings.header_background_style || 'dark',
      
      // Menu button controls
      hide_whatsapp_button_menu: clientSettings.hide_whatsapp_button_menu || false,
      hide_phone_button_menu: clientSettings.hide_phone_button_menu || false,
      custom_cta_button_link: clientSettings.custom_cta_button_link || null,
      custom_cta_button_text: clientSettings.custom_cta_button_text || null,
      show_whatsapp_popup: clientSettings.show_whatsapp_popup || false,
      
      // Restaurant basic info to prevent layout shifts
      restaurant_name: client.restaurant_name || '',
      phone: client.phone || null,
      phone_country_code: client.phone_country_code || null,
      whatsapp: client.whatsapp || null,
      whatsapp_country_code: client.whatsapp_country_code || null,
      
      // Delivery services info
      delivery: client.delivery || {},
      
      // Navigation-related data to prevent layout shifts
      has_reviews: reviews ? reviews.length > 0 : false,
      show_reviews_nav: reviews ? reviews.length > 0 : false, // Explicit navigation config
      delivery_services: deliveryServices || [],
      
      // Other customizations that might affect layout
      other_customizations: {
        ...client.other_customizations,
        ...clientSettings.other_customizations
      },
      
      // Above-the-fold content from admin_content to prevent layout shifts
      admin_content: adminContent ? {
        // Hero backgrounds for all pages
        homepage_hero_background_url: adminContent.homepage_hero_background_url,
        about_page_hero_background_url: adminContent.about_page_hero_background_url,
        contact_page_hero_background_url: adminContent.contact_page_hero_background_url,
        menu_page_hero_background_url: adminContent.menu_page_hero_background_url,
        reviews_page_hero_background_url: adminContent.reviews_page_hero_background_url,
        
        // Hero titles and descriptions for immediate rendering
        homepage_hero_title_first_line: (adminContent as any).homepage_hero_title_first_line,
        homepage_hero_title_second_line: (adminContent as any).homepage_hero_title_second_line,
        homepage_hero_description: adminContent.homepage_hero_description,
        
        about_page_hero_title_first_line: (adminContent as any).about_page_hero_title_first_line,
        about_page_hero_title_second_line: (adminContent as any).about_page_hero_title_second_line,
        about_page_hero_description: adminContent.about_page_hero_description,
        
        contact_page_hero_title_first_line: (adminContent as any).contact_page_hero_title_first_line,
        contact_page_hero_title_second_line: (adminContent as any).contact_page_hero_title_second_line,
        contact_page_hero_description: adminContent.contact_page_hero_description,
        
        menu_page_hero_title_first_line: (adminContent as any).menu_page_hero_title_first_line,
        menu_page_hero_title_second_line: (adminContent as any).menu_page_hero_title_second_line,
        menu_page_hero_description: adminContent.menu_page_hero_description,
        
        reviews_page_hero_title_first_line: (adminContent as any).reviews_page_hero_title_first_line,
        reviews_page_hero_title_second_line: (adminContent as any).reviews_page_hero_title_second_line,
        reviews_page_hero_description: adminContent.reviews_page_hero_description,
        
        // Homepage section titles (above the fold)
        homepage_menu_section_title_first_line: (adminContent as any).homepage_menu_section_title_first_line,
        homepage_menu_section_title_second_line: (adminContent as any).homepage_menu_section_title_second_line,
        homepage_about_section_title_first_line: (adminContent as any).homepage_about_section_title_first_line,
        homepage_about_section_title_second_line: (adminContent as any).homepage_about_section_title_second_line,
      } : null
    };
    
    localStorage.setItem(cacheKey, JSON.stringify({
      data: cacheData,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Failed to save cached styles:', error);
  }
};

const applyEarlyStyles = (domain: string) => {
  const cachedData = loadCachedStyles(domain);
  if (cachedData) {
    // Apply cached primary color immediately with text style
    applyDynamicColors(cachedData.primary_color, cachedData.primary_button_text_style);
    
    // Apply cached fonts immediately
    if (cachedData.title_font || cachedData.body_font) {
      loadAndApplyFonts({
        titleFont: cachedData.title_font,
        bodyFont: cachedData.body_font,
        titleFontWeight: cachedData.title_font_weight
      });
    }
    
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
    
    // Pre-cache hero background images to prevent layout shifts
    if (cachedData.admin_content) {
      const adminContent = cachedData.admin_content;
      
      // Preload hero background images
      const heroBackgrounds = [
        adminContent.homepage_hero_background_url,
        adminContent.about_page_hero_background_url,
        adminContent.contact_page_hero_background_url,
        adminContent.menu_page_hero_background_url,
        adminContent.reviews_page_hero_background_url
      ].filter(Boolean);
      
      // Create image elements to preload backgrounds
      heroBackgrounds.forEach(url => {
        if (url) {
          const img = new Image();
          img.src = url;
        }
      });
      
      // Store admin content in CSS custom properties for immediate access
      const adminProps = {
        '--cached-homepage-hero-bg': adminContent.homepage_hero_background_url || '',
        '--cached-about-hero-bg': adminContent.about_page_hero_background_url || '',
        '--cached-contact-hero-bg': adminContent.contact_page_hero_background_url || '',
        '--cached-menu-hero-bg': adminContent.menu_page_hero_background_url || '',
        '--cached-reviews-hero-bg': adminContent.reviews_page_hero_background_url || '',
        '--cached-restaurant-name': cachedData.restaurant_name || ''
      };
      
      Object.entries(adminProps).forEach(([prop, value]) => {
        document.documentElement.style.setProperty(prop, `"${value}"`);
      });
    }
  }
};

export interface ClientData {
  id: string;
  subdomain: string;
  restaurant_name: string;
  phone?: string;
  phone_country_code?: string;
  email?: string;
  whatsapp?: string;
  whatsapp_country_code?: string;
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
  category_id?: string;
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

export interface AdminContent {
  id: string;
  client_id: string;
  
  // Homepage content
  homepage_hero_title?: string;
  homepage_hero_description?: string;
  homepage_hero_background_url?: string;
  homepage_hero_right_button_text?: string;
  homepage_hero_right_button_link?: string;
  
  homepage_menu_section_title?: string;
  homepage_menu_section_description?: string;
  
  homepage_delivery_section_title?: string;
  homepage_delivery_section_description?: string;
  
  homepage_contact_section_title?: string;
  homepage_contact_section_description?: string;
  homepage_contact_hide_reservation_box?: boolean;
  
  homepage_about_section_title?: string;
  homepage_about_section_description?: string;
  
  homepage_services_section_title?: string;
  homepage_services_section_description?: string;
  
  // Page content
  about_page_hero_title?: string;
  about_page_hero_description?: string;
  about_page_hero_background_url?: string;
  about_page_content?: any;
  
  contact_page_hero_title?: string;
  contact_page_hero_description?: string;
  contact_page_hero_background_url?: string;
  
  menu_page_hero_title?: string;
  menu_page_hero_description?: string;
  menu_page_hero_background_url?: string;
  
  reviews_page_hero_title?: string;
  reviews_page_hero_description?: string;
  reviews_page_hero_background_url?: string;
  
  // Footer and Logo fields
  footer_description?: string;
  header_logo_url?: string;
  footer_logo_url?: string;
  
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  client_id: string;
  name: string;
  title: string;
  bio?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  client_id: string;
  reviewer_name: string;
  review_text: string;
  star_rating: number;
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
  title_font?: string;
  body_font?: string;
  hide_whatsapp_button_menu?: boolean;
  hide_phone_button_menu?: boolean;
  custom_cta_button_link?: string;
  custom_cta_button_text?: string;
  show_whatsapp_popup?: boolean;
  created_at: string;
  updated_at: string;
}

// Global data cache for instant access
interface GlobalDataCache {
  client: ClientData | null;
  adminContent: AdminContent | null;
  menuItems: MenuItem[];
  menuCategories: MenuCategory[];
  teamMembers: TeamMember[];
  reviews: Review[];
  clientSettings: ClientSettings | null;
  loading: boolean;
  error: string | null;
  domain: string;
}

const globalDataCache: GlobalDataCache = {
  client: null,
  adminContent: null,
  menuItems: [],
  menuCategories: [],
  teamMembers: [],
  reviews: [],
  clientSettings: null,
  loading: true,
  error: null,
  domain: ''
};

// Helper function for domain detection
function getDomainFromUrl(): string {
  // For development and Lovable platform, use demos domain
  if (window.location.hostname === 'localhost' || 
      window.location.hostname.includes('lovable') ||
      window.location.hostname.includes('lovableproject.com')) {
    return 'demos'; // Default domain for template
  }
  
  const hostname = window.location.hostname;
  
  // Check if it's our subdomain (contains lovable/lovableproject or has multiple dots)
  const isOurSubdomain = hostname.includes('lovable') || 
                         hostname.includes('lovableproject.com') ||
                         hostname.split('.').length > 2;
  
  if (isOurSubdomain) {
    // Extract subdomain part (e.g., 'client1' from 'client1.mirestaurante.online')
    const parts = hostname.split('.');
    return parts.length > 2 ? parts[0] : 'demo';
  } else {
    // Return full domain for custom domains (e.g., 'restaurantname.com')
    return hostname;
  }
}

// Preload all data immediately
export const preloadAllClientData = async (domain?: string) => {
  const detectedDomain = domain || getDomainFromUrl();
  globalDataCache.domain = detectedDomain;
  globalDataCache.loading = true;
  globalDataCache.error = null;

  console.log('🚀 Preloading ALL client data for:', detectedDomain);

  if (!detectedDomain) {
    globalDataCache.error = 'No domain detected';
    globalDataCache.loading = false;
    return;
  }

  try {
    // Apply cached styles immediately
    applyEarlyStyles(detectedDomain);

    // Fetch client data first - check both subdomain and domain fields
    const hostname = window.location.hostname;
    const isOurSubdomain = hostname.includes('lovable') || 
                           hostname.includes('lovableproject.com') ||
                           hostname.split('.').length > 2;
    
    let clientQuery;
    if (isOurSubdomain) {
      // Query by subdomain for our platform subdomains
      clientQuery = supabase
        .from('clients')
        .select('*')
        .eq('subdomain', detectedDomain)
        .single();
    } else {
      // Query by domain for custom domains
      clientQuery = supabase
        .from('clients')
        .select('*')
        .eq('domain', detectedDomain)
        .single();
    }
    
    const { data: clientData, error: clientError } = await clientQuery;

    if (clientError) {
      console.error('Error fetching client:', clientError);
      throw clientError;
    }

    globalDataCache.client = clientData as ClientData;

    if (clientData?.id) {
      // Fetch ALL data in parallel for instant access
      const [menuResponse, categoriesResponse, settingsResponse, adminContentResponse, teamResponse, reviewsResponse] = await Promise.all([
        supabase
          .from('menu_items')
          .select('*')
          .eq('client_id', clientData.id)
          .eq('is_active', true)
          .order('category', { ascending: true }),
        
        supabase
          .from('menu_categories')
          .select('*')
          .eq('client_id', clientData.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
        
        supabase
          .from('client_settings')
          .select('*')
          .eq('client_id', clientData.id)
          .single(),
        
        supabase
          .from('admin_content')
          .select('*')
          .eq('client_id', clientData.id)
          .single(),

        supabase
          .from('team_members')
          .select('*')
          .eq('client_id', clientData.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true }),

        supabase
          .from('reviews')
          .select('*')
          .eq('client_id', clientData.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true })
      ]);

      // Store all data in global cache with normalized category_id
      const categoriesByName = new Map((categoriesResponse.data || []).map((c: any) => [c.name, c.id]));
      const normalizedMenuItems = (menuResponse.data || []).map((item: any) =>
        item.category_id ? item : { ...item, category_id: categoriesByName.get(item.category) || null }
      );
      globalDataCache.menuItems = normalizedMenuItems;
      globalDataCache.menuCategories = categoriesResponse.data || [];
      globalDataCache.teamMembers = teamResponse.data || [];
      globalDataCache.reviews = reviewsResponse.data || [];
      globalDataCache.adminContent = adminContentResponse.data || null;
      globalDataCache.clientSettings = settingsResponse.data as ClientSettings || null;

      // Apply dynamic colors immediately
      if (settingsResponse.data) {
        const settings = settingsResponse.data as ClientSettings;
        applyDynamicColors(settings.primary_color, settings.primary_button_text_style);
        
        // Save to cache for future visits
        saveCachedStyles(
          detectedDomain,
          settings,
          clientData as ClientData,
          adminContentResponse.data,
          reviewsResponse.data || [],
          [] // delivery services - extracted from client data
        );
      }

      console.log('✅ All data preloaded successfully');
      globalDataCache.loading = false;
    }
  } catch (error: any) {
    console.error('❌ Preload failed:', error);
    globalDataCache.error = error.message;
    globalDataCache.loading = false;
  }
};

export const useClientData = (domain?: string) => {
  const [client, setClient] = useState<ClientData | null>(globalDataCache.client);
  const [adminContent, setAdminContent] = useState<AdminContent | null>(globalDataCache.adminContent);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(globalDataCache.menuItems);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(globalDataCache.menuCategories);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(globalDataCache.teamMembers);
  const [reviews, setReviews] = useState<Review[]>(globalDataCache.reviews);
  const [clientSettings, setClientSettings] = useState<ClientSettings | null>(globalDataCache.clientSettings);
  const [loading, setLoading] = useState(globalDataCache.loading);
  const [error, setError] = useState<string | null>(globalDataCache.error);

  // Auto-detect domain from URL if not provided
  const detectedDomain = domain || getDomainFromUrl();

  // Watch global cache for updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (globalDataCache.domain === detectedDomain) {
        setClient(globalDataCache.client);
        setAdminContent(globalDataCache.adminContent);
        setMenuItems(globalDataCache.menuItems);
        setMenuCategories(globalDataCache.menuCategories);
        setTeamMembers(globalDataCache.teamMembers);
        setReviews(globalDataCache.reviews);
        setClientSettings(globalDataCache.clientSettings);
        setLoading(globalDataCache.loading);
        setError(globalDataCache.error);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [detectedDomain]);

  function getDomainFromUrl(): string {
    // For development and Lovable platform, use demos domain
    if (window.location.hostname === 'localhost' || 
        window.location.hostname.includes('lovable') ||
        window.location.hostname.includes('lovableproject.com')) {
      return 'demos'; // Default domain for template
    }
    
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    return parts.length > 2 ? parts[0] : 'demo';
  }

  useEffect(() => {
    const fetchClientData = async () => {
      if (!detectedDomain) {
        setError('No domain detected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // TEMPORARILY DISABLE FAST-LOAD to fix immediate issue
        // TODO: Debug and re-enable later
        
        // Skip fast-load data for now, go straight to database
        console.log('⏳ Fetching fresh data from database...');
        // Fetch complete data from database
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('subdomain', detectedDomain)
          .single();

        if (clientError) {
          console.error('Error fetching client:', clientError);
          throw clientError;
        }

        // Update with complete client data from database
        setClient(clientData as ClientData);

        if (clientData?.id) {
          // Fetch all data in parallel
          const [menuResponse, categoriesResponse, settingsResponse, adminContentResponse] = await Promise.all([
            supabase
              .from('menu_items')
              .select('*')
              .eq('client_id', clientData.id)
              .eq('is_active', true)
              .order('category', { ascending: true }),
            
            supabase
              .from('menu_categories')
              .select('*')
              .eq('client_id', clientData.id)
              .eq('is_active', true)
              .order('display_order', { ascending: true }),
            
            supabase
              .from('client_settings')
              .select('*')
              .eq('client_id', clientData.id)
              .single(),
            
            supabase
              .from('admin_content')
              .select('*')
              .eq('client_id', clientData.id)
              .single()
          ]);

          // Fetch team members and reviews separately due to type limitations
          const teamResponse = await (supabase as any)
            .from('team_members')
            .select('*')
            .eq('client_id', clientData.id)
            .eq('is_active', true)
            .order('display_order', { ascending: true });

          const reviewsResponse = await (supabase as any)
            .from('reviews')
            .select('*')
            .eq('client_id', clientData.id)
            .eq('is_active', true)
            .order('display_order', { ascending: true });

          // Set menu data (normalize category_id using category name if missing)
          if (menuResponse.error) {
            console.error('Error fetching menu items:', menuResponse.error);
          } else {
            const categoriesByName = new Map((categoriesResponse.data || []).map((c: any) => [c.name, c.id]));
            const normalizedMenuItems = (menuResponse.data || []).map((item: any) =>
              item.category_id ? item : { ...item, category_id: categoriesByName.get(item.category) || null }
            );
            setMenuItems(normalizedMenuItems);
          }

          // Set categories data
          if (categoriesResponse.error) {
            console.error('Error fetching menu categories:', categoriesResponse.error);
          } else {
            setMenuCategories(categoriesResponse.data || []);
          }

          // Set team members data
          if (teamResponse.error) {
            console.error('Error fetching team members:', teamResponse.error);
          } else {
            setTeamMembers(teamResponse.data as TeamMember[] || []);
          }

          // Set reviews data
          if (reviewsResponse.error) {
            console.error('Error fetching reviews:', reviewsResponse.error);
          } else {
            const fetchedReviews = (reviewsResponse.data as Review[]) || [];
            setReviews(fetchedReviews);

            // Early cache update to prevent nav layout shift (before settings/admin content loaded)
            try {
              const prelimDelivery: any[] = [];
              const cDel = (clientData as any)?.delivery || {};
              if (cDel?.rappi) prelimDelivery.push({ name: 'Rappi', url: cDel.rappi, show: true });
              if (cDel?.pedidos_ya) prelimDelivery.push({ name: 'PedidosYa', url: cDel.pedidos_ya, show: true });
              if (cDel?.didi_food) prelimDelivery.push({ name: 'DiDi Food', url: cDel.didi_food, show: true });

              // Minimal settings placeholder for early cache write
              const minimalSettings: any = {
                primary_color: '#FFD700',
                primary_button_text_style: 'bright',
                header_background_enabled: false,
                header_background_style: 'dark',
              };

        saveCachedStyles(
          detectedDomain,
                minimalSettings as ClientSettings,
                clientData as ClientData,
                undefined,
                fetchedReviews,
                prelimDelivery
              );
            } catch (e) {
              console.warn('Early cache update failed:', e);
            }
          }

          // Set admin content
          if (adminContentResponse.error) {
            console.error('Error fetching admin content:', adminContentResponse.error);
          } else {
            setAdminContent(adminContentResponse.data || null);
          }

          // Set settings data and apply styles
          if (settingsResponse.error) {
            console.error('Error fetching client settings:', settingsResponse.error);
          } else {
            setClientSettings(settingsResponse.data as ClientSettings);
            
            // Apply dynamic colors immediately when settings are loaded
            const primaryColor = (settingsResponse.data as ClientSettings)?.primary_color || '#FFD700';
            const textStyle = (settingsResponse.data as ClientSettings)?.primary_button_text_style || 'bright';
            applyDynamicColors(primaryColor, textStyle);
            
            // Apply fonts immediately when settings are loaded
            const titleFont = (settingsResponse.data as ClientSettings)?.title_font || 'Cormorant Garamond';
            const bodyFont = (settingsResponse.data as ClientSettings)?.body_font || 'Inter';
            const titleFontWeight = (settingsResponse.data as any)?.title_font_weight || '400';
            
            loadAndApplyFonts({ titleFont, bodyFont, titleFontWeight });
            
            // Cache fonts for early application
            cacheFonts(detectedDomain, { titleFont, bodyFont, titleFontWeight });
            
            // Get delivery services for caching
            const clientDelivery = (clientData as any)?.delivery;
            const settingsDelivery = ((settingsResponse.data as ClientSettings) as any)?.delivery_info;
            let deliveryServices: any[] = [];

            if (clientDelivery || settingsDelivery) {
              const fromClient = !!clientDelivery;
              const services = [
                {
                  name: 'Rappi',
                  url: fromClient ? clientDelivery?.rappi : settingsDelivery?.rappi?.url,
                  show: fromClient ? true : settingsDelivery?.rappi?.show_in_nav !== false,
                },
                {
                  name: 'PedidosYa',
                  url: fromClient ? clientDelivery?.pedidos_ya : settingsDelivery?.pedidosya?.url,
                  show: fromClient ? true : settingsDelivery?.pedidosya?.show_in_nav !== false,
                },
                {
                  name: 'DiDi Food',
                  url: fromClient ? clientDelivery?.didi_food : settingsDelivery?.didi?.url,
                  show: fromClient ? true : settingsDelivery?.didi?.show_in_nav !== false,
                },
              ];
              deliveryServices = services.filter((service) => service.url && service.show);
            }
            
            // Cache the styles for future visits including admin content, reviews, and delivery
              saveCachedStyles(
                detectedDomain,
              settingsResponse.data as ClientSettings, 
              clientData as ClientData, 
              adminContentResponse.data as AdminContent, 
              reviewsResponse.data as Review[], 
              deliveryServices
            );
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
  }, [detectedDomain]);

  return {
    client,
    adminContent,
    menuItems,
    menuCategories,
    teamMembers,
    reviews,
    clientSettings,
    loading,
    error,
    domain: detectedDomain
  };
};