'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpenCheck, 
  Plus, 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Paperclip,
  Check,
  User,
  Sparkles
} from 'lucide-react';
import { ClassSection, HomeworkAssignment, User as UserType } from '@/types';

interface HomeworkTabProps {
  classes: ClassSection[];
  homework: HomeworkAssignment[];
  currentUser: UserType;
  onCreateHomework: (data: {
    classId: string;
    subject: string;
    title: string;
    description: string;
    isActivity: boolean;
    dueDate: string;
    attachments: string[];
  }) => HomeworkAssignment;
}

export function HomeworkTab({
  classes,
  homework,
  currentUser,
  onCreateHomework
}: HomeworkTabProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const [newHw, setNewHw] = useState({
    subject: 'Mathematics',
    title: '',
    description: '',
    dueDate: '2026-10-25',
    attachment: 'Practice_Worksheet_Set_01.pdf'
  });

  useEffect(() => {
    try {
      const d = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setNewHw(prev => ({ ...prev, dueDate: d }));
    } catch {
      // fallback
    }
  }, []);

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const classHomework = homework.filter(h => h.classId === selectedClassId && !h.isActivity);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHw.title || !newHw.description) return;

    onCreateHomework({
      classId: selectedClassId,
      subject: newHw.subject,
      title: newHw.title,
      description: newHw.description,
      isActivity: false,
      dueDate: newHw.dueDate,
      attachments: [newHw.attachment]
    });

    try {
      const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setNewHw({
        subject: 'Mathematics',
        title: '',
        description: '',
        dueDate: futureDate,
        attachment: 'Practice_Worksheet_Set_01.pdf'
      });
    } catch {
      setNewHw(prev => ({ ...prev, title: '', description: '' }));
    }
    setShowModal(false);
  };

  const handleSimulateDownload = (filename: string) => {
    setDownloadNotice(`Downloading authenticated worksheet: ${filename}`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
              <BookOpenCheck className="w-4 h-4 text-sky-500" />
              <span>Curricular Homework & Study Materials Engine</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Assignments, Worksheets & Learning Resources
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Publish structured curriculum assignments with downloadable worksheets accessible to students and guardians.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-center">
            {currentUser.role !== 'STUDENT' && currentUser.role !== 'PARENT' && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-md shadow-sky-500/20 transition-all cursor-pointer transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Assignment</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center space-x-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target Class:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-xs cursor-pointer transition-all"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} - Section {c.section} ({c.band.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>
      </div>

      {downloadNotice && (
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold flex items-center space-x-2.5 shadow-sm">
          <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Homework List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classHomework.map(hw => (
          <div key={hw.id} className="glass-card rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-sky-300 transition-all space-y-4 group">
            <div className="flex items-center justify-between">
              <span className="bg-sky-100 text-sky-900 text-[11px] font-bold px-3 py-1 rounded-full font-mono border border-sky-200">
                {hw.subject}
              </span>
              <span className="text-[11px] text-amber-800 font-mono font-bold flex items-center space-x-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Due: {hw.dueDate}</span>
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-sky-950 transition-colors">{hw.title}</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{hw.description}</p>
            </div>

            {hw.attachments && hw.attachments.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Attached Curricular Materials:
                </p>
                <div className="space-y-1.5">
                  {hw.attachments.map((file, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSimulateDownload(file)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 text-xs text-slate-700 transition cursor-pointer text-left"
                    >
                      <span className="flex items-center space-x-2 font-mono truncate font-medium">
                        <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                        <span className="truncate">{file}</span>
                      </span>
                      <Download className="w-4 h-4 text-slate-400 hover:text-sky-700 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Faculty: <strong className="text-slate-800 font-sans">{hw.assignedBy}</strong></span>
              <span>Published: {hw.createdAt.split('T')[0]}</span>
            </div>
          </div>
        ))}

        {classHomework.length === 0 && (
          <div className="col-span-2 glass-card rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-xs">
            No homework assignments published yet for this class section.
          </div>
        )}
      </div>

      {/* Modal: Create Homework */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <BookOpenCheck className="w-5 h-5 text-sky-600" />
                <span>Publish Curricular Assignment</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={newHw.subject}
                  onChange={(e) => setNewHw({ ...newHw, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English Language & Lit">English Language & Lit</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Hindi / Regional">Hindi / Regional</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newHw.title}
                  onChange={(e) => setNewHw({ ...newHw, title: e.target.value })}
                  placeholder="e.g., Quadratic Equations Practice Set 4.2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Submission Due Date</label>
                <input
                  type="date"
                  required
                  value={newHw.dueDate}
                  onChange={(e) => setNewHw({ ...newHw, dueDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Instructions & Guidelines</label>
                <textarea
                  rows={3}
                  required
                  value={newHw.description}
                  onChange={(e) => setNewHw({ ...newHw, description: e.target.value })}
                  placeholder="Detail step-by-step problem requirements..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold cursor-pointer shadow-md shadow-sky-500/20"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
