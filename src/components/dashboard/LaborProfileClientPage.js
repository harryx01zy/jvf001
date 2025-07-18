// src/components/dashboard/LaborProfileClientPage.js
'use client';

import { useState, useCallback, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Actions aur PDF generator import karein
import { 
    updateLabor, deleteLabor, endLaborAssignment, updatePayment, 
    deleteAssignment, logPaymentByAdmin, getLaborReportData,
    getLaborProfileDataAction
} from "@/app/dashboard/admin/actions";
import { generateLaborReportPDF } from "@/lib/reportGenerator";
// Timeline components ko import kiya gaya hai
import AttendanceTimeline from "@/components/dashboard/AttendanceTimeline";

// Hydration error se bachne ke liye Client-Side Date Component
function ClientOnlyDate({ dateString }) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);
    if (!isMounted) return null;
    return <>{new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</>;
}

// In components mein koi badlaav nahi hai
function EditLaborModal({ labor, onClose, onUpdateSuccess }) {
    const [message, setMessage] = useState(null);
    const [isPending, startTransition] = useTransition();
    const handleUpdate = async (formData) => {
        formData.append('laborId', labor.id);
        startTransition(async () => {
            const result = await updateLabor(formData);
            if (result.success) {
                alert(result.success);
                onUpdateSuccess();
                onClose();
            } else {
                setMessage(result);
                setTimeout(() => setMessage(null), 4000);
            }
        });
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h4 className="text-lg font-bold mb-4">Edit Labor: {labor.full_name}</h4>
                <form action={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium">Full Name</label><input name="fullName" defaultValue={labor.full_name} className="w-full mt-1 p-2 border rounded-md" required /></div>
                        <div><label className="block text-sm font-medium">Work Type</label><input name="workType" defaultValue={labor.work_type} className="w-full mt-1 p-2 border rounded-md" required /></div>
                        <div><label className="block text-sm font-medium">Per Day Rate (₹)</label><input name="perDayRate" type="number" defaultValue={labor.per_day_rate} className="w-full mt-1 p-2 border rounded-md" required /></div>
                        <div><label className="block text-sm font-medium">Phone Number</label><input name="phoneNumber" type="tel" defaultValue={labor.phone_number || ''} className="w-full mt-1 p-2 border rounded-md" /></div>
                    </div>
                    {message && <p className={`text-sm ${message.error ? 'text-red-600' : 'text-green-600'}`}>{message.error || message.success}</p>}
                    <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button><button type="submit" disabled={isPending} className="bg-slate-800 text-white px-4 py-2 rounded-md">Save Changes</button></div>
                </form>
            </div>
        </div>
    );
}

function EditPaymentModal({ payment, sites, onClose, onUpdateSuccess }) {
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = async (formData) => {
    formData.append('paymentId', payment.id);
    startTransition(async () => {
      const result = await updatePayment(formData);
      if (result.success) {
        alert(result.success);
        onUpdateSuccess();
        onClose();
      } else {
        setMessage(result.error);
        setTimeout(() => setMessage(null), 4000);
      }
    });
  };
   return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4">Edit Payment</h3>
            <form action={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-medium">Date</label><input type="date" name="date" defaultValue={payment.date} required className="w-full mt-1 p-2 border rounded-md"/></div>
                <div><label className="block text-sm font-medium">Amount (₹)</label><input type="number" name="amount" defaultValue={payment.amount} required className="w-full mt-1 p-2 border rounded-md"/></div>
                <div><label className="block text-sm font-medium">Site</label><select name="site_id" defaultValue={payment.site_id} required className="w-full mt-1 p-2 border rounded-md">{sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                <div><label className="block text-sm font-medium">Payment Mode</label><select name="payment_mode" defaultValue={payment.payment_mode} required className="w-full mt-1 p-2 border rounded-md"><option value="Cash">Cash</option><option value="Online">Online</option><option value="Bank Transfer">Bank Transfer</option></select></div>
                <div><label className="block text-sm font-medium">Remarks</label><input name="remarks" defaultValue={payment.remarks || ''} className="w-full mt-1 p-2 border rounded-md"/></div>
                {message && <p className="text-red-500 text-sm">{message}</p>}
                <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button><button type="submit" disabled={isPending} className="bg-slate-800 text-white px-4 py-2 rounded-md">{isPending ? 'Updating...' : 'Update Payment'}</button></div>
            </form>
        </div>
    </div>
  );
}

function AdminPaymentForm({ labor, sites, onPaymentSuccess }) {
  const formRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();
  const handleFormSubmit = async (formData) => {
    formData.append('labor_id', labor.id);
    startTransition(async () => {
      const result = await logPaymentByAdmin(formData);
      setMessage(result);
      if (result.success) {
        formRef.current?.reset();
        if (onPaymentSuccess) onPaymentSuccess();
      }
      setTimeout(() => setMessage(null), 5000);
    });
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Log a New Payment for {labor.full_name}</h3>
      <form ref={formRef} action={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700">Payment For Site</label><select name="site_id" required className="w-full mt-1 px-3 py-2 border rounded-md"><option value="">-- Select a Site --</option>{sites.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}</select></div>
          <div><label className="block text-sm font-medium text-gray-700">Amount (₹)</label><input type="number" name="amount" required className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
          <div><label className="block text-sm font-medium text-gray-700">Payment Date</label><input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Payment Mode</label><select name="payment_mode" required className="w-full mt-1 px-3 py-2 border rounded-md"><option value="Cash">Cash</option><option value="Online">Online</option><option value="Bank Transfer">Bank Transfer</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700">Remarks (Optional)</label><input name="remarks" className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
        </div>
        <div><button type="submit" disabled={isPending} className="w-full sm:w-auto bg-slate-800 text-white font-bold py-2 px-6 rounded-lg">{isPending ? 'Logging...' : 'Log Payment'}</button>{message && <p className={`inline-block ml-4 text-sm font-medium ${message.error ? 'text-red-600' : 'text-green-600'}`}>{message.error || message.success}</p>}</div>
      </form>
    </div>
  );
}

// Mukya Client Component
export default function LaborProfileClientPage({ initialProfileData }) {
    const router = useRouter();
    const [profileData, setProfileData] = useState(initialProfileData);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null);
    const [isPending, startTransition] = useTransition();
    const [isDownloading, startDownloading] = useTransition();
    
    const { labor, assignments, payments, sites, attendance } = profileData;
    const laborId = labor.id;

    const refreshProfileData = useCallback(async () => {
        const result = await getLaborProfileDataAction(laborId);
        if (!result.error) setProfileData(result.data);
    }, [laborId]);

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this labor? This action is permanent.")) {
            startTransition(async () => {
                const result = await deleteLabor(laborId);
                if(result.error) { alert("Error: " + result.error) } 
                else { alert(result.success); router.push('/dashboard/admin/labors'); }
            });
        }
    };

    const handleEndAssignment = (assignmentId) => {
        if (confirm("Are you sure you want to end this labor's current assignment?")) {
            startTransition(async () => {
                const result = await endLaborAssignment(assignmentId);
                if (result.success) { alert(result.success); refreshProfileData(); } 
                else { alert("Error: " + result.error); }
            });
        }
    };

    const handleAssignmentDelete = async (assignmentId) => {
        if (confirm("Are you sure you want to delete this assignment history? This is for correcting mistakes and cannot be undone.")) {
            startTransition(async () => {
                const result = await deleteAssignment(assignmentId, laborId);
                if (result.error) { alert("Error: " + result.error); } 
                else { alert(result.success); refreshProfileData(); }
            });
        }
    };
    
    const handleDownloadReport = () => {
        if (!laborId) return;
        startDownloading(async () => {
            const result = await getLaborReportData(laborId);
            if (result.error) { alert(`Error creating report: ${result.error}`); } 
            else if (result.data) { generateLaborReportPDF(result.data); }
        });
    };

    const currentAssignment = assignments.find(a => a.to_date === null);
    const totalDaysWorked = attendance.reduce((sum, a) => sum + Number(a.day_type || 0), 0);
    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return (
        <div className="space-y-8">
            <Link href="/dashboard/admin/labors" className="text-sm text-blue-600 hover:underline">&larr; Back to All Labors</Link>
            
            {isEditing && <EditLaborModal labor={labor} onClose={() => setIsEditing(false)} onUpdateSuccess={refreshProfileData} />}
            {editingPayment && <EditPaymentModal payment={editingPayment} sites={sites} onClose={() => setEditingPayment(null)} onUpdateSuccess={refreshProfileData} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{labor.full_name}</h1>
                            <p className="text-gray-600">{labor.work_type} - ₹{labor.per_day_rate}/day</p>
                            {labor.phone_number && (<p className="text-sm text-gray-500 mt-1">{labor.phone_number}</p>)}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button onClick={handleDownloadReport} disabled={isDownloading} className="bg-green-600 text-white px-3 py-2 text-sm rounded-md disabled:bg-green-400">
                                {isDownloading ? 'Generating...' : 'Download Report'}
                            </button>
                            {currentAssignment && <button onClick={() => handleEndAssignment(currentAssignment.id)} disabled={isPending} className="bg-yellow-500 text-white px-3 py-2 text-sm rounded-md">End Assignment</button>}
                            <button onClick={() => setIsEditing(true)} disabled={isPending} className="bg-blue-600 text-white px-3 py-2 text-sm rounded-md">Edit</button>
                            <button onClick={handleDelete} disabled={isPending} className="bg-red-600 text-white px-3 py-2 text-sm rounded-md">Delete</button>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md text-right">
                    <p className="text-sm text-gray-500">Total Paid</p>
                    <p className="text-2xl font-bold text-green-600 mb-2">₹{totalPaid.toLocaleString("en-IN")}</p>
                    <p className="text-sm text-gray-500">Total Days Worked</p>
                    <p className="text-2xl font-bold text-blue-600">{totalDaysWorked}</p>
                </div>
            </div>

            <AdminPaymentForm labor={labor} sites={sites} onPaymentSuccess={refreshProfileData} />
            
            {/* === YAHI HAI FINAL BADLAAV === */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Attendance ke liye naya timeline */}
                <AttendanceTimeline
                    history={attendance}
                    title="Attendance History"
                />

                {/* Payment History ke liye custom timeline UI (Edit button ke saath) */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Payment History</h2>
                    <div className="max-h-96 overflow-y-auto pr-2 pl-4">
                        {(() => {
                            if (!payments || payments.length === 0) {
                                return <p className="text-center text-gray-500 p-4">No payments logged yet.</p>;
                            }

                            const groupedByDate = payments.reduce((acc, entry) => {
                                const date = entry.date.split('T')[0];
                                (acc[date] = acc[date] || []).unshift(entry);
                                return acc;
                            }, {});

                            const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

                            return (
                                <ul className="relative border-l border-gray-200">
                                    {sortedDates.map(date => (
                                        <li key={date} className="mb-6 ml-6">
                                            <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                                                <svg className="w-3 h-3 text-green-700" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 0h-4.5M3.75 18h14.25a1.125 1.125 0 001.125-1.125V6.375a1.125 1.125 0 00-1.125-1.125H3.75A1.125 1.125 0 002.625 6.375v10.5A1.125 1.125 0 003.75 18z" /></svg>
                                            </span>
                                            <h4 className="flex items-center mb-1 text-base font-semibold text-gray-900">
                                                {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </h4>
                                            <div className="mt-2 space-y-4">
                                                {groupedByDate[date].map(p => (
                                                    <div key={p.id} className="pb-3 border-b border-gray-100 last:border-b-0">
                                                        <div className="flex justify-between items-start text-sm mb-1">
                                                            <p className="font-bold text-base text-right text-green-600">
                                                                ₹{Number(p.amount).toLocaleString('en-IN')}
                                                            </p>
                                                            <button onClick={() => setEditingPayment(p)} className="text-xs text-blue-600 hover:underline font-semibold flex-shrink-0 ml-4">Edit</button>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                                            <span>At: <span className="font-semibold">{p.sites?.name || 'N/A'}</span></span>
                                                            <span>by: {p.profiles?.full_name || 'Admin'}</span>
                                                        </div>
                                                         {p.remarks && (
                                                            <div className="mt-2 text-xs italic bg-yellow-50 text-yellow-800 p-2 rounded-md">
                                                                "{p.remarks}"
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            );
                        })()}
                    </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Site Assignment History</h2>
                    <div className="max-h-96 overflow-y-auto">
                        <ul className="space-y-3">{assignments.length > 0 ? (assignments.map((a) => (<li key={a.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-md text-sm"><div><p className="font-semibold">{a.sites.name}</p><p className="text-gray-500"><ClientOnlyDate dateString={a.from_date} /> &ndash; {a.to_date ? <ClientOnlyDate dateString={a.to_date} /> : (<span className="font-bold text-green-600">Present</span>)}</p></div><button onClick={() => handleAssignmentDelete(a.id)} className="text-xs text-red-500 hover:underline font-semibold flex-shrink-0 ml-4">Delete</button></li>))) : (<p className="text-gray-500 text-sm">No assignment history found.</p>)}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
}