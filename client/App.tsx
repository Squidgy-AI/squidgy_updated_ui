import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WebsiteDetails from "./pages/WebsiteDetails";
import BusinessDetails from "./pages/BusinessDetails";
import SolarSetup from "./pages/SolarSetup";
import CalendarSetup from "./pages/CalendarSetup";
import NotificationsPreferences from "./pages/NotificationsPreferences";
import FacebookConnect from "./pages/FacebookConnect";
import SetupComplete from "./pages/SetupComplete";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/website-details" element={<WebsiteDetails />} />
          <Route path="/business-details" element={<BusinessDetails />} />
          <Route path="/solar-setup" element={<SolarSetup />} />
          <Route path="/calendar-setup" element={<CalendarSetup />} />
          <Route path="/notifications-preferences" element={<NotificationsPreferences />} />
          <Route path="/facebook-connect" element={<FacebookConnect />} />
          <Route path="/setup-complete" element={<SetupComplete />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
