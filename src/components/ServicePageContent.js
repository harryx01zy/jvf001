// src/components/ServicePageContent.js
'use client'; // Yeh ek Client Component hai

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Yeh component props ke zariye pehle se taiyaar 'service' data lega
export default function ServicePageContent({ service }) {
  const [visibleProjects, setVisibleProjects] = useState(2); 
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [activeSlides, setActiveSlides] = useState([]);

  const loadMoreProjects = () => {
    setVisibleProjects(prev => prev + 2);
  };
  
  const openLightboxForProject = (projectImages, clickedIndex) => {
    setActiveSlides(projectImages.map(img => ({ src: img })));
    setIndex(clickedIndex);
    setOpen(true);
  };

  return (
    <>
      <main className="bg-white">
        <div className="container mx-auto px-4 py-13">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Column */}
            <div className="lg:col-span-1">
              <div className="lg:sticky top-13">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-orange-600 pl-4">{service.title}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-12">{service.description}</p>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-orange-600 pl-4">What's Included</h3>
                    <ul className="space-y-3">
                      {service.subServices.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-orange-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-16">
              <h2 className="text-3xl font-bold text-gray-800">Related Projects</h2>
              
              {service.galleryProjects.slice(0, visibleProjects).map((project, projectIndex) => (
                <motion.div 
                  key={projectIndex} 
                  className="bg-slate-50 p-4 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 px-2">{project.title}</h3>
                  <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    navigation={true}
                    loop={true}
                    className="w-full h-[400px] rounded-md"
                  >
                    {project.images.map((imgUrl, imgIndex) => (
                      <SwiperSlide 
                        key={imgIndex} 
                        className="cursor-pointer"
                        onClick={() => openLightboxForProject(project.images, imgIndex)}
                      >
                        <div className="relative w-full h-full">
                          <Image src={imgUrl} alt={`${project.title} image ${imgIndex + 1}`} fill className="object-contain" />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </motion.div>
              ))}

              {/* Load More Button */}
              {visibleProjects < service.galleryProjects.length && (
                <div className="text-center mt-16">
                  <motion.button
                    onClick={loadMoreProjects}
                    className="bg-slate-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Load More Projects
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Lightbox
        open={open}
        index={index}
        close={() => setOpen(false)}
        slides={activeSlides}
      />
    </>
  );
}