'use client';

import Link from 'next/link';
import { addSite } from '@/app/dashboard/admin/actions';
import { useRef, useState, useTransition, useEffect } from 'react';

// Client-Side Date Component (Hydration error se bachne ke liye)
function ClientDate({ dateString }) {
    const [formattedDate, setFormattedDate] = useState('');
    useEffect(() => {
        // Yeh code sirf browser mein chalega, server par nahi.
        if (dateString) {
            setFormattedDate(new Date(dateString).toLocaleDateString());
        }
    }, [dateString]);
    return <>{formattedDate}</>;
}

// MAIN SITE MANAGER COMPONENT (FINAL CLEANED VERSION)
export default function SiteManager({ sites }) {
  const formRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [isAdding, startAdding] = useTransition();

  const handleAddSite = async (formData) => {
    startAdding(async () => {
      const result = await addSite(formData);
      setMessage(result);
      if (result.success) {
          formRef.current?.reset();
          // Poora page reload karein taaki nayi site list mein dikhe
          window.location.reload();
      }
      setTimeout(() => setMessage(null), 4000);
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Manage Sites</h3>
      {/* Add Site Form */}
      <form ref={formRef} action={handleAddSite} className="mb-6 pb-6 border-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div><label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">Site Name</label><input id="siteName" name="siteName" className="w-full px-3 py-2 border rounded-md" required /></div>
          <div><label htmlFor="siteLocation" className="block text-sm font-medium text-gray-700 mb-1">Location</label><input id="siteLocation" name="siteLocation" className="w-full px-3 py-2 border rounded-md" /></div>
          <button type="submit" disabled={isAdding} className="bg-slate-800 text-white px-4 py-2 rounded-md h-10 font-semibold">{isAdding ? 'Adding...' : 'Add New Site'}</button>
        </div>
        {message && <p className={`mt-3 text-sm ${message.error ? 'text-red-600' : 'text-green-600'}`}>{message.error || message.success}</p>}
      </form>

      {/* Existing Sites List */}
      <div>
        <h4 className="font-semibold mb-3">Existing Sites:</h4>
        <div className="space-y-2">
          {sites.length > 0 ? (
            sites.map(site => (
              <div key={site.id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center text-sm">
                <div>
                  <Link href={`/dashboard/admin/sites/${site.id}`} className="text-gray-900 font-bold hover:text-blue-600 hover:underline">
                    {site.name}
                  </Link>
                  {site.location && <span className="text-gray-500 ml-2">- {site.location}</span>}
                </div>
                <span className="text-gray-400 text-xs">
                  Added: <ClientDate dateString={site.created_at} />
                </span>
              </div>
            ))
          ) : <p className="text-gray-500 text-sm">No sites added yet.</p>}
        </div>
      </div>
    </div>
  )
}