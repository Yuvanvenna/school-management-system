'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  CalendarCheck2, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  Edit3,
  Calendar,
  Layers,
  Sparkles,
  Users,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { 
  ClassSection, 
  StudentProfile, 
  AttendanceSession, 
  AttendanceStatus, 
  Role, 
  User 
} from '@/types';

interface AttendanceTabProps {
  classes: ClassSection[];
  students: StudentProfile[];
  attendanceSessions: AttendanceSession[];
  currentUser: User;
  onRecordAttendance: (
    classId: string,
    date: string,
    period: number | null,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    isUpdate?: boolean
  ) => AttendanceSession;
}

export function AttendanceTab({
  classes,
  students,
  attendanceSessions,
  currentUser,
  onRecordAttendance
}: AttendanceTabProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [attendanceDate, setAttendanceDate] = useState<string>('2026-10-19');

  useEffect(() => {
    try {
      setAttendanceDate(new Date().toISOString().split('T')[0]);
    } catch {
      // fallback
    }
  }, []);

  const [mode, setMode] = useState<'DAILY' | 'PERIOD'>('DAILY');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const classStudents = useMemo(() => {
    return students.filter(s => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Check if session already exists for this class, date, and period
  const effectivePeriod = mode === 'PERIOD' ? selectedPeriod : null;
  const existingSession = useMemo(() => {
    return attendanceSessions.find(
      s => s.classId === selectedClassId && s.date === attendanceDate && s.period === effectivePeriod
    );
  }, [attendanceSessions, selectedClassId, attendanceDate, effectivePeriod]);

  // Attendance status mapping
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});

  // Sync statuses when class, date, period or existingSession changes
  useEffect(() => {
    if (existingSession) {
      const initialMap: Record<string, AttendanceStatus> = {};
      const remarksMap: Record<string, string> = {};
      existingSession.records.forEach(r => {
        initialMap[r.studentId] = r.status;
        if (r.remarks) remarksMap[r.studentId] = r.remarks;
      });
      setStatuses(initialMap);
      setRemarks(remarksMap);
      setIsEditMode(false);
    } else {
      // Default all present
      const initialMap: Record<string, AttendanceStatus> = {};
      classStudents.forEach(s => {
        initialMap[s.id] = 'PRESENT';
      });
      setStatuses(initialMap);
      setRemarks({});
      setIsEditMode(false);
    }
    setFeedback(null);
  }, [existingSession, classStudents]);

  // "Mark All Present"
  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    classStudents.forEach(s => {
      updated[s.id] = 'PRESENT';
    });
    setStatuses(updated);
  };

  // Toggle single student status
  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    setStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  // Submit attendance
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      const records = classStudents.map(s => ({
        studentId: s.id,
        status: statuses[s.id] || 'PRESENT',
        remarks: remarks[s.id] || undefined
      }));

      onRecordAttendance(
        selectedClassId,
        attendanceDate,
        effectivePeriod,
        records,
        Boolean(existingSession && isEditMode)
      );

      setFeedback({
        type: 'success',
        message: existingSession && isEditMode
          ? `Attendance successfully adjusted and recorded in compliance audit log.`
          : `Attendance finalized and locked for ${selectedClass?.name}-${selectedClass?.section} (${attendanceDate}, ${effectivePeriod ? `Period ${effectivePeriod}` : 'Daily'}).`
      });
      setIsEditMode(false);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error recording attendance session.'
      });
    }
  };

  // Compute counts
  const presentCount = Object.values(statuses).filter(s => s === 'PRESENT').length;
  const absentCount = Object.values(statuses).filter(s => s === 'ABSENT').length;
  const lateCount = Object.values(statuses).filter(s => s === 'LATE').length;
  const leaveCount = Object.values(statuses).filter(s => s === 'APPROVED_LEAVE').length;

  return (
    <div className="space-y-6">
      {/* Title & Banner Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <CalendarCheck2 className="w-4 h-4 text-amber-500" />
              <span>Official Institutional Attendance Engine</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Class Attendance Registration & Verification
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Double-entry protection on (Class, Date, Period) prevents accidental duplicates. Post-finalization changes generate mandatory audit entries.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-center">
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-xl border border-slate-200 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Officer: <strong className="text-slate-900">{currentUser.name}</strong></span>
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Class & Section
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 shadow-xs cursor-pointer transition-all"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} - Section {c.section} ({c.band.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Attendance Date
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 shadow-xs cursor-pointer transition-all font-mono"
            />
          </div>

          {/* Mode Selector (Daily vs Period-wise) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tracking Granularity
            </label>
            <div className="flex rounded-xl border border-slate-200 bg-slate-100/70 p-1 text-xs">
              <button
                type="button"
                onClick={() => setMode('DAILY')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all cursor-pointer ${
                  mode === 'DAILY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Daily Roll Call
              </button>
              <button
                type="button"
                onClick={() => setMode('PERIOD')}
                className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all cursor-pointer ${
                  mode === 'PERIOD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Period-Wise
              </button>
            </div>
          </div>

          {/* Period Selector (if period mode) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Period Slot
            </label>
            {mode === 'PERIOD' ? (
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 shadow-xs cursor-pointer transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                  <option key={p} value={p}>
                    Period {p} ({8 + p}:00 - {8 + p}:45)
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-slate-100 text-slate-500 rounded-xl px-3.5 py-2.5 text-xs font-mono border border-slate-200 font-semibold flex items-center justify-between">
                <span>Full-Day Assembly</span>
                <span className="text-emerald-600">Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs shadow-sm ${
          feedback.type === 'success'
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
            : 'bg-rose-50/90 border-rose-200 text-rose-900'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="font-semibold">{feedback.message}</div>
        </div>
      )}

      {/* Existing Session Alert / Duplicate Guard Indicator */}
      {existingSession && (
        <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-200/60 rounded-xl text-amber-800 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-amber-950 text-sm">
                Finalized Attendance Record Found (Double-Entry Guard)
              </p>
              <p className="text-amber-800 mt-1">
                Attendance for <strong className="font-bold text-amber-950">{selectedClass?.name}-{selectedClass?.section}</strong> on {attendanceDate} ({effectivePeriod ? `Period ${effectivePeriod}` : 'Daily'}) was already locked by <strong className="font-bold text-amber-950">{existingSession.takenByName}</strong>.
              </p>
            </div>
          </div>
          <div>
            {!isEditMode ? (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 transition shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Audit Adjustment Mode</span>
              </button>
            ) : (
              <span className="bg-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-bold font-mono text-[11px] border border-amber-300/80">
                AUDIT CORRECTION MODE ACTIVE
              </span>
            )}
          </div>
        </div>
      )}

      {/* Roster & Attendance Form */}
      <div className="glass-card rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        {/* Controls Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="font-extrabold text-slate-900 text-sm md:text-base flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Student Register ({classStudents.length} Enrolled)</span>
            </h3>

            {/* Quick Metrics Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-bold border border-emerald-200">
                P: {presentCount}
              </span>
              <span className="bg-rose-100 text-rose-800 px-2.5 py-1 rounded-lg font-bold border border-rose-200">
                A: {absentCount}
              </span>
              <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg font-bold border border-amber-200">
                L: {lateCount}
              </span>
              <span className="bg-sky-100 text-sky-800 px-2.5 py-1 rounded-lg font-bold border border-sky-200">
                Leave: {leaveCount}
              </span>
            </div>
          </div>

          {(!existingSession || isEditMode) && (
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Mark All Present</span>
            </button>
          )}
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Roll No</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Admission No</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Quick Action</th>
                <th className="px-5 py-3.5">Remarks / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map(student => {
                const currentStatus = statuses[student.id] || 'PRESENT';
                const isLocked = existingSession && !isEditMode;

                return (
                  <tr key={student.id} className="hover:bg-indigo-50/25 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {student.rollNumber}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {student.user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{student.user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">
                      {student.admissionNo}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase inline-flex items-center gap-1 ${
                        currentStatus === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        currentStatus === 'ABSENT' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        currentStatus === 'LATE' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-sky-100 text-sky-800 border border-sky-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          currentStatus === 'PRESENT' ? 'bg-emerald-500' :
                          currentStatus === 'ABSENT' ? 'bg-rose-500' :
                          currentStatus === 'LATE' ? 'bg-amber-500' : 'bg-sky-500'
                        }`}></span>
                        {currentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200 gap-0.5">
                        <button
                          type="button"
                          disabled={Boolean(isLocked)}
                          onClick={() => handleSetStatus(student.id, 'PRESENT')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          disabled={Boolean(isLocked)}
                          onClick={() => handleSetStatus(student.id, 'ABSENT')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            currentStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          disabled={Boolean(isLocked)}
                          onClick={() => handleSetStatus(student.id, 'LATE')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            currentStatus === 'LATE'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          disabled={Boolean(isLocked)}
                          onClick={() => handleSetStatus(student.id, 'APPROVED_LEAVE')}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            currentStatus === 'APPROVED_LEAVE'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <input
                        type="text"
                        disabled={Boolean(isLocked)}
                        value={remarks[student.id] || ''}
                        onChange={(e) => setRemarks({ ...remarks, [student.id]: e.target.value })}
                        placeholder={currentStatus === 'ABSENT' ? 'Specify absence reason...' : 'Notes'}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Submit Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-mono">
            {existingSession && !isEditMode 
              ? '🔒 Record finalized. Click "Audit Adjustment Mode" to make certified corrections.'
              : '⚡ Finalizing records commits an immutable compliance log with actor fingerprint.'}
          </p>

          {(!existingSession || isEditMode) && (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{isEditMode ? 'Commit Audited Correction' : 'Finalize & Lock Attendance'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
