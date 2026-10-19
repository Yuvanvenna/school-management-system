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
import { Landmark, ShieldCheck } from 'lucide-react';

export default function Home() {
  const store = useSchoolStore();
  const [currentTab, setCurrentTab] = useState<TabType>('overview');

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
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
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Role-Aware Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userRole={store.currentUser.role}
          userName={store.currentUser.name}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
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
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 px-6 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-medium">
              National Institutional Education Portal • Hosted by National Informatics Centre (NIC)
            </span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400 font-mono">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ISO 27001 / CERT-IN AUDITED</span>
            </span>
            <span>•</span>
            <span>TENANT ID: {store.activeSchool.code}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
