'use client';

import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Landmark, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { School, User } from '@/types';

interface NavbarProps {
  schools: School[];
  activeSchool: School;
  onSelectSchool: (schoolId: string) => void;
  users: User[];
  currentUser: User;
  onSelectUser: (userId: string) => void;
  onResetData: () => void;
}

export function Navbar({
  schools,
  activeSchool,
  onSelectSchool,
  users,
  currentUser,
  onSelectUser,
  onResetData
}: NavbarProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-sm no-print">
      {/* Top Ministry Ribbon */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-xs tracking-wide">
        <div className="flex items-center space-x-3 text-slate-300">
          <span className="flex items-center space-x-1 font-semibold text-amber-400">
            <Landmark className="w-3.5 h-3.5" />
            <span>MINISTRY OF EDUCATION & LITERACY</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">Unified Multi-Tenant K-10 Institutional Governance Platform</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-400">
          <span className="flex items-center space-x-1.5 bg-emerald-950/80 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/60 font-mono text-[11px]">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>TENANT RLS: ACTIVE</span>
          </span>
          <button 
            onClick={onResetData}
            title="Reset to default seed data"
            className="hover:text-amber-300 transition-colors flex items-center space-x-1 cursor-pointer text-slate-400 text-[11px]"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Emblem & School Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md border border-amber-400/40 font-bold text-slate-950 text-base">
            <Building2 className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base tracking-tight text-white leading-tight">
                {activeSchool.name}
              </h1>
              <span className="bg-blue-900/60 text-blue-300 border border-blue-700/60 text-[10px] px-1.5 py-0.5 rounded font-mono">
                {activeSchool.code}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5">
              <span>{activeSchool.district}, {activeSchool.state}</span>
              <span>•</span>
              <span className="text-amber-400/90 font-mono text-[11px]">{activeSchool.affiliationNo}</span>
            </p>
          </div>
        </div>

        {/* Right: Tenant Switcher & Role Persona Switcher */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Tenant Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-800/90 rounded-lg p-1 border border-slate-700 text-xs">
            <span className="text-slate-400 pl-2 pr-1 font-medium text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Tenant:
            </span>
            <select
              value={activeSchool.id}
              onChange={(e) => onSelectSchool(e.target.value)}
              className="bg-slate-900 text-white rounded px-2.5 py-1 text-xs border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
            >
              {schools.map(school => (
                <option key={school.id} value={school.id} className="bg-slate-900 text-white">
                  {school.name.length > 28 ? school.name.substring(0, 28) + '...' : school.name} ({school.code})
                </option>
              ))}
            </select>
          </div>

          {/* Persona / Role Quick Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-800/90 rounded-lg p-1 border border-slate-700 text-xs">
            <span className="text-slate-400 pl-2 pr-1 font-medium text-[11px] uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              Active Role:
            </span>
            <select
              value={currentUser.id}
              onChange={(e) => onSelectUser(e.target.value)}
              className="bg-slate-900 text-white rounded px-2.5 py-1 text-xs border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium cursor-pointer"
            >
              {users
                .filter(u => u.schoolId === activeSchool.id)
                .map(user => (
                  <option key={user.id} value={user.id} className="bg-slate-900 text-white">
                    {user.name} [{user.role.replace('_', ' ')}]
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
