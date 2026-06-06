import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Search, Plus, Star, Edit2, Trash2, Filter } from 'lucide-react';
import Modal from '../components/common/Modal';
import StarRating from '../components/common/StarRating';
import api from '../api';

const vendorSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  gst_number: z.string().min(15, 'Invalid GST number').max(15),
  category: z.string().min(1, 'Category is required'),
  contact_person: z.string().min(2, 'Contact person is required'),
  phone: z.string().min(10, 'Contact must be at least 10 digits'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required'),
  status: z.enum(['active', 'inactive', 'blocked', 'pending']),
});

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [evaluatingVendor, setEvaluatingVendor] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [editingVendor, setEditingVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: { status: 'active' }
  });

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/vendors/');
      setVendors(response.data);
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleOpenModal = (vendor = null) => {
    if (vendor) {
      setEditingVendor(vendor);
      Object.keys(vendor).forEach(key => {
        if (key !== 'id' && key !== 'rating' && key !== 'created_at') {
          setValue(key, vendor[key] || '');
        }
      });
    } else {
      setEditingVendor(null);
      reset({ status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleOpenEvaluation = (vendor) => {
    setEvaluatingVendor(vendor);
    setNewRating(vendor.rating || 0);
    setIsRatingModalOpen(true);
  };

  const handleSaveRating = async () => {
    try {
      const payload = {
        name: evaluatingVendor.name,
        gst_number: evaluatingVendor.gst_number,
        category: evaluatingVendor.category,
        contact_person: evaluatingVendor.contact_person,
        phone: evaluatingVendor.phone,
        email: evaluatingVendor.email,
        address: evaluatingVendor.address,
        status: evaluatingVendor.status,
        rating: newRating
      };
      
      await api.put(`/vendors/${evaluatingVendor.id}`, payload);
      toast.success('Vendor evaluation submitted successfully!');
      setIsRatingModalOpen(false);
      fetchVendors();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit evaluation');
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingVendor) {
        await api.put(`/vendors/${editingVendor.id}`, data);
        toast.success('Vendor updated successfully');
      } else {
        await api.post('/vendors/', data);
        toast.success('Vendor added successfully');
      }
      setIsModalOpen(false);
      fetchVendors();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await api.delete(`/vendors/${id}`);
        toast.success('Vendor deleted');
        fetchVendors();
      } catch (error) {
        toast.error('Failed to delete vendor');
      }
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.gst_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || v.status?.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const tabs = [
    { name: 'All', count: vendors.length },
    { name: 'Pending', count: vendors.filter(v => v.status === 'pending').length },
    { name: 'Active', count: vendors.filter(v => v.status === 'active').length },
    { name: 'Inactive', count: vendors.filter(v => v.status === 'inactive').length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendors</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage supplier profiles and registrations</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm font-medium whitespace-nowrap"
        >
          <Plus size={18} /> Add Vendor
        </button>
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
              placeholder="Search by name, GST, category..."
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 transition-colors">
            <Filter size={16} /> More Filters
          </button>
        </div>

        <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.name
                  ? 'border-primary text-primary-dark dark:text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.name}
              <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                activeTab === tab.name ? 'bg-primary/10 text-primary-dark dark:bg-primary/20 dark:text-primary' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-medium">Vendor Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">GST No.</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {isLoading ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
              ) : filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{vendor.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-medium">{vendor.category}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">{vendor.gst_number}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{vendor.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">{vendor.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vendor.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        vendor.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>{vendor.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEvaluation(vendor)} className="p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors" title="Evaluate Performance"><Star size={16} /></button>
                        <button onClick={() => handleOpenModal(vendor)} className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Edit"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(vendor.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No vendors found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
              <input {...register('name')} className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <select {...register('category')} className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="IT Hardware">IT Hardware</option>
                <option value="Furniture">Furniture</option>
                <option value="Stationery">Stationery</option>
                <option value="Logistics">Logistics</option>
                <option value="Services">Services</option>
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GST Number *</label>
              <input {...register('gst_number')} className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary uppercase bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors" />
              {errors.gst_number && <p className="mt-1 text-xs text-red-500">{errors.gst_number.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person *</label>
              <input {...register('contact_person')} className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors" />
              {errors.contact_person && <p className="mt-1 text-xs text-red-500">{errors.contact_person.message}</p>}
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
              <input type="email" {...register('email')} className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors" />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone *</label>
              <input {...register('phone')} className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors" />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Address *</label>
              <textarea {...register('address')} rows={3} className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary resize-none bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"></textarea>
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
            </div>
            {editingVendor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Verification Status *</label>
                <select {...register('status')} className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
                  <option value="pending">Pending (Unverified)</option>
                  <option value="active">Active (Verified)</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">{editingVendor ? 'Save Changes' : 'Add Vendor'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} title="Evaluate Vendor Performance" maxWidth="max-w-md">
        <div className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Rate the performance of <strong>{evaluatingVendor?.name}</strong>. This rating helps the Anomaly Detection AI determine the reliability of future quotations.
          </p>
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <span className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{newRating}.0</span>
            <StarRating rating={newRating} onRate={setNewRating} size={36} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => setIsRatingModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={handleSaveRating} className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors">
              Submit Evaluation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Vendors;
