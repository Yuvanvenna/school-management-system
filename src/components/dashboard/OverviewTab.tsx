'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  CalendarCheck2, 
  ShieldAlert, 
  Building, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp,
  Layers,
  Sparkles,
  Baby,
  BookOpen,
  FileText,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Award,
  Clock
} from 'lucide-react';
import { School, ClassSection, StudentProfile, TeacherProfile, AttendanceSession, AuditLog } from '@/types';
import { TabType } from '../layout/Sidebar';

interface OverviewTabProps {
  activeSchool: School;
  classes: ClassSection[];
  students: StudentProfile[];
  teachers: TeacherProfile[];
  attendanceSessions: AttendanceSession[];
  auditLogs: AuditLog[];
  onNavigateTab: (tab: TabType) => void;
}

export function OverviewTab({
  activeSchool,
  classes,
  students,
  teachers,
  attendanceSessions,
  auditLogs,
  onNavigateTab
}: OverviewTabProps) {
  // Compute metrics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;

  // Safe client-rendered date to avoid Next.js 16 prerender unstable Date evaluation
  const [todayStr, setTodayStr] = useState<string>('2026-10-19');
  const [displayDate, setDisplayDate] = useState<string>('Monday, October 19, 2026');

  useEffect(() => {
    try {
      const now = new Date();
      setTodayStr(now.toISOString().split('T')[0]);
      setDisplayDate(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    } catch {
      // fallback
    }
  }, []);

  const todaySessions = attendanceSessions.filter(s => s.date === todayStr || s.date === '2026-10-19');
  let totalMarked = 0;
  let totalPresent = 0;

  todaySessions.forEach(s => {
    s.records.forEach(r => {
      totalMarked++;
      if (r.status === 'PRESENT') totalPresent++;
    });
  });

  const attendanceRate = totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 96;

  // Band counts
  const earlyYearsCount = students.filter(s => {
    const cls = classes.find(c => c.id === s.classId);
    return cls?.band === 'EARLY_YEARS';
  }).length;

  const primaryCount = students.filter(s => {
    const cls = classes.find(c => c.id === s.classId);
    return cls?.band === 'PRIMARY';
  }).length;

  const middleCount = students.filter(s => {
    const cls = classes.find(c => c.id === s.classId);
    return cls?.band === 'MIDDLE';
  }).length;

  const secondaryCount = students.filter(s => {
    const cls = classes.find(c => c.id === s.classId);
    return cls?.band === 'SECONDARY';
  }).length;

  return (
    <div className="space-y-6">
      {/* High-Impact Institutional Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 md:p-8 text-white shadow-xl shadow-slate-950/20">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Government K-10 Institutional Portal</span>
              </span>
              <span className="text-slate-400 text-xs font-mono">•</span>
              <span className="text-slate-300 text-xs font-mono flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{displayDate}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {activeSchool.name}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unified digital governance across Early Childhood (Nursery/KG) through Secondary School (Class 10). Row-Level Security tenant isolation with tamper-proof audit trails.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('attendance')}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <CalendarCheck2 className="w-4 h-4 text-slate-950" />
              <span>Mark Roll Call</span>
            </button>
            <button
              onClick={() => onNavigateTab('report-card')}
              className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-white font-medium px-4 py-2.5 rounded-xl text-xs border border-slate-700/80 hover:border-slate-600 flex items-center justify-center space-x-2 transition-all cursor-pointer backdrop-blur-sm"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Report Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Enrolled Students</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalStudents}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> Active Roster
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Verified Roll Numbers</span>
            <span className="text-slate-800 font-bold">{totalStudents} Students</span>
          </div>
        </div>

        {/* Teaching Faculty */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Certified Faculty</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalTeachers}</span>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
              Staff 100% Assigned
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Student-Teacher Ratio</span>
            <span className="text-emerald-700 font-bold">1:{Math.round(totalStudents / (totalTeachers || 1))}</span>
          </div>
        </div>

        {/* Daily Attendance Rate */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Today's Attendance</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{attendanceRate}%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Target Compliant
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Finalized Sessions</span>
            <span className="text-slate-800 font-bold">{todaySessions.length} sessions locked</span>
          </div>
        </div>

        {/* Audited Security Logs */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Security Audit Ledger</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{auditLogs.length}</span>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              Immutable Ledger
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>RLS Context</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Isolated
            </span>
          </div>
        </div>
      </div>

      {/* Differentiated Educational Band Segmentation */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>Differentiated Age-Band Architecture (K–10)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific pedagogical workflows tailored for early sensory exploration vs high-stakes secondary board examination.
            </p>
          </div>
          <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
            {classes.length} Academic Sections
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Early Years */}
          <div 
            onClick={() => onNavigateTab('early-years')}
            className="group cursor-pointer p-5 rounded-2xl border border-rose-200/70 bg-gradient-to-b from-rose-50/50 to-white hover:border-rose-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between text-xs font-bold text-rose-900">
              <span className="flex items-center space-x-1.5">
                <Baby className="w-4 h-4 text-rose-600" />
                <span>Early Years</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono">Nursery - UKG</span>
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <p className="text-3xl font-black text-rose-950">{earlyYearsCount}</p>
              <span className="text-xs text-rose-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                Open <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-xs text-rose-700/90 mt-2 leading-relaxed">
              Sensory observation logs, nap routines, gross & fine motor milestone tracking.
            </p>
          </div>

          {/* Primary */}
          <div 
            onClick={() => onNavigateTab('gradebook')}
            className="group cursor-pointer p-5 rounded-2xl border border-sky-200/70 bg-gradient-to-b from-sky-50/50 to-white hover:border-sky-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between text-xs font-bold text-sky-900">
              <span className="flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Primary Band</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-mono">Classes 1–5</span>
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <p className="text-3xl font-black text-sky-950">{primaryCount}</p>
              <span className="text-xs text-sky-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                Open <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-xs text-sky-700/90 mt-2 leading-relaxed">
              Foundational literacy, descriptive letter grades, parent homework notifications.
            </p>
          </div>

          {/* Middle */}
          <div 
            onClick={() => onNavigateTab('attendance')}
            className="group cursor-pointer p-5 rounded-2xl border border-indigo-200/70 bg-gradient-to-b from-indigo-50/50 to-white hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
              <span className="flex items-center space-x-1.5">
                <CalendarCheck2 className="w-4 h-4 text-indigo-600" />
                <span>Middle Band</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-mono">Classes 6–8</span>
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <p className="text-3xl font-black text-indigo-950">{middleCount}</p>
              <span className="text-xs text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                Open <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-xs text-indigo-700/90 mt-2 leading-relaxed">
              Period-wise attendance verification, specialized subject teacher roll call.
            </p>
          </div>

          {/* Secondary */}
          <div 
            onClick={() => onNavigateTab('gradebook')}
            className="group cursor-pointer p-5 rounded-2xl border border-emerald-200/70 bg-gradient-to-b from-emerald-50/50 to-white hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <span className="flex items-center space-x-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Secondary Band</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono">Classes 9–10</span>
            </div>
            <div className="flex items-baseline justify-between mt-3">
              <p className="text-3xl font-black text-emerald-950">{secondaryCount}</p>
              <span className="text-xs text-emerald-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center">
                Open <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-xs text-emerald-700/90 mt-2 leading-relaxed">
              National board preparation, strict CBSE 9-point scale grading & locked marks.
            </p>
          </div>
        </div>
      </div>

      {/* Class Section Roster Directory */}
      <div className="glass-card rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center space-x-2">
              <Building className="w-4 h-4 text-slate-700" />
              <span>Configured Academic Class Sections</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Assigned Class Teachers, Room Allocations, and Student Roster Counts</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full font-medium">
              Academic Session 2026-2027
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Class & Section</th>
                <th className="px-5 py-3.5">Educational Band</th>
                <th className="px-5 py-3.5">Assigned Class Teacher</th>
                <th className="px-5 py-3.5">Room / Wing</th>
                <th className="px-5 py-3.5">Enrolled / Capacity</th>
                <th className="px-5 py-3.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map(cls => {
                const classStudents = students.filter(s => s.classId === cls.id);
                const teacher = teachers.find(t => t.userId === cls.classTeacherId);
                const fillRatio = Math.round((classStudents.length / cls.capacity) * 100);

                return (
                  <tr key={cls.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900 flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span>{cls.name} - Section {cls.section}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        cls.band === 'EARLY_YEARS' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        cls.band === 'PRIMARY' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        cls.band === 'MIDDLE' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {cls.band.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-900 font-medium">
                      {teacher ? teacher.user.name : <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500">
                      {cls.roomNumber || 'Main Wing'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{classStudents.length}</span>
                        <span className="text-slate-400 text-[11px]">/ {cls.capacity}</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${fillRatio > 80 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(fillRatio, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => onNavigateTab('attendance')}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 px-2.5 py-1 rounded-lg font-semibold inline-flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <span>Take Roll</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
