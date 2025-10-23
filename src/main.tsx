import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { preloadAllClientData } from "@/hooks/useClientData";

// SSR-safe: Only run in browser context
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  // Clear old cache to force fresh data load
  try {
    localStorage.removeItem('fast_load_data_demo');
    localStorage.removeItem('client_styles_demo');
    console.log('🧹 Cleared old domain cache entries');
  } catch (error) {
    console.warn('Failed to clear old cache:', error);
  }

  // Wait for preloading to complete before rendering to prevent layout shifts
  preloadAllClientData().then(() => {
    createRoot(document.getElementById("root")!).render(<App />);
  }).catch((error) => {
    console.warn('Preloading failed, rendering anyway:', error);
    createRoot(document.getElementById("root")!).render(<App />);
  });
} else {
  // SSR fallback - render immediately without preloading
  if (typeof document !== 'undefined') {
    createRoot(document.getElementById("root")!).render(<App />);
  }
}
