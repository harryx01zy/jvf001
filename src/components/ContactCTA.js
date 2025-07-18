// src/components/ContactCTA.js
import React from 'react';

const ContactCTA = () => {
  return (
    <div className="bg-gray-800 lg:mb-15">
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Have a Project in Mind?
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Whether it&apos;s a custom furniture piece, a full office setup, or a construction project, our team is ready to turn your vision into reality. Let&apos;s build something great together.
        </p>
        <a 
          href="/contact" // Baad mein ise '/contact' page se link karenge
          className="bg-white text-gray-900 font-bold py-4 px-10 rounded-full text-lg hover:bg-gray-200 transform hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Contact Now
        </a>
      </div>
    </div>
  );
};

export default ContactCTA;