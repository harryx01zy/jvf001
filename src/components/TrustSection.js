// src/components/TrustSection.js
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const pillars = [
  {
    id: 1,
    title: 'Our Expert Team',
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.24.232-.487.34-.737m-1.068-2.872A3.375 3.375 0 0012 12c-1.865 0-3.375 1.51-3.375 3.375s1.51 3.375 3.375 3.375a3.375 3.375 0 003.118-2.072M12 12v-.003c0-1.113.285-2.16.786-3.07M12 12a3.375 3.375 0 00-3.118 2.072M18.75 5.25a3.375 3.375 0 00-3.375-3.375S12 3.375 12 5.25s1.51 3.375 3.375 3.375S18.75 7.125 18.75 5.25z" /></svg>),
    items: ['Experienced Architects', 'Interior Designers', 'Civil Engineers', 'Site Supervisors', 'Craftsmen'],
    imageUrl: '/pexels-denniz-futalan-339724-4956918.jpg'
  },
  {
    id: 2,
    title: 'Manufacturing Unit',
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 6h.008v.008H5.25V6zm.75 0h.008v.008H6V6zm.75 0h.008v.008H6.75V6zm.75 0h.008v.008H7.5V6zm.75 0h.008v.008H8.25V6zm.75 0h.008v.008H9V6zm6 0h.008v.008H15V6zm.75 0h.008v.008H15.75V6zm.75 0h.008v.008H16.5V6zm.75 0h.008v.008H17.25V6zm.75 0h.008v.008H18V6zm.75 0h.008v.008H18.75V6zM5.25 12h.008v.008H5.25V12zm.75 0h.008v.008H6V12zm.75 0h.008v.008H6.75V12zm.75 0h.008v.008H7.5V12zm.75 0h.008v.008H8.25V12zm.75 0h.008v.008H9V12zm6 0h.008v.008H15V12zm.75 0h.008v.008H15.75V12zm.75 0h.008v.008H16.5V12zm.75 0h.008v.008H17.25V12zm.75 0h.008v.008H18V12zm.75 0h.008v.008H18.75V12zM5.25 18h.008v.008H5.25V18zm.75 0h.008v.008H6V18zm.75 0h.008v.008H6.75V18zm.75 0h.008v.008H7.5V18zm.75 0h.008v.008H8.25V18zm.75 0h.008v.008H9V18zm6 0h.008v.008H15V18zm.75 0h.008v.008H15.75V18zm.75 0h.008v.008H16.5V18zm.75 0h.008v.008H17.25V18zm.75 0h.008v.008H18V18zm.75 0h.008v.008H18.75V18z" /></svg>),
    items: ['Location: Udasar, Bikaner', 'High-end Machinery', 'Trained Personnel', 'Handles Bulk Orders'],
    imageUrl: '/pexels-mandiri-abadi-396768996-15016523.jpg'
  },
  {
    id: 3,
    title: 'Our Work Speaks',
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
    items: ['Schools & Colleges', 'Hospitals & Clinics', 'Offices & Govt. Buildings', 'Homes & Apartments'],
    imageUrl: '/pexels-cottonbro-6568679.jpg'
  }
];

const TrustSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(0); // Pehla item default khula rahega

  return (
    <div className="bg-white py-14 sm:py-22">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Pillars of Our Trust</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">The foundation of our excellence is built on proven expertise, robust infrastructure, and a legacy of successful partnerships.</p>
        </motion.div>

        <div className="w-full space-y-4">
          {pillars.map((pillar, index) => (
            <motion.div key={pillar.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button 
                className="w-full p-6 flex justify-between items-center text-left"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-center">
                  <div className="text-orange-600">{pillar.icon}</div>
                  <h3 className="ml-4 text-2xl font-semibold text-gray-800">{pillar.title}</h3>
                </div>
                <motion.div animate={{ rotate: expandedIndex === index ? 180 : 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-500"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="relative p-8 md:p-12">
                      <Image 
                        src={pillar.imageUrl}
                        alt={pillar.title}
                        fill
                        className="object-cover opacity-10 z-0"
                      />
                       <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {pillar.items.map(item => (
                            <div key={item} className="flex items-center">
                              <svg className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                              <span className="text-lg text-gray-800">{item}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustSection;