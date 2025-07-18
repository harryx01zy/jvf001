// src/app/dashboard/supervisor/page.js

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AttendanceManager from '@/components/dashboard/AttendanceManager';
import PaymentManager from '@/components/dashboard/PaymentManager';
import MaterialManager from '@/components/dashboard/MaterialManager';
import AttendanceTimeline from '@/components/dashboard/AttendanceTimeline'; 
import FinancialTimeline from '@/components/dashboard/FinancialTimeline';
// Humne naya MaterialTimeline component import kar liya hai
import MaterialTimeline from '@/components/dashboard/MaterialTimeline';

// StatCard component (Koi badlaav nahi)
const StatCard = ({ title, value, icon }) => ( <div className="bg-white p-4 rounded-lg shadow-md flex items-center"><div className="bg-slate-100 p-3 rounded-full mr-4">{icon}</div><div><p className="text-sm font-medium text-gray-500">{title}</p><p className="text-2xl font-bold text-gray-900">{value}</p></div></div>);
// HistoryTable component (Ise ab hum material ke liye istemal nahi kar rahe, lekin rakha hai taaki future mein kaam aa sake)
const HistoryTable = ({ title, data, columns, total }) => { if (!data || data.length === 0) return null; return ( <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">{title}</h3>{total && ( <div className="text-right"><p className="text-sm text-gray-500">{total.label}</p><p className="text-2xl font-bold text-green-600">{total.value}</p></div>)}</div><div className="overflow-x-auto max-h-80"><table className="min-w-full text-sm"><thead className="bg-gray-100 sticky top-0"><tr>{columns.map(col => <th key={col.key} className="p-3 text-left font-semibold">{col.header}</th>)}</tr></thead><tbody>{data.map(row => ( <tr key={row.id} className="border-b">{columns.map(col => <td key={col.key} className="p-3">{col.render(row)}</td>)}</tr>))}</tbody></table></div></div>);};


// === DATA FETCHING FUNCTION MEIN BADLAAV ===
async function getSupervisorData(userId) {
    const supabase = await createClient();
    const { data: assignment } = await supabase
        .from('supervisor_sites')
        .select('site_id')
        .eq('supervisor_id', userId)
        .single();

    if (!assignment) {
        return { site: null, data: {} };
    }

    const siteId = assignment.site_id;
    const today = new Date().toISOString().split('T')[0];
    
    // Sabhi queries ko ek saath chalayenge
    const [
        siteRes,
        laborsOnSiteRes,
        alreadyMarkedRes,
        paymentsRes,
        materialsRes,
        attendanceRes
    ] = await Promise.all([
        supabase.from('sites').select('*').eq('id', siteId).single(),
        supabase.from('labor_site_assignments').select('labors(*)').eq('site_id', siteId).is('to_date', null),
        supabase.from('attendance').select('labor_id, day_type').eq('site_id', siteId).eq('date', today),
        supabase.from('payments').select('*, labors(full_name),profiles!paid_by_id(full_name)').eq('site_id', siteId).order('date', { ascending: false }).limit(50),
        // === YEH QUERY UPDATE KI GAYI HAI ===
        // Hum 'purchaser' alias ka istemal kar rahe hain jo naye component ke liye zaroori hai
        supabase.from('material_purchases').select('*, purchaser:profiles!purchased_by_id(full_name)').eq('site_id', siteId).order('purchase_date', { ascending: false }).limit(50),
        supabase.from('attendance').select('*, labors(full_name), marker:profiles!supervisor_id(full_name)').eq('site_id', siteId).order('date', { ascending: false }).limit(50)
    ]);

    const laborsOnSite = laborsOnSiteRes.data?.map(a => a.labors).filter(Boolean) || [];
    const alreadyMarkedLabors = alreadyMarkedRes.data?.reduce((acc, record) => { acc[record.labor_id] = record.day_type; return acc; }, {}) || {};
    const totalPaid = paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;
    const totalMaterialCost = materialsRes.data?.reduce((sum, m) => sum + Number(m.amount || 0), 0) || 0;

    return {
        site: siteRes.data,
        data: {
            laborsOnSite,
            alreadyMarkedLabors,
            payments: paymentsRes.data || [],
            materials: materialsRes.data || [],
            attendanceHistory: attendanceRes.data || [],
            totalPaid,
            totalMaterialCost
        }
    };
}


// === PAGE COMPONENT MEIN BADLAAV ===
export default async function SupervisorDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/dashboard/login');

    const { site, data } = await getSupervisorData(user.id);

    if (!site) {
        return ( <div className="p-8 text-center"><h1 className="text-xl font-bold">Assignment Pending</h1><p>You are not assigned to any site. Please contact an admin.</p></div>);
    }
    
    // Inki ab zaroorat nahi hai kyunki MaterialTimeline khud format kar lega
    // const dayTypeMap = { 0: "Absent", 0.5: "Half", 1: "Full", 1.5: "Full+Half", 2: "Double" };
    // const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div>
            <header className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-xl font-semibold leading-6 text-gray-900">Supervisor Dashboard</h1>
                    <p className="text-sm text-gray-600">Site: <span className="font-bold">{site.name}</span></p>
                </div>
            </header>
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Active Labors on Site" value={data.laborsOnSite.length} icon={'👷'}/>
                    <StatCard title="Site Payments" value={`₹${data.totalPaid.toLocaleString('en-IN')}`} icon={'💸'}/>
                    <StatCard title="Site Material Cost" value={`₹${data.totalMaterialCost.toLocaleString('en-IN')}`} icon={'🧱'}/>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-4">Labors on this Site</h3>
                            <div className="space-y-3">
                                {data.laborsOnSite.length > 0 ? data.laborsOnSite.map(labor => (
                                    <Link key={labor.id} href={`/dashboard/supervisor/labors/${labor.id}`} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                                        <span className="font-semibold">{labor.full_name}</span>
                                        <span className="text-xs text-blue-600 font-bold">VIEW PROFILE →</span>
                                    </Link>
                                )) : <p className="text-sm text-gray-500">No active labors.</p>}
                            </div>
                        </div>
                        <AttendanceManager site={site} labors={data.laborsOnSite} alreadyMarkedLabors={data.alreadyMarkedLabors} />
                        <PaymentManager site={site} labors={data.laborsOnSite} />
                        <MaterialManager site={site} />
                    </div>
                    <div className="space-y-8">
                        <FinancialTimeline
                            history={data.payments}
                            title="Site Payment History"
                            type="payment"
                        />
                        {/* === YAHI HAI FINAL BADLAAV === */}
                        {/* Purane HistoryTable ko naye MaterialTimeline se replace kar diya gaya hai */}
                        <MaterialTimeline 
                            history={data.materials}
                        />
                        <AttendanceTimeline 
                            title="Site Attendance History" 
                            history={data.attendanceHistory} 
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}