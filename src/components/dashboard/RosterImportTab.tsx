'use client';

import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Users, 
  ArrowRight,
  Database,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ClassSection, StudentProfile } from '@/types';

interface RosterImportTabProps {
  classes: ClassSection[];
  students: StudentProfile[];
  onImportCSV: (csvText: string, classId: string) => { importedCount: number; errors: string[] };
}

export function RosterImportTab({
  classes,
  students,
  onImportCSV
}: RosterImportTabProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [csvContent, setCsvContent] = useState<string>(
`fullName,email,rollNumber,admissionNo,dob,gender,emergencyContact
Rohan Mehra,rohan.m@kvmi.edu.in,1004,ADM-2016-112,2010-04-12,MALE,+91 98111 22334
Priya Sharma,priya.s@kvmi.edu.in,1005,ADM-2016-118,2010-09-21,FEMALE,+91 98222 33445
Karan Kapoor,karan.k@kvmi.edu.in,1006,ADM-2016-125,2010-02-15,MALE,+91 98333 44556`
  );

  const [importResult, setImportResult] = useState<{
    success: boolean;
    count: number;
    errors: string[];
  } | null>(null);

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter(s => s.classId === selectedClassId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleRunImport = () => {
    setImportResult(null);
    if (!csvContent.trim()) return;

    const res = onImportCSV(csvContent, selectedClassId);
    setImportResult({
      success: res.importedCount > 0,
      count: res.importedCount,
      errors: res.errors
    });
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
              <UploadCloud className="w-4 h-4 text-purple-500" />
              <span>Administrative Bulk Roster Ingestion Engine</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              CSV Student Enrollment & Account Provisioning
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Mass-import cohorts, auto-generate student accounts, and enforce roll number uniqueness with duplicate rejection guards.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-center">
            <span className="text-xs font-mono bg-purple-50 text-purple-900 border border-purple-200 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
              <Database className="w-4 h-4 text-purple-600" />
              <span>PAPAPARSE ENGINE ACTIVE</span>
            </span>
          </div>
        </div>

        {/* Target Class Selector */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target Enrollment Section:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-xs cursor-pointer transition-all"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} - Section {c.section} ({c.band.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 font-semibold">
            Currently Enrolled: <strong className="text-slate-900">{classStudents.length}</strong> students
          </span>
        </div>
      </div>

      {/* Import Result Notification */}
      {importResult && (
        <div className={`p-5 rounded-2xl border space-y-2 text-xs shadow-sm ${
          importResult.errors.length === 0
            ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/90 border-amber-300 text-amber-950'
        }`}>
          <div className="flex items-center space-x-2.5 font-bold text-sm">
            {importResult.errors.length === 0 ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <span>
              {importResult.count > 0 
                ? `Successfully provisioned ${importResult.count} students into ${selectedClass?.name}-${selectedClass?.section}.`
                : 'Batch processing completed with warnings.'}
            </span>
          </div>

          {importResult.errors.length > 0 && (
            <div className="pt-3 border-t border-amber-200/80">
              <p className="font-bold text-rose-800 mb-1">Validation Warnings / Rejection Reasons:</p>
              <ul className="list-disc list-inside space-y-1 text-rose-700 font-mono text-[11px]">
                {importResult.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Editor & File Upload Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>CSV Data Ingestion Stream</span>
            </h3>
            <label className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1.5 rounded-xl font-bold cursor-pointer flex items-center space-x-1.5 transition-colors">
              <UploadCloud className="w-4 h-4 text-purple-600" />
              <span>Choose .CSV File</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <textarea
            rows={10}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            className="w-full bg-slate-900 text-amber-300 font-mono text-xs p-4 rounded-xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
            placeholder="fullName,email,rollNumber,admissionNo,dob,gender,emergencyContact..."
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-500 font-mono">
              Columns: fullName, email, rollNumber, admissionNo, dob, gender, emergencyContact
            </p>
            <button
              onClick={handleRunImport}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-purple-500/20 transition-all cursor-pointer transform active:scale-95"
            >
              <span>Process & Ingest Roster</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>

        {/* Specifications & Schema Sidebar */}
        <div className="glass-card border border-slate-200/90 rounded-2xl p-6 space-y-4 text-xs">
          <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Schema Integrity Guard</span>
          </h4>
          <p className="text-slate-600 leading-relaxed">
            Every ingested student is automatically linked to tenant <strong className="font-mono text-slate-900">{selectedClass?.schoolId}</strong> with strict Row-Level Security isolation.
          </p>

          <div className="space-y-2.5 font-mono text-[11px]">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="font-bold text-slate-900 block font-sans">Roll Number:</span>
              <span className="text-slate-500">Unique integer per class. Re-imports will detect duplicates.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="font-bold text-slate-900 block font-sans">Date of Birth:</span>
              <span className="text-slate-500">Standard ISO-8601 string (YYYY-MM-DD).</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span className="font-bold text-slate-900 block font-sans">Gender Enum:</span>
              <span className="text-slate-500">MALE | FEMALE | OTHER.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
