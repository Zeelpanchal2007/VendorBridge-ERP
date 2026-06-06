import React from 'react';
import { Download, Calendar } from 'lucide-react';

const Reports = () => {
  const topVendors = [
    { name: 'TechCore Ltd', spend: 420000, pos: 6 },
    { name: 'Infra Supplies', spend: 310000, pos: 4 },
    { name: 'FastLog', spend: 190000, pos: 3 },
  ];

  const categorySpend = [
    { category: 'IT Hardware', amount: 4.8, max: 5, color: 'bg-blue-500' },
    { category: 'Furniture', amount: 3.2, max: 5, color: 'bg-green-500' },
    { category: 'Stationery', amount: 2.1, max: 5, color: 'bg-amber-500' },
    { category: 'Logistics', amount: 2.3, max: 5, color: 'bg-red-500' },
  ];

  const monthlyTrend = [
    { month: 'Dec', value: 30 },
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 35 },
    { month: 'Mar', value: 65 },
    { month: 'Apr', value: 55 },
    { month: 'May', value: 85 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Procurement Insights - May 2025</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 transition-colors text-sm font-medium shadow-sm">
            <Calendar size={16} /> May 2025
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 transition-colors text-sm font-medium shadow-sm">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-card border border-blue-200 dark:border-blue-900/50 rounded-xl p-6 text-center shadow-soft">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">12.4 L</p>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Spend</p>
        </div>
        <div className="bg-bg-card border border-green-200 dark:border-green-900/50 rounded-xl p-6 text-center shadow-soft">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">28</p>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Vendors</p>
        </div>
        <div className="bg-bg-card border border-amber-200 dark:border-amber-900/50 rounded-xl p-6 text-center shadow-soft">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">94%</p>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">PO Fulfillment</p>
        </div>
        <div className="bg-bg-card border border-red-200 dark:border-red-900/50 rounded-xl p-6 text-center shadow-soft">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">3</p>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Overdue Invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Spend by Category */}
        <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Spend by Category</h2>
          <div className="space-y-6">
            {categorySpend.map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-gray-700 dark:text-gray-300">{cat.category}</span>
                  <span className="text-gray-900 dark:text-white">₹{cat.amount}L</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div 
                    className={`${cat.color} h-2 rounded-full`} 
                    style={{ width: `${(cat.amount / cat.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vendors Table */}
        <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6 flex flex-col">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Top Vendors by Spend</h2>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Vendor</th>
                  <th className="px-4 py-3 font-medium">Spend (₹)</th>
                  <th className="px-4 py-3 font-medium rounded-tr-lg text-center">POs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {topVendors.map((vendor, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{vendor.name}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{vendor.spend.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300 text-center">{vendor.pos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Monthly Trend</h2>
        <div className="h-48 flex items-end justify-between gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
          {monthlyTrend.map((data, idx) => {
            // Determine color based on value intensity
            const isHighest = Math.max(...monthlyTrend.map(d => d.value)) === data.value;
            return (
              <div key={idx} className="w-full flex flex-col items-center gap-2 group relative">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-500 relative ${
                    isHighest ? 'bg-primary' : 'bg-primary/40 group-hover:bg-primary/60'
                  }`} 
                  style={{ height: `${data.value}%` }}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap transition-opacity">
                    {data.value} Units
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium absolute -bottom-6">
                  {data.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Reports;
