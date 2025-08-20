import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import "./App.css";

import Index from "./pages/Index";
import Countries from "./pages/Countries";
import CountryDetail from "./pages/CountryDetail";
import Universities from "./pages/Universities";
import UniversityDetail from "./pages/UniversityDetail";
import Programs from "./pages/Programs";
import Program from "./pages/program";
import ArticlesList from "./pages/Articles";
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

const LogoCenteredLoader = ({ siteSettings }) => {
  const logoUrl = siteSettings?.logo_animation || "https://i.ibb.co/ZpTGyb17/0000.png";
  const primaryColor1 = siteSettings?.primary_color_1 || "#f59e0b";
  const primaryColor2 = siteSettings?.primary_color_2 || "#d97706";

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 8,
            height: 8,
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            backgroundColor: primaryColor1
          }}
          initial={{ opacity: 0 }}
          animate={{
            x: 0,
            y: 0,
            opacity: [0, 1, 0],
            scale: [1, 1.5, 0.5],
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.03,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: "easeInOut"
          }}
        />
      ))}

      <motion.div
        className="relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.5
          }
        }}
        exit={{ 
          scale: 0.9, 
          opacity: 0,
          transition: { duration: 0.3 }
        }}
      >
        <motion.div
          className="absolute inset-0 border-4 rounded-full"
          style={{
            scale: 1.2,
            borderColor: primaryColor1
          }}
          animate={{
            rotate: 180,
            borderWidth: [4, 8, 4],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <motion.div
          className="w-40 h-40 rounded-full flex items-center justify-center overflow-hidden bg-gray-800/90 backdrop-blur-sm shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.img 
            src={logoUrl}
            alt="Company Logo" 
            className="w-full h-full object-cover"
            initial={{ scale: 0.95 }}
            animate={{ scale: [0.98, 1.02, 0.98] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gray-700 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full"
            style={{
              background: `linear-gradient(to right, ${primaryColor1}, ${primaryColor2})`
            }}
            initial={{ width: 0 }}
            animate={{ 
              width: "100%",
              transition: {
                duration: 1.0,
                ease: "easeInOut"
              }
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);
  const [currentClientId, setCurrentClientId] = useState(null);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const hostname = window.location.hostname;
        const { data, error } = await supabase
          .from("clients")
          .select("id")
          .eq("domain", hostname)
          .maybeSingle();

        if (error) throw error;
        if (data) setCurrentClientId(data.id);
      } catch (err) {
        console.error("Error fetching client ID:", err);
      }
    };
    fetchClientId();
  }, []);

  useEffect(() => {
    if (!currentClientId) {
      setIsLoading(false);
      return;
    }

    const fetchSiteSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .eq("client_id", currentClientId)
          .maybeSingle();

        if (error) throw error;
        if (data) setSiteSettings(data);
      } catch (error) {
        console.error("Error fetching site settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteSettings();
  }, [currentClientId]);

  useEffect(() => {
    if (siteSettings) {
      document.documentElement.style.setProperty('--primary-color-1', siteSettings.primary_color_1 || '#f59e0b');
      document.documentElement.style.setProperty('--primary-color-2', siteSettings.primary_color_2 || '#d97706');
      document.documentElement.style.setProperty('--primary-color-3', siteSettings.primary_color_3 || '#b45309');
    }
  }, [siteSettings]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LogoCenteredLoader siteSettings={siteSettings} />
          ) : (
            <BrowserRouter>
              <AnimatePresence>
                <Routes>
                  <Route path="/" element={<PageTransition><Index siteSettings={siteSettings} /></PageTransition>} />
                  <Route path="/countries" element={<PageTransition><Countries /></PageTransition>} />
                  <Route path="/countries/:slug" element={<PageTransition><CountryDetail /></PageTransition>} />
                  <Route path="/universities" element={<PageTransition><Universities /></PageTransition>} />
                  <Route path="/universities/:slug" element={<PageTransition><UniversityDetail /></PageTransition>} />
                  <Route path="/programs" element={<PageTransition><Programs /></PageTransition>} />
                  <Route path="/programs/:slug" element={<PageTransition><Program /></PageTransition>} />
                  <Route path="/articles" element={<PageTransition><ArticlesList /></PageTransition>} />
                  <Route path="/articles/:slug" element={<PageTransition><ArticleDetail /></PageTransition>} />
                  <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                  <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                  <Route path="/admin" element={<PageTransition><Login /></PageTransition>} />
                  <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                  <Route path="/admin/dashboard" element={<PageTransition><AdminDashboard /></PageTransition>} />
                  <Route path="/admin/countries" element={<PageTransition><AdminCountries /></PageTransition>} />
                  <Route path="/admin/universities" element={<PageTransition><AdminUniversities /></PageTransition>} />
                  <Route path="/admin/programs" element={<PageTransition><AdminPrograms /></PageTransition>} />
                  <Route path="/admin/articles" element={<PageTransition><AdminArticles /></PageTransition>} />
                  <Route path="/admin/testimonials" element={<PageTransition><AdminTestimonials /></PageTransition>} />
                  <Route path="/admin/consultations" element={<PageTransition><AdminConsultations /></PageTransition>} />
                  <Route path="/admin/messages" element={<PageTransition><AdminMessages /></PageTransition>} />
                  <Route path="/admin/managers" element={<PageTransition><AdminManagers /></PageTransition>} />
                  <Route path="/admin/settings" element={<PageTransition><AdminSettings /></PageTransition>} />
                  <Route path="/platform/login" element={<PageTransition><PlatformLogin /></PageTransition>} />
                  <Route path="/platform/dashboard" element={<PageTransition><PlatformDashboard /></PageTransition>} />
                  <Route path="/platform/create-client" element={<PageTransition><CreateClient /></PageTransition>} />
                  <Route path="/platform/stats" element={<PageTransition><PlatformStats /></PageTransition>} />
                  <Route path="/platform/users" element={<PageTransition><PlatformUsers /></PageTransition>} />
                  <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                </Routes>
              </AnimatePresence>
            </BrowserRouter>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
