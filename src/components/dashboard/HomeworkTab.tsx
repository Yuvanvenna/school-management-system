'use client';

import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Plus, 
  FileText, 
  Download, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Paperclip,
  Check
} from 'lucide-react';
import { ClassSection, HomeworkAssignment, User } from '@/types';

interface HomeworkTabProps {
  classes: ClassSection[];
  homework: HomeworkAssignment[];
  currentUser: User;
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
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    attachment: 'Practice_Worksheet_Set_01.pdf'
  });

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

    setNewHw({
      subject: 'Mathematics',
      title: '',
      description: '',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      attachment: 'Practice_Worksheet_Set_01.pdf'
    });
    setShowModal(false);
  };

  const handleSimulateDownload = (filename: string) => {
    setDownloadNotice(`Downloading worksheet: ${filename}`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <BookOpenCheck className="w-4 h-4 text-blue-600" />
              <span>Curricular Homework & Study Materials Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Assignments, Worksheets & Learning Resources
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Publish structured subject tasks with attachments for student and parent access.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {currentUser.role !== 'STUDENT' && currentUser.role !== 'PARENT' && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Assignment</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center space-x-3">
          <label className="text-xs font-semibold text-slate-700">Target Class:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
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
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Homework List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classHomework.map(hw => (
          <div key={hw.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full font-mono">
                {hw.subject}
              </span>
              <span className="text-[11px] text-amber-700 font-mono font-medium flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Due: {hw.dueDate}</span>
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">{hw.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{hw.description}</p>
            </div>

            {hw.attachments && hw.attachments.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Attached Worksheets:
                </p>
                <div className="space-y-1">
                  {hw.attachments.map((file, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSimulateDownload(file)}
                      className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition cursor-pointer text-left"
                    >
                      <span className="flex items-center space-x-2 font-mono truncate">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{file}</span>
                      </span>
                      <Download className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Assigned By: {hw.assignedBy}</span>
              <span>Published: {hw.createdAt.split('T')[0]}</span>
            </div>
          </div>
        ))}

        {classHomework.length === 0 && (
          <div className="col-span-2 bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500 text-xs">
            No homework assignments published yet for this class.
          </div>
        )}
      </div>

      {/* Modal: Create Homework */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <BookOpenCheck className="w-4 h-4 text-blue-600" />
                <span>Publish New Subject Assignment</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={newHw.subject}
                  onChange={(e) => setNewHw({ ...newHw, subject: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English Language & Lit">English Language & Lit</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Hindi / Regional">Hindi / Regional</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newHw.title}
                  onChange={(e) => setNewHw({ ...newHw, title: e.target.value })}
                  placeholder="e.g., Chapter 5 Trigonometry Application Problems"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Instructions</label>
                <textarea
                  rows={3}
                  required
                  value={newHw.description}
                  onChange={(e) => setNewHw({ ...newHw, description: e.target.value })}
                  placeholder="Provide precise problem sets, reference book pages, and guidelines..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Submission Due Date</label>
                  <input
                    type="date"
                    required
                    value={newHw.dueDate}
                    onChange={(e) => setNewHw({ ...newHw, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attached PDF File Name</label>
                  <input
                    type="text"
                    value={newHw.attachment}
                    onChange={(e) => setNewHw({ ...newHw, attachment: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
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
