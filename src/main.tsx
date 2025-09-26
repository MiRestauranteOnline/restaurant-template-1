import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { preloadAllClientData } from "@/hooks/useClientData";

// Wait for preloading to complete before rendering to prevent layout shifts
preloadAllClientData().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
}).catch((error) => {
  console.warn('Preloading failed, rendering anyway:', error);
  createRoot(document.getElementById("root")!).render(<App />);
});
