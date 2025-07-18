// src/app/dashboard/page.js
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardRedirector() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/dashboard/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'admin') {
    return redirect('/dashboard/admin');
  } 
  
  if (profile?.role === 'supervisor') {
    return redirect('/dashboard/supervisor');
  }

  // Agar koi role nahi hai to logout karke wapas bhej dein
  await supabase.auth.signOut();
  return redirect('/dashboard/login?error=unauthorized');
}