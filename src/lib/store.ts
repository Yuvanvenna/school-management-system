'use client';

import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import {
  School,
  AcademicYear,
  ClassSection,
  User,
  StudentProfile,
  TeacherProfile,
  GuardianLink,
  AttendanceSession,
  AttendanceRecord,
  AttendanceStatus,
  HomeworkAssignment,
  MarkRecord,
  AuditLog,
  Role,
  GradeLevelBand
} from '@/types';
import {
  INITIAL_SCHOOLS,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_GUARDIAN_LINKS,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_HOMEWORK,
  INITIAL_MARKS,
  INITIAL_AUDIT_LOGS
} from './mock-data';

const STORAGE_KEYS = {
  SCHOOLS: 'sms_schools_v1',
  ACADEMIC_YEARS: 'sms_academic_years_v1',
  USERS: 'sms_users_v1',
  CLASSES: 'sms_classes_v1',
  STUDENTS: 'sms_students_v1',
  TEACHERS: 'sms_teachers_v1',
  GUARDIAN_LINKS: 'sms_guardian_links_v1',
  ATTENDANCE: 'sms_attendance_v1',
  HOMEWORK: 'sms_homework_v1',
  MARKS: 'sms_marks_v1',
  AUDIT_LOGS: 'sms_audit_logs_v1',
  ACTIVE_SCHOOL_ID: 'sms_active_school_id_v1',
  ACTIVE_USER_ID: 'sms_active_user_id_v1'
};

function getStoredOrDefault<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to persist to localStorage:', err);
  }
}

