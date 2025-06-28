
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import Today from "./pages/Today";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthGuard>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/today" element={<Today />} />
            <Route path="/completed" element={<Index />} />
            <Route path="/important" element={<Index />} />
            <Route path="/upcoming" element={<Index />} />
            <Route path="/archive" element={<Index />} />
            <Route path="/settings" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthGuard>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
