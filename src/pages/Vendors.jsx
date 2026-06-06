import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Star,
  Edit2,
  Trash2,
  Filter
} from 'lucide-react';
import Modal from '../components/common/Modal';

// Validation Schema
const vendorSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  gst: z.string().min(15, 'Invalid GST number').max(15),
  category: z.string().min(1, 'Category is required'),
  contact: z.string().min(10, 'Contact must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
  status: z.enum(['Active', 'Pending', 'Blocked']),
});

// Mock initial data
const INITIAL_VENDORS = [
  { id: 1, name: 'Infra Supplies Pvt Ltd', category: 'Furniture', gst: '22AAAAA0000A1Z5', contact: '+91 9876543210', status: 'Active', rating: 4.5, poCount: 6 },
  { id: 2, name: 'Tech Core LTD', category: 'IT Hardware', gst: '27BBBBB1111B2Z6', contact: '+91 9876543211', status: 'Active', rating: 4.8, poCount: 12 },
  { id: 3, name: 'FastLog Transport', category: 'Logistics', gst: '07CCCCC2222C3Z7', contact: '+91 9876543212', status: 'Blocked', rating: 2.1, poCount: 3 },
  { id: 4, name: 'Office Steel Co.', category: 'Stationery', gst: '09DDDDD3333D4Z8', contact: '+91 9876543213', status: 'Pending', rating: 0, poCount: 0 },
];

const Vendors = () => {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      status: 'Active'
    }
  });

  const handleOpenModal = (vendor = null) => {
    if (vendor) {
      setEditingVendor(vendor);
      Object.keys(vendor).forEach(key => {
        if (key !== 'id' && key !== 'rating' && key !== 'poCount') {
          setValue(key, vendor[key]);
        }
      });
    } else {
      setEditingVendor(null);
      reset({ status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    if (editingVendor) {
      setVendors(vendors.map(v => v.id === editingVendor.id ? { ...v, ...data } : v));
      toast.success('Vendor updated successfully');
    } else {
      const newVendor = {
        id: Date.now(),
        ...data,
        rating: 0,
        poCount: 0
      };
      setVendors([newVendor, ...vendors]);
      toast.success('Vendor added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter(v => v.id !== id));
      toast.success('Vendor deleted');
    }
  };

  // Filtering
  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.gst.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || v.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = [
    { name: 'All', count: vendors.length },
    { name: 'Active', count: vendors.filter(v => v.status === 'Active').length },
    { name: 'Pending', count: vendors.filter(v => v.status === 'Pending').length },
    { name: 'Blocked', count: vendors.filter(v => v.status === 'Blocked').length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vendors</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage supplier profiles and registrations</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-sm font-medium whitespace-nowrap"
        >
          <Plus size={18} />
          Add Vendor
        </button>
      </div>

      {/* Toolbar */}
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
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-750 transition-colors">
            <Filter size={16} />
            More Filters
          </button>
        </div>

        {/* Tabs */}
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
                activeTab === tab.name 
                  ? 'bg-primary/10 text-primary-dark dark:bg-primary/20 dark:text-primary' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-medium">Vendor Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">GST No.</th>
                <th className="px-6 py-4 font-medium">Contact No.</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{vendor.name}</div>
                      <div className="text-xs text-gray-500">{vendor.poCount} POs fulfilled</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-medium">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300">{vendor.gst}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{vendor.contact}</td>
                    <td className="px-6 py-4">
                      {vendor.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          <span className="font-medium text-gray-700 dark:text-gray-300">{vendor.rating}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Not rated</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vendor.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        vendor.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(vendor)}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(vendor.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No vendors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Vendor Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
              <input
                {...register('name')}
                className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                placeholder="e.g. Infra Supplies Pvt Ltd"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <select
                {...register('category')}
                className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
              >
                <option value="">Select Category</option>
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
              <input
                {...register('gst')}
                className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors uppercase"
                placeholder="15 chars alphanumeric"
              />
              {errors.gst && <p className="mt-1 text-xs text-red-500">{errors.gst.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number *</label>
              <input
                {...register('contact')}
                className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                placeholder="+91 "
              />
              {errors.contact && <p className="mt-1 text-xs text-red-500">{errors.contact.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Address *</label>
              <textarea
                {...register('address')}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors resize-none"
                placeholder="Complete billing & shipping address"
              ></textarea>
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                {...register('status')}
                className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              {editingVendor ? 'Save Changes' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Vendors;
