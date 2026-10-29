'use client';

import React, { useState, useEffect } from 'react';
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
  Image as ImageIcon,
  Calendar,
  Layers,
  ChevronRight
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
  // Early years classes
  const earlyClasses = classes.filter(c => c.band === 'EARLY_YEARS');
  const [selectedClassId, setSelectedClassId] = useState<string>(earlyClasses[0]?.id || classes[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'activities' | 'milestones' | 'care-logs'>('activities');

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    category: 'Sensory Play & Phonics',
    description: '',
    dueDate: '2026-10-21',
    attachments: 'Activity_Worksheet_Visual.pdf'
  });

  useEffect(() => {
    try {
      setNewActivity(prev => ({ ...prev, dueDate: new Date().toISOString().split('T')[0] }));
    } catch {
      // fallback
    }
  }, []);

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
      dueDate: '2026-10-21',
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
      <div className="glass-card rounded-2xl p-6 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <Baby className="w-4 h-4 text-rose-500" />
              <span>Foundational Early Childhood Engine (Nursery, LKG, UKG)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Developmental Milestone & Activity Diary Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Replaces stressful numerical exams with observational learning milestones, sensory play diaries, and daily wellness logs.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-md shadow-rose-500/20 transition-all cursor-pointer transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Log Class Activity</span>
            </button>
          </div>
        </div>

        {/* Filters and Sub-navigation Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Class Section:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs cursor-pointer transition-all"
            >
              {earlyClasses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} - Section {c.section} ({c.roomNumber || 'Kindergarten Wing'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-xl border border-slate-200 bg-slate-100/70 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('activities')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'activities' ? 'bg-white text-rose-950 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Daily Diary ({activities.length})
            </button>
            <button
              onClick={() => setActiveSubTab('milestones')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'milestones' ? 'bg-white text-rose-950 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Developmental Milestones
            </button>
            <button
              onClick={() => setActiveSubTab('care-logs')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'care-logs' ? 'bg-white text-rose-950 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Diet & Nap Check
            </button>
          </div>
        </div>
      </div>

      {/* Subtab: Activities */}
      {activeSubTab === 'activities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((act) => (
            <div key={act.id} className="glass-card rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-rose-300 transition-all space-y-3.5 group">
              <div className="flex items-center justify-between">
                <span className="bg-rose-100 text-rose-900 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 font-mono border border-rose-200">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  {act.subject}
                </span>
                <span className="text-[11px] text-slate-500 font-mono font-medium">
                  Date: {act.dueDate}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-rose-950 transition-colors">{act.title}</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{act.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Teacher: <strong className="text-slate-700">{act.assignedBy}</strong></span>
                <span className="text-rose-600 font-semibold flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  {act.attachments[0] || 'Visual Guide'}
                </span>
              </div>
            </div>
          ))}

          {activities.length === 0 && (
            <div className="col-span-2 glass-card rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 text-xs">
              No activity logs recorded yet for this class. Click &quot;Log Class Activity&quot; to begin.
            </div>
          )}
        </div>
      )}

      {/* Subtab: Milestones */}
      {activeSubTab === 'milestones' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {milestoneDomains.map((domain, i) => (
            <div key={i} className="glass-card rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{domain.title}</h4>
              </div>

              <div className="space-y-2.5">
                {domain.milestones.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
                    <span className="text-slate-800 font-semibold">{m.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      m.status === 'Mastered' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'
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
        <div className="glass-card rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm md:text-base flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Daily Dietary, Nap & Health Check Records</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Preschool nutritional care logs in compliance with national childcare directives</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/70 text-slate-700 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Roll No</th>
                  <th className="px-5 py-3.5">Student Name</th>
                  <th className="px-5 py-3.5">Morning Meal / Milk</th>
                  <th className="px-5 py-3.5">Nap Rest Duration</th>
                  <th className="px-5 py-3.5">Mood & Emotional Energy</th>
                  <th className="px-5 py-3.5">Teacher Observation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {earlyStudents.map(student => (
                  <tr key={student.id} className="hover:bg-rose-50/25 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">{student.rollNumber}</td>
                    <td className="px-5 py-4 font-bold text-slate-900">{student.user.name}</td>
                    <td className="px-5 py-4 text-emerald-700 font-bold">Completed Full Portion</td>
                    <td className="px-5 py-4 font-mono text-slate-600">45 mins (Peaceful Rest)</td>
                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-[10px] bg-rose-100 text-rose-800 font-bold border border-rose-200 inline-flex items-center gap-1">
                        <Smile className="w-3 h-3" />
                        Joyful & Curious
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">Normal energy; drank water regularly</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Log New Activity */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-rose-600" />
                <span>Log Nursery / KG Learning Activity</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Activity Title</label>
                <input
                  type="text"
                  required
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                  placeholder="e.g., Clay Modeling & Identifying Primary Colors"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Developmental Category</label>
                <select
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
                >
                  <option value="Sensory Play & Phonics">Sensory Play & Phonics</option>
                  <option value="Rhymes & Story Circles">Rhymes & Story Circles</option>
                  <option value="Early Numeracy Concepts">Early Numeracy Concepts</option>
                  <option value="Gross Motor & Rhythm">Gross Motor & Rhythm</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description & Parent Takeaway</label>
                <textarea
                  rows={3}
                  required
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  placeholder="Describe circle time observations and guidance for home practice..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold cursor-pointer shadow-md shadow-rose-500/20"
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
