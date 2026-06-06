import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Send, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_ASSIGNED_RFQS = [
  { id: 'RFQ-001', title: 'Office Furniture Procurement Q2', deadline: '15 Jun 2025', status: 'Pending Submission' },
  { id: 'RFQ-002', title: 'Developer Laptops (MacBook Pro)', deadline: '20 May 2025', status: 'Submitted' },
];

// This page is primarily for Vendors to see assigned RFQs and submit quotes.
// For Procurement Officers, they would see a list of RFQs with received quotes to compare.

const Quotations = () => {
  const { user } = useAuth();
  
  if (user?.role === 'officer' || user?.role === 'manager' || user?.role === 'admin') {
    return <ProcurementQuotationsView />;
  }

  return <VendorQuotationsView />;
};

const VendorQuotationsView = () => {
  const [selectedRfq, setSelectedRfq] = useState(null);

  // Mock Form State
  const [quoteDetails, setQuoteDetails] = useState([
    { item: 'Ergonomic Chair', qty: 25, unitPrice: 3800, total: 95000 },
    { item: 'Standing Desk', qty: 10, unitPrice: 12000, total: 120000 },
  ]);
  const [deliveryDays, setDeliveryDays] = useState(15);
  const [paymentTerms, setPaymentTerms] = useState('Payment within 30 days');

  if (selectedRfq) {
    const subtotal = quoteDetails.reduce((acc, curr) => acc + curr.total, 0);
    const tax = subtotal * 0.18; // 18% GST
    const grandTotal = subtotal + tax;

    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Quotation</h1>
            <p className="text-gray-500 dark:text-gray-400">RFQ: {selectedRfq.title} - Deadline {selectedRfq.deadline}</p>
          </div>
          <button 
            onClick={() => setSelectedRfq(null)}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            Back to List
          </button>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-primary-dark mb-1">RFQ Summary</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Ergonomic chair x 25, Standing desk x 10 - Category Furniture
          </p>
        </div>

        <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Quotation Details</h3>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Item</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Unit Price (₹)</th>
                  <th className="px-4 py-3 font-medium rounded-tr-lg text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {quoteDetails.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{item.item}</td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{item.qty}</td>
                    <td className="px-4 py-4">
                      <input 
                        type="number" 
                        value={item.unitPrice}
                        onChange={(e) => {
                          const newPrice = Number(e.target.value);
                          const newDetails = [...quoteDetails];
                          newDetails[idx].unitPrice = newPrice;
                          newDetails[idx].total = newPrice * newDetails[idx].qty;
                          setQuoteDetails(newDetails);
                        }}
                        className="w-24 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-gray-900 dark:text-white">
                      {item.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax / GST (%)</label>
                  <input type="number" value={18} readOnly className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Time (Days)</label>
                  <input 
                    type="number" 
                    value={deliveryDays} 
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes / Terms</label>
                <textarea 
                  rows={2} 
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white resize-none" 
                />
              </div>
            </div>

            <div className="w-full md:w-72 bg-gray-50 dark:bg-gray-800/30 p-5 rounded-lg border border-gray-100 dark:border-gray-700 h-fit">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>GST (18%)</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹ {tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-lg text-primary-dark dark:text-primary">
                  <span>Grand Total</span>
                  <span>₹ {grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
              Save Draft
            </button>
            <button 
              onClick={() => {
                alert('Quotation Submitted!');
                setSelectedRfq(null);
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark shadow-sm"
            >
              <Send size={16} />
              Submit Quotation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotations</h1>
        <p className="text-gray-500 dark:text-gray-400">View RFQs assigned to you and submit your bids.</p>
      </div>

      <div className="grid gap-4">
        {MOCK_ASSIGNED_RFQS.map(rfq => (
          <div key={rfq.id} className="bg-bg-card p-5 rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors">
            <div className="flex gap-4">
              <div className="mt-1">
                {rfq.status === 'Submitted' ? (
                  <CheckCircle2 className="text-green-500" size={24} />
                ) : (
                  <FileText className="text-primary/70" size={24} />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{rfq.title}</h3>
                <p className="text-sm text-primary dark:text-primary-dark font-medium mb-1">{rfq.id}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>Deadline: {rfq.deadline}</span>
                </div>
              </div>
            </div>
            <div>
              {rfq.status === 'Pending Submission' ? (
                <button 
                  onClick={() => setSelectedRfq(rfq)}
                  className="w-full sm:w-auto px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Create Quotation
                </button>
              ) : (
                <button className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 transition-colors">
                  View Submitted
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProcurementQuotationsView = () => {
  const MOCK_RFQS_WITH_QUOTES = [
    { id: 'RFQ-001', title: 'Office Furniture Procurement Q2', received: 3, deadline: '15 Jun 2025' },
    { id: 'RFQ-002', title: 'Developer Laptops (MacBook Pro)', received: 2, deadline: '20 May 2025' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compare Quotations</h1>
        <p className="text-gray-500 dark:text-gray-400">Review and select the best vendor bids.</p>
      </div>

      <div className="grid gap-4">
        {MOCK_RFQS_WITH_QUOTES.map(rfq => (
          <div key={rfq.id} className="bg-bg-card p-5 rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{rfq.title}</h3>
              <p className="text-sm text-primary dark:text-primary-dark font-medium mb-1">{rfq.id}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-primary/10 text-primary-dark px-2 py-0.5 rounded font-medium">{rfq.received} Quotes Received</span>
                <span>Deadline: {rfq.deadline}</span>
              </div>
            </div>
            <div>
              <Link 
                to={`/quotations/compare/${rfq.id}`}
                className="inline-flex w-full sm:w-auto px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors text-center"
              >
                Compare & Evaluate
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quotations;
