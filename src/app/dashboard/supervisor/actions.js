// src/app/dashboard/supervisor/actions.js
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ... submitAttendance action waisa hi rahega ...
export async function submitAttendance(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication error. Please log in again.' }

  const rawData = Object.fromEntries(formData.entries())
  const siteId = rawData.siteId
  const attendanceDate = rawData.attendanceDate

  // === YAHAN SE NAYA CHECK SHURU HOTA HAI ===
  const today = new Date();
  const submittedDate = new Date(attendanceDate);

  // Timezone ki problem se bachne ke liye, hum sirf date part ko compare karenge
  today.setHours(0, 0, 0, 0);
  submittedDate.setHours(0, 0, 0, 0);

  if (submittedDate.getTime() !== today.getTime()) {
      return { error: 'Error: You can only mark attendance for the current day.' };
  }
  // === CHECK YAHAN KHATM HOTA HAI ===

  if (!siteId || !attendanceDate) {
    return { error: 'Site ID or Attendance Date is missing.' };
  }

  if (!siteId || !attendanceDate) {
    return { error: 'Site ID or Attendance Date is missing.' };
  }

  const attendanceRecords = []

  for (const key in rawData) {
    if (key.startsWith('attendance-')) {
      const laborId = key.split('-')[1]
      const dayType = parseFloat(rawData[key]) 
      
      attendanceRecords.push({
        labor_id: laborId,
        site_id: siteId,
        supervisor_id: user.id,
        date: attendanceDate,
        day_type: dayType,
      })
    }
  }

  if (attendanceRecords.length === 0) {
    return { success: 'No attendance data was provided to submit.' }
  }

  const { error } = await supabase
    .from('attendance')
    .upsert(attendanceRecords, { onConflict: 'date, labor_id, site_id' });
    
  if (error) {
    console.error('Supabase upsert error:', error);
    return { error: `Failed to submit attendance. Database error: ${error.message}` };
  }

  revalidatePath('/dashboard/supervisor')
  return { success: `Attendance for ${attendanceDate} submitted successfully!` }
}


// ... logPayment action waisa hi rahega ...
export async function logPayment(formData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Authentication error. Please log in again.' };
  
    const rawData = {
      labor_id: formData.get('labor_id'),
      site_id: formData.get('site_id'),
      amount: Number(formData.get('amount')),
      payment_mode: formData.get('payment_mode'),
      date: formData.get('date'),
      remarks: formData.get('remarks') || null,
      paid_by_id: user.id,
    };

     // === YAHAN SE NAYA CHECK SHURU HOTA HAI ===
    const today = new Date();
    const submittedDate = new Date(rawData.date);

    today.setHours(0, 0, 0, 0);
    submittedDate.setHours(0, 0, 0, 0);

    if (submittedDate.getTime() !== today.getTime()) {
        return { error: 'Error: You can only log payments for the current day.' };
    }
  
    if (!rawData.labor_id || !rawData.site_id || !rawData.amount || !rawData.date || !rawData.payment_mode) {
      return { error: 'Please fill all required fields.' };
    }
    
    const { error } = await supabase.from('payments').insert([rawData]);
    if (error) {
        return { error: 'Failed to log payment. Please try again.' };
    }
  
    revalidatePath('/dashboard/supervisor');
    return { success: 'Payment logged successfully!' };
}

// NAYA ACTION: Material log karne ke liye
export async function logMaterial(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Authentication error. Please log in again.' };

  const rawData = {
    site_id: formData.get('site_id'),
    item_name: formData.get('item_name'),
    vendor_name: formData.get('vendor_name'),
    amount: Number(formData.get('amount')),
    purchase_date: formData.get('purchase_date'),
    purchased_by_id: user.id
  };

  // === YAHAN SE NAYA CHECK SHURU HOTA HAI ===
  const today = new Date();
  const submittedDate = new Date(rawData.purchase_date);
  today.setHours(0, 0, 0, 0);
  submittedDate.setHours(0, 0, 0, 0);

  if (submittedDate.getTime() !== today.getTime()) {
      return { error: 'Error: You can only log material purchases for the current day.' };
  }

  if (!rawData.site_id || !rawData.item_name || !rawData.amount || !rawData.purchase_date) {
    return { error: 'Please fill all required fields.' };
  }

  const { error } = await supabase.from('material_purchases').insert([rawData]);

  if (error) {
    console.error('Log Material Error:', error);
    return { error: 'Failed to log material purchase.' };
  }

  revalidatePath('/dashboard/supervisor');
  return { success: 'Material purchase logged successfully!' };
}