import React, { useState } from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';

const MOCK_APPROVALS = [
  {
    id: 'APP-001',
    rfqId: 'RFQ-001',
    rfqTitle: 'Office Furniture Procurement Q2',
    vendorName: 'Infra Supplies Pvt Ltd',
    amount: 253700,
    requestedBy: 'Rahul Mehra (Procurement Head)',
    requestedDate: '20 May 2025, 10:15 AM',
    status: 'Pending',
    timeline: [
      { step: 'Submitted', user: 'Rahul Mehra', date: '20 May 2025, 10:15 AM', status: 'completed' },
      { step: 'L1 Review', user: 'Priya Shah (Finance)', date: '21 May 2025, 09:30 AM', status: 'completed' },
      { step: 'L2 Approval', user: 'You', date: 'Pending', status: 'current' },
      { step: 'Generate PO', user: 'System', date: 'Pending', status: 'upcoming' },
    ]
  },
  {
    id: 'APP-002',
    rfqId: 'RFQ-003',
    rfqTitle: 'Annual Logistics Contract',
    vendorName: 'Global Logistics',
    amount: 1450000,
    requestedBy: 'Anita Desai (Operations)',
    requestedDate: '18 May 2025, 02:45 PM',
    status: 'Approved',
    timeline: [
      { step: 'Submitted', user: 'Anita Desai', date: '18 May 2025, 02:45 PM', status: 'completed' },
      { step: 'L1 Review', user: 'System', date: '18 May 2025, 02:46 PM', status: 'completed', note: 'Auto-approved (Under limit)' },
      { step: 'L2 Approval', user: 'You', date: '19 May 2025, 11:20 AM', status: 'completed' },
      { step: 'Generate PO', user: 'System', date: '19 May 2025, 11:25 AM', status: 'completed' },
    ]
  }
];

const Approvals = () => {
  const [approvals, setApprovals] = useState(MOCK_APPROVALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState('approve'); // 'approve' or 'reject'

  const openActionModal = (approval, type) => {
    setSelectedApproval(approval);
    setActionType(type);
    setRemarks('');
    setIsModalOpen(true);
  };

  const handleAction = () => {
    if (!remarks && actionType === 'reject') {
      toast.error('Remarks are required for rejection');
      return;
    }

    const updatedApprovals = approvals.map(app => {
      if (app.id === selectedApproval.id) {
        return {
          ...app,
          status: actionType === 'approve' ? 'Approved' : 'Rejected',
          timeline: app.timeline.map(t => 
            t.step === 'L2 Approval' 
              ? { ...t, status: actionType === 'approve' ? 'completed' : 'rejected', date: new Date().toLocaleString() }
              : t
          )
        };
      }
      return app;
    });

    setApprovals(updatedApprovals);
    toast.success(`Request ${actionType}d successfully`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Approval Workflow</h1>
        <p className="text-gray-500 dark:text-gray-400">Review and authorize procurement requests.</p>
      </div>

      <div className="space-y-6">
        {approvals.map((approval) => (
          <div key={approval.id} className="bg-bg-card rounded-xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-6 lg:gap-10">
              
              {/* Approval Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{approval.rfqTitle}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        approval.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        approval.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {approval.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{approval.rfqId} • Requested by {approval.requestedBy}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">Total Amount</p>
                    <p className="text-xl font-bold text-primary-dark dark:text-primary">₹ {approval.amount.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Selected Vendor</p>
                    <p className="font-medium text-gray-900 dark:text-white">{approval.vendorName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date Requested</p>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{approval.requestedDate}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="pt-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Approval Timeline</h3>
                  <div className="relative flex justify-between">
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
                    {approval.timeline.map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center max-w-[80px]">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 bg-white dark:bg-gray-900 border-2 ${
                          item.status === 'completed' ? 'border-primary text-primary' :
                          item.status === 'rejected' ? 'border-red-500 text-red-500' :
                          item.status === 'current' ? 'border-amber-500 text-amber-500 ring-4 ring-amber-100 dark:ring-amber-900/30' :
                          'border-gray-300 text-gray-300 dark:border-gray-600 dark:text-gray-600'
                        }`}>
                          {item.status === 'completed' ? <CheckCircle2 size={16} /> :
                           item.status === 'rejected' ? <XCircle size={16} /> :
                           item.status === 'current' ? <Clock size={16} /> :
                           <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>}
                        </div>
                        <p className={`text-xs font-medium mb-1 ${
                          item.status === 'current' ? 'text-amber-600 dark:text-amber-400' : 
                          'text-gray-700 dark:text-gray-300'
                        }`}>{item.step}</p>
                        <p className="text-[10px] text-gray-500 leading-tight">{item.user}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Box */}
              {approval.status === 'Pending' && (
                <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-800/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700 flex flex-col justify-center h-fit">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 text-center">Your Action Required</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => openActionModal(approval, 'approve')}
                      className="w-full py-2.5 px-4 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} /> Approve Request
                    </button>
                    <button 
                      onClick={() => openActionModal(approval, 'reject')}
                      className="w-full py-2.5 px-4 bg-white text-red-600 border border-red-200 text-sm font-medium rounded-lg hover:bg-red-50 dark:bg-gray-800 dark:border-red-900/50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} /> Reject Request
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Approving this request will automatically generate a Purchase Order.
                  </p>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
      >
        <div className="space-y-4">
          <div className={`p-4 rounded-lg flex gap-3 ${
            actionType === 'approve' ? 'bg-primary/5 text-primary-dark' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">
              You are about to {actionType} the procurement request for <strong>{selectedApproval?.rfqTitle}</strong> amounting to <strong>₹ {selectedApproval?.amount.toLocaleString('en-IN')}</strong>.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Remarks {actionType === 'reject' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-bg-base dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
              placeholder={`Add your ${actionType} remarks here...`}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAction}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${
                actionType === 'approve' ? 'bg-primary hover:bg-primary-dark' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Approvals;
