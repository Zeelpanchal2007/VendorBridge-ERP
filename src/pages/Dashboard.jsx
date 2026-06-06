import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, 
  CheckSquare, 
  DollarSign, 
  AlertCircle,
  Plus,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for stats
  const stats = [
    { label: 'Active RFQs', value: '12', icon: <FileText size={24} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Approvals', value: '5', icon: <CheckSquare size={24} />, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'PO\'s This Month', value: '$ 2.3L', icon: <DollarSign size={24} />, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Overdue Invoices', value: '3', icon: <AlertCircle size={24} />, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  // Mock data for recent POs
  const recentPOs = [
    { id: 'PO-2024', vendor: 'Infra Supplies Pvt Ltd', amount: '₹ 89,000', status: 'Approved', date: '21 May 2025' },
    { id: 'PO-2025', vendor: 'Tech Core LTD', amount: '₹ 1,40,000', status: 'Pending', date: '20 May 2025' },
    { id: 'PO-2026', vendor: 'Office Steel Co.', amount: '₹ 26,400', status: 'Draft', date: '19 May 2025' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name || 'User'} - Today's Overview</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-3">
          <Link to="/rfqs" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm text-sm font-medium">
            <Plus size={18} />
            New RFQ
          </Link>
          <Link to="/vendors" className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-750 transition-colors shadow-sm text-sm font-medium">
            <Users size={18} />
            Add Vendor
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-bg-card rounded-xl p-6 shadow-soft border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color} dark:bg-opacity-20`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchase Orders Table */}
        <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Purchase Orders</h2>
            <Link to="/invoices" className="text-sm font-medium text-primary hover:text-primary-dark">View All</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-3 font-medium">PO #</th>
                  <th className="px-6 py-3 font-medium">Vendor</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {recentPOs.map((po, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{po.id}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{po.vendor}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{po.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        po.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        po.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">{po.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Spending Trend (Last 6 Months)</h2>
          
          {/* Simple CSS bar chart representation since no external library requested */}
          <div className="flex-1 flex items-end justify-between gap-2 mt-4 pb-4">
            {[35, 50, 40, 70, 55, 85].map((height, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-primary/20 rounded-t-sm relative flex items-end justify-center group-hover:bg-primary/30 transition-colors" style={{ height: '150px' }}>
                  <div 
                    className="w-full bg-primary rounded-t-sm group-hover:bg-primary-dark transition-all duration-500 relative" 
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity">
                      ₹{height * 10}k
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i]}
                </span>
              </div>
            ))}
          </div>
          <Link to="/reports" className="mt-4 text-center text-sm text-primary font-medium hover:text-primary-dark transition-colors py-2 border border-primary/20 rounded-lg hover:bg-primary/5">
            View Full Report
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
