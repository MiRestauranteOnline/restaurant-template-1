import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientProvider, useClient } from "@/contexts/ClientContext";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import HeadScripts from '@/components/HeadScripts';
import { lazy, Suspense, useEffect } from 'react';
import LoadingSpinner from "./components/LoadingSpinner";
import MenuPage from "./pages/MenuPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ReviewsPage from "./pages/ReviewsPage";
import NotFound from "./pages/NotFound";
import WhatsAppPopup from "./components/WhatsAppPopup";

// Lazy load templates
const ModernRestaurant = lazy(() => import('@/templates/modern-restaurant'));

const queryClient = new QueryClient();

/**
 * Template Switcher Component
 * Loads the appropriate template based on client.template_id from database
 * Currently only modern-restaurant template exists
 */
const TemplateSwitcher = () => {
  const { client, loading } = useClient();
  
  if (loading) {
    return <LoadingSpinner />;
  }

  // Default to modern-restaurant if no template specified
  // Future: Fetch template.slug from database based on client.template_id
  // and dynamically load the correct template
  const TemplateComponent = ModernRestaurant;
  
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
