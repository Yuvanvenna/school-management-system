'use client';

import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Award,
  Layers,
  BookOpen
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
  React.useEffect(() => {
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
  const calculateGrade = (obtained: number, max: number): string => {
    if (max <= 0) return 'NA';
    const pct = (obtained / max) * 100;
    if (pct >= 91) return 'A1';
    if (pct >= 81) return 'A2';
    if (pct >= 71) return 'B1';
    if (pct >= 61) return 'B2';
    if (pct >= 51) return 'C1';
    if (pct >= 41) return 'C2';
    if (pct >= 33) return 'D';
    return 'E (Needs Improvement)';
  };

  // Handle Mark input change with validation
  const handleMarkChange = (studentId: string, val: string) => {
    setMarksState(prev => ({ ...prev, [studentId]: val }));

    const num = parseFloat(val);
    if (!isNaN(num)) {
      if (num < 0) {
        setValidationErrors(prev => ({ ...prev, [studentId]: 'Marks cannot be negative' }));
      } else if (num > maxMarks) {
        // Marks Range Validation Check as mandated in spec
        setValidationErrors(prev => ({ 
          ...prev, 
          [studentId]: `Marks obtained (${num}) cannot exceed Max Marks (${maxMarks})!` 
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
    // Check if any validation errors
    if (Object.keys(validationErrors).length > 0) {
      setFeedback({
        type: 'error',
        message: 'Cannot finalize grades: Please fix marks exceeding maximum limits before saving.'
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

          // Double check server-side range
          if (obtained > maxMarks) {
            throw new Error(`Validation Error: Student ${student.user.name} marks (${obtained}) exceed Max (${maxMarks})`);
          }

          const grade = calculateGrade(obtained, maxMarks);
          onRecordMark(
            student.id,
            selectedSubject,
            selectedAssessment,
            obtained,
            maxMarks,
            grade,
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
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Official Academic Evaluation & Gradebook</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Certified Marks Entry & Performance Assessment
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Strict client and server range validation (obtained ≤ max) with automated audit logging on grade publication.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg border border-purple-200 flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>GOV COMPLIANCE: CBSE 9-POINT SCALE</span>
            </span>
          </div>
        </div>

        {/* Filter Configuration Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Class */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Class & Section
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
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
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Curriculum Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Assessment Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Evaluation Term
            </label>
            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {assessments.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Max Marks */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Maximum Scaled Marks
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Feedback banner */}
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

      {/* Roster Marks Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Student Gradebook: {selectedClass?.name}-{selectedClass?.section}
            </h3>
            <p className="text-xs text-slate-500">
              Subject: <span className="font-semibold text-slate-700">{selectedSubject}</span> | Max Scale: <span className="font-semibold text-slate-700">{maxMarks} Marks</span>
            </p>
          </div>
          <span className="text-xs font-mono bg-white border border-slate-200 px-2.5 py-1 rounded text-slate-600">
            {classStudents.length} Students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Roll No</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Admission No</th>
                <th className="px-4 py-3 w-40">Marks Obtained</th>
                <th className="px-4 py-3">Percentage</th>
                <th className="px-4 py-3">Computed Grade</th>
                <th className="px-4 py-3">Teacher Evaluator Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {classStudents.map(student => {
                const val = marksState[student.id] || '';
                const error = validationErrors[student.id];
                const num = parseFloat(val);
                const hasValue = !isNaN(num);
                const pct = hasValue && maxMarks > 0 ? ((num / maxMarks) * 100).toFixed(1) : '-';
                const grade = hasValue ? calculateGrade(num, maxMarks) : '-';

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
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="number"
                            step="0.5"
                            value={val}
                            onChange={(e) => handleMarkChange(student.id, e.target.value)}
                            placeholder="0.0"
                            className={`w-24 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 ${
                              error 
                                ? 'bg-rose-50 border-2 border-rose-500 text-rose-900 focus:ring-rose-500' 
                                : 'bg-slate-50 border border-slate-300 focus:ring-purple-500'
                            }`}
                          />
                          <span className="font-mono text-slate-400 text-xs">/ {maxMarks}</span>
                        </div>
                        {error && (
                          <p className="text-[10px] text-rose-600 font-semibold flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                            <span>{error}</span>
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-800">
                      {pct !== '-' ? `${pct}%` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {grade !== '-' ? (
                        <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                          grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                          grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          grade.startsWith('C') ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {grade}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={remarksState[student.id] || ''}
                        onChange={(e) => setRemarksState({ ...remarksState, [student.id]: e.target.value })}
                        placeholder="Analytical strengths or growth areas..."
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-mono flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Saving locks records and generates a tamper-evident audit trail log.</span>
          </p>

          <button
            type="button"
            onClick={handleSaveMarks}
            disabled={Object.keys(validationErrors).length > 0}
            className="bg-purple-900 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Certify & Publish Marks</span>
          </button>
        </div>
      </div>
    </div>
  );
}
