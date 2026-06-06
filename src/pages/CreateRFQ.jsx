import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, UploadCloud } from 'lucide-react';

const rfqSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  lineItems: z.array(z.object({
    itemDesc: z.string().min(2, 'Item description is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unit: z.string().min(1, 'Unit is required'),
  })).min(1, 'At least one line item is required'),
  assignedVendors: z.array(z.string()).min(1, 'Please select at least one vendor'),
});

const MOCK_VENDORS = [
  { id: 'v1', name: 'Infra Supplies Pvt Ltd', category: 'Furniture' },
  { id: 'v2', name: 'Tech Core LTD', category: 'IT Hardware' },
  { id: 'v3', name: 'Office Steel Co.', category: 'Stationery' },
  { id: 'v4', name: 'Global Logistics', category: 'Logistics' },
];

const STEPS = [
  { id: 1, name: 'RFQ Details' },
  { id: 2, name: 'Line Items' },
  { id: 3, name: 'Vendors & Attachments' },
];

const CreateRFQ = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors }, trigger, watch, setValue } = useForm({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      lineItems: [{ itemDesc: '', quantity: 1, unit: 'pcs' }],
      assignedVendors: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems'
  });

  const assignedVendors = watch('assignedVendors');

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['title', 'category', 'deadline', 'description'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['lineItems'];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log('RFQ Created:', data);
      setIsSubmitting(false);
      toast.success('RFQ Created successfully');
      navigate('/rfqs');
    }, 1500);
  };

  const toggleVendor = (vendorId) => {
    if (assignedVendors.includes(vendorId)) {
      setValue('assignedVendors', assignedVendors.filter(id => id !== vendorId));
    } else {
      setValue('assignedVendors', [...assignedVendors, vendorId]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/rfqs')}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create RFQ</h1>
          <p className="text-gray-500 dark:text-gray-400">New request for quotation</p>
        </div>
      </div>

      {/* Stepper Header */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10 -translate-y-1/2"></div>
        <div className="flex justify-between relative z-10">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-4 border-bg-base ${
                  isCompleted ? 'bg-primary text-white' : 
                  isCurrent ? 'bg-primary-dark text-white ring-4 ring-primary/20' : 
                  'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {isCompleted ? <Check size={18} /> : step.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  isCurrent ? 'text-primary-dark dark:text-primary' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* Step 1: RFQ Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">RFQ Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RFQ Title *</label>
                <input
                  {...register('title')}
                  className="block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  placeholder="e.g. Office Furniture Procurement Q2"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select
                    {...register('category')}
                    className="block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  >
                    <option value="">Select Category</option>
                    <option value="Furniture">Furniture</option>
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                  {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline *</label>
                  <input
                    type="date"
                    {...register('deadline')}
                    className="block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors"
                  />
                  {errors.deadline && <p className="mt-1 text-xs text-red-500">{errors.deadline.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">General Instructions / Description *</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors resize-none"
                  placeholder="Enter detailed requirements or terms..."
                ></textarea>
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Line Items */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Line Items</h2>
                <button
                  type="button"
                  onClick={() => append({ itemDesc: '', quantity: 1, unit: 'pcs' })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>

              {errors.lineItems?.root && (
                <p className="text-sm text-red-500">{errors.lineItems.root.message}</p>
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Item Description</label>
                      <input
                        {...register(`lineItems.${index}.itemDesc`)}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        placeholder="e.g. Ergonomic Chair"
                      />
                      {errors.lineItems?.[index]?.itemDesc && <p className="mt-1 text-xs text-red-500">{errors.lineItems[index].itemDesc.message}</p>}
                    </div>
                    
                    <div className="w-full sm:w-24">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                      <input
                        type="number"
                        {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        min="1"
                      />
                    </div>
                    
                    <div className="w-full sm:w-28">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Unit</label>
                      <select
                        {...register(`lineItems.${index}.unit`)}
                        className="block w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      >
                        <option value="pcs">pcs</option>
                        <option value="kg">kg</option>
                        <option value="boxes">boxes</option>
                        <option value="meters">meters</option>
                      </select>
                    </div>

                    <div className="flex sm:block w-full sm:w-auto justify-end mt-2 sm:mt-5">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Vendors & Attachments */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">Assign Vendors</h2>
                <p className="text-sm text-gray-500 mb-4">Select the vendors you want to invite to this RFQ.</p>
                
                {errors.assignedVendors && <p className="text-sm text-red-500 mb-3">{errors.assignedVendors.message}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOCK_VENDORS.map((vendor) => {
                    const isSelected = assignedVendors.includes(vendor.id);
                    return (
                      <div 
                        key={vendor.id}
                        onClick={() => toggleVendor(vendor.id)}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                          isSelected ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                        <div>
                          <p className={`font-medium ${isSelected ? 'text-primary-dark dark:text-primary' : 'text-gray-900 dark:text-white'}`}>
                            {vendor.name}
                          </p>
                          <p className="text-xs text-gray-500">{vendor.category}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">Attachments</h2>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Drag & drop files or click to upload</p>
                  <p className="text-xs text-gray-500">Support PDF, DOCX, XLSX (Max 10MB)</p>
                </div>
              </div>

            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={prevStep}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 transition-colors ${
                currentStep === 1 ? 'invisible' : ''
              }`}
            >
              <ArrowLeft size={18} /> Back
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
              >
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-primary/30"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>Publish & Send Invitations</>
                  )}
                </button>
              </div>
            )}
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default CreateRFQ;
