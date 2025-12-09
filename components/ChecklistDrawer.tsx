import React, { useState, useEffect } from 'react';
import { EmployeeRequest, Task, RequestStatus, UserRole, ProcessType } from '../types';
import { X, CheckSquare, Square, Laptop, Key, Box, Save, User, Calendar, Briefcase, Building, Building2, Users, Server, Clock, ArrowRight } from 'lucide-react';

interface ChecklistDrawerProps {
  isOpen: boolean;
  request: EmployeeRequest | null;
  role: UserRole;
  onClose: () => void;
  onUpdate: (updatedRequest: EmployeeRequest) => void;
}

const ChecklistDrawer: React.FC<ChecklistDrawerProps> = ({ isOpen, request, role, onClose, onUpdate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.PENDING);

  useEffect(() => {
    if (request) {
      setTasks(request.checklist);
      setStatus(request.status);
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const isHR = role === UserRole.HR;
  
  // Can modify if it's your department or if you are HR (Super User)
  const canModify = (taskDept: UserRole) => role === taskDept || isHR;

  const toggleTask = (taskId: string, taskDept: UserRole) => {
    if (!canModify(taskDept)) return;

    const newTasks = tasks.map(t => 
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    );
    setTasks(newTasks);
    
    // Auto status update logic
    const allComplete = newTasks.every(t => t.isCompleted);
    const anyComplete = newTasks.some(t => t.isCompleted);
    
    if (allComplete) setStatus(RequestStatus.COMPLETED);
    else if (anyComplete) setStatus(RequestStatus.IN_PROGRESS);
    else setStatus(RequestStatus.PENDING);
  };

  const handleSave = () => {
    onUpdate({
      ...request,
      checklist: tasks,
      status: status
    });
    onClose();
  };

  const getCategoryIcon = (cat: string = '') => {
    const c = cat.toLowerCase();
    if (c.includes('hardware')) return <Laptop size={14} />;
    if (c.includes('account')) return <User size={14} />;
    if (c.includes('legal') || c.includes('contract')) return <Briefcase size={14} />;
    if (c.includes('access') || c.includes('security')) return <Key size={14} />;
    return <Box size={14} />;
  };

  const getDeptIcon = (dept: UserRole) => {
    switch (dept) {
      case UserRole.HR: return <Users size={18} />;
      case UserRole.IT: return <Server size={18} />;
      case UserRole.ADMIN: return <Building2 size={18} />;
      default: return <Box size={18} />;
    }
  };

  const getDeptColor = (dept: UserRole) => {
     switch (dept) {
        case UserRole.HR: return 'bg-blue-50 text-blue-700 border-blue-200';
        case UserRole.IT: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case UserRole.ADMIN: return 'bg-purple-50 text-purple-700 border-purple-200';
        default: return 'bg-slate-50 text-slate-700';
     }
  };

  // Group tasks by department for HR view, or just show relevant tasks for others
  const departments = [UserRole.HR, UserRole.IT, UserRole.ADMIN];

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md ${
                  request.type === ProcessType.ONBOARDING ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                }`}>
                  {request.type}
                </span>
                <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md border ${
                   status === RequestStatus.COMPLETED ? 'border-emerald-200 bg-emerald-50 text-emerald-700' :
                   status === RequestStatus.IN_PROGRESS ? 'border-amber-200 bg-amber-50 text-amber-700' :
                   'border-slate-200 text-slate-600'
                }`}>
                    {status.replace('_', ' ')}
                </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{request.employeeName}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={20}/></div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Role</p>
                    <p className="text-sm font-medium text-slate-800">{request.role}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Building size={20}/></div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Department</p>
                    <p className="text-sm font-medium text-slate-800">{request.department}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Calendar size={20}/></div>
                <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Effective Date</p>
                    <p className="text-sm font-medium text-slate-800">{new Date(request.startDate).toDateString()}</p>
                </div>
             </div>
             {request.notes && (
                 <div className="col-span-2 mt-2 bg-yellow-50 border border-yellow-100 p-3 rounded-lg">
                    <p className="text-xs font-bold text-yellow-800 uppercase mb-1">Notes</p>
                    <p className="text-sm text-yellow-900">{request.notes}</p>
                 </div>
             )}
          </div>

          {/* Workflow Visualization */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="text-slate-400" size={20}/>
                Workflow & Tasks
            </h3>
            
            <div className="space-y-6">
                {departments.map(dept => {
                    const deptTasks = tasks.filter(t => t.department === dept);
                    if (deptTasks.length === 0) return null;

                    // If not HR, and not my department, maybe hide or show as read-only
                    const isMyDept = role === dept;
                    const showSection = isHR || isMyDept;

                    if (!showSection) return null;

                    const completedCount = deptTasks.filter(t => t.isCompleted).length;
                    
                    return (
                        <div key={dept} className={`border rounded-xl overflow-hidden ${isMyDept ? 'shadow-md border-blue-200 ring-1 ring-blue-100' : 'border-slate-200 opacity-80'}`}>
                            <div className={`px-4 py-3 flex justify-between items-center border-b ${getDeptColor(dept)} bg-opacity-30`}>
                                <div className="flex items-center gap-2 font-bold">
                                    {getDeptIcon(dept)}
                                    <span>{dept} Department</span>
                                </div>
                                <span className="text-xs font-medium px-2 py-0.5 bg-white/50 rounded-full">
                                    {completedCount} / {deptTasks.length} Done
                                </span>
                            </div>
                            
                            <div className="divide-y divide-slate-100 bg-white">
                                {deptTasks.map(task => (
                                    <div 
                                        key={task.id}
                                        onClick={() => toggleTask(task.id, task.department)}
                                        className={`flex items-start p-4 transition-all ${
                                            canModify(task.department) ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'
                                        }`}
                                    >
                                        <div className={`mt-0.5 mr-3 transition-colors ${
                                            task.isCompleted ? 'text-emerald-500' : 'text-slate-300'
                                        }`}>
                                            {task.isCompleted ? <CheckSquare size={20} /> : <Square size={20} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className={`text-sm font-medium transition-all ${
                                                    task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                                                }`}>
                                                    {task.description}
                                                </p>
                                                {task.timeline && (
                                                    <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
                                                        {task.timeline}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                                    {getCategoryIcon(task.category)}
                                                    {task.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!isHR && tasks.some(t => t.department !== role && !t.isCompleted) && (
                 <div className="mt-6 flex items-center justify-center text-slate-400 text-sm gap-2">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span>Other departments have pending tasks</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                 </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            {isHR ? (
               <div className="text-xs text-slate-500 w-full text-center">
                  You are viewing the Master Plan. Changes sync to all departments.
               </div>
            ) : (
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${status === RequestStatus.COMPLETED ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                   <span className="text-sm font-medium text-slate-600">My Status: {status.replace('_', ' ')}</span>
                </div>
            )}
            
            <button
                onClick={handleSave}
                className="flex items-center px-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-300 font-medium ml-auto"
            >
                <Save size={18} className="mr-2" />
                {isHR ? 'Close View' : 'Save Progress'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistDrawer;