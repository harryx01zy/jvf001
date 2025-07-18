// src/lib/reportGenerator.js

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper functions (Inmein koi badlaav nahi)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
const dayTypeMap = { 0: "Absent", 0.5: "Half", 1: "Full", 1.5: "P + Half", 2: "Double" };
const addHeader = (doc, title, subtitle1 = '', subtitle2 = '') => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("JVF", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(title, 14, 32);
    doc.setFontSize(10);
    if (subtitle1) doc.text(subtitle1, 14, 40);
    if (subtitle2) doc.text(subtitle2, 120, 40);
    doc.line(14, 44, 196, 44);
};

// Puraane sabhi PDF generators waise hi rahenge...

// 1. Comprehensive Site Report
export function generateSiteReportPDF(reportData) {
    const doc = new jsPDF();
    const { site, supervisorName, reportDateRange, attendance, payments, materials } = reportData;
    addHeader(doc, "Comprehensive Site Report", `Site: ${site.name}`, `Range: ${formatDate(reportDateRange.from)} to ${formatDate(reportDateRange.to)}`);
    let yPos = 52;

    if (attendance.length > 0) {
        doc.setFontSize(14);
        doc.text("Attendance Report", 14, yPos);
        autoTable(doc, {
            startY: yPos + 2,
            head: [['Date', 'Labor Name', 'Status', 'Marked By']],
            body: attendance.map(att => [
                formatDate(att.date),
                att.labors?.full_name || 'N/A',
                dayTypeMap[att.day_type] || 'N/A',
                att.marker?.full_name || 'Admin'
            ]),
            theme: 'grid'
        });
        yPos = doc.lastAutoTable.finalY + 10;
    }
    
    if (payments.length > 0) {
        const totalPayments = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        doc.setFontSize(14); doc.text("Payments Report", 14, yPos);
        autoTable(doc, {
            startY: yPos + 2,
            head: [['Date', 'Labor', 'Amount (Rs)', 'Paid By']],
            body: payments.map(p => [formatDate(p.date), p.labors?.full_name, Number(p.amount).toLocaleString('en-IN'), p.paid_by?.full_name]),
            foot: [['Total', '', `Rs ${totalPayments.toLocaleString('en-IN')}`, '']],
            footStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
            theme: 'grid'
        });
        yPos = doc.lastAutoTable.finalY + 10;
    }
    
    if (materials.length > 0) {
        const totalMaterials = materials.reduce((sum, m) => sum + Number(m.amount), 0);
        doc.setFontSize(14); doc.text("Material Purchase Report", 14, yPos);
        autoTable(doc, {
            startY: yPos + 2,
            head: [['Date', 'Item', 'Amount (Rs)', 'Purchased By']],
            body: materials.map(m => [formatDate(m.purchase_date), m.item_name, Number(m.amount).toLocaleString('en-IN'), m.purchaser?.full_name]),
            foot: [['Total', '', `Rs ${totalMaterials.toLocaleString('en-IN')}`, '']],
            footStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
            theme: 'grid'
        });
    }

    doc.save(`Site_Report_${site.name}_${reportDateRange.from}.pdf`);
}

// 2. Payments Only Report
export function generatePaymentsPDF(paymentsData, siteName, dateRange) {
    const doc = new jsPDF();
    const totalPayments = paymentsData.reduce((sum, p) => sum + Number(p.amount), 0);
    addHeader(doc, "Site Payments Report", `Site: ${siteName}`, `Range: ${formatDate(dateRange.from)} to ${formatDate(dateRange.to)}`);
    autoTable(doc, {
        startY: 52,
        head: [['Date', 'Labor Name', 'Amount (Rs)', 'Mode', 'Paid By']],
        body: paymentsData.map(p => [formatDate(p.date), p.labors?.full_name || 'N/A', Number(p.amount).toLocaleString('en-IN'), p.payment_mode || '-', p.paid_by?.full_name || 'Admin']),
        foot: [['Total', '', `Rs ${totalPayments.toLocaleString('en-IN')}`, '', '']],
        footStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
        theme: 'striped', headStyles: { fillColor: [22, 160, 133] },
    });
    doc.save(`Payments_Report_${siteName}_${dateRange.from}.pdf`);
}

// 3. Materials Only Report
export function generateMaterialsPDF(materialsData, siteName, dateRange) {
    const doc = new jsPDF();
    const totalMaterials = materialsData.reduce((sum, m) => sum + Number(m.amount), 0);
    addHeader(doc, "Site Material Purchase Report", `Site: ${siteName}`, `Range: ${formatDate(dateRange.from)} to ${formatDate(dateRange.to)}`);
    autoTable(doc, {
        startY: 52,
        head: [['Date', 'Item Name', 'Vendor', 'Amount (Rs)', 'Purchased By']],
        body: materialsData.map(m => [formatDate(m.purchase_date), m.item_name, m.vendor_name || '-', Number(m.amount).toLocaleString('en-IN'), m.purchaser?.full_name || 'Admin']),
        foot: [['Total', '', '', `Rs ${totalMaterials.toLocaleString('en-IN')}`, '']],
        footStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
        theme: 'striped', headStyles: { fillColor: [211, 84, 0] },
    });
    doc.save(`Materials_Report_${siteName}_${dateRange.from}.pdf`);
}

