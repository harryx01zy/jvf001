// src/app/layout.js

import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata = {
  title: "JVF - Construction & Interiors",
  description: "Pioneering construction and bespoke interior solutions since 1999.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${jakarta.variable} font-sans bg-gray-50 h-full`}>
        <div className="lg:grid lg:grid-cols-[288px_1fr] min-h-full">
          
          <Sidebar />
          <MobileNav />
          
          {/* === YAHI MUKHYA BADLAAV HAI === */}
          <div className="lg:col-start-2 flex flex-col">
            <main className="flex-grow pt-20 lg:pt-12 lg:px-12">
              {children}
            </main>
            
            {/* Footer ab 'main' tag ke bahar hai, jisse woh overlap nahi hoga */}
            <Footer />
          </div>

        </div>
      </body>
    </html>
  );
}