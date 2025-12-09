import React, { useState } from 'react';
import { ProcessType } from '../types';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const NewRequestModal: React.FC<NewRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    role: '',
    department: '',
    startDate: '',
    type: ProcessType.ONBOARDING,
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
    onClose();
    // Reset form
    setFormData({
      employeeName: '',
      role: '',
      department: '',
      startDate: '',
      type: ProcessType.ONBOARDING,
      notes: ''
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">New Personnel Request</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="space-y-4">
            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: ProcessType.ONBOARDING})}
                className={`py-2 text-sm font-medium rounded-md transition-all ${
                  formData.type === ProcessType.ONBOARDING
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Onboarding
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: ProcessType.OFFBOARDING})}
                className={`py-2 text-sm font-medium rounded-md transition-all ${
                  formData.type === ProcessType.OFFBOARDING
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Offboarding
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employee Name</label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.employeeName}
                onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title / Role</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  placeholder="e.g. Senior Designer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  placeholder="e.g. Marketing"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {formData.type === ProcessType.ONBOARDING ? 'Start Date' : 'Last Working Day'}
              </label>
              <input
                required
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
              <textarea
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Specific hardware requests, special permissions, etc."
              />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg flex items-start space-x-3 text-sm text-blue-700">
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                <p>
                    When you submit, AI will automatically generate a tailored checklist for IT based on the Role and Department.
                </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md shadow-blue-200 disabled:opacity-70 flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequestModal;
