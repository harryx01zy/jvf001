// src/components/FoundersSection.js
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Humne aapke content se har founder ki expertise ko data mein joda hai
const founders = [
  {
    name: 'Mr. Jagdish Suthar',
    title: 'Founder & Visionary',
    expertise: 'Master of Carpentry & Materials',
    imageUrl: '/profileplaceholder.jpg',
  },
  {
    name: 'Mr. Nihal Suthar',
    title: 'Founder & Strategist',
    expertise: 'Pillar of Design & Aesthetics',
    imageUrl: '/profileplaceholder.jpg',
  },
  {
    name: 'Mr. Anand Suthar',
    title: 'Founder & Executor',
    expertise: 'Expert in Civil & Site Engineering',
    imageUrl: '/profileplaceholder.jpg',
  },
];

const FoundersSection = () => {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header with the story */}
        <motion.div 
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Founders & Legacy</h2>
          <p className="text-lg text-gray-600 mt-6 leading-relaxed">
            JVF was established by Mr. Jagdish Suthar, Mr. Nihal Suthar, and Mr. Anand Suthar, who combined their deep expertise in carpentry, design, and civil engineering to build a company that could offer complete space transformation services — not just furniture or construction in isolation.
          </p>
        </motion.div>
        
        {/* Founder Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {founders.map((founder, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-lg shadow-lg overflow-hidden text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10, shadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="pt-8 px-8">
                <div className="w-36 h-36 relative rounded-full overflow-hidden shadow-md mx-auto border-4 border-white">
                  <Image
                    src={founder.imageUrl}
                    alt={founder.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">{founder.name}</h3>
                <p className="text-gray-500 mt-1">{founder.title}</p>
                <p className="mt-4 text-sm bg-orange-100 text-orange-800 font-medium rounded-full py-1 px-3 inline-block">
                  {founder.expertise}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoundersSection;