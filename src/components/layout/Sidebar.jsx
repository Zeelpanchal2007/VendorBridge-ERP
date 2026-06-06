import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CheckSquare, 
  ShoppingCart, 
  FileSpreadsheet, 
  BarChart2, 
  ActivitySquare 
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'manager', 'procurement_officer'] },
    { label: 'Vendors', path: '/vendors', icon: <Users size={20} />, roles: ['admin', 'manager', 'procurement_officer'] },
    { label: 'RFQ\'s', path: '/rfqs', icon: <FileText size={20} />, roles: ['admin', 'manager', 'procurement_officer', 'vendor'] },
    { label: 'Quotations', path: '/quotations', icon: <FileSpreadsheet size={20} />, roles: ['vendor'] },
    { label: 'My POs', path: '/vendor-pos', icon: <ShoppingCart size={20} />, roles: ['vendor'] },
    { label: 'Approvals', path: '/approvals', icon: <CheckSquare size={20} />, roles: ['admin', 'manager'] },
    { label: 'POs & Invoices', path: '/invoices', icon: <ShoppingCart size={20} />, roles: ['admin', 'manager', 'procurement_officer'] },
  ];

  const allowedNavItems = NAV_ITEMS.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="w-64 bg-bg-card border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700 bg-primary/5 dark:bg-primary/20">
        <h1 className="text-xl font-bold text-primary-dark dark:text-primary">VendorBridge</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {allowedNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary-dark dark:bg-primary/20 dark:text-primary font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
