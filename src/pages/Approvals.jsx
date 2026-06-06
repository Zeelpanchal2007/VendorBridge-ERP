import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await api.get('/approvals/');
        setApprovals(response.data);
      } catch (error) {
        toast.error('Failed to load approvals log');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApprovals();
  }, []);

  if (isLoading) return <div className="p-8 text-center">Loading approvals...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Approvals Log</h1>
        <p className="text-gray-500">History of all quotation approvals and rejections</p>
      </div>

      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 uppercase">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Quotation ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Remarks</th>
                <th className="px-6 py-4">Processed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {approvals.map(app => (
                <tr key={app.id}>
                  <td className="px-6 py-4 text-gray-500">APP-{app.id}</td>
                  <td className="px-6 py-4 font-medium">QTE-{app.quotation_id}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                       {app.status === 'approved' && <CheckCircle2 className="text-green-500" size={16} />}
                       {app.status === 'rejected' && <XCircle className="text-red-500" size={16} />}
                       <span className={`capitalize font-medium ${app.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                          {app.status}
                       </span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 italic">{app.remarks || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">
                     <div className="flex items-center gap-1.5">
                       <Clock size={14} />
                       {new Date(app.approved_at || Date.now()).toLocaleString()}
                     </div>
                  </td>
                </tr>
              ))}
              {approvals.length === 0 && (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No approvals found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Approvals;
