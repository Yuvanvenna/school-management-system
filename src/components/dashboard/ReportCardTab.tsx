'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  CheckCircle, 
  Award, 
  Landmark, 
  ShieldCheck, 
  GraduationCap,
  Calendar,
  Building
} from 'lucide-react';
import { School, AcademicYear, ClassSection, StudentProfile, MarkRecord, AttendanceSession } from '@/types';

interface ReportCardTabProps {
  activeSchool: School;
  academicYear: AcademicYear;
  classes: ClassSection[];
  students: StudentProfile[];
  marks: MarkRecord[];
  attendanceSessions: AttendanceSession[];
}

export function ReportCardTab({
  activeSchool,
  academicYear,
  classes,
  students,
  marks,
  attendanceSessions
}: ReportCardTabProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];
  const studentClass = classes.find(c => c.id === selectedStudent?.classId);

  // Student Marks
  const studentMarks = marks.filter(m => m.studentId === selectedStudent?.id);

  // Totals
  const totalObtained = studentMarks.reduce((acc, m) => acc + m.marksObtained, 0);
  const totalMax = studentMarks.reduce((acc, m) => acc + m.maxMarks, 0);
  const percentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '91.5';

  // Overall Grade
  const getOverallGrade = (pct: number) => {
    if (pct >= 91) return 'A1 (Outstanding)';
    if (pct >= 81) return 'A2 (Excellent)';
    if (pct >= 71) return 'B1 (Very Good)';
    if (pct >= 61) return 'B2 (Good)';
    if (pct >= 51) return 'C1 (Satisfactory)';
    if (pct >= 41) return 'C2 (Average)';
    return 'D (Pass)';
  };

  // Student Attendance Rate
  let studentPresent = 0;
  let studentTotal = 0;
  attendanceSessions.forEach(session => {
    session.records.forEach(r => {
      if (r.studentId === selectedStudent?.id) {
        studentTotal++;
        if (r.status === 'PRESENT') studentPresent++;
      }
    });
  });
  const attRate = studentTotal > 0 ? Math.round((studentPresent / studentTotal) * 100) : 96;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls (Hidden on Print) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Official Government Cumulative Progress Report</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Certified Student Report Card Generator
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Complies with Central Board of Secondary Education (CBSE) K-10 comprehensive assessment guidelines.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Official PDF Certificate</span>
            </button>
          </div>
        </div>

        {/* Student Selector */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center space-x-3">
          <label className="text-xs font-semibold text-slate-700">Select Student:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {students.map(s => {
              const cls = classes.find(c => c.id === s.classId);
              return (
                <option key={s.id} value={s.id}>
                  {s.user.name} (Roll: {s.rollNumber} | {cls?.name}-{cls?.section})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Official Government Report Card Document (Optimized for Screen & Print) */}
      <div className="report-card-container bg-white border-2 border-slate-900 rounded-xl p-8 max-w-4xl mx-auto shadow-md">
        {/* State / Directorate Heading */}
        <div className="text-center pb-5 border-b-2 border-slate-900 space-y-1">
          <div className="flex items-center justify-center space-x-2 text-slate-900 font-bold text-xs uppercase tracking-widest">
            <Landmark className="w-4 h-4 text-slate-800" />
            <span>DEPARTMENT OF SCHOOL EDUCATION & LITERACY</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight font-serif">
            {activeSchool.name}
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            {activeSchool.district}, {activeSchool.state} • Affiliation No: <span className="font-mono font-bold">{activeSchool.affiliationNo}</span> • School Code: <span className="font-mono font-bold">{activeSchool.code}</span>
          </p>
          <div className="pt-2">
            <span className="inline-block bg-slate-900 text-white font-bold text-xs px-4 py-1 rounded uppercase tracking-wider font-mono">
              OFFICIAL CUMULATIVE STUDENT PROGRESS CERTIFICATE
            </span>
          </div>
        </div>

        {/* Student Demographic & Enrollment Card */}
        <div className="my-5 p-4 bg-slate-50 border border-slate-300 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Student Full Name</span>
            <span className="font-bold text-slate-900 text-sm font-sans">{selectedStudent?.user.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Roll Number</span>
            <span className="font-bold text-slate-900">{selectedStudent?.rollNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Admission Number</span>
            <span className="font-bold text-slate-900">{selectedStudent?.admissionNo}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Academic Session</span>
            <span className="font-bold text-slate-900">{academicYear?.name || '2026-2027'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Class & Section</span>
            <span className="font-bold text-slate-900 font-sans">{studentClass?.name} - Section {studentClass?.section}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Date of Birth</span>
            <span className="font-bold text-slate-900">{selectedStudent?.dob}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Blood Group</span>
            <span className="font-bold text-slate-900">{selectedStudent?.bloodGroup || 'O+'}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold">Annual Attendance</span>
            <span className="font-bold text-emerald-700">{attRate}% Compliant</span>
          </div>
        </div>

        {/* Subject-Wise Performance Table */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono">
            PART 1: SCHOLASTIC PERFORMANCE (CURRICULUM EVALUATION)
          </h3>
          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 uppercase text-[11px]">
                <th className="border border-slate-300 px-3 py-2">Subject Description</th>
                <th className="border border-slate-300 px-3 py-2 text-center">Max Marks</th>
                <th className="border border-slate-300 px-3 py-2 text-center">Marks Secured</th>
                <th className="border border-slate-300 px-3 py-2 text-center">Percentage</th>
                <th className="border border-slate-300 px-3 py-2 text-center">Grade Scale</th>
                <th className="border border-slate-300 px-3 py-2">Teacher Assessment Remarks</th>
              </tr>
            </thead>
            <tbody>
              {studentMarks.map((m, idx) => {
                const pct = ((m.marksObtained / m.maxMarks) * 100).toFixed(1);
                return (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="border border-slate-300 px-3 py-2 font-semibold text-slate-900">
                      {m.subject}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-mono">
                      {m.maxMarks}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-mono font-bold text-slate-900">
                      {m.marksObtained}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-mono">
                      {pct}%
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-center font-mono font-bold text-emerald-700">
                      {m.grade}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-600 text-[11px]">
                      {m.remarks || 'Proficient conceptual clarity.'}
                    </td>
                  </tr>
                );
              })}

              {studentMarks.length === 0 && (
                <tr>
                  <td colSpan={6} className="border border-slate-300 px-3 py-4 text-center text-slate-500">
                    No term evaluation records published for this student.
                  </td>
                </tr>
              )}
            </tbody>
            {studentMarks.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-bold text-slate-900">
                  <td className="border border-slate-300 px-3 py-2 uppercase">AGGREGATE TOTAL</td>
                  <td className="border border-slate-300 px-3 py-2 text-center font-mono">{totalMax}</td>
                  <td className="border border-slate-300 px-3 py-2 text-center font-mono text-emerald-800">{totalObtained}</td>
                  <td className="border border-slate-300 px-3 py-2 text-center font-mono text-emerald-800">{percentage}%</td>
                  <td className="border border-slate-300 px-3 py-2 text-center font-mono text-emerald-800" colSpan={2}>
                    OVERALL RESULT: {getOverallGrade(parseFloat(percentage))}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Part 2: Co-Scholastic & Behavioral Indicators */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-mono">
            PART 2: CO-SCHOLASTIC & DISCIPLINARY EVALUATION
          </h3>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="border border-slate-300 p-2.5 rounded bg-slate-50">
              <span className="font-semibold block text-slate-800">Physical Education & Health</span>
              <span className="font-mono text-emerald-700 font-bold">Grade A (Active Participant)</span>
            </div>
            <div className="border border-slate-300 p-2.5 rounded bg-slate-50">
              <span className="font-semibold block text-slate-800">Discipline & Attendance</span>
              <span className="font-mono text-emerald-700 font-bold">Grade A (Exemplary Conduct)</span>
            </div>
            <div className="border border-slate-300 p-2.5 rounded bg-slate-50">
              <span className="font-semibold block text-slate-800">Art, Craft & Creative Expression</span>
              <span className="font-mono text-emerald-700 font-bold">Grade A (High Aptitude)</span>
            </div>
          </div>
        </div>

        {/* Signatures & Seal Section */}
        <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mb-2 flex items-end justify-center font-serif text-slate-500 italic">
              Shri Vikram Malhotra
            </div>
            <p className="font-bold text-slate-900 uppercase">Class Teacher Signature</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-800 uppercase text-center p-1 font-mono">
              OFFICIAL INSTITUTIONAL SEAL
            </div>
            <span className="text-[10px] text-slate-500 mt-1 font-mono">Dated: {new Date().toISOString().split('T')[0]}</span>
          </div>

          <div>
            <div className="h-12 border-b border-dashed border-slate-400 mb-2 flex items-end justify-center font-serif text-slate-500 italic">
              Smt. Anuradha Venkatraman
            </div>
            <p className="font-bold text-slate-900 uppercase">Principal / Head of Institution</p>
          </div>
        </div>
      </div>
    </div>
  );
}
