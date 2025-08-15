import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Globe, Award, Users, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import heroImage from "@/assets/harvard-university.jpg";
import { supabase } from "@/integrations/supabase/client";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ContactInfo {
  phone_numbers: string[];
  email_addresses: string[];
  whatsapp_number?: string;
}

interface SiteSettings {
  site_name_ar: string;
  site_name_en: string;
  primary_color_1: string;
  primary_color_2: string;
  primary_color_3: string;
}

const HeroSection = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [settingsResult, contactResult] = await Promise.all([
          supabase.from("site_settings").select("*").maybeSingle(),
          supabase.from("contact_info").select("phone_numbers, email_addresses, whatsapp_number").maybeSingle()
        ]);

        if (settingsResult.data) setSiteSettings(settingsResult.data);
        if (contactResult.data) setContactInfo(contactResult.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleContactClick = () => {
    if (!contactInfo) return;
    const primaryPhone = contactInfo.phone_numbers?.[0];
    if (primaryPhone) {
      window.open(`tel:${primaryPhone.replace(/[^0-9+]/g, '')}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
        <div className="text-center">
          <p></p>
        </div>
      </section>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };

  const statVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // Get dynamic colors or fallback to CSS variables
  const accentColor = siteSettings?.primary_color_1 || 'var(--primary)';
  const secondaryColor = siteSettings?.primary_color_2 || 'var(--secondary)';
  const tertiaryColor = siteSettings?.primary_color_3 || 'var(--accent)';

  const statColors = [
    { gradient: `from-blue-400 to-cyan-400`, color1: '#60a5fa', color2: '#22d3ee' },
    { gradient: `from-purple-400 to-pink-400`, color1: '#a78bfa', color2: '#f472b6' },
    { gradient: `from-green-400 to-emerald-400`, color1: '#4ade80', color2: '#34d399' },
    { gradient: `from-orange-400 to-red-400`, color1: '#fb923c', color2: '#f87171' }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" dir="rtl">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-black/50">
        <img 
          src={heroImage} 
          alt="خلفية الدراسة بالخارج"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Content */}
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative z-10 w-full px-4 py-16"
      >
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-center">

            {/* Text content - Right side */}
            <motion.div 
              variants={containerVariants}
              className="text-white text-right w-full lg:w-1/2 space-y-6"
            >
              <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span 
                  className="block"
                  style={{
                    color: accentColor
                  }}
                >
                  حقق حلمك في
                </span>
                الدراسة بالخارج
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg md:text-xl text-white/90 max-w-xl">
                نساعدك في الوصول لأفضل الجامعات العالمية مع خدمة استشارية متكاملة
              </motion.p>

              {/* Trust indicators */}
              <motion.div variants={itemVariants} className="flex gap-4 text-sm md:text-base">
                <span className="flex items-center gap-1">
                  <span>5000+ طالب</span>
                  <Users className="w-4 h-4" />
                </span>
                <span className="flex items-center gap-1">
                  <span>15 عام خبرة</span>
                  <Award className="w-4 h-4" />
                </span>
              </motion.div>

              {/* Action buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  style={{
                    background: `linear-gradient(to right, ${accentColor}, ${secondaryColor})`
                  }}
                  className="hover:opacity-90 text-white"
                  onClick={() => window.location.href = "/apply"}
                >
                  <ArrowLeft className="ml-2" />
                  ابدأ رحلتك الآن
                </Button>

                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white text-black hover:bg-white hover:text-black border-white"
                  onClick={handleContactClick}
                >
                  <Phone className="ml-2" />
                  تواصل معنا
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats - Left side */}
            <motion.div 
              variants={containerVariants}
              className="w-full lg:w-1/2 grid grid-cols-2 gap-4"
            >
              {[
                { icon: Globe, number: "50+", label: "دولة حول العالم" },
                { icon: Award, number: "500+", label: "جامعة مرموقة" },
                { icon: Users, number: "5000+", label: "طالب سعيد" },
                { icon: CheckCircle, number: "15+", label: "عام من الخبرة" }
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  variants={statVariants}
                  whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center"
                >
                  <div 
                    className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(to bottom right, ${statColors[index].color1}, ${statColors[index].color2})`
                    }}
                  >
                    <stat.icon className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-white/90 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;