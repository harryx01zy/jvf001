// src/app/services/[slug]/page.js

import { services } from '@/data/servicesData';
import ServicePageContent from '@/components/ServicePageContent'; // Hum yeh naya component banayenge
import { notFound } from 'next/navigation';

// Yeh ek Server Component hai (koi 'use client' nahi)
export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;

  // Data server par hi dhoonda jayega
  const service = services.find(s => s.slug === slug);

  // Agar service nahi milti hai, toh 404 page dikhayein
  if (!service) {
    notFound();
  }

  // Hum service data ko ek naye Client Component mein bhej denge
  return <ServicePageContent service={service} />;
}