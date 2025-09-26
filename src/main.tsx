import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { preloadAllClientData } from "@/hooks/useClientData";

// Preload ALL client data immediately for zero layout shifts
preloadAllClientData().catch(console.warn);

createRoot(document.getElementById("root")!).render(<App />);
