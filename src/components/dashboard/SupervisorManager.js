'use client';

// Imports ko saaf karein, ab kam cheezon ki zaroorat hai
import { createSupervisor, assignSupervisor } from '@/app/dashboard/admin/actions';
import { useRef, useState, useTransition } from 'react';
import Link from 'next/link'; // Link ko import karein

// AssignSiteForm (Isme koi badlaav nahi)
function AssignSiteForm({ supervisor, sites, currentAssignment }) {
    const [message, setMessage] = useState(null);
    const [isPending, startTransition] = useTransition();
    const handleAssign = async (formData) => {
        formData.append('supervisorId', supervisor.id);
        startTransition(async () => {
            const result = await assignSupervisor(formData);
            setMessage(result);
            setTimeout(() => setMessage(null), 4000);
        });
    };
    return ( <form action={handleAssign} className="flex items-center gap-2 mt-2"><select name="siteId" defaultValue={currentAssignment?.site_id || ""} className="flex-grow px-2 py-1 border rounded-md text-sm" required><option value="" disabled>-- Select a Site --</option>{sites.map(site => <option key={site.id} value={site.id}>{site.name}</option>)}</select><button type="submit" disabled={isPending || sites.length === 0} className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 disabled:bg-gray-400">{isPending ? '...' : 'Assign'}</button>{message && <p className={`ml-2 text-xs ${message.error ? 'text-red-500' : 'text-green-500'}`}>{message.error || message.success}</p>}</form> );
}

// MUKHYA COMPONENT (Updated and Cleaned)
export default function SupervisorManager({ supervisors, sites, assignments }) {
  const formRef = useRef(null);
  const [createMsg, setCreateMsg] = useState(null);
  const [isCreating, startCreate] = useTransition();

  const handleCreateSupervisor = async (formData) => {
    startCreate(async () => {
      const result = await createSupervisor(formData);
      setCreateMsg(result);
      if (result.success) formRef.current?.reset();
      setTimeout(() => setCreateMsg(null), 5000);
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Manage Supervisors</h3>
      <form ref={formRef} action={handleCreateSupervisor} className="mb-6 pb-6 border-b">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div><label className="block text-sm font-medium mb-1">Full Name</label><input name="name" required className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium mb-1">Email</label><input name="email" type="email" required className="w-full px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium mb-1">Password</label><input name="password" type="password" required className="w-full px-3 py-2 border rounded-md" /></div>
          <button type="submit" disabled={isCreating} className="bg-slate-800 text-white px-4 py-2 rounded-md h-10 font-semibold">{isCreating ? 'Creating...' : 'Create Supervisor'}</button>
        </div>
        {createMsg && <p className={`mt-3 text-sm ${createMsg.error ? 'text-red-600' : 'text-green-600'}`}>{createMsg.error || createMsg.success}</p>}
      </form>

      <div>
        <h4 className="font-semibold mb-3">Existing Supervisors & Site Assignments:</h4>
        <div className="space-y-4">
          {supervisors.length > 0 ? supervisors.map(sup => {
            const currentAssignment = assignments.find(a => a.supervisor_id === sup.id);
            const assignedSite = currentAssignment ? sites.find(s => s.id === currentAssignment.site_id) : null;
            return (
              <li key={sup.id} className="p-4 bg-gray-50 rounded-md text-sm list-none">
                <div className="flex justify-between items-center">
                    {/* === YAHAN BADLAAV HAI: Naam ab ek link hai === */}
                    <Link href={`/dashboard/admin/supervisors/${sup.id}`} className="font-bold text-gray-900 hover:text-blue-600 hover:underline">
                        {sup.full_name}
                    </Link>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${assignedSite ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {assignedSite ? `Assigned to: ${assignedSite.name}` : 'Not Assigned'}
                    </span>
                </div>
                <AssignSiteForm supervisor={sup} sites={sites} currentAssignment={currentAssignment} />
              </li>
            );
          }) : <p className="text-gray-500 text-sm">No supervisors added yet.</p>}
        </div>
      </div>
    </div>
  );
}