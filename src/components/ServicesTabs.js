// src/components/ServicesTabs.js
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const servicesData = [
  {
    id: "furniture",
    title: "Modular Furniture",
    description:
      "High-tech manufacturing for kitchens, wardrobes, offices, labs, and retail spaces.",
    imageUrl: "/pexels-heyho-6032416.jpg",
    href: "/services/modular-furniture",
  },
  {
    id: "School Furniture",
    title: "School Furniture",
    description:
      "Transforming outdated spaces into modern, functional environments with complete makeovers.",
    imageUrl: "/pexels-francesco-ungaro-32471845.jpg",
    href: "/services/school-furniture",
  },
  {
    id: "construction",
    title: "Construction",
    description:
      "End-to-end civil construction for residential, commercial, and institutional buildings.",
    imageUrl: "/pexels-sevenstormphotography-439416.jpg",
    href: "/services/construction",
  },
  {
    id: "renovation",
    title: "Renovation",
    description:
      "Transforming outdated spaces into modern, functional environments with complete makeovers.",
    imageUrl: "/pexels-francesco-ungaro-32471845.jpg",
    href: "/services/renovation",
  },
  {
    id: "Solar pannels",
    title: "Solar Panels",
    description:
      "Transforming outdated spaces into modern, functional environments with complete makeovers.",
    imageUrl: "/pexels-francesco-ungaro-32471845.jpg",
    href: "/services/solar-panels",
  },
];

const ServicesSection = () => {
  return (
    <div className="bg-white bg-[url('/grid-pattern.svg')] py-16 sm:py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Our Core Services
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            One-stop solutions for every space, from foundation to finishing
            touch.
          </p>
        </motion.div>
        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <Link
                href={service.href}
                // === YAHI BADLAAV HAI ===
                // Humne yahan se 'block' class ko hata diya hai
                className="group flex-grow flex flex-col"
              >
                {/* Image Part */}
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </div>

                {/* Content Part */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-gray-600 flex-grow">
                    {service.description}
                  </p>
                  <div className="mt-6 font-semibold text-orange-600 flex items-center group-hover:text-gray-900 transition-colors">
                    <span>See Projects</span>
                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;