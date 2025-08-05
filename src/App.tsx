import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Countries from "./pages/Countries";
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
          <Route path="/countries" element={<Countries />} />
          <Route path="/countries/:slug" element={<Countries />} />
          <Route path="/universities" element={<Countries />} />
          <Route path="/universities/:slug" element={<Countries />} />
          <Route path="/programs" element={<Countries />} />
          <Route path="/programs/:slug" element={<Countries />} />
          <Route path="/articles" element={<Countries />} />
          <Route path="/articles/:slug" element={<Countries />} />
          <Route path="/about" element={<Countries />} />
          <Route path="/contact" element={<Countries />} />
          <Route path="/admin" element={<Countries />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
