import React from 'react';
import { UserRole } from '../types';
import { RefreshCw, Users, Server, Building2 } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentRole, setRole }) => {
  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">LinkIT <span className="font-normal text-slate-400 text-sm">Enterprise</span></span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 text-sm hidden md:block">Current Workspace:</span>
            <div className="bg-slate-800 p-1 rounded-lg flex space-x-1 overflow-x-auto">
              <button
                onClick={() => setRole(UserRole.HR)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  currentRole === UserRole.HR
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                HR
              </button>
              <button
                onClick={() => setRole(UserRole.IT)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  currentRole === UserRole.IT
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Server className="w-4 h-4 mr-2" />
                IT
              </button>
              <button
                onClick={() => setRole(UserRole.ADMIN)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  currentRole === UserRole.ADMIN
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;