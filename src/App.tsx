import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import ServiceDetail from "./pages/services/ServiceDetail";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { DashboardOverview } from "./pages/admin/DashboardOverview";
import { LeadManagement } from "./pages/admin/LeadManagement";
import { DynamicFormPage } from "./pages/admin/DynamicFormPage";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";
import { ClientDashboard } from "./pages/client/ClientDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services/:slug" element={<ServiceDetail />} />
              
              {/* Authentication Access Route */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />


              {/* Employee Dashboard Portal */}
              <Route path="/employee" element={<EmployeeDashboard />} />

              {/* Client Portal Dashboard */}
              <Route path="/client" element={<ClientDashboard />} />

              {/* Admin Dashboard Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="leads" element={<LeadManagement />} />
                <Route path="services/new" element={<DynamicFormPage />} />
                <Route path="projects/new" element={<DynamicFormPage />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
