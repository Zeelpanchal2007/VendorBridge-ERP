import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

const VendorQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyQuotations = async () => {
      try {
        const response = await api.get('/quotations/vendor/me');
        setQuotations(response.data);
      } catch (error) {
        toast.error('Failed to load your quotations');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyQuotations();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Quotations</h1>
          <p className="text-gray-500 dark:text-gray-400">Track the status of the quotes you have submitted</p>
        </div>
        <Link 
          to="/rfqs"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm font-medium whitespace-nowrap"
        >
          <FileSpreadsheet size={18} /> Browse Open RFQs
        </Link>
      </div>

      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-medium">Quote ID</th>
                <th className="px-6 py-4 font-medium">RFQ Ref</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Delivery</th>
                <th className="px-6 py-4 font-medium">Status & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {isLoading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading your quotations...</td></tr>
              ) : quotations.length > 0 ? (
                 quotations.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 dark:text-white">QT-{quote.id}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(quote.submitted_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-primary font-medium">
                      RFQ-{quote.rfq_id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      ${quote.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {quote.delivery_days} Days
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          quote.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {quote.status === 'approved' && <CheckCircle2 size={12} />}
                          {quote.status === 'pending' && <Clock size={12} />}
                          {quote.status === 'rejected' && <AlertCircle size={12} />}
                          {quote.status.toUpperCase()}
                        </span>
                        
                        {/* Display Rejection Note if available */}
                        {quote.status === 'rejected' && quote.approval?.remarks && (
                          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-2 rounded border border-red-100 dark:border-red-900/30 mt-1">
                            <span className="font-bold">Manager Note:</span> {quote.approval.remarks}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <p className="mb-2">You haven't submitted any quotations yet.</p>
                    <Link to="/rfqs" className="text-primary hover:underline font-medium">Browse Open RFQs to start bidding</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorQuotations;
