// src/components/dashboard/MaterialManager.js
'use client';

import { logMaterial } from '@/app/dashboard/supervisor/actions';
import { useRef, useState, useTransition } from 'react';

export default function MaterialManager({ site }) {
  const formRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = async (formData) => {
    setMessage(null);
    startTransition(async () => {
      const result = await logMaterial(formData);
      setMessage(result);
      if (result.success) {
        formRef.current?.reset();
        window.location.reload();
      }
      setTimeout(() => setMessage(null), 5000);
    });
  };

  if (!site) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Log a Material Purchase</h3>
      <form ref={formRef} action={handleFormSubmit} className="space-y-4">
        <input type="hidden" name="site_id" value={site.id} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="item_name" className="block text-sm font-medium text-gray-700">Item/Material Name</label>
            <input name="item_name" id="item_name" required className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="vendor_name" className="block text-sm font-medium text-gray-700">Vendor Name (Optional)</label>
            <input name="vendor_name" id="vendor_name" className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="material_amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input type="number" name="amount" id="material_amount" required className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">Purchase Date</label>
            {/* Hidden input to send today's date */}
            <input type="hidden" name="purchase_date" value={new Date().toISOString().split('T')[0]} />
            {/* Styled display for the user */}
            <p className="w-full mt-1 px-3 py-2 bg-gray-100 rounded-md text-gray-800 font-semibold">
                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div>
          <button type="submit" disabled={isPending} className="w-full sm:w-auto bg-slate-800 text-white font-bold py-2 px-6 rounded-lg disabled:bg-slate-400">
            {isPending ? 'Logging...' : 'Log Material'}
          </button>
          {message && <p className={`mt-3 text-sm font-medium ${message.error ? 'text-red-600' : 'text-green-600'}`}>{message.error || message.success}</p>}
        </div>
      </form>
    </div>
  );
}