import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileText, 
  UserPlus, 
  CheckSquare, 
  Clock, 
  Filter
} from 'lucide-react';

const MOCK_ACTIVITIES = [
  { id: 1, type: 'quotation', title: 'Quotation Selected', desc: 'Infra Supplies Pvt Ltd selected for Office Furniture Q2', date: '25 May 2025, 4:15 PM', icon: <CheckCircle2 size={16} />, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { id: 2, type: 'approval', title: 'Approval Pending', desc: 'PO-2025 awaiting L2 approval by Priya Shah', date: '22 May 2025, 10:45 AM', icon: <Clock size={16} />, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  { id: 3, type: 'rfq', title: 'RFQ Published', desc: 'Office Furniture Q2 sent to 3 vendors', date: '19 May 2025, 11:30 AM', icon: <FileText size={16} />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 4, type: 'vendor', title: 'Vendor Added', desc: 'FastLog Transport registered and pending verification', date: '18 May 2025, 2:20 PM', icon: <UserPlus size={16} />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 5, type: 'approval', title: 'Approval Completed', desc: 'L1 Review passed for Developer Laptops', date: '17 May 2025, 9:00 AM', icon: <CheckSquare size={16} />, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
];

const Activity = () => {
  const [filter, setFilter] = useState('all');

  const filteredActivities = filter === 'all' 
    ? MOCK_ACTIVITIES 
    : MOCK_ACTIVITIES.filter(a => a.type === filter);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity & Logs</h1>
          <p className="text-gray-500 dark:text-gray-400">Procurement audit trail</p>
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 rounded-r-lg">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong className="font-semibold">Immutable Audit Logs:</strong> These entries are write-only. No edits or deletions are permitted for compliance.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 py-2">
        {['all', 'rfq', 'quotation', 'approval', 'vendor'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === type 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
        <div className="relative border-l border-gray-200 dark:border-gray-700 ml-4 space-y-8">
          
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="relative pl-8 sm:pl-10">
                {/* Icon Marker */}
                <div className={`absolute -left-[18px] top-1 w-9 h-9 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-900 ${activity.color}`}>
                  {activity.icon}
                </div>
                
                {/* Content */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{activity.desc}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="pl-8 text-sm text-gray-500">No activity found for this filter.</div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Activity;
