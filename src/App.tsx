import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClientProvider, useClient } from "@/contexts/ClientContext";
import { useEffect } from 'react';
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ReviewsPage from "./pages/ReviewsPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/admin" element={<AdminPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ClientProvider>
            <ThemedApp />
          </ClientProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
