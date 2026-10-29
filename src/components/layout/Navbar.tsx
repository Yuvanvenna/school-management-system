'use client';

import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Landmark, 
  RefreshCw,
  Sparkles,
  ChevronDown
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
  // Role accent color indicator
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SCHOOL_ADMIN':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'PRINCIPAL':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'CLASS_TEACHER':
      case 'TEACHER':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'PARENT':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'STUDENT':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800/80 text-white sticky top-0 z-40 shadow-lg no-print">
      {/* Top Official Ministry Ribbon */}
      <div className="bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-1.5 border-b border-slate-800/60 flex items-center justify-between text-xs tracking-wide">
        <div className="flex items-center space-x-3 text-slate-300">
          <span className="flex items-center space-x-1.5 font-semibold text-amber-400">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span className="tracking-wider">MINISTRY OF EDUCATION & LITERACY</span>
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            National Institutional School Governance Engine (CBSE & State Board Standard)
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-emerald-950/80 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-800/60 font-mono text-[11px] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">TENANT RLS: ACTIVE</span>
          </div>
          <button 
            onClick={onResetData}
            title="Reset system to default seed data"
            className="hover:text-amber-300 hover:bg-slate-800/60 px-2 py-0.5 rounded transition-all flex items-center space-x-1.5 cursor-pointer text-slate-400 text-[11px]"
          >
            <RefreshCw className="w-3 h-3 hover:rotate-180 transition-transform duration-500" />
            <span className="hidden sm:inline">Reset Seed Data</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Body */}
      <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Emblem & School Identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/40 text-slate-950 font-black">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="font-bold text-base md:text-lg tracking-tight text-white leading-tight">
                {activeSchool.name}
              </h1>
              <span className="bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono">
                {activeSchool.code}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex flex-wrap items-center gap-1.5 mt-0.5">
              <span>{activeSchool.district}, {activeSchool.state}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400/90 font-mono text-[11px] font-medium">Affiliation: {activeSchool.affiliationNo}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono text-[10px]">Est. {activeSchool.establishedYear}</span>
            </p>
          </div>
        </div>

        {/* Right: Tenant Switcher & Role Persona Switcher */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Tenant Switcher */}
          <div className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-900 rounded-xl px-2.5 py-1.5 border border-slate-800 focus-within:border-amber-500/60 transition-all shadow-inner">
            <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Institution:</span>
            </span>
            <select
              value={activeSchool.id}
              onChange={(e) => onSelectSchool(e.target.value)}
              className="bg-transparent text-white rounded text-xs focus:outline-none font-medium cursor-pointer max-w-[200px] truncate"
            >
              {schools.map(school => (
                <option key={school.id} value={school.id} className="bg-slate-900 text-white py-1">
                  {school.name.length > 26 ? school.name.substring(0, 26) + '...' : school.name} ({school.code})
                </option>
              ))}
            </select>
          </div>

          {/* Persona / Role Quick Switcher */}
          <div className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-900 rounded-xl px-2.5 py-1.5 border border-slate-800 focus-within:border-indigo-500/60 transition-all shadow-inner">
            <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Persona:</span>
            </span>
            <select
              value={currentUser.id}
              onChange={(e) => onSelectUser(e.target.value)}
              className="bg-transparent text-white rounded text-xs focus:outline-none font-medium cursor-pointer max-w-[210px] truncate"
            >
              {users
                .filter(u => u.schoolId === activeSchool.id)
                .map(user => (
                  <option key={user.id} value={user.id} className="bg-slate-900 text-white py-1">
                    {user.name} ({user.role.replace('_', ' ')})
                  </option>
                ))}
            </select>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getRoleBadgeColor(currentUser.role)} font-semibold uppercase`}>
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
