import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import RFQs from './pages/RFQs';
import CreateRFQ from './pages/CreateRFQ';
import Quotations from './pages/Quotations';
import VendorQuotations from './pages/VendorQuotations';
import VendorPOs from './pages/VendorPOs';
import QuotationComparison from './pages/QuotationComparison';
import Approvals from './pages/Approvals';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Activity from './pages/Activity';
import Unauthorized from './pages/Unauthorized';

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'vendor') return <Navigate to="/rfqs" replace />;
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<RootRedirect />} />
              <Route path="dashboard" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'procurement_officer']}><Dashboard /></ProtectedRoute>} />
              <Route path="vendors" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'procurement_officer']}><Vendors /></ProtectedRoute>} />
              <Route path="rfqs" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'procurement_officer', 'vendor']}><RFQs /></ProtectedRoute>} />
              <Route path="rfqs/create" element={<ProtectedRoute allowedRoles={['admin', 'procurement_officer']}><CreateRFQ /></ProtectedRoute>} />
              <Route path="quotations" element={<ProtectedRoute allowedRoles={['vendor']}><VendorQuotations /></ProtectedRoute>} />
              <Route path="vendor-pos" element={<ProtectedRoute allowedRoles={['vendor']}><VendorPOs /></ProtectedRoute>} />
              <Route path="quotations/new/:rfqId" element={<ProtectedRoute allowedRoles={['admin', 'vendor']}><Quotations /></ProtectedRoute>} />
              <Route path="quotations/compare/:rfqId" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'procurement_officer']}><QuotationComparison /></ProtectedRoute>} />
              <Route path="approvals" element={<ProtectedRoute allowedRoles={['admin', 'manager']}><Approvals /></ProtectedRoute>} />
              <Route path="invoices" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'procurement_officer', 'vendor']}><Invoices /></ProtectedRoute>} />
              <Route path="reports" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'procurement_officer']}><Reports /></ProtectedRoute>} />
              <Route path="activity" element={<ProtectedRoute allowedRoles={['admin', 'manager', 'procurement_officer']}><Activity /></ProtectedRoute>} />
            </Route>
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
