"use client";

import { useState, useEffect, useCallback, useTransition, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getSiteProfileDataAction,
  updateSite,
  deleteSite,
  addMaterialPurchase,
  updateMaterialPurchase,
  deleteMaterialPurchase,
} from "@/app/dashboard/admin/actions";
import AdminAttendanceManager from "@/components/dashboard/AdminAttendanceManager";

// Helper Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-900"></div>
  </div>
);
const DayTypeLabel = ({ dayType }) => {
  const map = {
    0: "Absent",
    0.5: "Half Day",
    1: "Present",
    1.5: "Present + Half",
    2: "Double Duty",
  };
  return <span className="font-medium">{map[dayType] || "N/A"}</span>;
};
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// EditSiteModal Component
function EditSiteModal({ site, onClose, onUpdateSuccess }) {
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();
  const handleUpdate = async (formData) => {
    startTransition(async () => {
      const result = await updateSite(formData);
      if (result.success) {
        alert(result.success);
        onClose();
        onUpdateSuccess();
      } else {
        setMessage(result);
        setTimeout(() => setMessage(null), 4000);
      }
    });
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h4 className="text-lg font-bold mb-4">Edit Site</h4>
        <form action={handleUpdate} className="space-y-4">
          <input type="hidden" name="siteId" value={site.id} />
          <div>
            <label className="block text-sm font-medium">Site Name</label>
            <input
              name="siteName"
              defaultValue={site.name}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              name="siteLocation"
              defaultValue={site.location}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          {message && (
            <p
              className={`text-sm ${
                message.error ? "text-red-600" : "text-green-600"
              }`}
            >
              {message.error || message.success}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-slate-800 text-white px-4 py-2 rounded-md"
            >
              Update Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MaterialPurchaseForm Component
function MaterialPurchaseForm({ siteId, onActionSuccess }) {
  const formRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = async (formData) => {
    startTransition(async () => {
      const result = await addMaterialPurchase(formData);
      if (result.success) {
        alert(result.success);
        formRef.current?.reset();
        onActionSuccess();
      } else {
        setMessage(result);
        setTimeout(() => setMessage(null), 4000);
      }
    });
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Log a Material Purchase</h2>
      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <input type="hidden" name="site_id" value={siteId} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">
              Item/Material Name
            </label>
            <input
              name="item_name"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Vendor Name
            </label>
            <input
              name="vendor_name"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount (₹)</label>
            <input
              name="amount"
              type="number"
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Purchase Date
            </label>
            <input
              name="purchase_date"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-slate-800 text-white px-6 py-2 rounded-md font-semibold"
          >
            {isPending ? "Logging..." : "Log Purchase"}
          </button>
          {message && (
            <p
              className={`inline-block ml-4 text-sm ${
                message.error ? "text-red-600" : "text-green-600"
              }`}
            >
              {message.error || message.success}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

// EditMaterialModal Component
function EditMaterialModal({ purchase, onClose, siteId, onUpdateSuccess }) {
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();
  const handleUpdate = async (formData) => {
    formData.append("siteId", siteId);
    startTransition(async () => {
      const result = await updateMaterialPurchase(formData);
      if (result.success) {
        alert(result.success);
        onClose();
        onUpdateSuccess();
      } else {
        setMessage(result);
        setTimeout(() => setMessage(null), 4000);
      }
    });
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h4 className="text-lg font-bold mb-4">Edit Material Purchase</h4>
        <form action={handleUpdate} className="space-y-4">
          <input type="hidden" name="purchase_id" value={purchase.id} />
          <div>
            <label className="block text-sm font-medium">Item Name</label>
            <input
              name="item_name"
              defaultValue={purchase.item_name}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Vendor Name</label>
            <input
              name="vendor_name"
              defaultValue={purchase.vendor_name}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Amount (₹)</label>
            <input
              name="amount"
              type="number"
              defaultValue={purchase.amount}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Purchase Date</label>
            <input
              name="purchase_date"
              type="date"
              defaultValue={purchase.purchase_date}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          {message && (
            <p
              className={`text-sm ${
                message.error ? "text-red-600" : "text-green-600"
              }`}
            >
              {message.error}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-slate-800 text-white px-4 py-2 rounded-md"
            >
              {isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MUKHYA PAGE COMPONENT
export default function SiteProfilePage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.siteId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [isPending, startTransition] = useTransition();

  const fetchSiteData = useCallback(async () => {
    if (siteId) {
      const result = await getSiteProfileDataAction(siteId);
      if (result.error) {
        setError(result.error);
      } else {
        setSiteData(result.data);
      }
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  const onActionSuccess = () => fetchSiteData();

  const handleSiteDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this site? This action cannot be undone."
      )
    ) {
      startTransition(async () => {
        const result = await deleteSite(siteId);
        if (result.error) {
          alert("Error: " + result.error);
        } else {
          alert(result.success);
          router.push("/dashboard/admin");
        }
      });
    }
  };

  const handlePurchaseDelete = (purchaseId) => {
    if (confirm("Are you sure you want to delete this purchase record?")) {
      startTransition(async () => {
        const result = await deleteMaterialPurchase(purchaseId, site.id);
        if (result.error) alert("Error: " + result.error);
        else {
          alert(result.success);
          onActionSuccess();
        }
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;
  if (!siteData) return <p className="p-4">Site data not found.</p>;

  const {
    site,
    supervisor,
    activeLabors,
    attendanceHistory,
    materialHistory,
    laborPayments,
  } = siteData;
  const totalMaterialCost = materialHistory.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );
  const laborsForAttendance = activeLabors
    .map((assignment) => assignment.labors)
    .filter(Boolean);

  return (
    <>
      {isEditing && (
        <EditSiteModal
          site={site}
          onClose={() => setIsEditing(false)}
          onUpdateSuccess={onActionSuccess}
        />
      )}
      {editingPurchase && (
        <EditMaterialModal
          purchase={editingPurchase}
          onClose={() => setEditingPurchase(null)}
          siteId={site.id}
          onUpdateSuccess={onActionSuccess}
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{site.name}</h1>
              <p className="text-gray-600">
                {site.location || "No location provided"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Created on: {formatDate(site.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isPending}
                className="bg-blue-600 text-white px-3 py-2 text-sm rounded-md"
              >
                Edit
              </button>
              <button
                onClick={handleSiteDelete}
                disabled={isPending}
                className="bg-red-600 text-white px-3 py-2 text-sm rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <MaterialPurchaseForm
          siteId={site.id}
          onActionSuccess={onActionSuccess}
        />
        <AdminAttendanceManager
          site={site}
          activeLabors={laborsForAttendance}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Assigned Supervisor</h2>
              {supervisor ? (
                <div>
                  <Link
                    href={`/dashboard/admin/supervisors/${supervisor.id}`}
                    className="font-semibold text-lg text-blue-700 hover:underline"
                  >
                    {supervisor.full_name}
                  </Link>
                  <p className="text-sm text-gray-500">{supervisor.email}</p>
                </div>
              ) : (
                <p className="text-gray-500">
                  No supervisor assigned to this site.
                </p>
              )}
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Active Labors ({activeLabors.length})
              </h2>
              <ul className="space-y-3 max-h-96 overflow-y-auto">
                {activeLabors.length > 0 ? (
                  activeLabors.map((assignment) => {
                    const labor = assignment.labors;
                    if (!labor) return null;
                    return (
                      <li
                        key={assignment.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                      >
                        <div>
                          <Link
                            href={`/dashboard/admin/labors/${labor.id}`}
                            className="font-semibold text-blue-700 hover:underline"
                          >
                            {labor.full_name}
                          </Link>
                          <p className="text-sm text-gray-600">
                            {labor.work_type}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          ₹{labor.per_day_rate}/day
                        </p>
                      </li>
                    );
                  })
                ) : (
                  <p className="text-gray-500">
                    No labors are currently active.
                  </p>
                )}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            {/* === YEH HAI NAYA LABOR PAYMENTS TIMELINE CARD === */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Labor Payments on this Site
              </h2>
              <div className="max-h-[30rem] overflow-y-auto pr-2 pl-3">
                {(() => {
                  // Check agar payments hain ya nahi
                  if (!siteData.payments || siteData.payments.length === 0) {
                    return (
                      <p className="text-center text-gray-500 p-4">
                        No payments have been logged for this site yet.
                      </p>
                    );
                  }

                  // Data ko date ke hisaab se group karein
                  const groupedByDate = siteData.payments.reduce(
                    (acc, entry) => {
                      const date = entry.date.split("T")[0];
                      (acc[date] = acc[date] || []).unshift(entry); // unshift() se nayi entry upar aayegi
                      return acc;
                    },
                    {}
                  );

                  const sortedDates = Object.keys(groupedByDate).sort(
                    (a, b) => new Date(b) - new Date(a)
                  );

                  return (
                    <ul className="relative border-l border-gray-200 pl-2">
                      {sortedDates.map((date) => (
                        <li key={date} className="mb-6 ml-6">
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                            <svg
                              className="w-3 h-3 text-green-700"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 0h-4.5M3.75 18h14.25a1.125 1.125 0 001.125-1.125V6.375a1.125 1.125 0 00-1.125-1.125H3.75A1.125 1.125 0 002.625 6.375v10.5A1.125 1.125 0 003.75 18z"
                              />
                            </svg>
                          </span>
                          <h4 className="flex items-center mb-1 text-base font-semibold text-gray-900">
                            {new Date(date + "T00:00:00").toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "long", year: "numeric" }
                            )}
                          </h4>
                          <div className="mt-2 space-y-4">
                            {groupedByDate[date].map((entry) => (
                              <div
                                key={entry.id}
                                className="pb-3 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex justify-between items-start text-sm mb-1">
                                  <Link
                                    href={`/dashboard/admin/labors/${entry.labors.id}`}
                                    className="font-medium text-blue-700 hover:underline"
                                  >
                                    {entry.labors.full_name}
                                  </Link>
                                  <p className="font-bold text-base text-right text-green-600">
                                    ₹
                                    {Number(entry.amount).toLocaleString(
                                      "en-IN"
                                    )}
                                  </p>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                  <span>
                                    Mode:{" "}
                                    <span className="font-semibold">
                                      {entry.payment_mode || "N/A"}
                                    </span>
                                  </span>
                                  <span>
                                    Paid by:{" "}
                                    {entry.profiles?.full_name || "Admin"}
                                  </span>
                                </div>
                                {entry.remarks && (
                                  <div className="mt-2 text-xs italic bg-yellow-50 text-yellow-800 p-2 rounded-md">
                                    "{entry.remarks}"
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
            {/* === YEH HAI NAYA SITE ATTENDANCE HISTORY TIMELINE === */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Site Attendance History
              </h2>
              <div className="max-h-[30rem] overflow-y-auto pr-2 pl-3">
                {(() => {
                  // Helper component to show status with color
                  const StatusBadge = ({ dayType }) => {
                    const styles = {
                      0: { text: "Absent", color: "text-red-600" },
                      0.5: { text: "Half Day", color: "text-yellow-600" },
                      1: { text: "Present", color: "text-green-600" },
                      1.5: { text: "P + Half", color: "text-teal-600" },
                      2: { text: "Double", color: "text-indigo-600" },
                    };
                    const style = styles[dayType] || {
                      text: "N/A",
                      color: "text-gray-500",
                    };
                    return (
                      <span className={`font-bold ${style.color}`}>
                        {style.text}
                      </span>
                    );
                  };

                  if (!attendanceHistory || attendanceHistory.length === 0) {
                    return (
                      <p className="text-center text-gray-500 p-4">
                        No attendance records found.
                      </p>
                    );
                  }

                  const groupedByDate = attendanceHistory.reduce(
                    (acc, entry) => {
                      const date = entry.date.split("T")[0];
                      (acc[date] = acc[date] || []).unshift(entry);
                      return acc;
                    },
                    {}
                  );

                  const sortedDates = Object.keys(groupedByDate).sort(
                    (a, b) => new Date(b) - new Date(a)
                  );

                  return (
                    <ul className="relative border-l border-gray-200">
                      {sortedDates.map((date) => (
                        <li key={date} className="mb-6 ml-6">
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                            <svg
                              className="w-3 h-3 text-blue-700"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18"
                              />
                            </svg>
                          </span>
                          <h4 className="flex items-center mb-1 text-base font-semibold text-gray-900">
                            {new Date(date + "T00:00:00").toLocaleDateString(
                              "en-IN",
                              { day: "numeric", month: "long", year: "numeric" }
                            )}
                          </h4>
                          <div className="mt-2 space-y-3">
                            {groupedByDate[date].map((entry) => (
                              <div
                                key={entry.id}
                                className="flex justify-between items-center text-sm"
                              >
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {entry.labors?.full_name || "N/A"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    by {entry.marker?.full_name || "Admin"}
                                  </p>
                                </div>
                                <StatusBadge dayType={entry.day_type} />
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
          </div>
        </div>

        {/* === YEH HAI NAYA MATERIAL PURCHASE HISTORY TIMELINE === */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Material Purchase History</h2>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Material Cost</p>
              <p className="text-2xl font-bold text-orange-600">
                ₹{totalMaterialCost.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <div className="max-h-[30rem] overflow-y-auto pr-2 pl-3">
            {(() => {
              if (!materialHistory || materialHistory.length === 0) {
                return (
                  <p className="text-center text-gray-500 p-4">
                    No material purchases have been logged.
                  </p>
                );
              }

              const groupedByDate = materialHistory.reduce((acc, entry) => {
                const date = entry.purchase_date.split("T")[0];
                (acc[date] = acc[date] || []).unshift(entry);
                return acc;
              }, {});

              const sortedDates = Object.keys(groupedByDate).sort(
                (a, b) => new Date(b) - new Date(a)
              );

              return (
                <ul className="relative border-l border-gray-200">
                  {sortedDates.map((date) => (
                    <li key={date} className="mb-6 ml-6">
                      <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white">
                        <svg
                          className="w-3 h-3 text-orange-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                          />
                        </svg>
                      </span>
                      <h4 className="flex items-center mb-1 text-base font-semibold text-gray-900">
                        {new Date(date + "T00:00:00").toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </h4>
                      <div className="mt-2 space-y-4">
                        {groupedByDate[date].map((entry) => (
                          <div
                            key={entry.id}
                            className="pb-3 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex justify-between items-start text-sm mb-1">
                              <p className="font-medium text-gray-800">
                                {entry.item_name}
                              </p>
                              <p className="font-bold text-base text-right text-orange-600">
                                ₹{Number(entry.amount).toLocaleString("en-IN")}
                              </p>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              {entry.vendor_name ? (
                                <span>
                                  Vendor:{" "}
                                  <span className="font-semibold">
                                    {entry.vendor_name}
                                  </span>
                                </span>
                              ) : (
                                <span />
                              )}
                              <span>
                                by: {entry.purchaser?.full_name || "Admin"}
                              </span>
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={() => setEditingPurchase(entry)}
                                className="text-blue-600 hover:underline text-xs font-semibold"
                                disabled={isPending}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handlePurchaseDelete(entry.id)}
                                className="text-red-600 hover:underline text-xs font-semibold"
                                disabled={isPending}
                              >
                                Delete
                              </button>
                            </div>
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
      </div>
    </>
  );
}
