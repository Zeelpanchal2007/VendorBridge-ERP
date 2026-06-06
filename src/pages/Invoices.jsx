import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { FileText, Download, CheckCircle, CreditCard, Receipt, Building2, Package } from 'lucide-react';
import Modal from '../components/common/Modal';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [pos, setPos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [invRes, poRes] = await Promise.all([
        api.get('/invoices/'),
        api.get('/purchase-orders/')
      ]);
      setInvoices(invRes.data);
      setPos(poRes.data);
    } catch (error) {
      toast.error('Failed to load financial data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (poId, status) => {
    try {
      await api.put(`/purchase-orders/${poId}/status`, { status });
      toast.success(`Purchase order status updated to ${status.replace('_', ' ')}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update PO status');
    }
  };

  const handleProcessPayment = async (poId) => {
    try {
      // Step 1: Mark PO as paid
      await api.put(`/purchase-orders/${poId}/status`, { status: 'paid' });
      // Step 2: Generate Receipt/Invoice
      await api.post(`/invoices/from-po/${poId}`);
      
      toast.success('Payment successful! Receipt generated.');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Payment processing failed');
    }
  };

  const downloadPdf = async (invoiceId, invoiceNumber) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Receipt Downloaded');
    } catch (error) {
       toast.error('Failed to download PDF');
    }
  };

  const viewReceipt = (invoice) => {
    setActiveReceipt(invoice);
    setIsReceiptModalOpen(true);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading procurement financials...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PO Fulfillment & Payments</h1>
        <p className="text-gray-500">Verify vendor work, process payments, and manage receipts</p>
      </div>

      {/* PURCHASE ORDERS TABLE */}
      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <Package size={20} className="text-primary" /> Active Purchase Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 uppercase">
                 <th className="px-4 py-3">PO Number</th>
                 <th className="px-4 py-3">Quote ID</th>
                 <th className="px-4 py-3">Total Amount</th>
                 <th className="px-4 py-3">Status</th>
                 <th className="px-4 py-3 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
               {pos.map(po => {
                 const hasInvoice = invoices.some(i => i.po_id === po.id);
                 return (
                   <tr key={po.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                     <td className="px-4 py-4 font-medium text-primary">{po.po_number}</td>
                     <td className="px-4 py-4 text-gray-600 dark:text-gray-400">#{po.quotation_id}</td>
                     <td className="px-4 py-4 font-bold text-gray-900 dark:text-white">₹{po.total_amount.toFixed(2)}</td>
                     <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          po.status === 'issued' ? 'bg-blue-100 text-blue-700' :
                          po.status === 'work_done' ? 'bg-yellow-100 text-yellow-700 animate-pulse' :
                          po.status === 'payment_initiated' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {po.status === 'issued' ? 'Work Pending' :
                           po.status === 'work_done' ? 'Action Req: Initiate Payment' :
                           po.status === 'payment_initiated' ? 'Action Req: Complete Payment' :
                           'Paid'}
                        </span>
                     </td>
                     <td className="px-4 py-4 text-right">
                       {po.status === 'issued' && (
                         <span className="text-gray-400 text-sm italic">Awaiting Vendor</span>
                       )}
                       {po.status === 'work_done' && (
                         <button 
                           onClick={() => handleUpdateStatus(po.id, 'payment_initiated')}
                           className="inline-flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors font-medium shadow-sm"
                         >
                           <CheckCircle size={16} /> Initiate Payment
                         </button>
                       )}
                       {(po.status === 'payment_initiated' || po.status === 'paid') && !hasInvoice && (
                         <button 
                           onClick={() => handleProcessPayment(po.id)}
                           className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors font-medium shadow-sm"
                         >
                           <CreditCard size={16} /> Process Payment
                         </button>
                       )}
                       {hasInvoice && (
                         <span className="text-green-600 text-sm font-medium flex items-center justify-end gap-1">
                           <CheckCircle size={14} /> Completed
                         </span>
                       )}
                     </td>
                   </tr>
                 )
               })}
               {pos.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-gray-500">No POs found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECEIPTS GRID */}
      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <Receipt size={20} className="text-primary" /> Generated Payment Receipts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map(inv => (
            <div key={inv.id} className="relative group border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-primary/50 transition-all shadow-sm hover:shadow-md bg-white dark:bg-gray-900">
              <div className="absolute top-4 right-4">
                <span className="bg-green-100 text-green-700 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold">Paid</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{inv.invoice_number}</h3>
                  <p className="text-xs text-gray-500">{new Date(inv.generated_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mb-6 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">PO Ref:</span>
                  <span className="font-medium text-gray-900 dark:text-white">#{inv.po_id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Amount:</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{inv.total_amount.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => viewReceipt(inv)}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg transition-colors text-sm font-medium"
              >
                View Full Receipt
              </button>
            </div>
          ))}
          {invoices.length === 0 && <div className="col-span-full text-center py-12 text-gray-500">No receipts generated yet.</div>}
        </div>
      </div>

      {/* PREMIUM RECEIPT MODAL */}
      <Modal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} title="Payment Receipt" maxWidth="max-w-3xl">
        {activeReceipt && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.02] pointer-events-none transform -rotate-12">
              <span className="text-[12rem] font-black">PAID</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-800 pb-8 mb-8 relative">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2.5 rounded-xl">
                  <Building2 size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">VendorBridge</h2>
                  <p className="text-sm text-gray-500 font-medium">Official Payment Receipt</p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">RECEIPT</h3>
                <p className="text-sm text-gray-500 font-mono">{activeReceipt.invoice_number}</p>
                <div className="mt-2 inline-flex bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                  STATUS: PAID IN FULL
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Billed To</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">VendorBridge Procurement</p>
                <p className="text-sm text-gray-500">123 Logistics Blvd</p>
                <p className="text-sm text-gray-500">Supply City, SC 90210</p>
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mr-2">Receipt Date:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{new Date(activeReceipt.generated_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mr-2">PO Reference:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">#{activeReceipt.po_id}</span>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-100 dark:border-gray-800 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Subtotal</span>
                <span className="text-gray-900 dark:text-white font-medium">₹{(activeReceipt.total_amount - activeReceipt.tax_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Estimated Tax</span>
                <span className="text-gray-900 dark:text-white font-medium">₹{activeReceipt.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total Amount Paid</span>
                <span className="text-3xl font-black text-primary">₹{activeReceipt.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer / Download */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-800 relative">
              <p className="text-xs text-gray-400 max-w-sm">
                This receipt is system generated. The funds have been deposited to the vendor's registered bank account.
              </p>
              <button 
                onClick={() => downloadPdf(activeReceipt.id, activeReceipt.invoice_number)}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white px-5 py-2.5 rounded-lg transition-colors text-sm font-bold shadow-md"
              >
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Invoices;
