// src/components/dashboard/AttendanceTimeline.js
'use client';

// Yeh component attendance history ko ek saaf-suthre timeline format mein dikhayega.
export default function AttendanceTimeline({ history, title = "Site Attendance History" }) {
    
    // Yahan hum aapke 5 attendance types ke liye icons aur text define kar rahe hain.
    const statusMap = {
        1:    { text: 'Full Day',  icon: <svg className="text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg> },
        0:    { text: 'Absent',    icon: <svg className="text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg> },
        0.5:  { text: 'Half Day',  icon: <svg className="text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"></path></svg> },
        1.5:  { text: 'Full+Half', icon: <svg className="text-teal-500" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6h-2.25a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25h2.25a.75.75 0 000-1.5h-2.25V6z" clipRule="evenodd" /></svg>},
        2:    { text: 'Double',    icon: <svg className="text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM8.25 9.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zm.75 4.5a.75.75 0 01.75-.75h5.25a.75.75 0 010 1.5H9.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>}
    };

    if (!history || history.length === 0) {
        return (
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-4 text-gray-500">No attendance records found.</p>
            </div>
        );
    }

    // Data ko date ke hisaab se group kar rahe hain
    const groupedByDate = history.reduce((acc, entry) => {
        const entryDate = entry.date.split('T')[0]; // Sirf date part use karein
        (acc[entryDate] = acc[entryDate] || []).unshift(entry);
        return acc;
    }, {});

    return (
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            <div className="max-h-96 overflow-y-auto pr-3 pl-4">
                <ul className="relative border-l border-gray-200">
                    {Object.keys(groupedByDate).map(date => (
                        <li key={date} className="mb-6 ml-6">
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                <svg className="w-3 h-3 text-blue-800" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                            </span>
                            <h4 className="flex items-center mb-1 text-base font-semibold text-gray-900">
                                {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </h4>
                            
                            <ul className="mt-2 space-y-2">
                                {groupedByDate[date].map(entry => {
                                    const statusInfo = statusMap[entry.day_type] || { text: 'N/A', icon: '' };
                                    return (
                                        <li key={entry.id} className="flex items-center text-sm">
                                            <span className="w-5 h-5 mr-2">{statusInfo.icon}</span>
                                            <span className="font-medium text-gray-800">{entry.labors?.full_name || 'N/A'}</span>
                                            <span className="ml-2 text-gray-500">({statusInfo.text})</span>
                                            <span className="ml-auto text-xs text-gray-400">by {entry.marker?.full_name || 'Admin'}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}