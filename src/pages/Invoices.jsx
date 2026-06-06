import React, { useState } from 'react';
import { Download, Printer, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

const MOCK_INVOICES = [
  {
    id: 'INV-2025-001',
    poNumber: 'PO-2025-0068',
    vendorName: 'Infra Supplies Pvt Ltd',
    vendorAddress: '456, Industrial Estate, Surat\nGSTIN: 24AAAAA0000A1Z5',
    orgName: 'VendorBridge Corp',
    orgAddress: '123 Business Park, Ahmedabad\nGSTIN: 24BBBBB1111B2Z6',
    date: '22 May 2025',
    dueDate: '21 Jun 2025',
    poDate: '21 May 2025',
    items: [
      { name: 'Ergonomic Chair', qty: 25, price: 3800, total: 95000 },
      { name: 'Standing Desk', qty: 10, price: 12000, total: 120000 }
    ],
    status: 'Pending Payment', // Pending Payment, Paid
  }
];

const Invoices = () => {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [activeInvoice, setActiveInvoice] = useState(MOCK_INVOICES[0]);

  // Calculations
  const subtotal = activeInvoice.items.reduce((acc, item) => acc + item.total, 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const grandTotal = subtotal + cgst + sgst;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(74, 122, 104); // Primary color
    doc.text('VendorBridge', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Purchase Order & Invoice', 14, 30);
    
    // Invoice Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Invoice #: ${activeInvoice.id}`, 140, 22);
    doc.setFontSize(10);
    doc.text(`Date: ${activeInvoice.date}`, 140, 28);
    doc.text(`Due Date: ${activeInvoice.dueDate}`, 140, 34);
    
    // Bill To & Vendor
    doc.setFontSize(11);
    doc.text('Bill To:', 14, 50);
    doc.text('Vendor:', 100, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(80);
    const splitBillTo = doc.splitTextToSize(`${activeInvoice.orgName}\n${activeInvoice.orgAddress}`, 80);
    doc.text(splitBillTo, 14, 56);
    
    const splitVendor = doc.splitTextToSize(`${activeInvoice.vendorName}\n${activeInvoice.vendorAddress}`, 80);
    doc.text(splitVendor, 100, 56);

    // PO Details
    doc.text(`PO Number: ${activeInvoice.poNumber}`, 14, 80);
    doc.text(`PO Date: ${activeInvoice.poDate}`, 100, 80);

    // Table
    const tableBody = activeInvoice.items.map(item => [
      item.name, 
      item.qty.toString(), 
      item.price.toLocaleString('en-IN'), 
      item.total.toLocaleString('en-IN')
    ]);

    doc.autoTable({
      startY: 90,
      head: [['Item Description', 'Qty', 'Unit Price (INR)', 'Total (INR)']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [90, 143, 123] }, // primary color
      styles: { fontSize: 9 },
      columnStyles: { 
        0: { cellWidth: 80 },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
      }
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text('Subtotal:', 140, finalY);
    doc.text(`${subtotal.toLocaleString('en-IN')}`, 180, finalY, { align: 'right' });
    
    doc.text('CGST (9%):', 140, finalY + 6);
    doc.text(`${cgst.toLocaleString('en-IN')}`, 180, finalY + 6, { align: 'right' });
    
    doc.text('SGST (9%):', 140, finalY + 12);
    doc.text(`${sgst.toLocaleString('en-IN')}`, 180, finalY + 12, { align: 'right' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Grand Total:', 140, finalY + 20);
    doc.text(`${grandTotal.toLocaleString('en-IN')}`, 180, finalY + 20, { align: 'right' });

    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text('This is a computer generated invoice and does not require a physical signature.', 14, 280);

    doc.save(`${activeInvoice.id}.pdf`);
    toast.success('Invoice downloaded successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    console.log(`Sending email to vendor ${activeInvoice.vendorName} with attachment ${activeInvoice.id}.pdf`);
    toast.success(`Invoice sent to ${activeInvoice.vendorName}`);
  };

  const handleMarkPaid = () => {
    setActiveInvoice(prev => ({ ...prev, status: 'Paid' }));
    setInvoices(invoices.map(inv => inv.id === activeInvoice.id ? { ...inv, status: 'Paid' } : inv));
    toast.success('Invoice marked as paid');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 print:p-0 print:m-0 print:space-y-0">
      
      {/* Header (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Orders & Invoices</h1>
          <p className="text-gray-500 dark:text-gray-400">View POs and generate vendor invoices</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Download size={16} /> Download PDF
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Printer size={16} /> Print
          </button>
          <button 
            onClick={handleSendEmail}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium shadow-sm"
          >
            <Mail size={16} /> Send Email
          </button>
        </div>
      </div>

      {/* Invoice Document (Printable Area) */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden print:shadow-none print:border-none print:rounded-none">
        <div className="p-8 sm:p-12">
          
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary-dark dark:text-primary mb-1">VendorBridge</h2>
              <p className="text-gray-500 text-sm">Purchase Order & Invoice</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-gray-500 text-sm">Invoice Number</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{activeInvoice.id}</p>
              <div className="pt-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium print:hidden ${
                  activeInvoice.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {activeInvoice.status === 'Paid' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {activeInvoice.status}
                </span>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">{activeInvoice.orgName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{activeInvoice.orgAddress}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Vendor</p>
              <p className="font-semibold text-gray-900 dark:text-white mb-1">{activeInvoice.vendorName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{activeInvoice.vendorAddress}</p>
            </div>
          </div>

          {/* PO Info */}
          <div className="flex flex-wrap gap-x-12 gap-y-4 py-6 bg-gray-50/50 dark:bg-gray-800/30 px-6 rounded-lg my-6 print:bg-transparent print:px-0">
            <div>
              <p className="text-xs text-gray-500 mb-1">PO Number</p>
              <p className="font-medium text-gray-900 dark:text-white">{activeInvoice.poNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">PO Date</p>
              <p className="font-medium text-gray-900 dark:text-white">{activeInvoice.poDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Invoice Date</p>
              <p className="font-medium text-gray-900 dark:text-white">{activeInvoice.date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Due Date</p>
              <p className="font-medium text-gray-900 dark:text-white">{activeInvoice.dueDate}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mt-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 dark:border-gray-800">
                  <th className="py-3 text-sm font-semibold text-gray-900 dark:text-white">Item Description</th>
                  <th className="py-3 text-sm font-semibold text-gray-900 dark:text-white text-center">Qty</th>
                  <th className="py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">Unit Price</th>
                  <th className="py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {activeInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-4 text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                    <td className="py-4 text-sm text-gray-700 dark:text-gray-300 text-center">{item.qty}</td>
                    <td className="py-4 text-sm text-gray-700 dark:text-gray-300 text-right">₹ {item.price.toLocaleString('en-IN')}</td>
                    <td className="py-4 text-sm text-gray-900 dark:text-white font-medium text-right">₹ {item.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mt-8">
            <div className="w-full sm:w-80 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹ {subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>CGST (9%)</span>
                <span>₹ {cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>SGST (9%)</span>
                <span>₹ {sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-lg text-primary-dark dark:text-primary">
                <span>Grand Total</span>
                <span>₹ {grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center print:hidden">
            <p className="text-xs text-gray-400">Computer generated document</p>
            {activeInvoice.status === 'Pending Payment' && (
              <button 
                onClick={handleMarkPaid}
                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
              >
                Mark as Paid
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Invoices;
