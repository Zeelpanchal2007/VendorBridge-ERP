import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, CheckCircle2, Clock } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const RFQs = () => {
  const [rfqs, setRfqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchRfqs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/rfqs/');
      setRfqs(response.data);
    } catch (error) {
      toast.error('Failed to load RFQs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const filteredRfqs = rfqs.filter(r => 
    r.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id?.toString().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Request For Quotations</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage procurement requests and track statuses</p>
        </div>
        {['admin', 'procurement_officer'].includes(user?.role) && (
          <Link 
            to="/rfqs/create"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm font-medium whitespace-nowrap"
          >
            <Plus size={18} /> Create New RFQ
          </Link>
        )}
      </div>

      <div className="bg-bg-card p-4 rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white text-sm transition-colors"
              placeholder="Search by RFQ ID or Title..."
            />
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-medium">RFQ Info</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Deadline</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {isLoading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">Loading RFQs...</td></tr>
              ) : filteredRfqs.length > 0 ? (
                 filteredRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary dark:text-primary-dark">RFQ-{rfq.id}</div>
                      <div className="font-semibold text-gray-900 dark:text-white mt-1">{rfq.title}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-medium">
                        {rfq.items?.length || 0} Items
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-2">
                      <Clock size={14} className="text-gray-400" />
                      {new Date(rfq.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        rfq.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        rfq.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {rfq.status === 'open' && <CheckCircle2 size={12} />}
                        {rfq.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       {user?.role === 'vendor' ? (
                          <Link to={`/quotations/new/${rfq.id}`} className="text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors px-3 py-1.5 rounded-md">
                            Submit Quote
                          </Link>
                       ) : (
                          <Link to={`/quotations/compare/${rfq.id}`} className="text-sm font-medium text-primary hover:text-primary-dark transition-colors px-3 py-1.5 rounded-md hover:bg-primary/5">
                            View Quotes
                          </Link>
                       )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No RFQs available.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RFQs;
