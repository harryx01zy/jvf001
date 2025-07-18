// src/components/MobileNav.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Social Icons
const InstagramIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const FacebookIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const LinkedinIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;


// --- THE FINAL MOBILE MENU OVERLAY ---
const MobileMenuOverlay = ({ setIsOpen, navLinks, serviceLinks, pathname }) => {
    // This effect locks the body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const isServicesActive = pathname.startsWith('/services');

    return (
        <div className="fixed inset-0 z-50 bg-white text-black p-8">
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8" aria-label="Close menu">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="h-full w-full flex flex-col pt-16">
                <nav className="flex-grow">
                    <ul className="space-y-4">
                        {navLinks.map(link => {
                            const isActive = pathname === link.href;
                            return (
                                <li key={link.href}>
                                    <Link href={link.href} onClick={() => setIsOpen(false)} className={`text-2xl font-serif transition-colors ${isActive ? 'text-amber-500' : 'text-black'}`}>
                                        {link.name}
                                    </Link>
                                </li>
                            );
                        })}
                        {/* Services Links with Highlighting */}
                        <li className="!mt-5">
                            <h3 className={`text-2xl font-serif mb-2 transition-colors ${isServicesActive ? 'text-amber-500' : 'text-black'}`}>
                                Services
                            </h3>
                            <ul className="pl-4 space-y-1">
                            {serviceLinks.map((link) => {
                                const isSubActive = pathname === link.href;
                                return(
                                    <li key={link.href}>
                                        <Link href={link.href} onClick={() => setIsOpen(false)} className={`text-lg font-serif transition-colors ${isSubActive ? 'text-amber-500' : 'text-gray-600 hover:text-black'}`}>
                                            {link.name}
                                        </Link>
                                    </li>
                                );
                            })}
                            </ul>
                        </li>
                    </ul>
                </nav>

                <div className="flex space-x-6 mt-auto">
                     <a href="#" className="text-black" aria-label="Instagram"><InstagramIcon /></a>
                     <a href="#" className="text-black" aria-label="Facebook"><FacebookIcon /></a>
                     <a href="#" className="text-black" aria-label="LinkedIn"><LinkedinIcon /></a>
                </div>
            </div>
        </div>
    );
};


// --- MOBILE HEADER ---
export default function MobileNav() {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname(); // Get pathname here to pass to overlay

    // Your original navigation links
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Project Gallery', href: '/projects' },
        { name: 'Contact', href: '/contact' },
    ];
    
    const serviceLinks = [
    { name: 'Modular Furniture', href: '/services/modular-furniture' },
    { name: 'School furniture', href: '/services/school-furniture' }, // BADLAAV YAHAN
    { name: 'Construction', href: '/services/construction' },
    { name: 'Renovation', href: '/services/renovation' },
    { name: 'Solar Panels', href: '/services/solar-panels' }, // BADLAAV YAHAN

  ];

    return (
        <>
            <header className="lg:hidden fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-sm shadow-sm">
                 <div className="flex justify-between items-center px-4 h-20">
                    <Link href="/" className="text-3xl font-extrabold text-black">JVF</Link>
                    <button onClick={() => setMenuOpen(true)} className="text-black p-2" aria-label="Open menu">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16" /></svg>
                    </button>
                </div>
            </header>
            {isMenuOpen && <MobileMenuOverlay setIsOpen={setMenuOpen} navLinks={navLinks} serviceLinks={serviceLinks} pathname={pathname} />}
        </>
    );
}