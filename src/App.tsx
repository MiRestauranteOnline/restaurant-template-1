import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientProvider, useClient } from "@/contexts/ClientContext";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import HeadScripts from '@/components/HeadScripts';
import FaviconManager from '@/components/FaviconManager';
import { lazy, Suspense, useEffect, useState } from 'react';
import LoadingSpinner from "./components/LoadingSpinner";
import MenuPage from "./pages/MenuPage";
import MenuPageRustic from "./pages/MenuPageRustic";
import MenuPageMinimalistic from "./pages/MenuPageMinimalistic";
import AboutPage from "./pages/AboutPage";
import AboutPageRustic from "./pages/AboutPageRustic";
import AboutPageMinimalistic from "./pages/AboutPageMinimalistic";
import ContactPage from "./pages/ContactPage";
import ContactPageRustic from "./pages/ContactPageRustic";
import ContactPageMinimalistic from "./pages/ContactPageMinimalistic";
import ReviewsPage from "./pages/ReviewsPage";
import ReviewsPageRustic from "./pages/ReviewsPageRustic";
import ReviewsPageMinimalistic from "./pages/ReviewsPageMinimalistic";
import NotFound from "./pages/NotFound";
import SitemapXML from "./pages/SitemapXML";
import WhatsAppPopup from "./components/WhatsAppPopup";
import { supabase } from "@/integrations/supabase/client";
import ErrorPage from "./components/ErrorPage";
import { DeactivationOverlay } from "./components/DeactivationOverlay";

// Template registry: Maps template slugs to lazy-loaded components
const TEMPLATE_REGISTRY: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'modern-restaurant': lazy(() => import('@/templates/modern-restaurant')),
  'rustic-restaurant': lazy(() => import('@/templates/rustic-restaurant')),
  'minimalistic-restaurant': lazy(() => import('@/templates/minimalistic-restaurant')),
};

const queryClient = new QueryClient();

/**
 * Template Switcher Component
 * Dynamically loads the appropriate template based on client.template_id from database
 */
const TemplateSwitcher = () => {
  const { client, loading: clientLoading } = useClient();
  const [templateSlug, setTemplateSlug] = useState<string | null>(null);
  const [templateLoading, setTemplateLoading] = useState(true);
  const [templateError, setTemplateError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTemplateSlug = async () => {
      // Type cast to access template_id (exists in DB but not in TS types yet)
      const clientWithTemplate = client as any;
      
      if (!clientWithTemplate?.template_id) {
        // No template assigned, default to modern-restaurant
        console.log('⚠️ No template_id assigned, defaulting to modern-restaurant');
        setTemplateSlug('modern-restaurant');
        setTemplateLoading(false);
        return;
      }

      try {
        console.log(`🔍 Fetching template for template_id: ${clientWithTemplate.template_id}`);
        
        // Fetch template slug from database
        const { data, error } = await supabase
          .from('templates' as any)
          .select('slug, is_active')
          .eq('id', clientWithTemplate.template_id)
          .maybeSingle();

        console.log('🔍 Template query result:', { data, error });

        if (error) throw error;
        if (!data) {
          console.warn('⚠️ No template found, using default');
          setTemplateSlug('modern-restaurant');
          setTemplateLoading(false);
          return;
        }

        const templateData = data as any;
        if (templateData?.slug) {
          console.log(`✅ Loaded template: ${templateData.slug} (is_active: ${templateData.is_active})`);
          setTemplateSlug(templateData.slug);
        } else {
          throw new Error('Template not found');
        }
      } catch (error) {
        console.error('❌ Error loading template:', error);
        setTemplateError('Failed to load template. Falling back to default.');
        setTemplateSlug('modern-restaurant');
      } finally {
        setTemplateLoading(false);
      }
    };

    if (!clientLoading && client) {
      fetchTemplateSlug();
    }
  }, [client, clientLoading]);
  
  if (clientLoading || templateLoading) {
    return <LoadingSpinner />;
  }

  if (templateError) {
    console.warn(templateError);
  }

  // Get template component from registry
  const TemplateComponent = templateSlug ? TEMPLATE_REGISTRY[templateSlug] : null;

  if (!TemplateComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">Template Not Found</h1>
          <p className="text-muted-foreground">
            The template "{templateSlug}" is not available. Please contact support.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TemplateComponent />
    </Suspense>
  );
};

// Template-aware About page wrapper
const TemplateAwareAboutPage = () => {
  const { client, loading: clientLoading } = useClient();
  const [templateSlug, setTemplateSlug] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTemplateSlug = async () => {
      const clientWithTemplate = client as any;
      
      if (!clientWithTemplate?.template_id) {
        setTemplateSlug('modern-restaurant');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('templates' as any)
          .select('slug')
          .eq('id', clientWithTemplate.template_id)
          .maybeSingle();

        if (error) throw error;
        const templateData = data as any;
        setTemplateSlug(templateData?.slug || 'modern-restaurant');
      } catch (error) {
        console.error('Error loading template:', error);
        setTemplateSlug('modern-restaurant');
      }
    };

    if (!clientLoading && client) {
      fetchTemplateSlug();
    }
  }, [client, clientLoading]);
  
  if (clientLoading || !templateSlug) {
    return <LoadingSpinner />;
  }

  return templateSlug === 'rustic-restaurant' ? <AboutPageRustic /> : 
         templateSlug === 'minimalistic-restaurant' ? <AboutPageMinimalistic /> : <AboutPage />;
};

