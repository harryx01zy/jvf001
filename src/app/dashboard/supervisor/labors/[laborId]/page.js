// src/app/dashboard/supervisor/labors/[laborId]/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getLaborProfileDataAction } from "@/app/dashboard/admin/actions";

// === NAYE TIMELINE COMPONENTS KO IMPORT KAREIN ===
import AttendanceTimeline from "@/components/dashboard/AttendanceTimeline";
import FinancialTimeline from "@/components/dashboard/FinancialTimeline";

// Helper Components
function LoadingSpinner() { return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-900"></div></div>; }
// Iski ab zaroorat nahi hai
// const DayTypeLabel = ({ dayType }) => { const map = { 0: "Absent", 0.5: "Half Day", 1: "Present", 1.5: "Present + Half", 2: "Double Duty" }; return <span className="font-medium">{map[dayType] || "N/A"}</span>; };


export default function SupervisorLaborProfileView() {
  const params = useParams();
  const laborId = params.laborId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const fetchProfileData = useCallback(async () => {
      if (laborId) {
          setLoading(true);
          const result = await getLaborProfileDataAction(laborId);
          if (result.error) setError(result.error);
          else setProfileData(result.data);
          setLoading(false);
      }
  }, [laborId]);

  useEffect(() => { fetchProfileData(); }, [fetchProfileData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 p-8">Error: {error}</p>;
  if (!profileData) return <p className="p-8">No data found for this labor.</p>;

  const { labor, payments, attendance } = profileData;
  
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalDaysWorked = attendance.reduce((sum, a) => sum + Number(a.day_type || 0), 0);

  return (
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <Link href="/dashboard/supervisor" className="text-sm text-blue-600 hover:underline">&larr; Back to Supervisor Dashboard</Link>
        
        {/* Top Info Section (Koi badlaav nahi) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-md md:col-span-2">
                <h1 className="text-3xl font-bold text-gray-900">{labor.full_name}</h1>
                <p className="text-gray-600">{labor.work_type} - ₹{labor.per_day_rate}/day</p>
                {labor.phone_number && (<p className="text-sm text-gray-500 mt-1">{labor.phone_number}</p>)}
            </div>
             <div className="p-6 bg-white rounded-lg shadow-md text-right">
                <p className="text-sm text-gray-500">Total Paid to this Labor</p>
                <p className="text-2xl font-bold text-green-600 mb-2">₹{totalPaid.toLocaleString("en-IN")}</p>
                <p className="text-sm text-gray-500">Total Days Worked</p>
                <p className="text-2xl font-bold text-blue-600">{totalDaysWorked}</p>
            </div>
        </div>

        {/* === HISTORY SECTION KO UPDATE KIYA GAYA HAI === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Attendance ke liye naya timeline */}
          <AttendanceTimeline
            history={attendance}
            title="Attendance History"
          />

          {/* Payment ke liye naya timeline */}
          <FinancialTimeline
            history={payments}
            title="Payment History"
            type="payment"
          />

        </div>
      </div>
  );
}