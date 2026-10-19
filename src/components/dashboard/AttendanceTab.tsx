'use client';

import React, { useState, useMemo } from 'react';
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
  Sparkles
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
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
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
  React.useEffect(() => {
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
      {/* Title & Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              <CalendarCheck2 className="w-4 h-4 text-amber-600" />
              <span>Official Daily & Period Attendance Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Class Attendance Registration & Verification
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Implements double-entry protection on (Class, Date, Period) with automated audit traceability for post-finalization adjustments.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
              Actor: <span className="font-semibold text-slate-900">{currentUser.name}</span>
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Class Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Target Class & Section
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
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
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Attendance Date
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            />
          </div>

          {/* Mode Selector (Daily vs Period-wise) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tracking Granularity
            </label>
            <div className="flex rounded-lg border border-slate-300 bg-slate-50 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMode('DAILY')}
                className={`flex-1 py-1.5 rounded-md font-medium text-center transition cursor-pointer ${
                  mode === 'DAILY' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Daily Roll Call
              </button>
              <button
                type="button"
                onClick={() => setMode('PERIOD')}
                className={`flex-1 py-1.5 rounded-md font-medium text-center transition cursor-pointer ${
                  mode === 'PERIOD' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Period-Wise
              </button>
            </div>
          </div>

          {/* Period Selector (if period mode) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Period Slot
            </label>
            {mode === 'PERIOD' ? (
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                  <option key={p} value={p}>
                    Period {p} ({8 + p}:00 - {8 + p}:45)
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-slate-100 text-slate-500 rounded-lg px-3 py-2 text-xs font-mono border border-slate-200">
                Full-Day Session
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
          feedback.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Existing Session Alert / Duplicate Guard Indicator */}
      {existingSession && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start space-x-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">
                Existing Finalized Session Detected
              </p>
              <p className="text-amber-800 mt-0.5">
                Attendance for <span className="font-semibold">{selectedClass?.name}-{selectedClass?.section}</span> on {attendanceDate} ({effectivePeriod ? `Period ${effectivePeriod}` : 'Daily'}) was already finalized by <span className="font-semibold">{existingSession.takenByName}</span>.
              </p>
            </div>
          </div>
          <div>
            {!isEditMode ? (
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Enable Audit Adjustment Mode</span>
              </button>
            ) : (
              <span className="bg-amber-200 text-amber-900 px-2.5 py-1 rounded font-semibold font-mono text-[11px]">
                AUDIT CORRECTION ACTIVE
              </span>
            )}
          </div>
        </div>
      )}

      {/* Roster & Attendance Form */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Controls Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Student Attendance Register ({classStudents.length} Enrolled)
            </h3>
            {/* Quick Metrics */}
            <div className="flex items-center space-x-2 text-[11px] font-mono">
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                P: {presentCount}
              </span>
              <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold">
                A: {absentCount}
              </span>
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                L: {lateCount}
              </span>
              <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-semibold">
                Leave: {leaveCount}
              </span>
            </div>
          </div>

          {(!existingSession || isEditMode) && (
            <button
              type="button"
              onClick={handleMarkAllPresent}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition shadow-xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark All Present</span>
            </button>
          )}
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Admission No</th>
                <th className="px-4 py-3">Current Status</th>
                <th className="px-4 py-3">Status Toggle</th>
                <th className="px-4 py-3">Remarks / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {classStudents.map(student => {
                const currentStatus = statuses[student.id] || 'PRESENT';
                const isLocked = existingSession && !isEditMode;

                return (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {student.rollNumber}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {student.user.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500">
                      {student.admissionNo}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        currentStatus === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                        currentStatus === 'ABSENT' ? 'bg-rose-100 text-rose-800' :
                        currentStatus === 'LATE' ? 'bg-amber-100 text-amber-800' :
                        'bg-sky-100 text-sky-800'
                      }`}>
                        {currentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          disabled={Boolean(isLocked)}
                          onClick={() => handleSetStatus(student.id, 'PRESENT')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          disabled={Boolean(isLocked)}
                          onClick={() => handleSetStatus(student.id, 'ABSENT')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                            currentStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          disabled={Boolean(isLocked)}
                          onClick={() => handleSetStatus(student.id, 'LATE')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                            currentStatus === 'LATE'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          disabled={Boolean(isLocked)}
                          onClick={() => handleSetStatus(student.id, 'APPROVED_LEAVE')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                            currentStatus === 'APPROVED_LEAVE'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
                          }`}
                        >
                          Leave
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        disabled={Boolean(isLocked)}
                        value={remarks[student.id] || ''}
                        onChange={(e) => setRemarks({ ...remarks, [student.id]: e.target.value })}
                        placeholder={currentStatus === 'ABSENT' ? 'Specify reason...' : 'Optional notes'}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Submit Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-mono">
            {existingSession && !isEditMode 
              ? '🔒 Record finalized. Click "Enable Audit Adjustment Mode" to update.'
              : '⚡ Submitting records will write an immutable audit log entry.'}
          </p>

          {(!existingSession || isEditMode) && (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
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
