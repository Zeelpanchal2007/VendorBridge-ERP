import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle2, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Data
const MOCK_RFQ = {
  id: 'RFQ-001',
  title: 'Office Furniture Procurement Q2',
  category: 'Furniture',
  deadline: '15 Jun 2025',
};

const MOCK_QUOTATIONS = [
  {
    id: 'Q-01',
    vendorId: 1,
    vendorName: 'Infra Supplies Pvt Ltd',
    rating: 4.5,
    items: [
      { name: 'Ergonomic Chair', qty: 25, unitPrice: 3800, total: 95000 },
      { name: 'Standing Desk', qty: 10, unitPrice: 12000, total: 120000 },
    ],
    subtotal: 215000,
    tax: 38700,
    grandTotal: 253700,
    deliveryDays: 15,
    paymentTerms: '30 Days Net',
    status: 'Submitted'
  },
  {
    id: 'Q-02',
    vendorId: 2,
    vendorName: 'Tech Core LTD',
    rating: 4.8,
    items: [
      { name: 'Ergonomic Chair', qty: 25, unitPrice: 4000, total: 100000 },
      { name: 'Standing Desk', qty: 10, unitPrice: 11500, total: 115000 },
    ],
    subtotal: 215000,
    tax: 38700,
    grandTotal: 253700,
    deliveryDays: 10,
    paymentTerms: 'Advance 50%',
    status: 'Submitted'
  },
  {
    id: 'Q-03',
    vendorId: 3,
    vendorName: 'Office Steel Co.',
    rating: 3.5,
    items: [
      { name: 'Ergonomic Chair', qty: 25, unitPrice: 3500, total: 87500 },
      { name: 'Standing Desk', qty: 10, unitPrice: 11000, total: 110000 },
    ],
    subtotal: 197500,
    tax: 35550,
    grandTotal: 233050,
    deliveryDays: 20,
    paymentTerms: '45 Days Net',
    status: 'Submitted'
  }
];

const QuotationComparison = () => {
  const { rfqId } = useParams();
  const navigate = useNavigate();
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);

  // Find lowest price
  const lowestPrice = Math.min(...MOCK_QUOTATIONS.map(q => q.grandTotal));

  const handleSelectVendor = () => {
    if (!selectedQuoteId) {
      toast.error('Please select a quotation first');
      return;
    }
    toast.success('Quotation selected and sent for approval!');
    navigate('/approvals');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/quotations')}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quotation Comparison</h1>
          <p className="text-gray-500 dark:text-gray-400">RFQ: {MOCK_RFQ.title} - {MOCK_QUOTATIONS.length} quotations received</p>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 w-48">Criteria</th>
                {MOCK_QUOTATIONS.map((quote) => (
                  <th key={quote.id} className={`px-6 py-4 align-top ${
                    quote.grandTotal === lowestPrice ? 'bg-primary/5 dark:bg-primary/10 border-t-4 border-t-primary' : ''
                  }`}>
                    <div className="font-semibold text-gray-900 dark:text-white text-lg">{quote.vendorName}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{quote.rating} Rating</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              
              {/* Grand Total Row (Highlight Lowest) */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300 bg-gray-50/30 dark:bg-gray-800/30">
                  Grand Total (₹)
                </td>
                {MOCK_QUOTATIONS.map((quote) => (
                  <td key={quote.id} className={`px-6 py-4 font-bold text-lg ${
                    quote.grandTotal === lowestPrice 
                      ? 'text-primary-dark dark:text-primary bg-primary/5 dark:bg-primary/10' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    <div className="flex items-center gap-2">
                      ₹ {quote.grandTotal.toLocaleString('en-IN')}
                      {quote.grandTotal === lowestPrice && (
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary text-white font-medium">
                          <TrendingDown size={12} /> Lowest
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Delivery Days */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300 bg-gray-50/30 dark:bg-gray-800/30">
                  Delivery (Days)
                </td>
                {MOCK_QUOTATIONS.map((quote) => (
                  <td key={quote.id} className={`px-6 py-4 text-gray-700 dark:text-gray-300 ${
                    quote.grandTotal === lowestPrice ? 'bg-primary/5 dark:bg-primary/10' : ''
                  }`}>
                    {quote.deliveryDays} Days
                  </td>
                ))}
              </tr>

              {/* Payment Terms */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300 bg-gray-50/30 dark:bg-gray-800/30">
                  Payment Terms
                </td>
                {MOCK_QUOTATIONS.map((quote) => (
                  <td key={quote.id} className={`px-6 py-4 text-gray-700 dark:text-gray-300 ${
                    quote.grandTotal === lowestPrice ? 'bg-primary/5 dark:bg-primary/10' : ''
                  }`}>
                    {quote.paymentTerms}
                  </td>
                ))}
              </tr>

              {/* Line Items Breakdown */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300 bg-gray-50/30 dark:bg-gray-800/30 align-top">
                  Item Breakdown
                </td>
                {MOCK_QUOTATIONS.map((quote) => (
                  <td key={quote.id} className={`px-6 py-4 ${
                    quote.grandTotal === lowestPrice ? 'bg-primary/5 dark:bg-primary/10' : ''
                  }`}>
                    <div className="space-y-3">
                      {quote.items.map((item, idx) => (
                        <div key={idx} className="text-xs">
                          <div className="font-medium text-gray-900 dark:text-white mb-0.5">{item.name} (x{item.qty})</div>
                          <div className="text-gray-500">₹ {item.unitPrice.toLocaleString('en-IN')} / unit</div>
                        </div>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Action Row */}
              <tr>
                <td className="px-6 py-4 bg-gray-50/30 dark:bg-gray-800/30"></td>
                {MOCK_QUOTATIONS.map((quote) => (
                  <td key={quote.id} className={`px-6 py-6 ${
                    quote.grandTotal === lowestPrice ? 'bg-primary/5 dark:bg-primary/10' : ''
                  }`}>
                    <button
                      onClick={() => setSelectedQuoteId(quote.id)}
                      className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        selectedQuoteId === quote.id
                          ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900'
                          : quote.grandTotal === lowestPrice
                            ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 hover:border-transparent'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-750'
                      }`}
                    >
                      {selectedQuoteId === quote.id ? (
                        <><CheckCircle2 size={18} /> Selected</>
                      ) : (
                        'Select Vendor'
                      )}
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSelectVendor}
          disabled={!selectedQuoteId}
          className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          Proceed to Approval
        </button>
      </div>

    </div>
  );
};

export default QuotationComparison;
