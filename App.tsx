import React, { useState } from 'react';
import Navbar from './components/Navbar';
import RequestCard from './components/RequestCard';
import NewRequestModal from './components/NewRequestModal';
import ChecklistDrawer from './components/ChecklistDrawer';
import { EmployeeRequest, RequestStatus, UserRole, ProcessType, Task } from './types';
import { Plus, Search, Filter, Inbox } from 'lucide-react';
import { generateITChecklist } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

// Mock initial data
const MOCK_REQUESTS: EmployeeRequest[] = [
  {
    id: '1',
    employeeName: 'Alice Chen',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    startDate: '2023-11-15',
    type: ProcessType.ONBOARDING,
    status: RequestStatus.IN_PROGRESS,
    createdAt: Date.now(),
    checklist: [
      { id: 't1', description: 'Collect Signed Offer', isCompleted: true, category: 'Legal', department: UserRole.HR, timeline: 'Day -14' },
      { id: 't2', description: 'Configure MacBook Pro M2', isCompleted: true, category: 'Hardware', department: UserRole.IT, timeline: 'Day -7' },
      { id: 't3', description: 'Create AWS IAM User', isCompleted: true, category: 'Access', department: UserRole.IT, timeline: 'Day -3' },
      { id: 't4', description: 'Assign Desk in Zone A', isCompleted: false, category: 'Facilities', department: UserRole.ADMIN, timeline: 'Day -2' },
      { id: 't5', description: 'Prepare Welcome Kit', isCompleted: false, category: 'General', department: UserRole.ADMIN, timeline: 'Day -1' }
    ]
  },
  {
    id: '2',
    employeeName: 'Marcus Johnson',
    role: 'Sales Director',
    department: 'Sales',
    startDate: '2023-11-20',
    type: ProcessType.OFFBOARDING,
    status: RequestStatus.PENDING,
    createdAt: Date.now() - 86400000,
    checklist: [
      { id: 't6', description: 'Conduct Exit Survey', isCompleted: false, category: 'HR', department: UserRole.HR, timeline: 'Day -7' },
      { id: 't7', description: 'Disable Salesforce Access', isCompleted: false, category: 'Access', department: UserRole.IT, timeline: 'Day 0' },
      { id: 't8', description: 'Collect Corporate Phone', isCompleted: false, category: 'Hardware', department: UserRole.IT, timeline: 'Day 0' },
      { id: 't9', description: 'Inspect Desk Area', isCompleted: false, category: 'Facilities', department: UserRole.ADMIN, timeline: 'Day 0' }
    ]
  }
];

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.HR);
  const [requests, setRequests] = useState<EmployeeRequest[]>(MOCK_REQUESTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRequest | null>(null);
  const [filter, setFilter] = useState<'ALL' | ProcessType>('ALL');
  const [search, setSearch] = useState('');

  const handleNewRequest = async (formData: any) => {
    // 1. Call AI to generate checklist for all departments
    const generatedTasks = await generateITChecklist(
      formData.role,
      formData.department,
      formData.type,
      formData.notes
    );

    const checklist: Task[] = generatedTasks.map((t) => ({
      id: uuidv4(),
      description: t.description,
      isCompleted: false,
      category: t.category,
      department: t.department,
      timeline: t.timeline
    }));

    // 2. Create new request object
    const newRequest: EmployeeRequest = {
      id: uuidv4(),
      employeeName: formData.employeeName,
      role: formData.role,
      department: formData.department,
      startDate: formData.startDate,
      type: formData.type,
      status: RequestStatus.PENDING, // Starts pending
      notes: formData.notes,
      checklist: checklist,
      createdAt: Date.now()
    };

    setRequests([newRequest, ...requests]);
  };

  const handleUpdateRequest = (updated: EmployeeRequest) => {
    setRequests(requests.map(r => r.id === updated.id ? updated : r));
  };

  // Filter Logic:
  // HR sees all requests.
  // IT sees requests that have IT tasks.
  // Admin sees requests that have Admin tasks.
  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === 'ALL' || r.type === filter;
    const matchesSearch = r.employeeName.toLowerCase().includes(search.toLowerCase()) || 
                          r.role.toLowerCase().includes(search.toLowerCase());
    
    let isRelevantToRole = true;
    if (role !== UserRole.HR) {
      // Only show requests where there is at least one task for my department
      isRelevantToRole = r.checklist.some(t => t.department === role);
    }

    return matchesFilter && matchesSearch && isRelevantToRole;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar currentRole={role} setRole={setRole} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {role === UserRole.HR ? 'Master Personnel Board' : `${role} Task Board`}
            </h1>
            <p className="text-slate-500 mt-1">
              {role === UserRole.HR 
                ? 'Oversee the entire employee lifecycle across all departments.' 
                : `Manage ${role} specific provisioning and collection tasks.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
             {role === UserRole.HR && (
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Initiate Process
                </button>
             )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
           <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
           </div>

           <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <Filter className="text-slate-400 h-4 w-4 hidden sm:block" />
              <button 
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                All Active
              </button>
              <button 
                onClick={() => setFilter(ProcessType.ONBOARDING)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap ${filter === ProcessType.ONBOARDING ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Onboarding
              </button>
              <button 
                onClick={() => setFilter(ProcessType.OFFBOARDING)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap ${filter === ProcessType.OFFBOARDING ? 'bg-red-100 text-red-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Offboarding
              </button>
           </div>
        </div>

        {/* Grid */}
        {filteredRequests.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="mx-auto h-12 w-12 text-slate-300 mb-3 bg-slate-50 rounded-full flex items-center justify-center">
                 <Inbox className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No pending tasks found</h3>
              <p className="text-slate-500 mt-1">
                  {role === UserRole.HR 
                    ? 'Create a new request to get started.' 
                    : 'You have no assigned tasks at the moment.'}
              </p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map(req => (
              <RequestCard 
                key={req.id} 
                request={req} 
                onClick={setSelectedRequest} 
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <NewRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleNewRequest}
      />

      <ChecklistDrawer 
        isOpen={!!selectedRequest}
        request={selectedRequest}
        role={role}
        onClose={() => setSelectedRequest(null)}
        onUpdate={handleUpdateRequest}
      />
    </div>
  );
};

export default App;