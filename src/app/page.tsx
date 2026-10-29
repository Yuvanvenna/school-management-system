'use client';

import React, { useState } from 'react';
import { useSchoolStore } from '@/lib/store';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar, TabType } from '@/components/layout/Sidebar';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { AttendanceTab } from '@/components/dashboard/AttendanceTab';
import { GradebookTab } from '@/components/dashboard/GradebookTab';
import { EarlyYearsTab } from '@/components/dashboard/EarlyYearsTab';
import { HomeworkTab } from '@/components/dashboard/HomeworkTab';
import { ReportCardTab } from '@/components/dashboard/ReportCardTab';
import { RosterImportTab } from '@/components/dashboard/RosterImportTab';
import { AuditTrailTab } from '@/components/dashboard/AuditTrailTab';
import { Landmark, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function Home() {
  const store = useSchoolStore();
  const [currentTab, setCurrentTab] = useState<TabType>('overview');

  return (
    <div className="min-h-screen bg-slate-900/5 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Official Government Navbar */}
      <Navbar
        schools={store.schools}
        activeSchool={store.activeSchool}
        onSelectSchool={store.setActiveSchoolId}
        users={store.users}
        currentUser={store.currentUser}
        onSelectUser={store.switchUser}
        onResetData={store.resetToSeedData}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-[1520px] mx-auto shadow-xs">
        {/* Role-Aware Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userRole={store.currentUser.role}
          userName={store.currentUser.name}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'overview' && (
            <OverviewTab
              activeSchool={store.activeSchool}
              classes={store.classes}
              students={store.students}
              teachers={store.teachers}
              attendanceSessions={store.attendanceSessions}
              auditLogs={store.auditLogs}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceTab
              classes={store.classes}
              students={store.students}
              attendanceSessions={store.attendanceSessions}
              currentUser={store.currentUser}
              onRecordAttendance={store.recordAttendance}
            />
          )}

          {currentTab === 'gradebook' && (
            <GradebookTab
              classes={store.classes}
              students={store.students}
              marks={store.marks}
              currentUser={store.currentUser}
              onRecordMark={store.recordMark}
            />
          )}

          {currentTab === 'early-years' && (
            <EarlyYearsTab
              classes={store.classes}
              students={store.students}
              homework={store.homework}
              currentUser={store.currentUser}
              onCreateActivity={store.createHomework}
            />
          )}

          {currentTab === 'homework' && (
            <HomeworkTab
              classes={store.classes}
              homework={store.homework}
              currentUser={store.currentUser}
              onCreateHomework={store.createHomework}
            />
          )}

          {currentTab === 'report-card' && (
            <ReportCardTab
              activeSchool={store.activeSchool}
              academicYear={store.currentAcademicYear}
              classes={store.classes}
              students={store.students}
              marks={store.marks}
              attendanceSessions={store.attendanceSessions}
            />
          )}

          {currentTab === 'roster-import' && (
            <RosterImportTab
              classes={store.classes}
              students={store.students}
              onImportCSV={store.importStudentsFromCSV}
            />
          )}

          {currentTab === 'audit-trail' && (
            <AuditTrailTab
              activeSchool={store.activeSchool}
              auditLogs={store.auditLogs}
            />
          )}
        </main>
      </div>

      {/* Official Government Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-5 px-6 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Landmark className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-slate-300 font-semibold">
                Unified National Institutional Education Platform
              </span>
              <span className="text-slate-400 hidden md:inline ml-1.5">
                • Directorate of School Education & Literacy (NIC Cloud Engine)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-400 font-mono text-[10px]">
            <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>ISO 27001 AUDITED</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>TENANT: {store.activeSchool.code}</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400">SESSION: 2026-27</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
