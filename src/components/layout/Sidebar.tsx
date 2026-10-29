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
  Lock,
  Sparkles,
  ShieldCheck
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
  const navSections: {
    title: string;
    items: {
      id: TabType;
      label: string;
      icon: React.ElementType;
      badge?: string;
      badgeColor?: string;
      allowedRoles?: Role[];
    }[];
  }[] = [
    {
      title: 'Institutional Governance',
      items: [
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
          badge: 'Daily & Period',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
          allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'PARENT', 'STUDENT']
        }
      ]
    },
    {
      title: 'Academic Delivery (K–10)',
      items: [
        {
          id: 'gradebook',
          label: 'Certified Gradebook',
          icon: GraduationCap,
          badge: 'Classes 1–10',
          badgeColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
          allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'PARENT', 'STUDENT']
        },
        {
          id: 'early-years',
          label: 'Early Years Diary',
          icon: Baby,
          badge: 'Nursery / KG',
          badgeColor: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
          allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'PARENT']
        },
        {
          id: 'homework',
          label: 'Curricular Homework',
          icon: BookOpenCheck,
          allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'PARENT', 'STUDENT']
        },
        {
          id: 'report-card',
          label: 'Official Report Cards',
          icon: FileText,
          badge: 'CBSE PDF',
          badgeColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
          allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'CLASS_TEACHER', 'PARENT', 'STUDENT']
        }
      ]
    },
    {
      title: 'Administrative Controls',
      items: [
        {
          id: 'roster-import',
          label: 'CSV Roster Ingestion',
          icon: UploadCloud,
          badge: 'Admin Only',
          badgeColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
          allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL']
        },
        {
          id: 'audit-trail',
          label: 'Immutable Audit Trail',
          icon: ShieldAlert,
          badge: 'RLS Safe',
          badgeColor: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
          allowedRoles: ['SCHOOL_ADMIN', 'PRINCIPAL']
        }
      ]
    }
  ];

  return (
    <aside className="w-full md:w-68 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0 no-print min-h-[calc(100vh-100px)]">
      <div className="p-3.5 space-y-4">
        {/* User Persona Profile Card */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/90 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-bold text-xs text-slate-950 shadow-md shadow-amber-500/20">
              {userName.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] font-mono text-amber-300 font-semibold tracking-wide uppercase">
                  {userRole.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-2.5 pb-1 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                {section.title}
              </p>
              {section.items.map((item) => {
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer group ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : isAccessible
                        ? 'text-slate-300 hover:bg-slate-900/80 hover:text-white hover:translate-x-0.5'
                        : 'text-slate-600 opacity-45 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive 
                          ? 'text-slate-950 scale-105' 
                          : isAccessible 
                          ? 'text-slate-400 group-hover:text-amber-400' 
                          : 'text-slate-600'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {!isAccessible ? (
                      <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0 ml-1.5" />
                    ) : item.badge ? (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-medium shrink-0 ml-1.5 ${
                        isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer System Specs */}
      <div className="p-3.5 m-3 rounded-xl border border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400 space-y-1.5 font-mono">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400">ISOLATION:</span>
          <span className="text-emerald-400 font-semibold flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>RLS Active</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400">FRAMEWORK:</span>
          <span className="text-slate-300 font-medium">Next.js 16 + React 19</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-400">CURRICULUM:</span>
          <span className="text-amber-400 font-medium">CBSE / State K-10</span>
        </div>
      </div>
    </aside>
  );
}
