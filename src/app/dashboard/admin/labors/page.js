// src/app/dashboard/admin/labors/page.js
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import LaborManager from '@/components/dashboard/LaborManager';
import Link from 'next/link';

async function getLaborPageData() {
    const supabase = await createClient();
    const laborsPromise = supabase.from('labors').select('*').order('full_name');
    const sitesPromise = supabase.from('sites').select('*').order('name');
    const assignmentsPromise = supabase.from('labor_site_assignments').select('*');

    const [
        { data: labors },
        { data: sites },
        { data: laborAssignments }
    ] = await Promise.all([laborsPromise, sitesPromise, assignmentsPromise]);

    return { labors: labors || [], sites: sites || [], laborAssignments: laborAssignments || [] };
}

export default async function LaborManagementPage() {
    // ===== YAHI HAI ASLI BADLAAV =====
    // createClient() ek promise lautaata hai, isliye use AWAIT karna zaroori hai
    const supabase = await createClient(); 
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/dashboard/login');
    }

    const { labors, sites, laborAssignments } = await getLaborPageData();

    return (
        <LaborManager 
            labors={labors} 
            sites={sites} 
            laborAssignments={laborAssignments}
        />
    );
}