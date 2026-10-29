'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  GraduationCap, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Award,
  Layers,
  BookOpen,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  ClassSection, 
  StudentProfile, 
  MarkRecord, 
  User 
} from '@/types';

interface GradebookTabProps {
  classes: ClassSection[];
  students: StudentProfile[];
  marks: MarkRecord[];
  currentUser: User;
  onRecordMark: (
    studentId: string,
    subject: string,
    assessment: string,
    marksObtained: number,
    maxMarks: number,
    grade: string,
    remarks?: string
  ) => MarkRecord;
}

export function GradebookTab({
  classes,
  students,
  marks,
  currentUser,
  onRecordMark
}: GradebookTabProps) {
  // Non-early-years classes
  const academicClasses = useMemo(() => {
    return classes.filter(c => c.band !== 'EARLY_YEARS');
  }, [classes]);

  const [selectedClassId, setSelectedClassId] = useState<string>(
    academicClasses[0]?.id || classes[0]?.id || ''
  );

  const subjects = ['Mathematics', 'Science', 'English Language & Lit', 'Social Science', 'Hindi / Regional'];
  const assessments = ['Term 1 Mid-Term Board Prep Exam', 'Unit Test 1', 'Term 2 Final Exam', 'Practical Assessment'];

  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]);
  const [selectedAssessment, setSelectedAssessment] = useState<string>(assessments[0]);
  const [maxMarks, setMaxMarks] = useState<number>(80);

  // Mark values state
  const [marksState, setMarksState] = useState<Record<string, string>>({});
  const [remarksState, setRemarksState] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classStudents = useMemo(() => {
    return students.filter(s => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Sync existing marks for the selected student/subject/assessment
  useEffect(() => {
    const newMarksMap: Record<string, string> = {};
    const newRemarksMap: Record<string, string> = {};

    classStudents.forEach(s => {
      const existing = marks.find(
        m => m.studentId === s.id && m.subject === selectedSubject && m.assessment === selectedAssessment
      );
      if (existing) {
        newMarksMap[s.id] = String(existing.marksObtained);
        newRemarksMap[s.id] = existing.remarks || '';
      }
    });

    setMarksState(newMarksMap);
    setRemarksState(newRemarksMap);
    setValidationErrors({});
    setFeedback(null);
  }, [selectedClassId, selectedSubject, selectedAssessment, classStudents, marks]);

  // Calculate grade based on percentage (Standard CBSE/Government K-10 scale)
  const calculateGrade = (obtained: number, max: number): { grade: string; color: string } => {
    if (max <= 0 || isNaN(obtained)) return { grade: '—', color: 'bg-slate-100 text-slate-500' };
    const pct = (obtained / max) * 100;
    if (pct >= 91) return { grade: 'A1', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (pct >= 81) return { grade: 'A2', color: 'bg-teal-100 text-teal-800 border-teal-300' };
    if (pct >= 71) return { grade: 'B1', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (pct >= 61) return { grade: 'B2', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    if (pct >= 51) return { grade: 'C1', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    if (pct >= 41) return { grade: 'C2', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    if (pct >= 33) return { grade: 'D', color: 'bg-purple-100 text-purple-800 border-purple-300' };
    return { grade: 'E', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  // Handle Mark input change with validation
  const handleMarkChange = (studentId: string, val: string) => {
    setMarksState(prev => ({ ...prev, [studentId]: val }));

    const num = parseFloat(val);
    if (!isNaN(num)) {
      if (num < 0) {
        setValidationErrors(prev => ({ ...prev, [studentId]: 'Marks cannot be negative' }));
      } else if (num > maxMarks) {
        setValidationErrors(prev => ({ 
          ...prev, 
          [studentId]: `Marks (${num}) exceed Max (${maxMarks})!` 
        }));
      } else {
        setValidationErrors(prev => {
          const next = { ...prev };
          delete next[studentId];
          return next;
        });
      }
    } else if (val === '') {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
    }
  };

  // Submit and lock marks
  const handleSaveMarks = () => {
    if (Object.keys(validationErrors).length > 0) {
      setFeedback({
        type: 'error',
        message: 'Cannot finalize grades: Please resolve marks exceeding maximum limits before saving.'
      });
      return;
    }

    try {
      let savedCount = 0;
      for (const student of classStudents) {
        const valStr = marksState[student.id];
        if (valStr !== undefined && valStr !== '') {
          const obtained = parseFloat(valStr);
          if (isNaN(obtained)) continue;

          if (obtained > maxMarks) {
            throw new Error(`Validation Error: Student ${student.user.name} marks (${obtained}) exceed Max (${maxMarks})`);
          }

          const gradeObj = calculateGrade(obtained, maxMarks);
          onRecordMark(
            student.id,
            selectedSubject,
            selectedAssessment,
            obtained,
            maxMarks,
            gradeObj.grade,
            remarksState[student.id] || undefined
          );
          savedCount++;
        }
      }

      setFeedback({
        type: 'success',
        message: `Successfully locked and certified ${savedCount} student grades. Official audit trail log generated.`
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Error saving marks record.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>Certified Academic Evaluation & Gradebook</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Certified Marks Entry & Performance Assessment
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Strict client and server range validation (obtained ≤ max) with automated CBSE 9-point scale grading and immutable audit logs.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-center">
            <span className="text-xs font-mono bg-indigo-50 text-indigo-900 px-3.5 py-1.5 rounded-xl border border-indigo-200 flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>CBSE 9-POINT SCALE COMPLIANT</span>
            </span>
          </div>
        </div>

        {/* CBSE 9-Point Scale Visual Legend Ribbon */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span className="flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              <span>CBSE Grading Scale Reference:</span>
            </span>
            <span className="font-mono text-slate-400">Pass Criteria: 33% (Grade D)</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center font-mono text-[10px]">
            <div className="p-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">A1: 91–100</div>
            <div className="p-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 font-bold">A2: 81–90</div>
            <div className="p-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-bold">B1: 71–80</div>
            <div className="p-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold">B2: 61–70</div>
            <div className="p-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold">C1: 51–60</div>
            <div className="p-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-900 font-bold">C2: 41–50</div>
            <div className="p-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 font-bold">D: 33–40</div>
            <div className="p-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-bold">E: &lt;33%</div>
          </div>
        </div>

        {/* Filter Configuration Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Class & Section
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-xs cursor-pointer transition-all"
            >
              {academicClasses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} - Section {c.section} ({c.band})
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Curriculum Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-xs cursor-pointer transition-all"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Assessment Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Evaluation Term
            </label>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-xs cursor-pointer transition-all"
            >
              {assessments.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Max Marks */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Maximum Scaled Marks
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-xs font-mono transition-all"
            />
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

      {/* Roster Marks Table */}
      <div className="glass-card rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm md:text-base">
              Student Gradebook: {selectedClass?.name}-{selectedClass?.section}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Subject: <strong className="text-slate-800">{selectedSubject}</strong> | Max Assessment Scale: <strong className="text-slate-800">{maxMarks} Marks</strong>
            </p>
          </div>
          <span className="text-xs font-mono bg-white border border-slate-200 px-3 py-1 rounded-full font-bold text-slate-700 self-start sm:self-auto">
            {classStudents.length} Students Enrolled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Roll No</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Admission No</th>
                <th className="px-5 py-3.5 w-44">Marks Obtained</th>
                <th className="px-5 py-3.5">Calculated Grade</th>
                <th className="px-5 py-3.5">Qualitative Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map(student => {
                const markVal = marksState[student.id] || '';
                const hasError = validationErrors[student.id];
                const numMark = parseFloat(markVal);
                const gradeInfo = !isNaN(numMark) ? calculateGrade(numMark, maxMarks) : { grade: '—', color: 'bg-slate-100 text-slate-500' };

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
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="number"
                            min="0"
                            max={maxMarks}
                            step="0.5"
                            value={markVal}
                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                            placeholder={`0 - ${maxMarks}`}
                            className={`w-24 bg-white border rounded-xl px-3 py-1.5 text-xs font-bold font-mono focus:outline-none transition-all ${
                              hasError 
                                ? 'border-rose-500 text-rose-700 bg-rose-50/50 focus:ring-2 focus:ring-rose-400' 
                                : 'border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'
                            }`}
                          />
                          <span className="text-slate-400 text-xs font-mono font-semibold">/ {maxMarks}</span>
                        </div>
                        {hasError && (
                          <p className="text-[10px] text-rose-600 font-bold leading-tight">{hasError}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${gradeInfo.color}`}>
                        {gradeInfo.grade}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <input
                        type="text"
                        value={remarksState[student.id] || ''}
                        onChange={(e) => setRemarksState({ ...remarksState, [student.id]: e.target.value })}
                        placeholder="Academic commentary or performance notes..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-mono">
            🛡️ Certifying marks locks the record and generates a cryptographic audit hash for compliance.
          </p>

          <button
            type="button"
            onClick={handleSaveMarks}
            className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-800 hover:to-indigo-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Certify & Publish Gradebook</span>
          </button>
        </div>
      </div>
    </div>
  );
}
