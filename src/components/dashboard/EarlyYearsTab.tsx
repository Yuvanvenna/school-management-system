'use client';

import React, { useState } from 'react';
import { 
  Baby, 
  Sparkles, 
  Heart, 
  Smile, 
  BookOpen, 
  Sun, 
  Plus, 
  CheckCircle, 
  Activity,
  Image as ImageIcon
} from 'lucide-react';
import { ClassSection, StudentProfile, HomeworkAssignment, User } from '@/types';

interface EarlyYearsTabProps {
  classes: ClassSection[];
  students: StudentProfile[];
  homework: HomeworkAssignment[];
  currentUser: User;
  onCreateActivity: (data: {
    classId: string;
    subject: string;
    title: string;
    description: string;
    isActivity: boolean;
    dueDate: string;
    attachments: string[];
  }) => HomeworkAssignment;
}

export function EarlyYearsTab({
  classes,
  students,
  homework,
  currentUser,
  onCreateActivity
}: EarlyYearsTabProps) {
  const earlyClasses = classes.filter(c => c.band === 'EARLY_YEARS');
  const [selectedClassId, setSelectedClassId] = useState<string>(earlyClasses[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'activities' | 'milestones' | 'care-logs'>('activities');

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    category: 'Sensory Play & Phonics',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    attachments: 'Activity_Worksheet_Visual.pdf'
  });

  const selectedClass = classes.find(c => c.id === selectedClassId) || earlyClasses[0];
  const earlyStudents = students.filter(s => s.classId === selectedClassId);
  const activities = homework.filter(h => h.classId === selectedClassId && h.isActivity);

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.title || !newActivity.description) return;

    onCreateActivity({
      classId: selectedClassId,
      subject: newActivity.category,
      title: newActivity.title,
      description: newActivity.description,
      isActivity: true,
      dueDate: newActivity.dueDate,
      attachments: [newActivity.attachments]
    });

    setNewActivity({
      title: '',
      category: 'Sensory Play & Phonics',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      attachments: 'Activity_Worksheet_Visual.pdf'
    });
    setShowCreateModal(false);
  };

  // Sample developmental milestone domains
  const milestoneDomains = [
    {
      title: 'Gross & Fine Motor Skills',
      milestones: [
        { name: 'Pencil grip & hand-eye coordination', status: 'Mastered' },
        { name: 'Hopping, single-leg balance', status: 'Mastered' },
        { name: 'Buttoning coat & scissor cutting', status: 'Developing' }
      ]
    },
    {
      title: 'Language Acquisition & Phonics',
      milestones: [
        { name: 'Recognizing letter sounds (A to Z)', status: 'Mastered' },
        { name: 'Reciting 4-line nursery rhymes', status: 'Mastered' },
        { name: 'Expressing feelings in full sentences', status: 'Developing' }
      ]
    },
    {
      title: 'Socio-Emotional Maturity',
      milestones: [
        { name: 'Collaborative sharing in circle time', status: 'Developing' },
        { name: 'Responding to turn-taking instructions', status: 'Mastered' },
        { name: 'Independent lunch & handwashing', status: 'Mastered' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-pink-700 uppercase tracking-wider mb-1">
              <Baby className="w-4 h-4 text-pink-600" />
              <span>Foundational Early Childhood Engine (Nursery, LKG, UKG)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Developmental Milestone & Activity Diary Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Replaces stressful numerical exams with observational learning milestones, sensory play logs, and parent-friendly daily diaries.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log New Class Activity</span>
            </button>
          </div>
        </div>

        {/* Filters and Sub-navigation */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700">Class Section:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer"
            >
              {earlyClasses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} - Section {c.section} ({c.roomNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              onClick={() => setActiveSubTab('activities')}
              className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                activeSubTab === 'activities' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Daily Activity Diary ({activities.length})
            </button>
            <button
              onClick={() => setActiveSubTab('milestones')}
              className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                activeSubTab === 'milestones' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Developmental Milestones
            </button>
            <button
              onClick={() => setActiveSubTab('care-logs')}
              className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
                activeSubTab === 'care-logs' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Health & Care Logs
            </button>
          </div>
        </div>
      </div>

      {/* Subtab: Activities */}
      {activeSubTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((act) => (
            <div key={act.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-pink-300 transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-pink-100 text-pink-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-pink-600" />
                  {act.subject}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Target Date: {act.dueDate}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{act.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Facilitator: {act.assignedBy}</span>
                <span className="text-pink-600 font-medium flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  Attachment: {act.attachments[0] || 'Visual Guide'}
                </span>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="col-span-2 bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500 text-xs">
              No activity logs recorded yet for this class. Click &quot;Log New Class Activity&quot; to begin.
            </div>
          )}
        </div>
      )}

      {/* Subtab: Milestones */}
      {activeSubTab === 'milestones' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {milestoneDomains.map((domain, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
                  <Activity className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{domain.title}</h4>
              </div>

              <div className="space-y-2.5">
                {domain.milestones.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                    <span className="text-slate-800 font-medium">{m.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      m.status === 'Mastered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab: Care Logs */}
      {activeSubTab === 'care-logs' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Daily Dietary, Nap & Health Check Records</span>
              </h3>
              <p className="text-xs text-slate-500">Government compliance logs for preschool nutrition and wellness</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Morning Meal / Milk</th>
                  <th className="px-4 py-3">Nap Rest Duration</th>
                  <th className="px-4 py-3">Physical Mood Observation</th>
                  <th className="px-4 py-3">Parent Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {earlyStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{student.rollNumber}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{student.user.name}</td>
                    <td className="px-4 py-3 text-emerald-700 font-medium">Completed Full Portion</td>
                    <td className="px-4 py-3 font-mono text-slate-600">45 mins (Peaceful)</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-pink-100 text-pink-800 font-medium">
                        Joyful & Curious
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">Normal energy; drank water regularly</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Log New Activity */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span>Log Nursery / KG Learning Activity</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  placeholder="e.g., Clay Modeling & Identifying Primary Colors"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Developmental Category</label>
                <select
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                >
                  <option value="Sensory Play & Phonics">Sensory Play & Phonics</option>
                  <option value="Rhymes & Story Circles">Rhymes & Story Circles</option>
                  <option value="Early Numeracy Concepts">Early Numeracy Concepts</option>
                  <option value="Gross Motor & Rhythm">Gross Motor & Rhythm</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Parent Takeaway</label>
                <textarea
                  rows={3}
                  required
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  placeholder="Describe circle time observations and guidance for home practice..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold cursor-pointer"
                >
                  Publish to Diary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
