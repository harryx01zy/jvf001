'use client';

import { logPaymentByAdmin } from '@/app/dashboard/admin/actions';
import { useRef, useState, useTransition } from 'react';

// Form ab ek naya prop 'onPaymentSuccess' lega
export default function AdminPaymentForm({ labor, sites, onPaymentSuccess }) {
  const formRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = async (formData) => {
    startTransition(async () => {
      const result = await logPaymentByAdmin(formData);
      setMessage(result);
      
      if (result.success) {
        formRef.current?.reset();
        
        // === YAHI HAI FINAL FIX ===
        // router.refresh() ki jagah, hum parent component ke diye gaye
        // onPaymentSuccess function ko call kar rahe hain.
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      }
      
      setTimeout(() => setMessage(null), 5000);
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Log a New Payment for {labor.full_name}</h3>
      <form ref={formRef} action={handleFormSubmit} className="space-y-4">
        <input type="hidden" name="labor_id" value={labor.id} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="site_id" className="block text-sm font-medium text-gray-700">Payment For Site</label>
            <select name="site_id" id="site_id" required className="w-full mt-1 px-3 py-2 border rounded-md">
              <option value="">-- Select a Site --</option>
              {sites.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (₹)</label>
            <input type="number" name="amount" id="amount" required className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Payment Date</label>
            <input type="date" name="date" id="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full mt-1 px-3 py-2 border rounded-md" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="payment_mode" className="block text-sm font-medium text-gray-700">Payment Mode</label>
                <select name="payment_mode" id="payment_mode" required className="w-full mt-1 px-3 py-2 border rounded-md">
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
            </div>
            <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
                <input name="remarks" id="remarks" className="w-full mt-1 px-3 py-2 border rounded-md" />
            </div>
        </div>

        <div>
          <button type="submit" disabled={isPending} className="w-full sm:w-auto bg-slate-800 text-white font-bold py-2 px-6 rounded-lg">
            {isPending ? 'Logging...' : 'Log Payment'}
          </button>
          {message && <p className={`inline-block ml-4 text-sm font-medium ${message.error ? 'text-red-600' : 'text-green-600'}`}>{message.error || message.success}</p>}
        </div>
      </form>
    </div>
  );
}