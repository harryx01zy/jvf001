// src/app/projects/page.js
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import photos, { imageSlides } from '@/data/galleryData';

// Yeh Blank cell ke andar ke chote black elements hain
const GraphicElement = () => (
  <motion.div 
    className="absolute bg-slate-800"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
    style={{
      width: `${Math.random() * 20 + 5}px`,
      height: '4px',
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 90}%`,
      rotate: `${Math.random() * 90}deg`,
    }}
  />
);


const ProjectsPage = () => {
  const [index, setIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(6);

  const openLightbox = (photo) => {
    const photoIndex = imageSlides.findIndex(slide => slide.src === photo.src);
    if (photoIndex > -1) {
      setIndex(photoIndex);
    }
  };

  return (
    <main className="bg-white">
      {/* Page Header */}
      <div className="pt-14 pb-13 text-center">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Our Work</h1>
        <p className="text-lg text-gray-600 mt-4">A Curated Gallery of Our Projects</p>
      </div>
      
      {/* Curated Grid Gallery */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.slice(0, visibleCount).map((photo, photoIndex) => (
            <motion.div
              key={photoIndex}
              className="w-full aspect-square"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: photoIndex * 0.05 }}
            >
              {photo.type === 'image' ? (
                <div 
                  className="group relative h-full w-full cursor-pointer overflow-hidden bg-slate-100" // Optional: background color for letterboxing
                  onClick={() => openLightbox(photo)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title || 'JVF Project'}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    // === YAHI BADLAAV HAI ===
                    // Humne 'object-cover' ko 'object-contain' kar diya hai
                    className="object-contain group-hover:scale-105 transition-transform duration-300" 
                  />
                  {/* Overlay ko comment out ya remove kar sakte hain, kyunki contain ke saath iski zaroorat kam hai */}
                  {/* <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div> */}
                </div>
              ) : (
                <div className="bg-slate-50 h-full w-full relative">
                  {[...Array(8)].map((_, i) => <GraphicElement key={i} />)}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        {visibleCount < photos.length && (
          <div className="text-center mt-16">
            <button
              onClick={() => setVisibleCount(photos.length)}
              className="border border-slate-400 text-slate-600 font-medium py-3 px-12 hover:bg-slate-100 transition-colors"
            >
              VIEW MORE
            </button>
          </div>
        )}

        <Lightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={imageSlides}
        />
      </div>
    </main>
  );
};

export default ProjectsPage;