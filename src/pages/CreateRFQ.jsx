import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Plus, Trash2, Check } from 'lucide-react';
import api from '../api';

const rfqSchema = z.object({
  title: z.string().min(5, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  deadline: z.string().min(1, 'Deadline is required'),
  items: z.array(z.object({
    product_name: z.string().min(2, 'Item name is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    description: z.string().optional(),
    unit_price_estimate: z.number().optional(),
  })).min(1, 'At least one line item is required'),
});

const STEPS = [
  { id: 1, name: 'RFQ Details' },
  { id: 2, name: 'Line Items' },
];

const CreateRFQ = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, formState: { errors }, trigger } = useForm({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      items: [{ product_name: '', quantity: 1, description: '', unit_price_estimate: 0 }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['title', 'description', 'deadline'];
    }
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Reformat the date to ISO for the backend if needed
      const payload = {
        ...data,
        deadline: new Date(data.deadline).toISOString(),
        status: 'open'
      };
      await api.post('/rfqs/', payload);
      toast.success('RFQ Created successfully');
      navigate('/rfqs');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create RFQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/rfqs')} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full dark:hover:text-white dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create RFQ</h1>
          <p className="text-gray-500 dark:text-gray-400">New request for quotation</p>
        </div>
      </div>

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
                <span className={`text-xs font-medium hidden sm:block ${isCurrent ? 'text-primary-dark dark:text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">RFQ Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RFQ Title *</label>
                <input {...register('title')} className="block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors" />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline *</label>
                <input type="date" {...register('deadline')} className="block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors" />
                {errors.deadline && <p className="mt-1 text-xs text-red-500">{errors.deadline.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">General Instructions / Description *</label>
                <textarea {...register('description')} rows={4} className="block w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white transition-colors resize-none"></textarea>
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Line Items</h2>
                <button type="button" onClick={() => append({ product_name: '', quantity: 1, description: '', unit_price_estimate: 0 })} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors">
                  <Plus size={16} /> Add Item
                </button>
              </div>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700/50">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Product Name</label>
                      <input {...register(`items.${index}.product_name`)} className="block w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Notes/Desc</label>
                      <input {...register(`items.${index}.description`)} className="block w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                    </div>
                    <div className="w-full sm:w-24">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Qty</label>
                      <input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} className="block w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white" min="1" />
                    </div>
                     <div className="w-full sm:w-32">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Est. Unit Price</label>
                      <input type="number" step="0.01" {...register(`items.${index}.unit_price_estimate`, { valueAsNumber: true })} className="block w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded focus:ring-1 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                    </div>
                    <div className="flex sm:block w-full sm:w-auto justify-end mt-2 sm:mt-5">
                      <button type="button" onClick={() => remove(index)} disabled={fields.length === 1} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={prevStep} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 transition-colors ${currentStep === 1 ? 'invisible' : ''}`}>
              <ArrowLeft size={18} /> Back
            </button>
            {currentStep < 2 ? (
              <button type="button" onClick={nextStep} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-primary/30">
                {isSubmitting ? 'Processing...' : 'Publish RFQ'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRFQ;
