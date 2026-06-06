import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, FileText, CheckCircle2, Clock } from 'lucide-react';

// Mock Data
const INITIAL_RFQS = [
  { id: 'RFQ-001', title: 'Office Furniture Procurement Q2', category: 'Furniture', deadline: '15 Jun 2025', vendorsAssigned: 3, status: 'Active' },
  { id: 'RFQ-002', title: 'Developer Laptops (MacBook Pro)', category: 'IT Hardware', deadline: '20 May 2025', vendorsAssigned: 2, status: 'Closed' },
  { id: 'RFQ-003', title: 'Annual Logistics Contract', category: 'Logistics', deadline: '30 May 2025', vendorsAssigned: 4, status: 'Active' },
  { id: 'RFQ-004', title: 'Pantry Supplies', category: 'Stationery', deadline: '25 May 2025', vendorsAssigned: 1, status: 'Draft' },
];

const RFQs = () => {
  const [rfqs] = useState(INITIAL_RFQS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRfqs = rfqs.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Request For Quotations</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage procurement requests and track statuses</p>
        </div>
        <Link 
          to="/rfqs/create"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm font-medium whitespace-nowrap"
        >
          <Plus size={18} />
          Create New RFQ
        </Link>
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
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 transition-colors">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-medium">RFQ Info</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Deadline</th>
                <th className="px-6 py-4 font-medium">Vendors</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {filteredRfqs.map((rfq) => (
                <tr key={rfq.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-primary dark:text-primary-dark">{rfq.id}</div>
                    <div className="font-semibold text-gray-900 dark:text-white mt-1">{rfq.title}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-medium">
                      {rfq.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-2">
                    <Clock size={14} className="text-gray-400" />
                    {rfq.deadline}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary-dark flex items-center justify-center text-xs font-bold">
                        {rfq.vendorsAssigned}
                      </span>
                      <span className="text-gray-500 text-xs">Invited</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      rfq.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      rfq.status === 'Draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {rfq.status === 'Active' && <CheckCircle2 size={12} />}
                      {rfq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors px-3 py-1.5 rounded-md hover:bg-primary/5">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RFQs;
