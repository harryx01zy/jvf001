// src/app/dashboard/admin/layout.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard/admin' },
  { name: 'Manage Labors', href: '/dashboard/admin/labors' },
  { name: 'Reports', href: '/dashboard/admin/reports' }, 
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold leading-6 text-gray-900">Admin Panel</h1>
          </div>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {navLinks.map((link) => {
                const isDashboardLink = link.href === '/dashboard/admin';
                const isActive = isDashboardLink 
                    ? pathname === link.href 
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`${
                      isActive
                        ? 'border-slate-500 text-slate-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}