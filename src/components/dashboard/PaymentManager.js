// src/components/dashboard/PaymentManager.js
'use client';

import { logPayment } from '@/app/dashboard/supervisor/actions';
import { useRef, useState, useTransition } from 'react';

export default function PaymentManager({ site, labors }) {
  const formRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();

  // Supervisor context mein, site hamesha defined hogi.
  const isSupervisorContext = !!site;

  const handleFormSubmit = async (formData) => {
    setMessage(null);
    startTransition(async () => {
      const result = await logPayment(formData);
      setMessage(result);
      if (result.success) {
        formRef.current?.reset();
        // Page reload karein taaki payment history aur total amounts update ho jayein.
        window.location.reload();
      }
      setTimeout(() => setMessage(null), 5000);
    });
  };

  // Agar site hi nahi hai to component ko render na karein
  if (!isSupervisorContext || !labors || labors.length === 0) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Log a New Payment</h3>
      <form ref={formRef} action={handleFormSubmit} className="space-y-4">
        
        {/* Supervisor ke liye site fixed hai, isliye hidden input ka istemal */}
        <input type="hidden" name="site_id" value={site.id} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="labor_id" className="block text-sm font-medium text-gray-700">Select Labor</label>
            <select name="labor_id" id="labor_id" required className="w-full mt-1 px-3 py-2 border rounded-md">
              <option value="">-- Select a Labor --</option>
              {labors.map(labor => (<option key={labor.id} value={labor.id}>{labor.full_name}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input type="number" name="amount" id="amount" required className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
           <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Payment Date</label>
            <input type="hidden" name="date" value={new Date().toISOString().split('T')[0]} />
            <p className="w-full mt-1 px-3 py-2 bg-gray-100 rounded-md text-gray-800 font-semibold">
                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div>
            <label htmlFor="payment_mode" className="block text-sm font-medium text-gray-700">Payment Mode</label>
            <select name="payment_mode" id="payment_mode" required className="w-full mt-1 px-3 py-2 border rounded-md">
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
          <textarea name="remarks" id="remarks" rows="2" className="w-full mt-1 px-3 py-2 border rounded-md"></textarea>
        </div>
        <div>
          <button type="submit" disabled={isPending} className="w-full sm:w-auto bg-slate-800 text-white font-bold py-2 px-6 rounded-lg disabled:bg-slate-400">
            {isPending ? 'Logging...' : 'Log Payment'}
          </button>
          {message && <p className={`mt-3 text-sm font-medium ${message.error ? 'text-red-600' : 'text-green-600'}`}>{message.error || message.success}</p>}
        </div>
      </form>
    </div>
  );
}