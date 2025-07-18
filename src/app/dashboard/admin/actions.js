'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// ACTION 1: ADD A NEW SITE
export async function addSite(formData) {
  const supabase = await createClient();
  const siteName = formData.get('siteName')?.toString();
  const siteLocation = formData.get('siteLocation')?.toString();

  if (!siteName) return { error: 'Site Name is required.' };

  const { error } = await supabase.from('sites').insert([{ name: siteName, location: siteLocation }]);
  if (error) {
    console.error('Add Site Error:', error);
    return { error: 'Failed to add site.' };
  }

  revalidatePath('/dashboard/admin');
  return { success: 'Site added successfully!' };
}

// ACTION 2: CREATE A NEW SUPERVISOR (FINAL VERSION)
export async function createSupervisor(formData) {
  const supabaseAdmin = createAdminClient(); 
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!name || !email || !password) {
    return { error: 'Full Name, Email, and Password are required.' };
  }

  // Step 1: User create karein, is baar naam ke saath
  const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    // === YAHI HAI FINAL FIX: Hum user banate waqt hi uska naam bhej rahe hain ===
    user_metadata: {
        full_name: name
    }
  });

  if (authError) {
    console.error('Create User Error:', authError);
    if (authError.message.includes('User already registered')) {
        return { error: 'A user with this email already exists.' };
    }
    return { error: 'Failed to create supervisor user. ' + authError.message };
  }
  
  if (!userData?.user?.id) {
    return { error: 'Failed to get new user ID after creation.' };
  }

  // Step 2: Profile ko update karein (yeh pehle se sahi kaam kar raha hai)
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ 
        full_name: name, 
        role: 'supervisor'
    })
    .eq('id', userData.user.id);

  if (updateError) {
    console.error('Update Profile Error:', updateError);
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
    return { error: `Failed to update supervisor profile. DB Error: ${updateError.message}` };
  }

  revalidatePath('/dashboard/admin');
  return { success: `Supervisor ${name} created successfully! They can now log in directly.` };
}

// ACTION 3: ADD A NEW LABOR
export async function addLabor(formData) {
  const supabase = await createClient();
  const rawData = {
    full_name: formData.get('fullName')?.toString(),
    work_type: formData.get('workType')?.toString(),
    per_day_rate: Number(formData.get('perDayRate')),
    phone_number: formData.get('phoneNumber')?.toString() || null,
  };

  if (!rawData.full_name || !rawData.work_type || !rawData.per_day_rate) {
    return { error: 'Full Name, Work Type, and Rate are required.' };
  }

  const { error } = await supabase.from('labors').insert([rawData]);

  if (error) {
    console.error('Add Labor Error:', error);
    if (error.code === '23505') return { error: 'A labor with this phone number already exists.' };
    return { error: 'Failed to add labor.' };
  }

  revalidatePath('/dashboard/admin/labors');
  return { success: 'Labor added successfully!' };
}

// ACTION 4: ASSIGN A SUPERVISOR TO A SITE
export async function assignSupervisor(formData) {
  const supabase = await createClient();
  const rawData = {
    supervisor_id: formData.get('supervisorId')?.toString(),
    site_id: formData.get('siteId')?.toString(),
  };

  if (!rawData.supervisor_id || !rawData.site_id) return { error: 'Supervisor and Site must be selected.' };

  const { error } = await supabase.from('supervisor_sites').upsert(
    { supervisor_id: rawData.supervisor_id, site_id: rawData.site_id },
    { onConflict: 'supervisor_id' }
  );

  if (error) {
    console.error('Assign Supervisor Error:', error);
    return { error: 'Failed to assign supervisor.' };
  }

  revalidatePath('/dashboard/admin');
  return { success: 'Supervisor assigned successfully!' };
}

