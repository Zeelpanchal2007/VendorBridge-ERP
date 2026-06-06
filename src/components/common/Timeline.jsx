import React from 'react';

const Timeline = ({ currentStatus, submittedAt, approvalData }) => {
  // Define our workflow stages
  const stages = [
    { key: 'draft', label: 'Draft', description: 'Quotation Created', date: submittedAt ? new Date(submittedAt).toLocaleDateString() : 'Pending' },
    { key: 'submitted', label: 'Submitted', description: 'Pending Review', date: submittedAt ? new Date(submittedAt).toLocaleDateString() : 'Pending' },
    { key: 'under_review', label: 'Under Review', description: 'Manager Evaluating', date: 'In Progress' },
    { key: 'final', label: currentStatus === 'rejected' ? 'Rejected' : 'Approved', description: 'Final Decision', date: approvalData?.approved_at ? new Date(approvalData.approved_at).toLocaleDateString() : 'Pending' }
  ];

  const getStatusIndex = () => {
    switch(currentStatus) {
      case 'draft': return 0;
      case 'pending': return 1;
      case 'under_review': return 2;
      case 'approved': return 3;
      case 'rejected': return 3;
      default: return 1;
    }
  };

  const activeIndex = getStatusIndex();

  return (
    <div className="w-full py-6 px-2 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[600px] relative">
        {stages.map((stage, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const isPending = index > activeIndex;
          
          return (
            <div key={stage.key} className="relative flex flex-col items-center flex-1">
              
              {/* Connecting Line (drawn to the next node) */}
              {index < stages.length - 1 && (
                <div 
                  className={`absolute top-3 left-[50%] w-full h-[2px] -z-10 transition-colors duration-500
                    ${index < activeIndex ? 'bg-purple-800 dark:bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                />
              )}

              {/* Node Circle */}
              <div 
                className={`w-6 h-6 rounded-full border-[3px] z-10 bg-white dark:bg-gray-900 transition-all duration-500
                  ${isCompleted ? 'border-purple-800 bg-purple-800 dark:border-purple-600 dark:bg-purple-600 shadow-[0_0_10px_rgba(107,33,168,0.5)]' 
                  : isActive ? 'border-purple-800 dark:border-purple-500 shadow-[0_0_15px_rgba(107,33,168,0.5)]' 
                  : 'border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700'}`}
              ></div>

              {/* Text Content below node */}
              <div className="mt-4 text-center max-w-[120px]">
                <h4 className={`text-sm font-bold transition-colors ${
                  isCompleted || isActive ? 'text-purple-900 dark:text-purple-300' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {stage.label}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{stage.description}</p>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">{stage.date}</p>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
