'use client';

import { addLabor, assignLaborToSite } from '@/app/dashboard/admin/actions';
import { useRef, useState, useTransition } from 'react';
import Link from 'next/link';
// useRouter ko import karein
import { useRouter } from 'next/navigation';

// AssignLaborForm
function AssignLaborForm({ labor, sites }) {
  const formRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();
  const today = new Date().toISOString().split('T')[0];
  // useRouter hook ko yahaan bhi initialize karein
  const router = useRouter();

  const handleAssign = async (formData) => {
    formData.append('laborId', labor.id);
    startTransition(async () => {
      const result = await assignLaborToSite(formData);
      setMessage(result);
      if(result.success) {
          // window.location.reload() ki jagah router.refresh() ka istemaal karein
          router.refresh();
      }
      setTimeout(() => setMessage(null), 5000);
    });
  };

  return (
    <form ref={formRef} action={handleAssign} className="mt-4 p-4 bg-slate-100 rounded-lg">
        <p className="text-sm font-semibold mb-2 text-gray-700">Assign to a New Site</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <div>
                <label className="text-xs font-medium text-gray-600">Site</label>
                <select name="siteId" className="w-full p-2 mt-1 border rounded-md text-sm bg-white" required>
                    <option value="">Select a site</option>
                    {sites.map(site => (<option key={site.id} value={site.id}>{site.name}</option>))}
                </select>
            </div>
            <div>
                <label className="text-xs font-medium text-gray-600">Start Date</label>
                <input type="date" name="fromDate" defaultValue={today} required className="w-full p-2 mt-1 border rounded-md text-sm bg-white" />
            </div>
            <button type="submit" disabled={isPending || sites.length === 0} className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800 disabled:bg-gray-400 h-10">{isPending ? 'Assigning...' : 'Assign'}</button>
        </div>
        {message && <p className={`mt-2 text-xs font-medium ${message.error ? 'text-red-500' : 'text-green-500'}`}>{message.error || message.success}</p>}
    </form>
  );
}

// MAIN LABOR MANAGER COMPONENT
export default function LaborManager({ labors = [], sites = [], laborAssignments = [] }) {
  const addLaborFormRef = useRef(null);
  const [addLaborMessage, setAddLaborMessage] = useState(null);
  const [isAddingLabor, startAddingLabor] = useTransition();
  // useRouter hook ko yahaan bhi initialize karein
  const router = useRouter();

  const handleAddLabor = async (formData) => {
    startAddingLabor(async () => {
      const result = await addLabor(formData);
      setAddLaborMessage(result);
      if (result.success) {
          addLaborFormRef.current?.reset();
          // window.location.reload() ki jagah router.refresh() ka istemaal karein
          router.refresh();
      }
      setTimeout(() => setAddLaborMessage(null), 5000);
    });
  };

  return (
      <div className="space-y-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Add New Labor</h3>
            <form ref={addLaborFormRef} action={handleAddLabor} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div><label className="block text-sm font-medium mb-1">Full Name</label><input name="fullName" required className="w-full px-3 py-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium mb-1">Work Type</label><input name="workType" required className="w-full px-3 py-2 border rounded-md" placeholder="e.g., Mason, Helper"/></div>
                    <div><label className="block text-sm font-medium mb-1">Per Day Rate (₹)</label><input name="perDayRate" type="number" required className="w-full px-3 py-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium mb-1">Phone (Optional)</label><input name="phoneNumber" type="tel" className="w-full px-3 py-2 border rounded-md" /></div>
                </div>
                <div className="pt-2">
                    <button type="submit" disabled={isAddingLabor} className="bg-slate-800 text-white px-6 py-2 rounded-md font-semibold">{isAddingLabor ? 'Adding...' : 'Add Labor'}</button>
                    {addLaborMessage && <p className={`inline-block ml-4 text-sm ${addLaborMessage.error ? 'text-red-600' : 'text-green-600'}`}>{addLaborMessage.error || addLaborMessage.success}</p>}
                </div>
            </form>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Manage Labor Assignments</h3>
            <div className="space-y-4">
                {labors.map((labor) => {
                    const currentAssignment = laborAssignments.find(a => a.labor_id === labor.id && a.to_date === null);
                    const currentSite = currentAssignment ? sites.find(s => s.id === currentAssignment.site_id) : null;
                    return (
                        <div key={labor.id} className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Link href={`/dashboard/admin/labors/${labor.id}`} className="font-bold text-gray-800 hover:text-blue-600 hover:underline">
                                        {labor.full_name}
                                    </Link>
                                    <p className="text-sm text-gray-600">{labor.work_type} @ ₹{labor.per_day_rate}/day</p>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${currentSite ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {currentSite ? `At: ${currentSite.name}` : 'Not Assigned'}
                                </span>
                            </div>
                            {/* Agar labor assigned nahi hai, to hi assign form dikhayein */}
                            {!currentAssignment && <AssignLaborForm labor={labor} sites={sites} />}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
  );
}