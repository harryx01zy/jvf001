// src/app/about/page.js
import React from 'react';

// Humne imports ko theek kar diya hai, ab @/ ka istemal kar rahe hain
import AboutIntro from '@/components/AboutIntro';
import FoundersSection from '@/components/FoundersSection';
import UspSection from '@/components/UspSection';
import EthosSection from '@/components/EthosSection';
import TrustSection from '@/components/TrustSection';
import ContactCTA from '@/components/ContactCTA';

// SEO Metadata yahaan add karein
export const metadata = {
  title: "About JVF - Our Story, Mission, and Values",
  description: "Learn about JVF's journey in construction and modular furniture since 1999. Meet our founders and understand our commitment to quality and trust.",
};

const AboutPage = () => {
  return (
    <main>
      {/* Page Header */}
      <div className="bg-slate-800 py-24 text-center">
        <h1 className="text-5xl font-bold text-white tracking-tight">About JVF</h1>
        <p className="text-xl text-slate-300 mt-4">The Story of Our Craft, Commitment, and Capability.</p>
      </div>

      {/* Ab hum apne banaye hue sections ko yahan arrange karenge */}
      <AboutIntro />
      <FoundersSection />
      <UspSection />
      <EthosSection />
      <TrustSection />
      <ContactCTA />
    </main>
  );
};

export default AboutPage;