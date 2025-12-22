import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CoreFocusSection from '@/components/CoreFocusSection';
import WhyChooseSection from '@/components/WhyChooseSection';
import AboutSection from '@/components/AboutSection';
import PlatformSection from '@/components/PlatformSection';
import IndustriesSection from '@/components/IndustriesSection';
import RevenueModelSection from '@/components/RevenueModelSection';
import ImpactSection from '@/components/ImpactSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <CoreFocusSection />
        <WhyChooseSection />
        <AboutSection />
        <PlatformSection />
        <IndustriesSection />
        <RevenueModelSection />
        <ImpactSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
