import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
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
  
  // State for real data
  const [metrics, setMetrics] = useState({
    activeRfqs: 0,
    pendingApprovals: 0,
    poValue: 0,
    paidInvoicesCount: 0
  });
  const [recentPOs, setRecentPOs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [rfqsRes, approvalsRes, posRes, invoicesRes] = await Promise.all([
          api.get('/rfqs/'),
          api.get('/approvals/'),
          api.get('/purchase-orders/'),
          api.get('/invoices/')
        ]);

        // Calculate Active RFQs
        const activeRfqs = rfqsRes.data.filter(r => r.status === 'open').length;

        // Calculate Pending Approvals
        const pendingApprovals = approvalsRes.data.filter(a => a.status === 'pending').length;

        // Calculate Total PO Value
        const poValue = posRes.data.reduce((acc, po) => acc + po.total_amount, 0);

        // Calculate Paid Invoices
        const paidInvoicesCount = invoicesRes.data.length;

        setMetrics({
          activeRfqs,
          pendingApprovals,
          poValue,
          paidInvoicesCount
        });

        // Set Recent POs (top 5 by ID descending)
        const sortedPOs = [...posRes.data].sort((a, b) => b.id - a.id).slice(0, 5);
        setRecentPOs(sortedPOs);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹ ${(amount / 100000).toFixed(2)}L`;
    }
    return `₹ ${amount.toLocaleString('en-IN')}`;
  };

  const stats = [
    { label: 'Active RFQs', value: metrics.activeRfqs.toString(), icon: <FileText size={24} />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Pending Approvals', value: metrics.pendingApprovals.toString(), icon: <CheckSquare size={24} />, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Total PO Value', value: formatCurrency(metrics.poValue), icon: <DollarSign size={24} />, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Paid Invoices', value: metrics.paidInvoicesCount.toString(), icon: <AlertCircle size={24} />, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.name || 'User'} - Today's Overview</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-3">
          <Link to="/rfqs/create" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm text-sm font-medium">
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
          <div key={idx} className="bg-bg-card rounded-xl p-6 shadow-soft border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color} dark:bg-opacity-20 transition-transform duration-500 hover:scale-110`}>
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
        <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 lg:col-span-2 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Purchase Orders</h2>
            <Link to="/invoices" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">View All</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-3 font-medium">PO #</th>
                  <th className="px-6 py-3 font-medium">Quote Ref</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {recentPOs.map((po, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors">{po.po_number}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">#{po.quotation_id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">₹{po.total_amount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                        po.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        po.status === 'payment_initiated' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        po.status === 'work_done' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {po.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500 dark:text-gray-400">{new Date(po.issued_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {recentPOs.length === 0 && (
                   <tr>
                     <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent purchase orders found.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6 flex flex-col transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Spending Trend (Last 6 Months)</h2>
          
          {/* Simple CSS bar chart representation */}
          <div className="flex-1 flex items-end justify-between gap-2 mt-4 pb-4">
            {[35, 50, 40, 70, 55, Math.min(100, Math.max(20, (metrics.poValue / 100000) * 10))].map((height, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-primary/10 rounded-t-sm relative flex items-end justify-center group-hover:bg-primary/20 transition-colors" style={{ height: '150px' }}>
                  <div 
                    className="w-full bg-primary rounded-t-sm group-hover:bg-primary-dark transition-all duration-700 ease-out relative shadow-sm" 
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-10 font-medium">
                      ₹{Math.round(height * 10)}k
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i]}
                </span>
              </div>
            ))}
          </div>
          <Link to="/invoices" className="mt-4 text-center text-sm text-primary font-medium hover:text-primary-dark transition-colors py-2 border border-primary/20 rounded-lg hover:bg-primary/10">
            View All Financials
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
