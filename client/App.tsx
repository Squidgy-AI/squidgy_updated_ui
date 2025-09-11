import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/hooks/useUser";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SetNewPassword from './pages/SetNewPassword';
import WebsiteDetails from "./pages/WebsiteDetails";
import BusinessDetails from "./pages/BusinessDetails";
import SolarSetup from "./pages/SolarSetup";
import CalendarSetup from "./pages/CalendarSetup";
import NotificationsPreferences from "./pages/NotificationsPreferences";
import FacebookConnect from "./pages/FacebookConnect";
import SetupComplete from "./pages/SetupComplete";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<SetNewPassword />} />
          <Route path="/" element={<Login />} />
          <Route path="/welcome" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/website-details" element={
            <ProtectedRoute>
              <WebsiteDetails />
            </ProtectedRoute>
          } />
          <Route path="/business-details" element={
            <ProtectedRoute>
              <BusinessDetails />
            </ProtectedRoute>
          } />
          <Route path="/solar-setup" element={
            <ProtectedRoute>
              <SolarSetup />
            </ProtectedRoute>
          } />
          <Route path="/calendar-setup" element={
            <ProtectedRoute>
              <CalendarSetup />
            </ProtectedRoute>
          } />
          <Route path="/notifications-preferences" element={
            <ProtectedRoute>
              <NotificationsPreferences />
            </ProtectedRoute>
          } />
          <Route path="/facebook-connect" element={
            <ProtectedRoute>
              <FacebookConnect />
            </ProtectedRoute>
          } />
          <Route path="/setup-complete" element={
            <ProtectedRoute>
              <SetupComplete />
            </ProtectedRoute>
          } />
          <Route path="/account-settings" element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
