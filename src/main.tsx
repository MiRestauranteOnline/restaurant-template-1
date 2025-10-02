import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { preloadAllClientData } from "@/hooks/useClientData";

// Clear old cache to force fresh data load
const clearOldDomainCache = () => {
  try {
    // Clear demos domain cache
    localStorage.removeItem('fast_load_data_demos');
    localStorage.removeItem('client_styles_demos');
    console.log('🧹 Cleared old domain cache entries');
  } catch (error) {
    console.warn('Failed to clear old cache:', error);
  }
};

// Clear cache before loading
clearOldDomainCache();

// Wait for preloading to complete before rendering to prevent layout shifts
preloadAllClientData().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
}).catch((error) => {
  console.warn('Preloading failed, rendering anyway:', error);
  createRoot(document.getElementById("root")!).render(<App />);
});
