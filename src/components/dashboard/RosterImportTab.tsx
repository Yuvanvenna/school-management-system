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
  Database
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
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              <UploadCloud className="w-4 h-4 text-amber-600" />
              <span>Administrative Bulk Roster Ingestion Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              CSV Student Enrollment & Account Provisioning
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mass-import student records, auto-generate active accounts, and validate roll numbers with duplicate rejection.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 font-semibold">
              <Database className="w-4 h-4 text-slate-600" />
              <span>PARSER: PAPAPARSE STREAM</span>
            </span>
          </div>
        </div>

        {/* Target Class Selector */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center space-x-3">
          <label className="text-xs font-semibold text-slate-700">Target Enrollment Class:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} - Section {c.section} ({c.band.replace('_', ' ')})
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500 font-mono">
            Currently Enrolled: <span className="font-semibold text-slate-900">{classStudents.length}</span> students
          </span>
        </div>
      </div>

      {/* Import Result Notification */}
      {importResult && (
        <div className={`p-4 rounded-xl border space-y-2 text-xs ${
          importResult.errors.length === 0
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <div className="flex items-center space-x-2 font-semibold">
            {importResult.errors.length === 0 ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>
              {importResult.count > 0 
                ? `Successfully imported and provisioned ${importResult.count} students into ${selectedClass?.name}-${selectedClass?.section}.`
                : 'Import failed or encountered duplicate entries.'}
            </span>
          </div>

          {importResult.errors.length > 0 && (
            <div className="pt-2 border-t border-amber-200">
              <p className="font-semibold text-rose-800 mb-1">Validation Warnings / Duplicate Rejections:</p>
              <ul className="list-disc list-inside space-y-0.5 text-rose-700 font-mono text-[11px]">
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
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>CSV Payload Editor</span>
            </h3>
            <label className="text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer flex items-center space-x-1">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload CSV File</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <textarea
            rows={10}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 font-mono text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder="fullName,email,rollNumber,admissionNo,dob,gender,emergencyContact..."
          />

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-500 font-mono">
              Headers required: fullName, email, rollNumber, admissionNo, dob, gender, emergencyContact
            </p>
            <button
              onClick={handleRunImport}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-2 shadow-sm transition cursor-pointer"
            >
              <span>Validate & Process Roster</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Specifications & Schema Sidebar */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
          <h4 className="font-bold text-slate-900 text-sm">Roster Validation Guidelines</h4>
          <p className="text-slate-600 leading-relaxed">
            Every enrolled student is immediately bound to tenant <span className="font-mono font-semibold text-slate-900">{selectedClass?.schoolId}</span> with Row-Level Security isolation.
          </p>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-2.5 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800 block">Roll Number:</span>
              <span className="text-slate-500">Unique per class section. Duplicates rejected.</span>
            </div>
            <div className="p-2.5 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800 block">Date of Birth:</span>
              <span className="text-slate-500">ISO-8601 formatted (YYYY-MM-DD).</span>
            </div>
            <div className="p-2.5 bg-white rounded border border-slate-200">
              <span className="font-bold text-slate-800 block">Gender:</span>
              <span className="text-slate-500">MALE / FEMALE / OTHER.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
