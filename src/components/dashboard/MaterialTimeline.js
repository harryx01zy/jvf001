// src/components/dashboard/MaterialTimeline.js
'use client';

// Function to format the date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Use a robust date parsing to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
export default function MaterialTimeline({ history, title = "Site Material History" }) {
    
    if (!history || history.length === 0) {
        return (
            <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-4 text-gray-500">No material records found for this site.</p>
            </div>
        );
    }

    // Group data by date
    const groupedByDate = history.reduce((acc, entry) => {
        const entryDate = entry.purchase_date.split('T')[0];
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
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-orange-100 rounded-full -left-3 ring-8 ring-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-orange-800" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </span>
                            <h4 className="flex items-center mb-1 text-base font-semibold text-gray-900">
                                {formatDate(date)}
                            </h4>
                            
                            <ul className="mt-2 space-y-2">
                                {groupedByDate[date].map(entry => (
                                    <li key={entry.id} className="flex justify-between items-start text-sm">
                                        <div>
                                            <p className="font-medium text-gray-800">{entry.item_name}</p>
                                            
                                            {/* === YAHI HAI FINAL FIX === */}
                                            {/* Hum check kar rahe hain ki vendor_name hai ya nahi, fir usse dikha rahe hain */}
                                            {entry.vendor_name && <p className="text-xs text-gray-500">Vendor: {entry.vendor_name}</p>}
                                            
                                            <p className="text-xs text-gray-500">by {entry.purchaser?.full_name || 'Admin'}</p>
                                        </div>
                                        <p className="font-bold text-orange-600">
                                           ₹{Number(entry.amount).toLocaleString('en-IN')}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}