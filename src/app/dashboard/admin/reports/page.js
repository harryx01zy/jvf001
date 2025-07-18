// src/app/dashboard/admin/reports/page.js
'use client';

import { getAttendanceReport, getComprehensiveSiteReportData, getPaymentsReportData, getMaterialsReportData } from '@/app/dashboard/admin/actions';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState, useTransition } from 'react';
import { generateSiteReportPDF, generatePaymentsPDF, generateMaterialsPDF } from '@/lib/reportGenerator';

async function getSites() {
    const supabase = createClient();
    const { data: sites } = await supabase.from('sites').select('id, name');
    return sites || [];
}

export default function ReportsPage() {
    const [sites, setSites] = useState([]);
    const [filters, setFilters] = useState(null);
    const [error, setError] = useState(null);
    const [isGenerating, startGenerating] = useTransition();

    useEffect(() => { getSites().then(setSites); }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const siteId = formData.get('siteId');
        const fromDate = formData.get('fromDate');
        const toDate = formData.get('toDate');
        if (!siteId || !fromDate || !toDate) {
            alert('Please select site and date range.');
            return;
        }
        const siteName = sites.find(s => s.id == siteId)?.name || 'Site';
        setFilters({ siteId, siteName, fromDate, toDate });
        setError(null);
    };
    
    // Generic function to handle all PDF downloads
    const handleDownload = (reportType) => {
        if (!filters) {
            alert('Please select filters and generate a report first.');
            return;
        }
        
        startGenerating(async () => {
            const { siteId, siteName, fromDate, toDate } = filters;
            let result;

            try {
                switch (reportType) {
                    case 'comprehensive':
                        result = await getComprehensiveSiteReportData(siteId, fromDate, toDate);
                        if (result.data) generateSiteReportPDF(result.data);
                        break;
                    case 'payments':
                        result = await getPaymentsReportData(siteId, fromDate, toDate);
                        if (result.data) generatePaymentsPDF(result.data, siteName, { from: fromDate, to: toDate });
                        break;
                    case 'materials':
                        result = await getMaterialsReportData(siteId, fromDate, toDate);
                        if (result.data) generateMaterialsPDF(result.data, siteName, { from: fromDate, to: toDate });
                        break;
                    default:
                        throw new Error('Invalid report type');
                }
                if (result.error) throw new Error(result.error);
            } catch (err) {
                alert(`Error creating PDF: ${err.message}`);
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Site Reports</h2>
                <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div><label className="block text-sm font-medium">Select Site</label><select name="siteId" required className="w-full mt-1 p-2 border rounded-md"><option value="">-- Choose a Site --</option>{sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                    <div><label className="block text-sm font-medium">From Date</label><input type="date" name="fromDate" required className="w-full mt-1 p-2 border rounded-md" /></div>
                    <div><label className="block text-sm font-medium">To Date</label><input type="date" name="toDate" required className="w-full mt-1 p-2 border rounded-md" /></div>
                    <button type="submit" className="bg-slate-800 text-white font-semibold py-2 px-4 rounded-md h-10">Set Filters</button>
                </form>
                 {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
            </div>

            {filters && (
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-bold mb-4">Download Reports for <span className="text-blue-600">{filters.siteName}</span></h3>
                    <p className="text-sm text-gray-500 mb-6">Date Range: {filters.fromDate} to {filters.toDate}</p>
                    <div className="flex flex-wrap gap-4">
                        <button onClick={() => handleDownload('comprehensive')} disabled={isGenerating} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                            {isGenerating ? 'Generating...' : 'Comprehensive Report (PDF)'}
                        </button>
                        <button onClick={() => handleDownload('payments')} disabled={isGenerating} className="bg-green-600 text-white font-semibold py-2 px-5 rounded-md hover:bg-green-700 disabled:bg-green-400">
                            {isGenerating ? 'Generating...' : 'Payments Only (PDF)'}
                        </button>
                        <button onClick={() => handleDownload('materials')} disabled={isGenerating} className="bg-orange-500 text-white font-semibold py-2 px-5 rounded-md hover:bg-orange-600 disabled:bg-orange-300">
                            {isGenerating ? 'Generating...' : 'Materials Only (PDF)'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}