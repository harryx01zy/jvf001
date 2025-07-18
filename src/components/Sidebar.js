// src/components/Sidebar.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({ href, children, className = '' }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link href={href} className={`block transition-colors duration-200 ${className} ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-900'}`}>
            {children}
        </Link>
    );
};

export default function Sidebar() {
    // Correct navigation links as requested by you
    const mainLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Project Gallery', href: '/projects' },
    ];
    const serviceLinks = [
    { name: 'Modular Furniture', href: '/services/modular-furniture' },
    { name: 'School furniture', href: '/services/school-furniture' }, // BADLAAV YAHAN
    { name: 'Construction', href: '/services/construction' },
    { name: 'Renovation', href: '/services/renovation' },
    { name: 'Solar Panels', href: '/services/solar-panels' }, // BADLAAV YAHAN

  ];
    const contactLink = { name: 'Contact', href: '/contact' };

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen fixed top-0 left-0 bg-white border-r border-gray-200 p-12 font-serif">
            <div className="flex-grow">
                <Link href="/" className="text-4xl font-extrabold text-black mb-20 block">
                    JVF
                </Link>
                <nav className="space-y-4">
                    {mainLinks.map(link => <NavLink key={link.href} href={link.href} className="text-xl">{link.name}</NavLink>)}
                    
                    {/* Services Section for Sidebar */}
                    <div>
                        <h3 className="text-xl text-gray-900 font-semibold mt-4">Services</h3>
                        <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                            {serviceLinks.map(link => <NavLink key={link.href} href={link.href} className="text-lg">{link.name}</NavLink>)}
                        </div>
                    </div>

                    <NavLink href={contactLink.href} className="text-xl pt-2">{contactLink.name}</NavLink>
                </nav>
            </div>
            {/* Social Icons can be added here if needed for desktop */}
        </aside>
    );
}