// ACTION 5: ASSIGN LABOR TO SITE (IMPROVED AND SAFER LOGIC)
export async function assignLaborToSite(formData) {
    const supabase = await createClient();
    const laborId = formData.get('laborId')?.toString();
    const siteId = formData.get('siteId')?.toString();
    const fromDate = formData.get('fromDate')?.toString();

    if (!laborId || !siteId || !fromDate) {
        return { error: 'Labor, Site, and Start Date are all required.' };
    }

    const { data: existingOnSameDay, error: checkError } = await supabase
        .from('labor_site_assignments')
        .select('id')
        .eq('labor_id', laborId)
        .eq('from_date', fromDate)
        .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking same-day assignment:', checkError);
        return { error: 'Could not verify existing assignments.' };
    }

    if (existingOnSameDay) {
        return { error: 'This labor is already assigned to start at a site on this date. Please choose a different start date.' };
    }

    const today = new Date(fromDate);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().split('T')[0];

    const { data: oldAssignment, error: findError } = await supabase
        .from('labor_site_assignments')
        .select('id')
        .eq('labor_id', laborId)
        .is('to_date', null)
        .single();

    if (findError && findError.code !== 'PGRST116') {
        console.error('Error finding old assignment:', findError);
        return { error: 'Could not retrieve old assignment data.' };
    }

    if (oldAssignment) {
        const { error: updateError } = await supabase
            .from('labor_site_assignments')
            .update({ to_date: yesterdayISO })
            .eq('id', oldAssignment.id);
        if (updateError) {
            console.error('Error closing old assignment:', updateError);
            return { error: 'Failed to update the previous assignment.' };
        }
    }

    const { error: insertError } = await supabase
        .from('labor_site_assignments')
        .insert({ labor_id: laborId, site_id: siteId, from_date: fromDate });

    if (insertError) {
        console.error('Error creating new assignment:', insertError);
        return { error: 'Failed to create new assignment.' };
    }

    revalidatePath('/dashboard/admin/labors');
    revalidatePath(`/dashboard/admin/labors/${laborId}`);
    return { success: 'Labor successfully assigned!' };
}

// ACTION 6: DELETE SITE
export async function deleteSite(siteId) {
  if (!siteId) return { error: 'Site ID is missing.' };
  const supabase = await createClient();

  const { data: assignments, error: assignmentError } = await supabase
    .from('labor_site_assignments')
    .select('id')
    .eq('site_id', siteId)
    .is('to_date', null);

  if (assignmentError) return { error: 'Could not verify site assignments.' };
  if (assignments?.length) return { error: 'Cannot delete site. It has active labors assigned.' };

  const { error: deleteError } = await supabase.from('sites').delete().eq('id', siteId);
  if (deleteError) return { error: 'Failed to delete site.' };

  revalidatePath('/dashboard/admin');
  return { success: 'Site deleted successfully!' };
}

// ACTION 7: DELETE SUPERVISOR
export async function deleteSupervisor(supervisorId) {
  if (!supervisorId) return { error: 'Supervisor ID is missing.' };
  const supabase = await createClient();

  const { data: assignment, error: assignmentError } = await supabase
    .from('supervisor_sites')
    .select('site_id')
    .eq('supervisor_id', supervisorId)
    .single();

  if (assignmentError && assignmentError.code !== 'PGRST116') return { error: 'Could not verify supervisor assignment.' };
  if (assignment) return { error: 'Cannot delete supervisor. They are currently assigned to a site.' };

  const supabaseAdmin = createAdminClient();
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(supervisorId);
  if (deleteError) return { error: 'Failed to delete supervisor. ' + deleteError.message };

  revalidatePath('/dashboard/admin');
  return { success: 'Supervisor deleted successfully!' };
}

