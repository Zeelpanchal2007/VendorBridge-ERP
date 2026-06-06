import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { FileText, Download } from 'lucide-react';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [pos, setPos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const handleGenerateInvoice = async (poId) => {
    try {
      await api.post(`/invoices/from-po/${poId}`);
      toast.success('Invoice generated successfully');
      const invRes = await api.get('/invoices/');
      setInvoices(invRes.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to generate invoice');
    }
  };

  const downloadPdf = async (invoiceId, invoiceNumber) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF Downloaded');
    } catch (error) {
       toast.error('Failed to download PDF');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading invoices...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Purchase Orders & Invoices</h1>
        <p className="text-gray-500">Manage POs and generate tax invoices</p>
      </div>

      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold mb-4">Pending Purchase Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 uppercase">
                 <th className="px-4 py-3">PO Number</th>
                 <th className="px-4 py-3">Quote ID</th>
                 <th className="px-4 py-3">Total Amount</th>
                 <th className="px-4 py-3 text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
               {pos.map(po => {
                 // Check if invoice already exists for this PO
                 const hasInvoice = invoices.some(i => i.po_id === po.id);
                 return (
                   <tr key={po.id}>
                     <td className="px-4 py-3 font-medium text-primary">{po.po_number}</td>
                     <td className="px-4 py-3">#{po.quotation_id}</td>
                     <td className="px-4 py-3 font-bold">${po.total_amount.toFixed(2)}</td>
                     <td className="px-4 py-3 text-right">
                       {!hasInvoice ? (
                         <button 
                           onClick={() => handleGenerateInvoice(po.id)}
                           className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded text-sm transition-colors"
                         >
                           Generate Invoice
                         </button>
                       ) : (
                         <span className="text-green-500 text-sm font-medium">Invoice Generated</span>
                       )}
                     </td>
                   </tr>
                 )
               })}
               {pos.length === 0 && <tr><td colSpan="4" className="text-center py-4 text-gray-500">No POs found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-lg font-bold mb-4">Generated Invoices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {invoices.map(inv => (
            <div key={inv.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Paid/Generated</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">{inv.invoice_number}</h3>
              <p className="text-sm text-gray-500 mb-4">Amount: ${inv.total_amount.toFixed(2)} (inc. tax)</p>
              
              <button 
                onClick={() => downloadPdf(inv.id, inv.invoice_number)}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 rounded-lg transition-colors text-sm"
              >
                <Download size={16} /> Download PDF
              </button>
            </div>
          ))}
          {invoices.length === 0 && <div className="col-span-3 text-center py-8 text-gray-500">No invoices generated yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
