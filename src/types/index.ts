export type Role = 
  | 'SCHOOL_ADMIN'
  | 'PRINCIPAL'
  | 'TEACHER'
  | 'CLASS_TEACHER'
  | 'PARENT'
  | 'STUDENT'
  | 'ACCOUNTANT';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'APPROVED_LEAVE';

export type GradeLevelBand = 'EARLY_YEARS' | 'PRIMARY' | 'MIDDLE' | 'SECONDARY';

export interface School {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  affiliationNo: string;
  establishedYear: number;
}

export interface AcademicYear {
  id: string;
  schoolId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface ClassSection {
  id: string;
  schoolId: string;
  academicYearId: string;
  name: string;      // e.g. "Nursery", "Class 1", "Class 10"
  section: string;   // e.g. "A", "B"
  band: GradeLevelBand;
  roomNumber?: string;
  classTeacherId?: string;
  capacity: number;
}

export interface User {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  avatarUrl?: string;
}

export interface StudentProfile {
  id: string;
  schoolId: string;
  userId: string;
  classId: string;
  rollNumber: string;
  admissionNo: string;
  dob: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  emergencyContact: string;
  user: User;
}

export interface TeacherProfile {
  id: string;
  schoolId: string;
  userId: string;
  staffId: string;
  designation: string;
  specialization: string[];
  user: User;
}

export interface GuardianLink {
  id: string;
  parentId: string;
  studentId: string;
  relation: string; // "Father", "Mother", "Legal Guardian"
  parentUser: User;
  student: StudentProfile;
}

export interface AttendanceSession {
  id: string;
  schoolId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  period: number | null; // null for Daily, 1..8 for Period-wise
  takenById: string;
  takenByName: string;
  createdAt: string;
  records: AttendanceRecord[];
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface HomeworkAssignment {
  id: string;
  schoolId: string;
  classId: string;
  subject: string;
  title: string;
  description: string;
  isActivity: boolean; // Early childhood developmental activity
  dueDate: string;
  assignedBy: string;
  createdAt: string;
  attachments: string[];
}

export interface MarkRecord {
  id: string;
  schoolId: string;
  studentId: string;
  subject: string;
  assessment: string; // e.g. "Mid-Term Examination", "Milestone 1"
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks?: string;
  isLocked?: boolean;
}

export interface AuditLog {
  id: string;
  schoolId: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  target: string;
  payload: {
    previous?: Record<string, unknown> | null;
    current?: Record<string, unknown>;
    reason?: string;
  };
  timestamp: string;
}
