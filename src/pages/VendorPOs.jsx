import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { PackageCheck, CheckCircle2, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const POTimeline = ({ status }) => {
  const steps = [
    { key: 'issued', label: 'Active Job' },
    { key: 'work_done', label: 'Work Done' },
    { key: 'payment_initiated', label: 'Payment Initiated' },
    { key: 'paid', label: 'Paid' }
  ];

  const currentIndex = steps.findIndex(s => s.key === status);
  
  return (
    <div className="relative mt-6 mb-8 px-2">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 rounded-full"></div>
      <div 
        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500"
        style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
      ></div>
      
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.key} className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded-full border-2 bg-white dark:bg-gray-900 z-10 transition-colors ${
                isCompleted ? 'border-primary ring-4 ring-primary/20 bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'border-gray-300 dark:border-gray-600'
              }`} />
              <span className={`absolute -bottom-6 text-[10px] font-medium whitespace-nowrap ${
                isCurrent ? 'text-primary' : isCompleted ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const VendorPOs = () => {
  const [pos, setPos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchPOs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/purchase-orders/');
      // Ideally backend filters by vendor_id, but here we can just show all for demo
      // In a real app, API handles scoping. Assuming backend scopes it or it's just a demo.
      setPos(response.data);
    } catch (error) {
      toast.error('Failed to load Purchase Orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPOs();
  }, []);

  const handleMarkWorkDone = async (id) => {
    try {
      await api.put(`/purchase-orders/${id}/status`, { status: 'work_done' });
      toast.success('Work marked as done! Sent to PO for confirmation.');
      fetchPOs();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading your Purchase Orders...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Purchase Orders</h1>
        <p className="text-gray-500">Track and fulfill your awarded jobs</p>
      </div>

      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pos.map(po => (
            <div key={po.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-primary transition-colors flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <PackageCheck size={20} />
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  po.status === 'issued' ? 'bg-blue-100 text-blue-700' :
                  po.status === 'work_done' ? 'bg-yellow-100 text-yellow-700' :
                  po.status === 'payment_initiated' ? 'bg-orange-100 text-orange-700' :
                  po.status === 'paid' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {po.status === 'issued' ? 'Active Job' :
                   po.status === 'work_done' ? 'Pending PO Confirmation' :
                   po.status === 'payment_initiated' ? 'Payment Processing' :
                   'Paid & Completed'}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{po.po_number}</h3>
              <p className="text-sm text-gray-500 mb-2">Quote ID: #{po.quotation_id}</p>
              
              <POTimeline status={po.status} />
              
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500">Value</span>
                  <span className="font-bold text-gray-900 dark:text-white">₹{po.total_amount.toFixed(2)}</span>
                </div>

                {po.status === 'issued' && (
                  <button 
                    onClick={() => handleMarkWorkDone(po.id)}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg transition-colors text-sm font-medium"
                  >
                    <CheckCircle2 size={18} /> Mark Work Done
                  </button>
                )}
                
                {po.status === 'work_done' && (
                  <button disabled className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-lg text-sm font-medium cursor-not-allowed">
                    Awaiting Review
                  </button>
                )}

                {po.status === 'payment_initiated' && (
                  <button disabled className="w-full bg-orange-100 text-orange-700 py-2.5 rounded-lg text-sm font-medium cursor-wait">
                    Processing Payment...
                  </button>
                )}

                {po.status === 'paid' && (
                  <button disabled className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-2.5 rounded-lg text-sm font-medium">
                    <DollarSign size={18} /> Payment Received
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {pos.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <PackageCheck size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Purchase Orders Yet</h3>
              <p className="text-gray-500">Approved quotations will appear here as POs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorPOs;
