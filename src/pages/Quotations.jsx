import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const Quotations = () => {
  // This is a generic Quotations component, but let's make it a Quote Submission form for Vendors
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // If there's no RFQ ID in URL, we shouldn't really be here without a list view, 
  // but for the workflow the user clicked "Submit Quote" from RFQs page.
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Fetch vendors to find a valid vendor_id
      const vendorsRes = await api.get('/vendors/');
      const vendors = vendorsRes.data;
      
      let actualVendorId;
      const matchedVendor = vendors.find(v => v.email === user.email);
      
      if (matchedVendor) {
        if (matchedVendor.status !== 'active') {
          toast.error("Your Vendor Profile is pending verification. A Procurement Officer must verify you before you can submit quotes.");
          setIsSubmitting(false);
          return;
        }
        actualVendorId = matchedVendor.id;
      } else {
        // Auto-create a vendor profile for this user so they can submit quotes
        const newVendorPayload = {
          name: user.name || 'New Vendor',
          email: user.email,
          category: 'General',
          gst_number: 'GST' + Math.floor(100000000000 + Math.random() * 900000000000), // Exactly 15 chars
          contact_person: user.name || 'Contact',
          phone: '0000000000',
          address: 'System Generated Profile',
          status: 'pending' // Changed from active to pending for verification workflow
        };
        try {
          const newVendorRes = await api.post('/vendors/', newVendorPayload);
          
          // Instantly block them and tell them they are pending
          toast.error('Profile created, but pending verification. Please wait for an Officer to verify you before submitting quotes.', { duration: 5000 });
          setIsSubmitting(false);
          return;
        } catch (e) {
          toast.error('Failed to auto-create Vendor Profile. Please ask Admin.');
          setIsSubmitting(false);
          return;
        }
      }

      const payload = {
        rfq_id: parseInt(rfqId),
        vendor_id: actualVendorId,
        total_amount: parseFloat(data.total_amount),
        delivery_days: parseInt(data.delivery_days),
        notes: data.notes
      };
      
      await api.post('/quotations/', payload);
      toast.success('Quotation submitted successfully!');
      navigate('/rfqs');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit quotation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Quotation</h1>
      <p className="text-gray-500">For RFQ #{rfqId}</p>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-soft">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Amount ($)</label>
            <input 
              type="number" 
              step="0.01"
              {...register('total_amount', { required: 'Total amount is required' })} 
              className="block w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white" 
            />
            {errors.total_amount && <span className="text-red-500 text-xs">{errors.total_amount.message}</span>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Time (Days)</label>
            <input 
              type="number" 
              {...register('delivery_days', { required: 'Delivery days is required' })} 
              className="block w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white" 
            />
            {errors.delivery_days && <span className="text-red-500 text-xs">{errors.delivery_days.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes / Terms</label>
            <textarea 
              {...register('notes')} 
              rows={4}
              className="block w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white" 
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/rfqs')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
              {isSubmitting ? 'Submitting...' : 'Submit Quotation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Quotations;