// 4. Individual Labor Report (With Total Attendance)
export function generateLaborReportPDF(reportData) {
    const doc = new jsPDF();
    const { labor, attendance, payments, assignments } = reportData;

    // Kul payment aur attendance ka hisaab
    const totalPayments = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    // ===== YAHI HAI ASLI BADLAAV =====
    const totalDaysWorked = attendance.reduce((sum, a) => sum + Number(a.day_type || 0), 0);

    // Header
    addHeader(
        doc, 
        `Labor Report: ${labor.full_name}`, 
        `Work: ${labor.work_type}`, 
        `Rate: Rs ${labor.per_day_rate}/day`
    );

    let yPos = 52; // Vertical position start

    // Attendance History Table
    if (attendance.length > 0) {
        doc.setFontSize(14);
        doc.text("Attendance History", 14, yPos);
        autoTable(doc, {
            startY: yPos + 2,
            head: [['Date', 'Site', 'Status']],
            body: attendance.map(a => [
                formatDate(a.date), 
                a.sites?.name || 'N/A', 
                dayTypeMap[a.day_type] || 'N/A'
            ]),
            // ===== NAYA FOOTER ADD KIYA GAYA HAI =====
            foot: [['Total Days Worked', '', `${totalDaysWorked} Days`]],
            footStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
            theme: 'grid'
        });
        yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Payment History Table
    if (payments.length > 0) {
        doc.setFontSize(14);
        doc.text("Payment History", 14, yPos);
        autoTable(doc, {
            startY: yPos + 2,
            head: [['Date', 'Site', 'Amount (Rs)', 'Paid By']],
            body: payments.map(p => [
                formatDate(p.date), 
                p.sites?.name || 'N/A', 
                Number(p.amount).toLocaleString('en-IN'), 
                p.paid_by?.full_name || 'Admin'
            ]),
            foot: [['Total', '', `Rs ${totalPayments.toLocaleString('en-IN')}`, '']],
            footStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
            theme: 'grid'
        });
        yPos = doc.lastAutoTable.finalY + 10;
    }
    
    // Site Assignment History Table
    if (assignments.length > 0) {
        doc.setFontSize(14);
        doc.text("Site Assignment History", 14, yPos);
        autoTable(doc, {
            startY: yPos + 2,
            head: [['From Date', 'To Date', 'Site Name']],
            body: assignments.map(a => [
                formatDate(a.from_date), 
                a.to_date ? formatDate(a.to_date) : 'Present', 
                a.sites?.name || 'N/A'
            ]),
            theme: 'grid'
        });
    }

    doc.save(`Labor_Report_${labor.full_name.replace(/ /g, '_')}.pdf`);
}

// 5. Individual Supervisor Report
export function generateSupervisorReportPDF(reportData) {
    const doc = new jsPDF();
    const { supervisor, markedAttendance, loggedPayments, loggedMaterials } = reportData;
    const totalPayments = loggedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalMaterials = loggedMaterials.reduce((sum, m) => sum + Number(m.amount), 0);
    addHeader(doc, `Supervisor Activity Report`, `Name: ${supervisor.full_name}`);
    let yPos = 52;

    if (markedAttendance.length > 0) {
        doc.setFontSize(14); doc.text("Attendance Marked", 14, yPos);
        autoTable(doc, { startY: yPos + 2, head: [['Date', 'Site', 'Labor', 'Status']], body: markedAttendance.map(a => [formatDate(a.date), a.sites?.name || 'N/A', a.labors?.full_name || 'N/A', dayTypeMap[a.day_type] || 'N/A']), theme: 'grid' });
        yPos = doc.lastAutoTable.finalY + 10;
    }
    
    if (loggedPayments.length > 0) {
        doc.setFontSize(14); doc.text("Payments Logged", 14, yPos);
        autoTable(doc, {
            startY: yPos + 2,
            head: [['Date', 'Site', 'Labor', 'Amount (Rs)']],
            body: loggedPayments.map(p => [formatDate(p.date), p.sites?.name || 'N/A', p.labors?.full_name || 'N/A', Number(p.amount).toLocaleString('en-IN')]),
            foot: [['Total', '', '', `Rs ${totalPayments.toLocaleString('en-IN')}`]],
            footStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
            theme: 'grid'
        });
        yPos = doc.lastAutoTable.finalY + 10;
    }
    
    if (loggedMaterials.length > 0) {
        doc.setFontSize(14); doc.text("Materials Purchased", 14, yPos);
        autoTable(doc, {
            startY: yPos + 2,
            head: [['Date', 'Site', 'Item', 'Amount (Rs)']],
            body: loggedMaterials.map(m => [formatDate(m.purchase_date), m.sites?.name || 'N/A', m.item_name, Number(m.amount).toLocaleString('en-IN')]),
            foot: [['Total', '', '', `Rs ${totalMaterials.toLocaleString('en-IN')}`]],
            footStyles: { fillColor: [230, 230, 230], textColor: 0, fontStyle: 'bold' },
            theme: 'grid'
        });
    }

    doc.save(`Supervisor_Report_${supervisor.full_name.replace(/ /g, '_')}.pdf`);
}