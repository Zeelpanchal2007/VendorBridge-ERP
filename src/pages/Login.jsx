import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { User, Lock, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('officer');
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      login(email, password, role);
      setIsLoading(false);
    }, 800);
  };

  const handleDemoLogin = (demoRole) => {
    setEmail(`${demoRole}@vendorbridge.com`);
    setPassword('password123');
    setRole(demoRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-4">
      <div className="w-full max-w-md bg-bg-card rounded-2xl shadow-soft p-8 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        
        {/* Decorative background circle */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-pastel-blue/40 rounded-full blur-2xl dark:bg-primary/5"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-dark dark:text-primary mb-2">VendorBridge</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role (For Demo)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors appearance-none"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager / Approver</option>
                  <option value="officer">Procurement Officer</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-primary-dark font-medium transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Don't have an account? <Link to="/register" className="font-medium text-primary hover:text-primary-dark transition-colors">Register</Link>
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-center text-gray-500 mb-4">Quick Demo Login:</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => handleDemoLogin('officer')} className="text-xs py-1.5 px-2 rounded bg-pastel-blue text-primary-dark hover:bg-primary/20 dark:bg-gray-800 dark:text-gray-300 transition-colors">Officer</button>
              <button onClick={() => handleDemoLogin('vendor')} className="text-xs py-1.5 px-2 rounded bg-pastel-green text-primary-dark hover:bg-primary/20 dark:bg-gray-800 dark:text-gray-300 transition-colors">Vendor</button>
              <button onClick={() => handleDemoLogin('manager')} className="text-xs py-1.5 px-2 rounded bg-pastel-yellow text-gray-700 hover:bg-yellow-200 dark:bg-gray-800 dark:text-gray-300 transition-colors">Manager</button>
              <button onClick={() => handleDemoLogin('admin')} className="text-xs py-1.5 px-2 rounded bg-pastel-red text-red-800 hover:bg-red-200 dark:bg-gray-800 dark:text-gray-300 transition-colors">Admin</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
