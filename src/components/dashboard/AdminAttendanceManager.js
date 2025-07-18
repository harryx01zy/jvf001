'use client';

import { useEffect, useState, useTransition } from "react";
import { getAttendanceForDate, submitAttendanceByAdmin } from "@/app/dashboard/admin/actions";

// YEH FINAL AUR WORKING COMPONENT HAI
export default function AdminAttendanceManager({ site, activeLabors }) {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [attendance, setAttendance] = useState({});
    const [message, setMessage] = useState(null);
    const [isFetching, startFetching] = useTransition();
    const [isSubmitting, startSubmitting] = useTransition();

    // Sahi labors (jinki ID hai) ki list
    const validLabors = activeLabors.filter(labor => labor && labor.id);

    useEffect(() => {
        if (validLabors.length === 0) {
            setAttendance({});
            return;
        };

        startFetching(async () => {
            const result = await getAttendanceForDate(site.id, selectedDate);
            const newAttendanceState = {};
            validLabors.forEach(labor => {
                newAttendanceState[labor.id] = result.data?.[labor.id] ?? 0;
            });
            setAttendance(newAttendanceState);
        });
    }, [selectedDate, site.id, activeLabors]); // activeLabors ko dependency rakha hai

    const handleAttendanceChange = (laborId, dayType) => {
        setAttendance(prevState => ({
            ...prevState,
            [laborId]: parseFloat(dayType)
        }));
    };
    
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setMessage(null);

        // Server action ke liye ek saaf object banayein
        const submissionData = {
            siteId: site.id,
            attendanceDate: selectedDate,
            attendance: attendance, // Poora attendance state bhej dein
        };
        
        startSubmitting(async () => {
            const result = await submitAttendanceByAdmin(submissionData);
            setMessage(result);
            if (result.success) {
                window.location.reload(); 
                //alert(result.success);
            }
            setTimeout(() => setMessage(null), 5000);
        });
    };
    
    if (!validLabors || validLabors.length === 0) {
        return (
             <div className="p-6 bg-white rounded-lg shadow-md mt-8">
                <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
                <p className="text-gray-500">No active labors on this site to mark attendance for.</p>
            </div>
        );
    }
    
    return (
        <div className="p-6 bg-white rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>

            <form onSubmit={handleFormSubmit}>
                <div className="mb-6">
                    <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                    <input 
                        type="date" 
                        id="date-picker"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                        disabled={isFetching || isSubmitting}
                    />
                </div>
                
                {isFetching ? (
                    <div className="text-center p-8">
                        <p className="text-gray-500">Loading attendance data...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {validLabors.map((labor) => (
                            <div key={labor.id} className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 border rounded-md items-center bg-white">
                                <div className="col-span-2 md:col-span-1 font-semibold">{labor.full_name}</div>
                                <div className="col-span-2 md:col-span-3">
                                    <fieldset className="flex flex-wrap gap-3">
                                        {[
                                            { label: 'Absent', value: 0, peer: 'absent', style: 'peer-checked/absent:bg-red-500 peer-checked/absent:text-white peer-checked/absent:border-red-500' },
                                            { label: 'Half (1/2)', value: 0.5, peer: 'half', style: 'peer-checked/half:bg-yellow-500 peer-checked/half:text-white peer-checked/half:border-yellow-500' },
                                            { label: 'Full (P)', value: 1, peer: 'full', style: 'peer-checked/full:bg-green-500 peer-checked/full:text-white peer-checked/full:border-green-500' },
                                            { label: 'Full+Half', value: 1.5, peer: 'onehalf', style: 'peer-checked/onehalf:bg-teal-500 peer-checked/onehalf:text-white peer-checked/onehalf:border-teal-500' },
                                            { label: 'Double', value: 2, peer: 'double', style: 'peer-checked/double:bg-indigo-500 peer-checked/double:text-white peer-checked/double:border-indigo-500' }
                                        ].map(opt => (
                                            <div key={`opt-${labor.id}-${opt.value}`}>
                                                <input 
                                                    type="radio" 
                                                    id={`att-${labor.id}-${opt.peer}`} 
                                                    name={`attendance-${labor.id}`} 
                                                    value={opt.value} 
                                                    checked={attendance[labor.id] === opt.value}
                                                    onChange={() => handleAttendanceChange(labor.id, opt.value)}
                                                    className={`hidden peer/${opt.peer}`}
                                                />
                                                {/* ## FIX: Ab className backticks (``) ka istemal kar raha hai aur style sahi hai ## */}
                                                <label 
                                                    htmlFor={`att-${labor.id}-${opt.peer}`} 
                                                    className={`cursor-pointer px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${opt.style}`}
                                                >
                                                    {opt.label}
                                                </label>
                                            </div>
                                        ))}
                                    </fieldset>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="mt-6">
                    <button type="submit" disabled={isSubmitting || isFetching} className="w-full sm:w-auto bg-slate-800 text-white font-bold py-3 px-8 rounded-lg disabled:bg-slate-400">
                        {isSubmitting ? 'Submitting...' : (isFetching ? 'Loading...' : 'Submit Attendance')}
                    </button>
                    {message && <p className={`mt-3 text-sm font-medium ${message.error ? 'text-red-600' : 'text-green-600'}`}>{message.error || message.success}</p>}
                </div>
            </form>
        </div>
    );
}