// src/components/AboutIntro.js
'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AboutIntro = () => {
  return (
    // Subtle geometric pattern background
    <div className="bg-white py-5 sm:py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: The Big, Bold Statement */}
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 tracking-tighter leading-tight">
              Transforming Spaces Since 1999.
            </h2>
            <p className="mt-6 text-lg text-slate-600">
              We are not bound by industry or project type. From educational institutions to hospitals, corporate offices to residential spaces.
            </p>
          </motion.div>

          {/* Right Column: The Detailed Story with Drop Cap */}
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              <span className="float-left mr-4 mt-1 text-7xl font-bold text-slate-800">D</span>ecades of expertise, JVF is a dynamic and experienced delivering comprehensive solutions in modular furniture, school furniture, construction, and renovation. With more than 25 years of excellence, JVF is known for handling turnkey projects that transform empty spaces into fully functional, beautiful environments. Our approach blends precision construction with strategic vision, creating spaces that respond to the evolving needs of government and commercial sectors.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
    
  );
};

export default AboutIntro;
