"use client";

import { useState, useEffect, useCallback, useTransition, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// Saare actions, purane aur naye, import kiye gaye hain
import {
  getSupervisorProfileDataAction,
  deleteSupervisor,
  updateSupervisor,
  unassignSupervisor,
  getSupervisorReportData, // Report ke liye naya action
} from "@/app/dashboard/admin/actions";
import { generateSupervisorReportPDF } from "@/lib/reportGenerator"; // PDF generator
// Timeline components ko import kiya gaya hai
import AttendanceTimeline from "@/components/dashboard/AttendanceTimeline";
import FinancialTimeline from "@/components/dashboard/FinancialTimeline";

// Helper Component: Loading Spinner (Aapke purane code se)
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-900"></div>
    </div>
  );
}

// Helper Component: Edit Supervisor Modal (Aapke purane code se, koi badlaav nahi)
function EditSupervisorModal({ supervisor, onClose }) {
  const formRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData) => {
    startTransition(async () => {
      const result = await updateSupervisor(formData);
      if (result.success) {
        alert(result.success);
        onClose();
        window.location.reload();
      } else {
        setMessage(result.error);
        setTimeout(() => setMessage(null), 4000);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Edit Supervisor</h3>
        <form action={handleSubmit} ref={formRef} className="space-y-4">
          <input type="hidden" name="supervisorId" value={supervisor.id} />
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              name="fullName"
              placeholder={supervisor.full_name}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder={supervisor.email}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              name="password"
              placeholder="Leave blank to keep current"
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          {message && (
            <p className="text-red-500 text-sm font-medium">{message}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm"
            >
              {isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MUKHYA PROFILE PAGE COMPONENT (Updated with Timelines)
export default function SupervisorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const supervisorId = params.supervisorId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDownloading, startDownloading] = useTransition();

  const fetchProfileData = useCallback(async () => {
    if (supervisorId) {
      const result = await getSupervisorProfileDataAction(supervisorId);
      if (result.error) {
        setError(result.error);
      } else {
        setProfileData(result.data);
      }
      setLoading(false);
    }
  }, [supervisorId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleDelete = () => {
    if (
      window.confirm(
        "Kya aap pakka is supervisor ko hamesha ke liye delete karna chahte hain? Yeh action wapas nahi liya ja sakta."
      )
    ) {
      startTransition(async () => {
        const result = await deleteSupervisor(supervisorId);
        if (result.success) {
          alert("Supervisor safaltaapoorvak delete ho gaya!");
          router.push("/dashboard/admin");
        } else {
          alert(`Supervisor ko delete karne mein error: ${result.error}`);
        }
      });
    }
  };

  const handleUnassign = () => {
    startTransition(async () => {
      const result = await unassignSupervisor(supervisorId);
      if (result.success) {
        alert("Supervisor ko site se safaltaapoorvak unassign kar diya gaya!");
        setProfileData((prevData) => ({
          ...prevData,
          currentSite: null,
        }));
      } else {
        alert(`Supervisor ko unassign karne mein error: ${result.error}`);
      }
    });
  };

  const handleDownloadReport = () => {
    startDownloading(async () => {
      const result = await getSupervisorReportData(supervisorId);
      if (result.error) {
        alert(`Error creating report: ${result.error}`);
      } else {
        generateSupervisorReportPDF(result.data);
      }
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;
  if (!profileData) return <p className="p-4">No data found.</p>;

  const { profile, currentSite, attendanceHistory, paymentHistory } =
    profileData;

  return (
    <>
      {isEditing && (
        <EditSupervisorModal
          supervisor={profile}
          onClose={() => setIsEditing(false)}
        />
      )}
      <div className="space-y-8">
        <Link
          href="/dashboard/admin"
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Back to Admin Dashboard
        </Link>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {profile.full_name}
              </h1>
              <p className="text-gray-600">{profile.email}</p>
              {currentSite && (
                <p className="mt-2 font-semibold">
                  Currently Assigned to:{" "}
                  <span className="text-blue-700">{currentSite.name}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <button
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className="bg-green-600 text-white px-3 py-2 text-sm rounded-md disabled:bg-green-400"
              >
                {isDownloading ? "Generating..." : "Download Activity Report"}
              </button>
              {currentSite && (
                <button
                  onClick={handleUnassign}
                  disabled={isPending}
                  className="bg-yellow-500 text-white px-3 py-2 text-sm rounded-md"
                >
                  Unassign
                </button>
              )}
              <button
                onClick={() => setIsEditing(true)}
                disabled={isPending}
                className="bg-blue-600 text-white px-3 py-2 text-sm rounded-md"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="bg-red-600 text-white px-3 py-2 text-sm rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* === YAHI HAI FINAL BADLAAV === */}
        {/* Purani list ko naye timeline components se replace kiya gaya hai */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AttendanceTimeline
            history={attendanceHistory}
            title={`Attendance Marked (${attendanceHistory.length})`}
          />
          <FinancialTimeline
            history={paymentHistory}
            title={`Payments Logged (${paymentHistory.length})`}
            type="payment"
          />
        </div>
      </div>
    </>
  );
}