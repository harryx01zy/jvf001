// src/components/EthosSection.js
'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Values aur unke icons ke liye data
const valuesData = [
  { text: 'Uncompromised Quality', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { text: 'Design-Driven Execution', icon: 'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15' },
  { text: 'Timely Project Delivery', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { text: 'Transparent Client Communication', icon: 'M7.5 8.25h9m-9 3H12m2.252 4.5H17.25a2.25 2.25 0 002.25-2.25v-1.172c0-.962-.384-1.846-.996-2.477l-4.24-4.243a2.25 2.25 0 00-3.182 0l-4.24 4.243a2.5 2.5 0 00-.996 2.477v1.172c0 1.242 1.008 2.25 2.25 2.25z' },
  { text: 'Sustainable Manufacturing', icon: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 01-8.614 1.414l-1.44-1.44zM1.5 12a10.5 10.5 0 1121 0 10.5 10.5 0 01-21 0zM12 5.25a.75.75 0 00-.75.75v3a.75.75 0 001.5 0V6A.75.75 0 0012 5.25z' }
];

const EthosSection = () => {
  return (
    <div className="relative py-16 sm:py-20 overflow-hidden">
      <div 
      className="absolute inset-0 -z-10 bg-white bg-[url('/newhari.svg')] bg-cover bg-center bg-no-repeat rotate-180"
    ></div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Our Mission */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-4 border-l-4 border-orange-600 pl-4">Our Mission</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To become India’s most versatile and reliable company in the field of modular furniture and construction by delivering customized, large-scale, and high-quality solutions across all sectors.
            </p>
          </motion.div>

          {/* Right Column: Our Values */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-8 border-l-4 border-orange-600 pl-4">Our Values</h2>
            <ul className="space-y-6">
              {valuesData.map((value, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-center"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={value.icon} />
                  </svg>
                  <span className="text-lg text-gray-700">{value.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EthosSection;