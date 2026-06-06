import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-4">
      <div className="max-w-md w-full bg-bg-card backdrop-blur-xl border border-red-500/20 dark:border-red-500/10 rounded-2xl shadow-2xl p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          403 Unauthorized
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          You do not have the required permissions to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-primary hover:bg-primary-dark transition-colors rounded-xl shadow-lg shadow-primary/25"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
