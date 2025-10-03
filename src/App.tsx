import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientProvider, useClient } from "@/contexts/ClientContext";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import HeadScripts from '@/components/HeadScripts';
import { lazy, Suspense, useEffect, useState } from 'react';
import LoadingSpinner from "./components/LoadingSpinner";
import MenuPage from "./pages/MenuPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ReviewsPage from "./pages/ReviewsPage";
import NotFound from "./pages/NotFound";
import WhatsAppPopup from "./components/WhatsAppPopup";
import { supabase } from "@/integrations/supabase/client";
import ErrorPage from "./components/ErrorPage";

// Template registry: Maps template slugs to lazy-loaded components
const TEMPLATE_REGISTRY: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'modern-restaurant': lazy(() => import('@/templates/modern-restaurant')),
  'rustic-restaurant': lazy(() => import('@/templates/rustic-restaurant')),
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
        // Fetch template slug from database
        const { data, error } = await supabase
          .from('templates' as any)
          .select('slug')
          .eq('id', clientWithTemplate.template_id)
          .eq('is_active', true)
          .single();

        if (error) throw error;

        const templateData = data as any;
        if (templateData?.slug) {
          console.log(`✅ Loaded template: ${templateData.slug}`);
          setTemplateSlug(templateData.slug);
        } else {
          throw new Error('Template not found or inactive');
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

  return (
    <>
      <HeadScripts />
      <AnalyticsProvider>
        <Routes>
          <Route path="/" element={<TemplateSwitcher />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
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
