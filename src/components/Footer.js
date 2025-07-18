// src/components/Footer.js
import React from 'react';
// === NAYA BADLAAV: Next.js se Link component ko import karein ===
import Link from 'next/link';


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-2">JVF</h3>
            <p className="text-gray-400">Defining Spaces, Crafting Dreams since 1999.</p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            {/* === BADLAAV: Ab hum <a> ki jagah <Link> ka istemaal kar rahe hain === */}
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/projects" className="text-gray-400 hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="font-semibold mb-3">Services</h4>
             {/* === BADLAAV: Inhe bhi Link bana dete hain taaki future mein kaam aaye === */}
            <ul className="space-y-2">
              <li><Link href="/services/modular-furniture" className="text-gray-400 hover:text-white transition-colors">Modular Furniture</Link></li>
              <li><Link href="/services/school-furniture" className="text-gray-400 hover:text-white transition-colors">School Furniture</Link></li>
              <li><Link href="/services/construction" className="text-gray-400 hover:text-white transition-colors">Construction</Link></li>
              <li><Link href="/services/renovation" className="text-gray-400 hover:text-white transition-colors">Renovation</Link></li>
              <li><Link href="/services/solar-panels" className="text-gray-400 hover:text-white transition-colors">Solar Panels</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <address className="not-italic text-gray-400">
              JVF Factory, Bikaner<br />
              Rajasthan, India<br />
              <a href="tel:+910000000000" className="hover:text-white transition-colors block mt-2">+91 000-000-0000</a>
              <a href="mailto:contact@jvf.com" className="hover:text-white transition-colors">contact@jvf.com</a>
            </address>
          </div>

        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} JVF. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;