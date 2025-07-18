// src/app/page.js
import HeroSection from '@/components/HeroSection';
import AboutIntro from '@/components/AboutIntro';
import ServicesSection from '@/components/ServicesTabs';
import UspSection from '@/components/UspSection';
import EthosSection from '@/components/EthosSection';
import TrustSection from '@/components/TrustSection';
import FoundersSection from '@/components/FoundersSection';
import ContactCTA from '@/components/ContactCTA';


export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutIntro />
      <ServicesSection />
      <UspSection />
      <EthosSection />
      <TrustSection />
      <FoundersSection />
      <ContactCTA />
    </main>
  );
}