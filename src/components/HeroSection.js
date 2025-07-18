// src/components/HeroSection.js
'use client';
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const headline = "JVF";
  const tagline = "Defining Spaces, Crafting Dreams.";

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Bachho ko ek ke baad ek animate karega
        delayChildren: 0.5,
      },
    },
  };

  // Animation variants for each letter/word
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="relative  h-[58vh] w-full overflow-hidden">
      {/* Video Background */}
      <video
        src="/hero-section.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-full h-full object-cover"
      ></video>
      
      {/* Black Overlay */}
      <div className="absolute z-10 w-full h-full bg-black/60"></div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-7xl md:text-9xl font-bold tracking-tighter leading-tight"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
            aria-label={headline}
          >
            {headline.split("").map((char, index) => (
              <motion.span key={index} variants={itemVariants} className="inline-block">
                {char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="mt-4 text-xl md:text-2xl font-light text-gray-200"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
            variants={itemVariants}
          >
            {tagline}
          </motion.p>
        </motion.div>
      </div>
      {/* NAYA SVG SHAPE DIVIDER */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-none z-30">
        <svg 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[120px]"
        >
          <path 
            d="M1440,120 C1200,120 900,40 600,40 C300,40 0,120 0,120 Z" 
            className="fill-white" // Yeh neeche waale section (bg-white) se match karega
          ></path>
        </svg>
      </div>
      
     

    </div>
  );
};

export default HeroSection;