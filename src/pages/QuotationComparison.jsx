import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import { ArrowLeft, Check, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Timeline from '../components/common/Timeline';

const QuotationComparison = () => {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quotes, setQuotes] = useState([]);
  const [rfq, setRfq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rfqRes = await api.get(`/rfqs/${rfqId}`);
        setRfq(rfqRes.data);
        
        const quoteRes = await api.get(`/quotations/rfq/${rfqId}`);
        setQuotes(quoteRes.data);
      } catch (error) {
        toast.error('Failed to load comparison data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [rfqId]);

  const handleApprove = async (quoteId) => {
    try {
      await api.post('/approvals/', {
        quotation_id: quoteId,
        status: 'approved',
        remarks: 'Approved after comparison'
      });
      toast.success('Quotation Approved! Purchase Order Generated.');
      navigate('/purchase-orders'); // Assuming this route exists, or redirect to invoices
    } catch (error) {
       toast.error(error.response?.data?.detail || 'Approval failed');
    }
  };

  const handleReject = async (quoteId) => {
     const reason = window.prompt("Please enter a reason for rejecting this quotation:");
     if (reason === null) return; // User cancelled
     
     try {
      await api.post('/approvals/', {
        quotation_id: quoteId,
        status: 'rejected',
        remarks: reason || 'Rejected during comparison'
      });
      toast.success('Quotation Rejected.');
      // Refresh list
      const quoteRes = await api.get(`/quotations/rfq/${rfqId}`);
      setQuotes(quoteRes.data);
    } catch (error) {
       toast.error(error.response?.data?.detail || 'Rejection failed');
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading comparison...</div>;

  const lowestQuote = quotes.length > 0 ? [...quotes].sort((a, b) => a.total_amount - b.total_amount)[0] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/rfqs')} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compare Quotations</h1>
          <p className="text-gray-500">RFQ: {rfq?.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {quotes.length === 0 ? (
          <div className="col-span-3 text-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
             No quotations submitted for this RFQ yet.
          </div>
        ) : (
          quotes.map(quote => {
            const isLowest = lowestQuote?.id === quote.id;
            return (
              <div key={quote.id} className={`bg-bg-card rounded-xl shadow-soft p-6 border-2 relative ${isLowest ? 'border-green-500' : 'border-gray-100 dark:border-gray-800'}`}>
                {isLowest && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Lowest Price
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Vendor ID: {quote.vendor_id}</h3>
                  {quote.is_anomaly && (
                    <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-md animate-pulse border border-red-200 dark:border-red-800">
                      <AlertTriangle size={12} /> High-Risk Anomaly
                    </span>
                  )}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-bold text-gray-900 dark:text-white">₹{quote.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-500">Delivery Days</span>
                    <span className="font-medium text-gray-900 dark:text-white">{quote.delivery_days} days</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{quote.status}</span>
                  </div>
                  {quote.notes && (
                     <div className="pt-2">
                        <span className="text-gray-500 block mb-1 text-sm">Notes</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2 rounded">{quote.notes}</p>
                     </div>
                  )}
                </div>

                <div className="mb-6 bg-gray-50/50 dark:bg-gray-900/30 rounded-lg py-2">
                   <Timeline currentStatus={quote.status} submittedAt={quote.submitted_at} approvalData={quote.approval} />
                </div>

                {user?.role === 'manager' || user?.role === 'admin' ? (
                   <div className="flex gap-3">
                     <button 
                       onClick={() => handleApprove(quote.id)}
                       disabled={quote.status !== 'pending'}
                       className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2 rounded-lg transition-colors text-sm font-medium"
                     >
                       <Check size={16} /> Approve
                     </button>
                     <button 
                       onClick={() => handleReject(quote.id)}
                       disabled={quote.status !== 'pending'}
                       className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 py-2 rounded-lg transition-colors text-sm font-medium"
                     >
                       <X size={16} /> Reject
                     </button>
                   </div>
                ) : (
                   <div className="text-center text-sm text-gray-500 italic">Waiting for Manager Approval</div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default QuotationComparison;
