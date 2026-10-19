'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck2, 
  GraduationCap, 
  Baby, 
  BookOpenCheck, 
  FileText, 
  UploadCloud, 
  ShieldAlert,
  Lock
} from 'lucide-react';
import { Role } from '@/types';

export type TabType = 
  | 'overview' 
  | 'attendance' 
  | 'gradebook' 
  | 'early-years' 
  | 'homework' 
  | 'report-card' 
  | 'roster-import' 
  | 'audit-trail';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userRole: Role;
  userName: string;
}

export function Sidebar({ currentTab, onSelectTab, userRole, userName }: SidebarProps) {
  const navItems: { id: TabType; label: string; icon: React.ElementType; band?: string; allowedRoles?: Role[] }[] = [
    {
      id: 'overview',
      label: 'Institutional Overview',
      icon: LayoutDashboard,
      allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'PARENT', 'STUDENT', 'ACCOUNTANT']
    },
    {
      id: 'attendance',
      label: 'Attendance Engine',
      icon: CalendarCheck2,
      band: 'Daily & Period-wise',
      allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'PARENT', 'STUDENT']
    },
    {
      id: 'gradebook',
      label: 'Gradebook & Marks',
      icon: GraduationCap,
      band: 'Classes 1–10',
      allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'PARENT', 'STUDENT']
    },
    {
      id: 'early-years',
      label: 'Early Years Diary',
      icon: Baby,
      band: 'Nursery / LKG / UKG',
      allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'PARENT']
    },
    {
      id: 'homework',
      label: 'Homework & Materials',
      icon: BookOpenCheck,
      allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'PARENT', 'STUDENT']
    },
    {
      id: 'report-card',
      label: 'Official Report Cards',
      icon: FileText,
      band: 'Printable / PDF',
      allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'PARENT', 'STUDENT']
    },
    {
      id: 'roster-import',
      label: 'CSV Roster Ingestion',
      icon: UploadCloud,
      band: 'Admin Only',
      allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL']
    },
    {
      id: 'audit-trail',
      label: 'Immutable Audit Trail',
      icon: ShieldAlert,
      band: 'Regulatory RLS',
      allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL']
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 no-print min-h-[calc(100vh-84px)]">
      <div className="p-3">
        {/* User Persona Card */}
        <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-amber-300">
              {userName.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{userName}</p>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">
                  {userRole.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="space-y-1">
          <p className="px-2 pb-1.5 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
            System Modules
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isAccessible = !item.allowedRoles || item.allowedRoles.includes(userRole);
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isAccessible) onSelectTab(item.id);
                }}
                disabled={!isAccessible}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : isAccessible
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {!isAccessible ? (
                  <Lock className="w-3 h-3 text-slate-600 shrink-0 ml-1" />
                ) : item.band ? (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ml-1 ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.band}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer System Specs */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400 space-y-1 font-mono">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400">FRAMEWORK:</span>
          <span className="text-slate-300 font-semibold">Next.js 16 + RLS</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400">GOV-STANDARD:</span>
          <span className="text-emerald-400">CBSE/STATE K-10</span>
        </div>
      </div>
    </aside>
  );
}
