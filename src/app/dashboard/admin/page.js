// src/app/dashboard/admin/page.js
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SiteManager from '@/components/dashboard/SiteManager';
import SupervisorManager from '@/components/dashboard/SupervisorManager';
import Link from 'next/link';

async function getAdminData() {
    const supabase = await createClient();
    // We can fetch all data in parallel for efficiency
    const sitesPromise = supabase.from('sites').select('*', { count: 'exact' });
    const supervisorsPromise = supabase.from('profiles').select('id, full_name', { count: 'exact' }).eq('role', 'supervisor');
    const laborsPromise = supabase.from('labors').select('id', { count: 'exact' });
    const assignmentsPromise = supabase.from('supervisor_sites').select('*');

    const [
        { data: sites, count: siteCount }, 
        { data: supervisors, count: supervisorCount }, 
        { data: labors, count: laborCount },
        { data: assignments }
    ] = await Promise.all([sitesPromise, supervisorsPromise, laborsPromise, assignmentsPromise]);

    return { 
        sites: sites || [], 
        supervisors: supervisors || [], 
        assignments: assignments || [],
        siteCount: siteCount || 0,
        supervisorCount: supervisorCount || 0,
        laborCount: laborCount || 0,
    };
}

// === STAT CARD COMPONENT ===
// A simple component to display a single statistic.
function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="bg-slate-100 p-3 rounded-full mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/dashboard/login');
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        // This is a safeguard; the main redirector should handle this.
        return redirect('/dashboard');
    }

    // Fetch all the necessary data, including the new counts
    const { sites, supervisors, assignments, siteCount, supervisorCount, laborCount } = await getAdminData();

    return (
        <div>
            {/* The header is now part of the admin layout, so we can remove it from here if using the layout */}
            
            <main className="p-4 sm:p-6 lg:p-8 space-y-8">
                {/* === NEW: Summary Widgets Section === */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard 
                        title="Total Sites" 
                        value={siteCount} 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} 
                    />
                    <StatCard 
                        title="Total Supervisors" 
                        value={supervisorCount}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /></svg>}
                    />
                    <StatCard 
                        title="Total Labors" 
                        value={laborCount}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
                    />
                </div>

                {/* Existing Manager Components */}
                <SiteManager sites={sites} />
                <SupervisorManager
                    supervisors={supervisors}
                    sites={sites}
                    assignments={assignments}
                />
            </main>
        </div>
    );
}