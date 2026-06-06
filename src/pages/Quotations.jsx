import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const quotationSchema = z.object({
  total_amount: z.number({ invalid_type_error: "Total amount must be a number" }).positive('Total amount must be greater than 0'),
  delivery_days: z.number({ invalid_type_error: "Delivery days must be a number" }).positive('Delivery days must be at least 1').int('Delivery days must be an integer'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional()
});

const Quotations = () => {
  // This is a generic Quotations component, but let's make it a Quote Submission form for Vendors
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(quotationSchema)
  });

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

      // Fetch RFQ details for ML prediction
      const rfqRes = await api.get(`/rfqs/${rfqId}`);
      const rfq = rfqRes.data;
      const firstItem = rfq.items && rfq.items.length > 0 ? rfq.items[0] : {};
      const itemName = firstItem.product_name || 'Generic Item';
      const quantity = firstItem.quantity || 1;
      const unitPrice = parseFloat(data.total_amount) / quantity;

      // Make request to Anomaly Detection ML microservice
      let isAnomaly = false;
      try {
        const mlPayload = {
          category: matchedVendor?.category || 'General',
          item_name: itemName,
          quantity: quantity,
          unit_price: unitPrice,
          vendor_rating: matchedVendor?.rating || 3.0
        };
        // This simulates calling the Python ML microservice
        const mlRes = await axios.post('http://localhost:8000/predict', mlPayload);
        if (mlRes.data?.is_anomaly) {
          isAnomaly = true;
          toast.error("Warning: Quotation flagged by Anomaly AI.", { duration: 4000 });
        }
      } catch (err) {
        console.warn("ML Service unavailable or failed, proceeding without anomaly check.");
      }

      const payload = {
        rfq_id: parseInt(rfqId),
        vendor_id: actualVendorId,
        total_amount: parseFloat(data.total_amount),
        delivery_days: parseInt(data.delivery_days),
        notes: data.notes,
        is_anomaly: isAnomaly
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Total Amount (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('total_amount', { valueAsNumber: true })}
                className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                placeholder="e.g. 5000.00"
              />
              {errors.total_amount && <p className="mt-1 text-xs text-red-500">{errors.total_amount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estimated Delivery (Days) *
              </label>
              <input
                type="number"
                {...register('delivery_days', { valueAsNumber: true })}
                className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                placeholder="e.g. 15"
              />
              {errors.delivery_days && <p className="mt-1 text-xs text-red-500">{errors.delivery_days.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Terms & Conditions / Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                placeholder="Any special terms, warranty information, or notes..."
              ></textarea>
              {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
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