// Template-aware Menu page wrapper
const TemplateAwareMenuPage = () => {
  const { client, loading: clientLoading } = useClient();
  const [templateSlug, setTemplateSlug] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTemplateSlug = async () => {
      const clientWithTemplate = client as any;
      
      if (!clientWithTemplate?.template_id) {
        setTemplateSlug('modern-restaurant');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('templates' as any)
          .select('slug')
          .eq('id', clientWithTemplate.template_id)
          .maybeSingle();

        if (error) throw error;
        const templateData = data as any;
        setTemplateSlug(templateData?.slug || 'modern-restaurant');
      } catch (error) {
        console.error('Error loading template:', error);
        setTemplateSlug('modern-restaurant');
      }
    };

    if (!clientLoading && client) {
      fetchTemplateSlug();
    }
  }, [client, clientLoading]);
  
  if (clientLoading || !templateSlug) {
    return <LoadingSpinner />;
  }

  return templateSlug === 'rustic-restaurant' ? <MenuPageRustic /> : 
         templateSlug === 'minimalistic-restaurant' ? <MenuPageMinimalistic /> : <MenuPage />;
};

// Template-aware Contact page wrapper
const TemplateAwareContactPage = () => {
  const { client, loading: clientLoading } = useClient();
  const [templateSlug, setTemplateSlug] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTemplateSlug = async () => {
      const clientWithTemplate = client as any;
      
      if (!clientWithTemplate?.template_id) {
        setTemplateSlug('modern-restaurant');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('templates' as any)
          .select('slug')
          .eq('id', clientWithTemplate.template_id)
          .maybeSingle();

        if (error) throw error;
        const templateData = data as any;
        setTemplateSlug(templateData?.slug || 'modern-restaurant');
      } catch (error) {
        console.error('Error loading template:', error);
        setTemplateSlug('modern-restaurant');
      }
    };

    if (!clientLoading && client) {
      fetchTemplateSlug();
    }
  }, [client, clientLoading]);
  
  if (clientLoading || !templateSlug) {
    return <LoadingSpinner />;
  }

  return templateSlug === 'rustic-restaurant' ? <ContactPageRustic /> : 
         templateSlug === 'minimalistic-restaurant' ? <ContactPageMinimalistic /> : <ContactPage />;
};

// Template-aware Reviews page wrapper
const TemplateAwareReviewsPage = () => {
  const { client, loading: clientLoading } = useClient();
  const [templateSlug, setTemplateSlug] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTemplateSlug = async () => {
      const clientWithTemplate = client as any;
      
      if (!clientWithTemplate?.template_id) {
        setTemplateSlug('modern-restaurant');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('templates' as any)
          .select('slug')
          .eq('id', clientWithTemplate.template_id)
          .maybeSingle();

        if (error) throw error;
        const templateData = data as any;
        setTemplateSlug(templateData?.slug || 'modern-restaurant');
      } catch (error) {
        console.error('Error loading template:', error);
        setTemplateSlug('modern-restaurant');
      }
    };

    if (!clientLoading && client) {
      fetchTemplateSlug();
    }
  }, [client, clientLoading]);
  
  if (clientLoading || !templateSlug) {
    return <LoadingSpinner />;
  }

  return templateSlug === 'rustic-restaurant' ? <ReviewsPageRustic /> : 
         templateSlug === 'minimalistic-restaurant' ? <ReviewsPageMinimalistic /> : <ReviewsPage />;
};

// Redirect component for external URLs
const ExternalRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  
  return <LoadingSpinner />;
};


// Theme wrapper component that waits for client data
const ThemedApp = () => {
  console.log('🔍 ThemedApp: Component mounting');
  const { client, loading } = useClient();
  
  // Wait for client data to load before applying theme
  useEffect(() => {
    if (!loading && client) {
      console.log('🔍 ThemedApp: Applying theme from client data');
      // PROTECTED: Dynamic theme switching based on database value
      const theme = client.theme || 'dark';
      
      // Remove existing theme classes
      document.documentElement.classList.remove('dark', 'bright', 'light');
      
      // Apply the theme from database
      if (theme === 'bright') {
        document.documentElement.classList.add('bright');
      } else {
        // Default to dark theme (no class needed as it's the root styles)
        document.documentElement.classList.remove('bright');
      }
    }
  }, [client, loading]);

  console.log('🔍 ThemedApp: Rendering routes');

  // Show deactivation overlay if site is deactivated
  if (!loading && client?.is_deactivated) {
    return <DeactivationOverlay />;
  }

  return (
    <>
      <HeadScripts />
      <FaviconManager />
      <AnalyticsProvider>
          <Routes>
            <Route path="/" element={<TemplateSwitcher />} />
            <Route path="/login" element={<ExternalRedirect to="https://mirestaurante.online/auth" />} />
            <Route path="/sitemap.xml" element={<SitemapXML />} />
            <Route path="/menu" element={<TemplateAwareMenuPage />} />
            <Route path="/about" element={<TemplateAwareAboutPage />} />
            <Route path="/contact" element={<TemplateAwareContactPage />} />
            <Route path="/reviews" element={<TemplateAwareReviewsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        <WhatsAppPopup />
      </AnalyticsProvider>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ClientProvider>
            <ThemedApp />
          </ClientProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
