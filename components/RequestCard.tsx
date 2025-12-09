import React, { useContext } from 'react';
import { EmployeeRequest, ProcessType, RequestStatus, UserRole } from '../types';
import { UserMinus, UserPlus, Clock, ChevronRight, Layers } from 'lucide-react';

interface RequestCardProps {
  request: EmployeeRequest;
  onClick: (request: EmployeeRequest) => void;
}

// Helper to get current role context would be ideal, but for now we calculate based on tasks
// We will simply display "My Tasks" if we are in a context that filters, 
// but since the Card doesn't know the parent's Role state directly without prop drilling, 
// we will show "Total Progress".
// *Self-correction*: Let's show total progress, but maybe highlight if *my* department has pending tasks.

const RequestCard: React.FC<RequestCardProps> = ({ request, onClick }) => {
  const isPending = request.status === RequestStatus.PENDING;
  const isComplete = request.status === RequestStatus.COMPLETED;
  const isOnboarding = request.type === ProcessType.ONBOARDING;

  // Calculate progress
  const completedTasks = request.checklist.filter(t => t.isCompleted).length;
  const totalTasks = request.checklist.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group task counts by department
  const hrTasks = request.checklist.filter(t => t.department === UserRole.HR).length;
  const itTasks = request.checklist.filter(t => t.department === UserRole.IT).length;
  const adminTasks = request.checklist.filter(t => t.department === UserRole.ADMIN).length;

  return (
    <div 
      onClick={() => onClick(request)}
      className={`bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group relative overflow-hidden`}
    >
      {/* Status Stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
        isComplete ? 'bg-emerald-500' : isPending ? 'bg-amber-400' : 'bg-blue-500'
      }`} />

      <div className="p-5 pl-7">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md flex items-center gap-1 ${
              isOnboarding ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
            }`}>
              {isOnboarding ? <UserPlus size={12} /> : <UserMinus size={12} />}
              {isOnboarding ? 'In' : 'Out'}
            </span>
            <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">{request.employeeName}</h3>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
            isComplete ? 'bg-emerald-100 text-emerald-700' :
            isPending ? 'bg-amber-100 text-amber-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {request.status.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-500 mb-4">
          <p className="line-clamp-1">Role: <span className="text-slate-700 font-medium">{request.role}</span></p>
          <p className="line-clamp-1">Dept: <span className="text-slate-700 font-medium">{request.department}</span></p>
          <p className="col-span-2 mt-1 flex items-center gap-1 text-xs">
             <Clock size={12} /> 
             {isOnboarding ? 'Starts:' : 'Last Day:'} {new Date(request.startDate).toLocaleDateString()}
          </p>
        </div>

        {/* Department Chips */}
        <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-slate-400 flex items-center gap-1"><Layers size={12}/> Tasks:</span>
            {hrTasks > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">HR</span>}
            {itTasks > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">IT</span>}
            {adminTasks > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-100">ADM</span>}
        </div>

        {/* Progress Bar */}
        <div className="mt-1">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Completion</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isComplete ? 'bg-emerald-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
           <span className="text-blue-600 text-sm font-medium group-hover:underline flex items-center">
             View Checklist <ChevronRight size={16} />
           </span>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;