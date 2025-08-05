import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import PopularDestinations from "@/components/home/PopularDestinations";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PopularDestinations />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
