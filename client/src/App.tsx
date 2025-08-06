import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Countries from "./pages/Countries";
import CountryDetail from "./pages/CountryDetail";
import Universities from "./pages/Universities";
import UniversityDetail from "./pages/UniversityDetail";
import Programs from "./pages/Programs";
import ArticlesList from "./pages/Articles"; // تم تغيير الاسم
import ArticleDetail from "./pages/ArticleDetail"; // صفحة جديدة
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCountries from "./pages/admin/AdminCountries";
import AdminUniversities from "./pages/admin/AdminUniversities";
import AdminConsultations from "./pages/admin/AdminConsultations";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminManagers from "./pages/admin/AdminManagers";
import PlatformLogin from "./pages/platform/PlatformLogin";
import PlatformDashboard from "./pages/platform/PlatformDashboard";
import CreateClient from "./pages/platform/CreateClient";
import PlatformStats from "./pages/platform/PlatformStats";
import PlatformUsers from "./pages/platform/PlatformUsers";
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
          <Route path="/countries/:slug" element={<CountryDetail />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/universities/:slug" element={<UniversityDetail />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:slug" element={<Programs />} />
          <Route path="/articles" element={<ArticlesList />} /> {/* تم التغيير */}
          <Route path="/articles/:slug" element={<ArticleDetail />} /> {/* صفحة جديدة */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/countries" element={<AdminCountries />} />
          <Route path="/admin/universities" element={<AdminUniversities />} />
          <Route path="/admin/programs" element={<AdminPrograms />} />
          <Route path="/admin/articles" element={<AdminArticles />} />
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />
          <Route path="/admin/consultations" element={<AdminConsultations />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/managers" element={<AdminManagers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/platform/login" element={<PlatformLogin />} />
          <Route path="/platform/dashboard" element={<PlatformDashboard />} />
          <Route path="/platform/create-client" element={<CreateClient />} />
          <Route path="/platform/stats" element={<PlatformStats />} />
          <Route path="/platform/users" element={<PlatformUsers />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;