// ACTION 8: UPDATE SITE
export async function updateSite(formData) {
  const siteId = formData.get('siteId')?.toString();
  const siteName = formData.get('siteName')?.toString();
  const siteLocation = formData.get('siteLocation')?.toString();

  if (!siteId || !siteName) return { error: 'Site ID and Site Name are required.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('sites')
    .update({ name: siteName, location: siteLocation })
    .eq('id', siteId);

  if (error) return { error: 'Failed to update site.' };

  revalidatePath('/dashboard/admin');
  return { success: 'Site updated successfully!' };
}

// ACTION 9: UPDATE LABOR
export async function updateLabor(formData) {
  const laborId = formData.get('laborId')?.toString();
  if (!laborId) return { error: 'Labor ID is missing.' };

  const rawData = {
    full_name: formData.get('fullName')?.toString(),
    work_type: formData.get('workType')?.toString(),
    per_day_rate: Number(formData.get('perDayRate')),
    phone_number: formData.get('phoneNumber')?.toString() || null,
  };

  if (!rawData.full_name || !rawData.work_type || !rawData.per_day_rate) {
    return { error: 'Full Name, Work Type, and Rate are required.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('labors').update(rawData).eq('id', laborId);

  if (error) {
    if (error.code === '23505') return { error: 'A labor with this phone number already exists.' };
    return { error: 'Failed to update labor details.' };
  }

  revalidatePath('/dashboard/admin/labors');
  return { success: 'Labor details updated successfully!' };
}

// ACTION 10: DELETE LABOR
export async function deleteLabor(laborId) {
  if (!laborId) return { error: 'Labor ID is missing.' };
  const supabase = await createClient();

  const { data: activeAssignment, error: checkError } = await supabase
    .from('labor_site_assignments')
    .select('id')
    .eq('labor_id', laborId)
    .is('to_date', null)
    .single();

  if (checkError && checkError.code !== 'PGRST116') return { error: 'Could not verify labor assignment status.' };
  if (activeAssignment) return { error: 'Cannot delete. This labor is currently active on a site.' };

  const { error: deleteError } = await supabase.from('labors').delete().eq('id', laborId);
  if (deleteError) return { error: 'Failed to delete labor.' };

  revalidatePath('/dashboard/admin/labors');
  return { success: 'Labor deleted successfully.' };
}

// ACTION 11: GET ATTENDANCE REPORT
export async function getAttendanceReport(siteId, fromDate, toDate) {
  if (!siteId || !fromDate || !toDate) return { error: 'Site and date range are required.' };
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('attendance')
    .select(`date, day_type, labors (full_name), profiles (full_name)`)
    .eq('site_id', siteId)
    .gte('date', fromDate)
    .lte('date', toDate)
    .order('date', { ascending: false });

  if (error) return { error: 'Failed to fetch attendance report.' };

  return { data: data || [] };
}

// ACTION 12: ADMIN LOG PAYMENT
export async function logPaymentByAdmin(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in.' };

  const rawData = {
    labor_id: formData.get('labor_id'),
    site_id: formData.get('site_id'),
    amount: formData.get('amount'),
    payment_mode: formData.get('payment_mode'),
    date: formData.get('date'),
    remarks: formData.get('remarks'),
    paid_by_id: user.id,
  };

  if (!rawData.labor_id || !rawData.site_id || !rawData.amount || !rawData.date) {
    return { error: 'Please fill all required fields (Labor, Site, Amount, Date).' };
  }

  const { error } = await supabase.from('payments').insert([rawData]);
  if (error) return { error: 'Failed to log payment.' };

  revalidatePath(`/dashboard/admin/labors/${rawData.labor_id}`);
  return { success: 'Payment logged successfully!' };
}

// ACTION 13: GET LABOR PROFILE DATA
export async function getLaborProfileDataAction(laborId) {
  if (!laborId) return { error: 'Labor ID is missing.' };
  const supabase = await createClient();
  const { data: labor, error } = await supabase.from('labors').select('*').eq('id', laborId).single();
  if (error || !labor) return { error: 'Labor not found.' };

  const assignmentsPromise = supabase.from('labor_site_assignments').select('*, sites(name)').eq('labor_id', laborId).order('from_date', { ascending: false });
  const paymentsPromise = supabase.from('payments').select('*, sites(name), profiles!paid_by_id(full_name)').eq('labor_id', laborId).order('date', { ascending: false });
  const sitesPromise = supabase.from('sites').select('*').order('name');
  const attendancePromise = supabase.from('attendance').select('*, sites(name), labors(full_name), marker:profiles!supervisor_id(full_name)').eq('labor_id', laborId).order('date', { ascending: false });
  const [{ data: assignments }, { data: payments }, { data: sites }, { data: attendance }] = await Promise.all([
    assignmentsPromise, paymentsPromise, sitesPromise, attendancePromise
  ]);

  return {
    data: {
      labor,
      assignments: assignments || [],
      payments: payments || [],
      sites: sites || [],
      attendance: attendance || []
    }
  };
}

// ACTION 14: UPDATE A PAYMENT
export async function updatePayment(formData) {
  const paymentId = formData.get('paymentId');
  if (!paymentId) return { error: 'Payment ID is missing.' };
  const rawData = { site_id: formData.get('site_id'), amount: Number(formData.get('amount')), payment_mode: formData.get('payment_mode'), date: formData.get('date'), remarks: formData.get('remarks') };
  if (!rawData.site_id || !rawData.amount || !rawData.date) return { error: 'Site, Amount, and Date are required.' };
  const supabase = await createClient();
  const { error } = await supabase.from('payments').update(rawData).eq('id', paymentId);
  if (error) { console.error('Update Payment Error:', error); return { error: 'Failed to update payment.' }; }
  return { success: 'Payment updated successfully!' };
}

// ACTION 15: DELETE A LABOR ASSIGNMENT
export async function deleteAssignment(assignmentId, laborId) {
  if (!assignmentId) return { error: 'Assignment ID is missing.' };
  const supabase = await createClient();
  const { error } = await supabase.from('labor_site_assignments').delete().eq('id', assignmentId);
  if (error) { console.error('Delete Assignment Error:', error); return { error: 'Failed to delete assignment.' }; }
  revalidatePath('/dashboard/admin/labors');
  if (laborId) revalidatePath(`/dashboard/admin/labors/${laborId}`);
  return { success: 'Assignment deleted successfully. You can now create a new one.' };
}

// ACTION 16: UPDATE A SUPERVISOR'S DETAILS (FINAL & FLEXIBLE)
export async function updateSupervisor(formData) {
  const supervisorId = formData.get('supervisorId')?.toString();
  const fullName = formData.get('fullName')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  if (!supervisorId) return { error: 'Supervisor ID is missing.' };
  let updates = {};
  if (email) updates.email = email;
  if (password) updates.password = password;
  let userMetadata = {};
  if (fullName) userMetadata.full_name = fullName;
  if (Object.keys(userMetadata).length > 0) updates.user_metadata = userMetadata;
  if (Object.keys(updates).length === 0) return { error: 'No changes provided. Please fill at least one field to update.' };
  const supabaseAdmin = createAdminClient();
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(supervisorId, updates);
  if (authError) { console.error('Update Supervisor Auth Error:', authError); if (authError.message.includes('unique constraint')) { return { error: 'This email is already in use by another user.' }; } return { error: "Failed to update supervisor's details." }; }
  revalidatePath('/dashboard/admin');
  return { success: 'Supervisor details updated successfully!' };
}

// ... (file ke upar ke saare actions waise hi rahenge) ...

// === YEH HAI ACTION 17 KA FINAL AUR COMPLETE UPDATED VERSION ===
export async function getSiteProfileDataAction(siteId) {
    if (!siteId) {
        return { error: 'Site ID is missing.' };
    }
    const supabase = await createClient();

    // Site ki details laayein (yeh zaroori hai)
    const { data: site, error: siteError } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteId)
        .single();

    if (siteError || !site) {
        console.error("Site Fetch Error:", siteError);
        return { error: 'Site not found. It might have been deleted.' };
    }

    // Ab baaki saari details ko ek saath (parallel mein) laayein taaki speed acchi rahe
    const [
        supervisorRes,
        activeLaborsRes,
        attendanceHistoryRes,
        materialHistoryRes,
        // NAYA: Site par hue sabhi payments ki poori history, "Paid By" ke naam ke saath
        sitePaymentsRes
    ] = await Promise.all([
        supabase.from('supervisor_sites').select('supervisor_id, supervisor_name, email').eq('site_id', siteId).limit(1).maybeSingle(),
        supabase.from('labor_site_assignments').select('id, labors(id, full_name, work_type, per_day_rate)').eq('site_id', siteId).is('to_date', null),
        supabase.from('attendance').select('*, labors(full_name), marker:profiles(full_name)').eq('site_id', siteId).order('date', { ascending: false }).limit(50),
        supabase.from('material_purchases').select('*, purchaser:profiles(full_name)').eq('site_id', siteId).order('purchase_date', { ascending: false }),
        supabase.from('payments').select('*, labors(id, full_name), profiles!paid_by_id(full_name)').eq('site_id', siteId).order('date', { ascending: false })
    ]);

    // Supervisor ka data saaf-suthre format mein
    const supervisor = supervisorRes.data 
        ? { id: supervisorRes.data.supervisor_id, full_name: supervisorRes.data.supervisor_name, email: supervisorRes.data.email } 
        : null;

    return {
        data: {
            site,
            supervisor,
            activeLabors: activeLaborsRes.data || [],
            attendanceHistory: attendanceHistoryRes.data || [],
            materialHistory: materialHistoryRes.data || [],
            // Ab hum poori payment list bhej rahe hain taaki frontend par sab kuch dikha sakein
            payments: sitePaymentsRes.data || []
        },
    };
}

// ACTION 18: LABOR KA CURRENT ASSIGNMENT KHATM KARNE KE LIYE
export async function endLaborAssignment(assignmentId) {
  if (!assignmentId) {
    return { error: 'Assignment ID is missing.' };
  }
  const supabase = await createClient();

  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('labor_site_assignments')
    .update({ to_date: today })
    .eq('id', assignmentId);

  if (error) {
    console.error('End Labor Assignment Error:', error);
    return { error: 'Failed to end the assignment.' };
  }

  revalidatePath('/dashboard/admin/labors');
  return { success: 'Assignment ended successfully!' };
}

// ACTION 19: SUPERVISOR KO SITE SE UNASSIGN KARNE KE LIYE
export async function unassignSupervisor(supervisorId) {
  if (!supervisorId) {
    return { error: 'Supervisor ID is missing.' };
  }
  const supabase = await createClient();

  const { error } = await supabase
    .from('supervisor_sites')
    .delete()
    .eq('supervisor_id', supervisorId);

  if (error) {
    console.error('Unassign Supervisor Error:', error);
    return { error: 'Failed to unassign supervisor.' };
  }

  revalidatePath('/dashboard/admin');
  return { success: 'Supervisor unassigned successfully!' };
}

// ACTION 20: GET SUPERVISOR PROFILE DATA
export async function getSupervisorProfileDataAction(supervisorId) {
  if (!supervisorId) {
    return { error: 'Supervisor ID is missing.' };
  }
  const supabase = await createClient();

  // Promise.all se sabhi queries ek saath chalayenge
  const [profileRes, assignmentRes, attendanceRes, paymentsRes] = await Promise.all([
    // Supervisor ki profile details
    supabase.from('profiles').select('*').eq('id', supervisorId).single(),
    // Unka current site assignment
    supabase.from('supervisor_sites').select('sites(id, name)').eq('supervisor_id', supervisorId).single(),
    // Unke dwara mark ki gayi attendance
    supabase.from('attendance').select('*, labors(full_name), sites(name), marker:profiles!supervisor_id(full_name)').eq('supervisor_id', supervisorId).order('date', { ascending: false }).limit(50),
    // Unke dwara ki gayi payments
    supabase.from('payments').select('*, labors(full_name), sites(name), profiles!paid_by_id(full_name)').eq('paid_by_id', supervisorId).order('date', { ascending: false }).limit(50)
  ]);

  const { data: profile, error: profileError } = profileRes;
  if (profileError || !profile) {
    return { error: 'Supervisor not found.' };
  }

  return {
    data: {
      profile,
      currentSite: assignmentRes.data?.sites || null,
      attendanceHistory: attendanceRes.data || [],
      paymentHistory: paymentsRes.data || []
    }
  };
}


// ACTION 21: KISI SPECIFIC DATE KI ATTENDANCE FETCH KARNE KE LIYE
export async function getAttendanceForDate(siteId, date) {
  if (!siteId || !date) {
    return { error: 'Site ID and Date are required.' };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('attendance')
    .select('labor_id, day_type')
    .eq('site_id', siteId)
    .eq('date', date);

  if (error) {
    console.error('Fetch Attendance Error:', error);
    return { error: 'Could not fetch attendance data.' };
  }
  // Data ko aasan format mein badlein: { labor_id: day_type }
  const attendanceMap = data.reduce((acc, record) => {
    acc[record.labor_id] = record.day_type;
    return acc;
  }, {});
  return { data: attendanceMap };
}


// ACTION 22: ADMIN DWARA ATTENDANCE SUBMIT KARNE KE LIYE (CORRECTED VERSION)
export async function submitAttendanceByAdmin(submissionData) { // Naam badal diya taaki confusion na ho
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in.' };

  // Ab submissionData se seedhe data nikalein
  const siteId = submissionData.siteId;
  const attendanceDate = submissionData.attendanceDate;
  const attendanceObject = submissionData.attendance; // Yeh object hai -> { laborId: dayType, ... }

  if (!siteId || !attendanceDate || !attendanceObject) {
    return { error: 'Site ID, Date, or Attendance data is missing.' };
  }

  // attendanceObject se records banayein
  const attendanceRecords = Object.entries(attendanceObject).map(([laborId, dayType]) => ({
      labor_id: laborId,
      site_id: siteId,
      supervisor_id: user.id, // Admin is marking it
      date: attendanceDate,
      day_type: parseFloat(dayType),
  }));

  if (attendanceRecords.length === 0) {
    return { success: 'No attendance data to submit.' };
  }

  // Baki ka logic same rahega (upsert)
  const { error } = await supabase
    .from('attendance')
    .upsert(attendanceRecords, {
      onConflict: 'date, labor_id, site_id'
    });
    
  if (error) {
    console.error('Supabase upsert error:', error);
    return { error: `Failed to submit attendance. Database error: ${error.message}` };
  }

  revalidatePath(`/dashboard/admin/sites/${siteId}`);
  return { success: `Attendance for ${attendanceDate} submitted successfully!` };
}
// ACTION 23: NAYE MATERIAL PURCHASE KO ADD KARNE KE LIYE
export async function addMaterialPurchase(formData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in.' };

  const rawData = {
    site_id: formData.get('site_id'),
    item_name: formData.get('item_name'),
    vendor_name: formData.get('vendor_name'),
    amount: formData.get('amount'),
    purchase_date: formData.get('purchase_date'),
    purchased_by_id: user.id
  };

  if (!rawData.site_id || !rawData.item_name || !rawData.amount || !rawData.purchase_date) {
    return { error: 'Please fill all required fields.' };
  }

  const { error } = await supabase.from('material_purchases').insert([rawData]);

  if (error) {
    console.error('Add Material Purchase Error:', error);
    return { error: 'Failed to add material purchase.' };
  }

  revalidatePath(`/dashboard/admin/sites/${rawData.site_id}`);
  return { success: 'Material purchase logged successfully!' };
}

// ... (Aapke purane saare actions waise hi rahenge) ...

// === YAHAN SE NAYA CODE SHURU HUA HAI ===

// ACTION 24: MATERIAL PURCHASE KO UPDATE KARNE KE LIYE
export async function updateMaterialPurchase(formData) {
  const supabase = await createClient();
  const purchaseId = formData.get('purchase_id');

  const rawData = {
    item_name: formData.get('item_name'),
    vendor_name: formData.get('vendor_name'),
    amount: formData.get('amount'),
    purchase_date: formData.get('purchase_date'),
  };

  if (!purchaseId || !rawData.item_name || !rawData.amount || !rawData.purchase_date) {
    return { error: 'All fields are required to update.' };
  }

  const { error } = await supabase
    .from('material_purchases')
    .update(rawData)
    .eq('id', purchaseId);

  if (error) {
    console.error('Update Material Purchase Error:', error);
    return { error: 'Failed to update material purchase.' };
  }

  return { success: 'Purchase updated successfully!' };
}


// ACTION 25: MATERIAL PURCHASE KO DELETE KARNE KE LIYE
export async function deleteMaterialPurchase(purchaseId) {
  if (!purchaseId) {
    return { error: 'Purchase ID is missing.' };
  }
  const supabase = await createClient();

  const { error } = await supabase
    .from('material_purchases')
    .delete()
    .eq('id', purchaseId);

  if (error) {
    console.error('Delete Material Purchase Error:', error);
    return { error: 'Failed to delete material purchase.' };
  }

  return { success: 'Purchase deleted successfully!' };
}

// ACTION 26: COMPREHENSIVE SITE REPORT KA DATA LAANE KE LIYE
export async function getComprehensiveSiteReportData(siteId, fromDate, toDate) {
  if (!siteId || !fromDate || !toDate) {
    return { error: 'Site, From Date, and To Date are all required.' };
  }
  const supabase = await createClient();

  // Step 1: Site aur Supervisor ki details laayein
  const sitePromise = supabase.from('sites').select('name, location').eq('id', siteId).single();
  const supervisorPromise = supabase.from('supervisor_sites').select('profiles(full_name)').eq('site_id', siteId).limit(1).maybeSingle();

  // Step 2: Date range ke andar ka saara data laayein
  const attendancePromise = supabase
    .from('attendance')
    .select('date, day_type, labors(full_name), marker:profiles(full_name)')
    .eq('site_id', siteId)
    .gte('date', fromDate)
    .lte('date', toDate)
    .order('date');

  const paymentsPromise = supabase
    .from('payments')
    .select('date, amount, payment_mode, remarks, labors(full_name), paid_by:profiles(full_name)')
    .eq('site_id', siteId)
    .gte('date', fromDate)
    .lte('date', toDate)
    .order('date');
    
  const materialsPromise = supabase
    .from('material_purchases')
    .select('purchase_date, item_name, vendor_name, amount, purchaser:profiles(full_name)')
    .eq('site_id', siteId)
    .gte('purchase_date', fromDate)
    .lte('purchase_date', toDate)
    .order('purchase_date');

  // Saari queries ek saath chalayein
  const [
    { data: site, error: siteError },
    { data: supervisor },
    { data: attendance, error: attendanceError },
    { data: payments, error: paymentsError },
    { data: materials, error: materialsError }
  ] = await Promise.all([sitePromise, supervisorPromise, attendancePromise, paymentsPromise, materialsPromise]);

  // Agar koi bhi zaroori data nahi mila, toh error dein
  if (siteError) return { error: `Failed to fetch site details: ${siteError.message}` };
  if (attendanceError) return { error: `Failed to fetch attendance: ${attendanceError.message}` };
  if (paymentsError) return { error: `Failed to fetch payments: ${paymentsError.message}` };
  if (materialsError) return { error: `Failed to fetch materials: ${materialsError.message}` };

  // Data ko saaf-suthre format mein return karein
  return {
    data: {
      site: site || {},
      supervisorName: supervisor?.profiles?.full_name || 'N/A',
      reportDateRange: { from: fromDate, to: toDate },
      attendance: attendance || [],
      payments: payments || [],
      materials: materials || [],
    }
  };
}


// ACTION 27: SIRF PAYMENTS KI REPORT KE LIYE DATA LAANE WALA FUNCTION
export async function getPaymentsReportData(siteId, fromDate, toDate) {
  if (!siteId || !fromDate || !toDate) {
    return { error: 'Site, From Date, and To Date are required.' };
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('payments')
    .select('date, amount, payment_mode, labors(full_name), paid_by:profiles(full_name)')
    .eq('site_id', siteId)
    .gte('date', fromDate)
    .lte('date', toDate)
    .order('date');

  if (error) return { error: `Failed to fetch payments data: ${error.message}` };
  return { data: data || [] };
}


// ACTION 28: SIRF MATERIALS KI REPORT KE LIYE DATA LAANE WALA FUNCTION
export async function getMaterialsReportData(siteId, fromDate, toDate) {
  if (!siteId || !fromDate || !toDate) {
    return { error: 'Site, From Date, and To Date are required.' };
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('material_purchases')
    .select('purchase_date, item_name, vendor_name, amount, purchaser:profiles(full_name)')
    .eq('site_id', siteId)
    .gte('purchase_date', fromDate)
    .lte('purchase_date', toDate)
    .order('purchase_date');

  if (error) return { error: `Failed to fetch materials data: ${error.message}` };
  return { data: data || [] };
}
// ACTION 29: INDIVIDUAL LABOR KI POORI REPORT KE LIYE DATA LAANE WALA FUNCTION
export async function getLaborReportData(laborId) {
  if (!laborId) {
    return { error: 'Labor ID is missing.' };
  }
  const supabase = await createClient();

  // Promise.all se saari queries ek saath chalayein taaki speed acchi rahe
  const [laborRes, attendanceRes, paymentsRes, assignmentsRes] = await Promise.all([
    // Labor ki basic details
    supabase.from('labors').select('*').eq('id', laborId).single(),
    // Uski poori attendance history
    supabase.from('attendance').select('date, day_type, sites(name)').eq('labor_id', laborId).order('date', { ascending: false }),
    // Usko mili saari payments ki history
    supabase.from('payments').select('date, amount, payment_mode, sites(name), paid_by:profiles(full_name)').eq('labor_id', laborId).order('date', { ascending: false }),
    // Uske saare site assignments ki history
    supabase.from('labor_site_assignments').select('from_date, to_date, sites(name)').eq('labor_id', laborId).order('from_date', { ascending: false })
  ]);

  if (laborRes.error) {
    return { error: `Failed to fetch labor details: ${laborRes.error.message}` };
  }

  // Data ko saaf-suthre format mein return karein
  return {
    data: {
      labor: laborRes.data || {},
      attendance: attendanceRes.data || [],
      payments: paymentsRes.data || [],
      assignments: assignmentsRes.data || []
    }
  };
}



// ACTION 30: INDIVIDUAL SUPERVISOR KI POORI REPORT KE LIYE DATA LAANE WALA FUNCTION (CORRECTED)
export async function getSupervisorReportData(supervisorId) {
    // ... yeh function waise hi rahega ...
    if (!supervisorId) {
    return { error: 'Supervisor ID is missing.' };
  }
  const supabase = await createClient();

  const [supervisorRes, attendanceRes, paymentsRes, materialsRes] = await Promise.all([
    supabase.from('profiles').select('full_name, role').eq('id', supervisorId).single(),
    supabase.from('attendance').select('date, day_type, labors(full_name), sites(name)').eq('supervisor_id', supervisorId).order('date', { ascending: false }),
    supabase.from('payments').select('date, amount, payment_mode, labors(full_name), sites(name)').eq('paid_by_id', supervisorId).order('date', { ascending: false }),
    supabase.from('material_purchases').select('purchase_date, item_name, amount, sites(name)').eq('purchased_by_id', supervisorId).order('purchase_date', { ascending: false })
  ]);

  if (supervisorRes.error) {
    return { error: `Failed to fetch supervisor details: ${supervisorRes.error.message}` };
  }

  return {
    data: {
      supervisor: supervisorRes.data || {},
      markedAttendance: attendanceRes.data || [],
      loggedPayments: paymentsRes.data || [],
      loggedMaterials: materialsRes.data || []
    }
  };
}