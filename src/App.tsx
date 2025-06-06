
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Import pages
import Index from "./pages/Index";
import Lighting from "./pages/Lighting";
import Traffic from "./pages/Traffic";
import Environment from "./pages/Environment";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Devices from "./pages/Devices";
import Poles from "./pages/Poles"; // Importar o componente Poles

const queryClient = new QueryClient();

const App = () => (
  <div className="font-roboto">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lighting" element={<Lighting />} />
            <Route path="/lighting/poles" element={<Poles />} /> {/* Adicionar a rota para Poles */}
            <Route path="/traffic" element={<Traffic />} />
            <Route path="/environment" element={<Environment />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/devices" element={<Devices />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
    </QueryClientProvider>
  </div>
);

export default App;
