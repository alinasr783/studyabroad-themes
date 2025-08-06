import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route } from "wouter";
import Index from "./pages/Index";
import Countries from "./pages/Countries";
import CountryDetail from "./pages/CountryDetail";
import Universities from "./pages/Universities";
import UniversityDetail from "./pages/UniversityDetail";
import Programs from "./pages/Programs";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
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
      <Router>
        <Route path="/" component={Index} />
        <Route path="/countries" component={Countries} />
        <Route path="/countries/:slug" component={CountryDetail} />
        <Route path="/universities" component={Universities} />
        <Route path="/universities/:slug" component={UniversityDetail} />
        <Route path="/programs" component={Programs} />
        <Route path="/programs/:slug" component={Programs} />
        <Route path="/articles" component={Articles} />
        <Route path="/articles/:slug" component={ArticleDetail} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route path="/login" component={Login} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/countries" component={AdminCountries} />
        <Route path="/admin/universities" component={AdminUniversities} />
        <Route path="/admin/programs" component={AdminPrograms} />
        <Route path="/admin/articles" component={AdminArticles} />
        <Route path="/admin/testimonials" component={AdminTestimonials} />
        <Route path="/admin/consultations" component={AdminConsultations} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/managers" component={AdminManagers} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/platform/login" component={PlatformLogin} />
        <Route path="/platform/dashboard" component={PlatformDashboard} />
        <Route path="/platform/create-client" component={CreateClient} />
        <Route path="/platform/stats" component={PlatformStats} />
        <Route path="/platform/users" component={PlatformUsers} />
        <Route path="*" component={NotFound} />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;