export function useSchoolStore() {
  const [schools, setSchools] = useState<School[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.SCHOOLS, INITIAL_SCHOOLS)
  );
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.ACADEMIC_YEARS, INITIAL_ACADEMIC_YEARS)
  );
  const [users, setUsers] = useState<User[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.USERS, INITIAL_USERS)
  );
  const [classes, setClasses] = useState<ClassSection[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.CLASSES, INITIAL_CLASSES)
  );
  const [students, setStudents] = useState<StudentProfile[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
  );
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS)
  );
  const [guardianLinks, setGuardianLinks] = useState<GuardianLink[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.GUARDIAN_LINKS, INITIAL_GUARDIAN_LINKS)
  );
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE_SESSIONS)
  );
  const [homework, setHomework] = useState<HomeworkAssignment[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.HOMEWORK, INITIAL_HOMEWORK)
  );
  const [marks, setMarks] = useState<MarkRecord[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.MARKS, INITIAL_MARKS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    getStoredOrDefault(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS)
  );

  const [activeSchoolId, setActiveSchoolId] = useState<string>(() =>
    getStoredOrDefault(STORAGE_KEYS.ACTIVE_SCHOOL_ID, 'sch-001')
  );

  const [activeUserId, setActiveUserId] = useState<string>(() =>
    getStoredOrDefault(STORAGE_KEYS.ACTIVE_USER_ID, 'usr-admin-1')
  );

  // Sync to localStorage
  useEffect(() => { saveToStorage(STORAGE_KEYS.SCHOOLS, schools); }, [schools]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ACADEMIC_YEARS, academicYears); }, [academicYears]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.USERS, users); }, [users]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.CLASSES, classes); }, [classes]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.STUDENTS, students); }, [students]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TEACHERS, teachers); }, [teachers]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.GUARDIAN_LINKS, guardianLinks); }, [guardianLinks]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ATTENDANCE, attendanceSessions); }, [attendanceSessions]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.HOMEWORK, homework); }, [homework]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.MARKS, marks); }, [marks]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.AUDIT_LOGS, auditLogs); }, [auditLogs]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ACTIVE_SCHOOL_ID, activeSchoolId); }, [activeSchoolId]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ACTIVE_USER_ID, activeUserId); }, [activeUserId]);

  const activeSchool = schools.find(s => s.id === activeSchoolId) || schools[0];
  const currentUser = users.find(u => u.id === activeUserId) || users[0];

  // Audit Log helper
  const logAudit = useCallback((action: string, target: string, payload: AuditLog['payload']) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      schoolId: activeSchoolId,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      target,
      payload,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [activeSchoolId, currentUser]);

  // Tenant-scoped selectors
  const tenantAcademicYears = academicYears.filter(ay => ay.schoolId === activeSchoolId);
  const currentAcademicYear = tenantAcademicYears.find(ay => ay.isCurrent) || tenantAcademicYears[0];
  const tenantClasses = classes.filter(c => c.schoolId === activeSchoolId);
  const tenantStudents = students.filter(s => s.schoolId === activeSchoolId);
  const tenantTeachers = teachers.filter(t => t.schoolId === activeSchoolId);
  const tenantAttendance = attendanceSessions.filter(a => a.schoolId === activeSchoolId);
  const tenantHomework = homework.filter(h => h.schoolId === activeSchoolId);
  const tenantMarks = marks.filter(m => m.schoolId === activeSchoolId);
  const tenantAuditLogs = auditLogs.filter(a => a.schoolId === activeSchoolId);

  // Switch Active User / Role
  const switchUser = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setActiveUserId(user.id);
      setActiveSchoolId(user.schoolId);
    }
  }, [users]);

  // Record or Update Attendance Session
  const recordAttendance = useCallback((
    classId: string,
    date: string,
    period: number | null,
    records: { studentId: string; status: AttendanceStatus; remarks?: string }[],
    isUpdate = false
  ) => {
    // Duplicate Protection Check: (classId, date, period)
    const existingIndex = attendanceSessions.findIndex(
      s => s.schoolId === activeSchoolId && s.classId === classId && s.date === date && s.period === period
    );

    if (existingIndex >= 0 && !isUpdate) {
      throw new Error(`Duplicate Session Detected: Attendance for Class ${classId} on ${date} (Period: ${period ?? 'Daily'}) has already been submitted.`);
    }

    const cls = tenantClasses.find(c => c.id === classId);
    const className = cls ? `${cls.name}-${cls.section}` : classId;

    if (existingIndex >= 0 && isUpdate) {
      // Update existing & generate Audit Log
      const prevSession = attendanceSessions[existingIndex];
      const updatedSession: AttendanceSession = {
        ...prevSession,
        records: records.map(r => ({
          id: `rec-${Date.now()}-${r.studentId}`,
          sessionId: prevSession.id,
          studentId: r.studentId,
          status: r.status,
          remarks: r.remarks
        }))
      };

      setAttendanceSessions(prev => {
        const next = [...prev];
        next[existingIndex] = updatedSession;
        return next;
      });

      logAudit('ATTENDANCE_CORRECTED', `AttendanceSession:${prevSession.id}`, {
        previous: {
          present: prevSession.records.filter(r => r.status === 'PRESENT').length,
          absent: prevSession.records.filter(r => r.status === 'ABSENT').length
        },
        current: {
          present: records.filter(r => r.status === 'PRESENT').length,
          absent: records.filter(r => r.status === 'ABSENT').length
        },
        reason: `Attendance adjustment submitted by ${currentUser.name} for ${className} (${date})`
      });

      return updatedSession;
    }

    // New Session
    const newSessionId = `att-${Date.now()}`;
    const newSession: AttendanceSession = {
      id: newSessionId,
      schoolId: activeSchoolId,
      classId,
      date,
      period,
      takenById: currentUser.id,
      takenByName: currentUser.name,
      createdAt: new Date().toISOString(),
      records: records.map(r => ({
        id: `rec-${Date.now()}-${r.studentId}`,
        sessionId: newSessionId,
        studentId: r.studentId,
        status: r.status,
        remarks: r.remarks
      }))
    };

    setAttendanceSessions(prev => [newSession, ...prev]);

    logAudit('ATTENDANCE_FINALIZED', `AttendanceSession:${newSessionId}`, {
      current: {
        class: className,
        date,
        period: period ?? 'Daily',
        totalRecorded: records.length,
        present: records.filter(r => r.status === 'PRESENT').length,
        absent: records.filter(r => r.status === 'ABSENT').length
      },
      reason: `Morning/Period attendance registered by ${currentUser.name}`
    });

    return newSession;
  }, [activeSchoolId, attendanceSessions, currentUser, logAudit, tenantClasses]);

  // Record / Update Assessment Mark
  const recordMark = useCallback((
    studentId: string,
    subject: string,
    assessment: string,
    marksObtained: number,
    maxMarks: number,
    grade: string,
    remarks?: string
  ) => {
    // Marks Range Validation Check
    if (marksObtained < 0 || marksObtained > maxMarks) {
      throw new Error(`Marks Range Error: Marks obtained (${marksObtained}) cannot exceed maximum marks (${maxMarks}).`);
    }

    const existingIndex = marks.findIndex(
      m => m.schoolId === activeSchoolId && m.studentId === studentId && m.subject === subject && m.assessment === assessment
    );

    const student = tenantStudents.find(s => s.id === studentId);
    const studentName = student ? student.user.name : studentId;

    if (existingIndex >= 0) {
      const prevMark = marks[existingIndex];
      const updatedMark: MarkRecord = {
        ...prevMark,
        marksObtained,
        maxMarks,
        grade,
        remarks,
        isLocked: true
      };

      setMarks(prev => {
        const next = [...prev];
        next[existingIndex] = updatedMark;
        return next;
      });

      logAudit('GRADE_ADJUSTMENT', `MarkRecord:${prevMark.id}`, {
        previous: { marksObtained: prevMark.marksObtained, grade: prevMark.grade },
        current: { marksObtained, grade, remarks },
        reason: `Grade adjustment recorded by ${currentUser.name} for ${studentName} in ${subject}`
      });

      return updatedMark;
    }

    const newMark: MarkRecord = {
      id: `mrk-${Date.now()}`,
      schoolId: activeSchoolId,
      studentId,
      subject,
      assessment,
      marksObtained,
      maxMarks,
      grade,
      remarks,
      isLocked: true
    };

    setMarks(prev => [newMark, ...prev]);

    logAudit('MARKS_ENTERED', `MarkRecord:${newMark.id}`, {
      current: { student: studentName, subject, assessment, marksObtained, maxMarks, grade },
      reason: `Marks recorded and verified by ${currentUser.name}`
    });

    return newMark;
  }, [activeSchoolId, marks, tenantStudents, currentUser, logAudit]);

  // Create Homework or Early Years Activity
  const createHomework = useCallback((data: {
    classId: string;
    subject: string;
    title: string;
    description: string;
    isActivity: boolean;
    dueDate: string;
    attachments: string[];
  }) => {
    const newHw: HomeworkAssignment = {
      id: `hw-${Date.now()}`,
      schoolId: activeSchoolId,
      classId: data.classId,
      subject: data.subject,
      title: data.title,
      description: data.description,
      isActivity: data.isActivity,
      dueDate: data.dueDate,
      assignedBy: currentUser.name,
      createdAt: new Date().toISOString(),
      attachments: data.attachments
    };

    setHomework(prev => [newHw, ...prev]);

    logAudit(data.isActivity ? 'EARLY_YEARS_ACTIVITY_PUBLISHED' : 'HOMEWORK_PUBLISHED', `HomeworkAssignment:${newHw.id}`, {
      current: { title: data.title, subject: data.subject, classId: data.classId, isActivity: data.isActivity },
      reason: `Published by ${currentUser.name}`
    });

    return newHw;
  }, [activeSchoolId, currentUser, logAudit]);

  // CSV Ingestion for Students
  const importStudentsFromCSV = useCallback((csvText: string, classId: string): { importedCount: number; errors: string[] } => {
    const parsed = Papa.parse<{
      fullName: string;
      email: string;
      rollNumber: string;
      admissionNo: string;
      dob: string;
      gender: string;
      emergencyContact: string;
      parentName?: string;
      parentEmail?: string;
    }>(csvText, {
      header: true,
      skipEmptyLines: true
    });

    const errors: string[] = [];
    const newStudents: StudentProfile[] = [];
    const newUsers: User[] = [];

    parsed.data.forEach((row, idx) => {
      if (!row.fullName || !row.rollNumber) {
        errors.push(`Row ${idx + 2}: Missing required Student Name or Roll Number.`);
        return;
      }

      // Check duplicate roll number in class
      const duplicate = tenantStudents.some(
        s => s.classId === classId && s.rollNumber.trim() === row.rollNumber.trim()
      );
      if (duplicate) {
        errors.push(`Row ${idx + 2}: Roll Number "${row.rollNumber}" already exists in this class.`);
        return;
      }

      const userId = `usr-stu-${Date.now()}-${idx}`;
      const newUser: User = {
        id: userId,
        schoolId: activeSchoolId,
        name: row.fullName.trim(),
        email: row.email?.trim() || `${row.rollNumber.toLowerCase()}@kvmi.edu.in`,
        role: 'STUDENT',
        isActive: true
      };

      const newProfile: StudentProfile = {
        id: `sp-${Date.now()}-${idx}`,
        schoolId: activeSchoolId,
        userId: userId,
        classId: classId,
        rollNumber: row.rollNumber.trim(),
        admissionNo: row.admissionNo?.trim() || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
        dob: row.dob?.trim() || '2012-01-01',
        gender: (row.gender?.toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE'),
        emergencyContact: row.emergencyContact?.trim() || '+91 99999 00000',
        user: newUser
      };

      newUsers.push(newUser);
      newStudents.push(newProfile);
    });

    if (newStudents.length > 0) {
      setUsers(prev => [...prev, ...newUsers]);
      setStudents(prev => [...prev, ...newStudents]);

      logAudit('CSV_ROSTER_IMPORTED', `Class:${classId}`, {
        current: { count: newStudents.length, classId },
        reason: `Bulk enrolled ${newStudents.length} students via CSV roster upload by ${currentUser.name}`
      });
    }

    return { importedCount: newStudents.length, errors };
  }, [activeSchoolId, currentUser, logAudit, tenantStudents]);

  // Reset to initial government seed data
  const resetToSeedData = useCallback(() => {
    setSchools(INITIAL_SCHOOLS);
    setAcademicYears(INITIAL_ACADEMIC_YEARS);
    setUsers(INITIAL_USERS);
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setGuardianLinks(INITIAL_GUARDIAN_LINKS);
    setAttendanceSessions(INITIAL_ATTENDANCE_SESSIONS);
    setHomework(INITIAL_HOMEWORK);
    setMarks(INITIAL_MARKS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveSchoolId('sch-001');
    setActiveUserId('usr-admin-1');

    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    }
  }, []);

  return {
    // Tenant context
    schools,
    activeSchool,
    setActiveSchoolId,
    currentUser,
    switchUser,
    users,

    // Tenant scoped records
    academicYears: tenantAcademicYears,
    currentAcademicYear,
    classes: tenantClasses,
    students: tenantStudents,
    teachers: tenantTeachers,
    guardianLinks: guardianLinks.filter(g => g.student.schoolId === activeSchoolId),
    attendanceSessions: tenantAttendance,
    homework: tenantHomework,
    marks: tenantMarks,
    auditLogs: tenantAuditLogs,

    // Core actions
    recordAttendance,
    recordMark,
    createHomework,
    importStudentsFromCSV,
    logAudit,
    resetToSeedData
  };
}
