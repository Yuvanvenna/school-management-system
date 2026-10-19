import {
  School,
  AcademicYear,
  ClassSection,
  User,
  StudentProfile,
  TeacherProfile,
  GuardianLink,
  AttendanceSession,
  HomeworkAssignment,
  MarkRecord,
  AuditLog
} from '@/types';

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'sch-001',
    name: 'Kendriya Vidyalaya Model Institute',
    code: 'KVMI-DL-104',
    district: 'New Delhi Central',
    state: 'Delhi (NCT)',
    affiliationNo: 'CBSE-GOV-2026-9921',
    establishedYear: 1984
  },
  {
    id: 'sch-002',
    name: 'State Model Senior Secondary Exemplar School',
    code: 'SMSSS-MH-401',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    affiliationNo: 'MSBSHSE-P-8841',
    establishedYear: 1992
  }
];

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay-2026',
    schoolId: 'sch-001',
    name: 'Academic Session 2026-2027',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    isCurrent: true
  },
  {
    id: 'ay-2026-sch2',
    schoolId: 'sch-002',
    name: 'Academic Session 2026-2027',
    startDate: '2026-06-15',
    endDate: '2027-04-30',
    isCurrent: true
  }
];

export const INITIAL_USERS: User[] = [
  // Admin for School 1
  {
    id: 'usr-admin-1',
    schoolId: 'sch-001',
    name: 'Dr. Rajeshwar Sharma',
    email: 'admin.delhi@gov.k10.edu.in',
    role: 'SCHOOL_ADMIN',
    isActive: true
  },
  // Principal for School 1
  {
    id: 'usr-princ-1',
    schoolId: 'sch-001',
    name: 'Smt. Anuradha Venkatraman',
    email: 'principal.delhi@gov.k10.edu.in',
    role: 'PRINCIPAL',
    isActive: true
  },
  // Teachers
  {
    id: 'usr-tch-1',
    schoolId: 'sch-001',
    name: 'Shri Vikram Malhotra',
    email: 'v.malhotra@gov.k10.edu.in',
    role: 'CLASS_TEACHER',
    isActive: true
  },
  {
    id: 'usr-tch-2',
    schoolId: 'sch-001',
    name: 'Ms. Sunita Roy',
    email: 's.roy@gov.k10.edu.in',
    role: 'TEACHER',
    isActive: true
  },
  {
    id: 'usr-tch-early',
    schoolId: 'sch-001',
    name: 'Smt. Geeta Pathak',
    email: 'g.pathak@gov.k10.edu.in',
    role: 'CLASS_TEACHER',
    isActive: true
  },
  // Parents
  {
    id: 'usr-par-1',
    schoolId: 'sch-001',
    name: 'Shri Suresh Kumar Gupta',
    email: 'skgupta.parent@gov.k10.edu.in',
    role: 'PARENT',
    isActive: true
  },
  {
    id: 'usr-par-2',
    schoolId: 'sch-001',
    name: 'Smt. Meenakshi Joshi',
    email: 'm.joshi.parent@gov.k10.edu.in',
    role: 'PARENT',
    isActive: true
  },
  // Students
  {
    id: 'usr-stu-1',
    schoolId: 'sch-001',
    name: 'Aarav Gupta',
    email: 'aarav.g@kvmi.edu.in',
    role: 'STUDENT',
    isActive: true
  },
  {
    id: 'usr-stu-2',
    schoolId: 'sch-001',
    name: 'Ananya Joshi',
    email: 'ananya.j@kvmi.edu.in',
    role: 'STUDENT',
    isActive: true
  },
  {
    id: 'usr-stu-3',
    schoolId: 'sch-001',
    name: 'Kabir Verma',
    email: 'kabir.v@kvmi.edu.in',
    role: 'STUDENT',
    isActive: true
  },
  {
    id: 'usr-stu-early-1',
    schoolId: 'sch-001',
    name: 'Vivaan Sharma',
    email: 'vivaan.s@kvmi.edu.in',
    role: 'STUDENT',
    isActive: true
  },
  {
    id: 'usr-stu-early-2',
    schoolId: 'sch-001',
    name: 'Diya Nair',
    email: 'diya.n@kvmi.edu.in',
    role: 'STUDENT',
    isActive: true
  },
  // Accountant
  {
    id: 'usr-acc-1',
    schoolId: 'sch-001',
    name: 'Shri Harish Chandran',
    email: 'accounts@kvmi.edu.in',
    role: 'ACCOUNTANT',
    isActive: true
  }
];

export const INITIAL_CLASSES: ClassSection[] = [
  {
    id: 'cls-nursery-a',
    schoolId: 'sch-001',
    academicYearId: 'ay-2026',
    name: 'Nursery',
    section: 'A',
    band: 'EARLY_YEARS',
    roomNumber: 'B-01 (Play Wing)',
    classTeacherId: 'usr-tch-early',
    capacity: 25
  },
  {
    id: 'cls-ukg-a',
    schoolId: 'sch-001',
    academicYearId: 'ay-2026',
    name: 'UKG',
    section: 'A',
    band: 'EARLY_YEARS',
    roomNumber: 'B-04 (Foundational Wing)',
    classTeacherId: 'usr-tch-early',
    capacity: 30
  },
  {
    id: 'cls-pri-3a',
    schoolId: 'sch-001',
    academicYearId: 'ay-2026',
    name: 'Class 3',
    section: 'A',
    band: 'PRIMARY',
    roomNumber: 'Block 2, Room 102',
    classTeacherId: 'usr-tch-2',
    capacity: 35
  },
  {
    id: 'cls-mid-7b',
    schoolId: 'sch-001',
    academicYearId: 'ay-2026',
    name: 'Class 7',
    section: 'B',
    band: 'MIDDLE',
    roomNumber: 'Block 3, Room 205',
    classTeacherId: 'usr-tch-1',
    capacity: 40
  },
  {
    id: 'cls-sec-10a',
    schoolId: 'sch-001',
    academicYearId: 'ay-2026',
    name: 'Class 10',
    section: 'A',
    band: 'SECONDARY',
    roomNumber: 'Block 4, Room 301',
    classTeacherId: 'usr-tch-1',
    capacity: 40
  }
];

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    id: 'sp-1',
    schoolId: 'sch-001',
    userId: 'usr-stu-1',
    classId: 'cls-sec-10a',
    rollNumber: '1001',
    admissionNo: 'ADM-2016-042',
    dob: '2010-08-14',
    gender: 'MALE',
    bloodGroup: 'B+',
    emergencyContact: '+91 98110 44321',
    user: INITIAL_USERS.find(u => u.id === 'usr-stu-1')!
  },
  {
    id: 'sp-2',
    schoolId: 'sch-001',
    userId: 'usr-stu-2',
    classId: 'cls-sec-10a',
    rollNumber: '1002',
    admissionNo: 'ADM-2016-089',
    dob: '2010-11-20',
    gender: 'FEMALE',
    bloodGroup: 'O+',
    emergencyContact: '+91 98102 33119',
    user: INITIAL_USERS.find(u => u.id === 'usr-stu-2')!
  },
  {
    id: 'sp-3',
    schoolId: 'sch-001',
    userId: 'usr-stu-3',
    classId: 'cls-sec-10a',
    rollNumber: '1003',
    admissionNo: 'ADM-2016-105',
    dob: '2010-05-04',
    gender: 'MALE',
    bloodGroup: 'A+',
    emergencyContact: '+91 98711 99022',
    user: INITIAL_USERS.find(u => u.id === 'usr-stu-3')!
  },
  {
    id: 'sp-early-1',
    schoolId: 'sch-001',
    userId: 'usr-stu-early-1',
    classId: 'cls-nursery-a',
    rollNumber: '001',
    admissionNo: 'ADM-2025-012',
    dob: '2022-03-18',
    gender: 'MALE',
    bloodGroup: 'O+',
    emergencyContact: '+91 98110 44321',
    user: INITIAL_USERS.find(u => u.id === 'usr-stu-early-1')!
  },
  {
    id: 'sp-early-2',
    schoolId: 'sch-001',
    userId: 'usr-stu-early-2',
    classId: 'cls-nursery-a',
    rollNumber: '002',
    admissionNo: 'ADM-2025-019',
    dob: '2022-07-25',
    gender: 'FEMALE',
    bloodGroup: 'A+',
    emergencyContact: '+91 98102 33119',
    user: INITIAL_USERS.find(u => u.id === 'usr-stu-early-2')!
  }
];

export const INITIAL_TEACHERS: TeacherProfile[] = [
  {
    id: 'tp-1',
    schoolId: 'sch-001',
    userId: 'usr-tch-1',
    staffId: 'GOV-TCH-2014-08',
    designation: 'Post Graduate Teacher (Mathematics & Physics)',
    specialization: ['Mathematics', 'Science', 'Information Technology'],
    user: INITIAL_USERS.find(u => u.id === 'usr-tch-1')!
  },
  {
    id: 'tp-2',
    schoolId: 'sch-001',
    userId: 'usr-tch-2',
    staffId: 'GOV-TCH-2018-44',
    designation: 'Trained Graduate Teacher (English & Social Science)',
    specialization: ['English Literature', 'Environmental Studies'],
    user: INITIAL_USERS.find(u => u.id === 'usr-tch-2')!
  },
  {
    id: 'tp-3',
    schoolId: 'sch-001',
    userId: 'usr-tch-early',
    staffId: 'GOV-TCH-2020-91',
    designation: 'Early Childhood Education Specialist',
    specialization: ['Child Development', 'Phonics & Sensory Play'],
    user: INITIAL_USERS.find(u => u.id === 'usr-tch-early')!
  }
];

export const INITIAL_GUARDIAN_LINKS: GuardianLink[] = [
  {
    id: 'glink-1',
    parentId: 'usr-par-1',
    studentId: 'sp-1', // Aarav Gupta
    relation: 'Father',
    parentUser: INITIAL_USERS.find(u => u.id === 'usr-par-1')!,
    student: INITIAL_STUDENTS.find(s => s.id === 'sp-1')!
  },
  {
    id: 'glink-2',
    parentId: 'usr-par-1',
    studentId: 'sp-early-1', // Vivaan Sharma (sibling under legal guardianship)
    relation: 'Legal Guardian',
    parentUser: INITIAL_USERS.find(u => u.id === 'usr-par-1')!,
    student: INITIAL_STUDENTS.find(s => s.id === 'sp-early-1')!
  },
  {
    id: 'glink-3',
    parentId: 'usr-par-2',
    studentId: 'sp-2', // Ananya Joshi
    relation: 'Mother',
    parentUser: INITIAL_USERS.find(u => u.id === 'usr-par-2')!,
    student: INITIAL_STUDENTS.find(s => s.id === 'sp-2')!
  }
];

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'att-sess-2026-10-19-10a',
    schoolId: 'sch-001',
    classId: 'cls-sec-10a',
    date: '2026-10-19',
    period: null, // Daily attendance
    takenById: 'usr-tch-1',
    takenByName: 'Shri Vikram Malhotra',
    createdAt: '2026-10-19T08:45:00Z',
    records: [
      { id: 'rec-1', sessionId: 'att-sess-2026-10-19-10a', studentId: 'sp-1', status: 'PRESENT' },
      { id: 'rec-2', sessionId: 'att-sess-2026-10-19-10a', studentId: 'sp-2', status: 'PRESENT' },
      { id: 'rec-3', sessionId: 'att-sess-2026-10-19-10a', studentId: 'sp-3', status: 'ABSENT', remarks: 'Medical leave requested' }
    ]
  },
  {
    id: 'att-sess-2026-10-19-nursery',
    schoolId: 'sch-001',
    classId: 'cls-nursery-a',
    date: '2026-10-19',
    period: null,
    takenById: 'usr-tch-early',
    takenByName: 'Smt. Geeta Pathak',
    createdAt: '2026-10-19T09:10:00Z',
    records: [
      { id: 'rec-n1', sessionId: 'att-sess-2026-10-19-nursery', studentId: 'sp-early-1', status: 'PRESENT' },
      { id: 'rec-n2', sessionId: 'att-sess-2026-10-19-nursery', studentId: 'sp-early-2', status: 'PRESENT' }
    ]
  }
];

export const INITIAL_HOMEWORK: HomeworkAssignment[] = [
  {
    id: 'hw-101',
    schoolId: 'sch-001',
    classId: 'cls-sec-10a',
    subject: 'Mathematics',
    title: 'Quadratic Equations Exercise 4.3 & 4.4',
    description: 'Solve questions 1 through 8 in your homework notebook. Show complete step-wise discriminant formulas.',
    isActivity: false,
    dueDate: '2026-10-22',
    assignedBy: 'Shri Vikram Malhotra',
    createdAt: '2026-10-19T10:00:00Z',
    attachments: ['Mathematics_Class10_Ch4_Worksheet.pdf']
  },
  {
    id: 'hw-102',
    schoolId: 'sch-001',
    classId: 'cls-sec-10a',
    subject: 'Science',
    title: 'Ray Optics - Reflection & Refraction Diagrams',
    description: 'Draw ray diagrams for concave and convex mirrors with distinct focal length labels.',
    isActivity: false,
    dueDate: '2026-10-23',
    assignedBy: 'Ms. Sunita Roy',
    createdAt: '2026-10-19T11:15:00Z',
    attachments: ['Ray_Optics_Practice_Sheet.pdf']
  },
  {
    id: 'act-early-01',
    schoolId: 'sch-001',
    classId: 'cls-nursery-a',
    subject: 'Sensory Play & Phonics',
    title: 'Autumn Leaf Textures & The Letter "B" Sound',
    description: 'Children explored fallen leaves of different textures and practiced phonetic sounds for "Ball", "Butterfly", and "Bird". Home observation: Encourage finding 3 circular objects.',
    isActivity: true,
    dueDate: '2026-10-21',
    assignedBy: 'Smt. Geeta Pathak',
    createdAt: '2026-10-19T12:30:00Z',
    attachments: ['Leaf_Tracing_Guide.pdf']
  }
];

export const INITIAL_MARKS: MarkRecord[] = [
  {
    id: 'mrk-1',
    schoolId: 'sch-001',
    studentId: 'sp-1', // Aarav Gupta
    subject: 'Mathematics',
    assessment: 'Term 1 Mid-Term Board Prep Exam',
    marksObtained: 76.5,
    maxMarks: 80,
    grade: 'A1',
    remarks: 'Outstanding analytical clarity in geometric proofs.',
    isLocked: true
  },
  {
    id: 'mrk-2',
    schoolId: 'sch-001',
    studentId: 'sp-1',
    subject: 'Science',
    assessment: 'Term 1 Mid-Term Board Prep Exam',
    marksObtained: 72,
    maxMarks: 80,
    grade: 'A2',
    remarks: 'Strong conceptual understanding of chemical equations.',
    isLocked: true
  },
  {
    id: 'mrk-3',
    schoolId: 'sch-001',
    studentId: 'sp-1',
    subject: 'English Language & Lit',
    assessment: 'Term 1 Mid-Term Board Prep Exam',
    marksObtained: 68.5,
    maxMarks: 80,
    grade: 'B1',
    remarks: 'Grammar and comprehension are proficient; improve formal letter format.',
    isLocked: true
  },
  {
    id: 'mrk-4',
    schoolId: 'sch-001',
    studentId: 'sp-2', // Ananya Joshi
    subject: 'Mathematics',
    assessment: 'Term 1 Mid-Term Board Prep Exam',
    marksObtained: 79,
    maxMarks: 80,
    grade: 'A1',
    remarks: 'Exemplary performance across all problem sets.',
    isLocked: true
  },
  {
    id: 'mrk-early-1',
    schoolId: 'sch-001',
    studentId: 'sp-early-1', // Vivaan Sharma (Early Years milestone rating)
    subject: 'Gross Motor Skills',
    assessment: 'Early Years Developmental Milestone 1',
    marksObtained: 9.5,
    maxMarks: 10,
    grade: 'Exemplary',
    remarks: 'Balances on one foot with high coordination, joyful participation in group circles.',
    isLocked: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    schoolId: 'sch-001',
    actorId: 'usr-admin-1',
    actorName: 'Dr. Rajeshwar Sharma',
    actorRole: 'SCHOOL_ADMIN',
    action: 'ACADEMIC_YEAR_INITIALIZED',
    target: 'AcademicYear:ay-2026',
    payload: {
      current: { name: 'Academic Session 2026-2027', startDate: '2026-04-01', endDate: '2027-03-31' },
      reason: 'Official commencement of 2026-27 state academic curriculum.'
    },
    timestamp: '2026-04-01T09:00:00Z'
  },
  {
    id: 'aud-002',
    schoolId: 'sch-001',
    actorId: 'usr-tch-1',
    actorName: 'Shri Vikram Malhotra',
    actorRole: 'CLASS_TEACHER',
    action: 'ATTENDANCE_FINALIZED',
    target: 'AttendanceSession:att-sess-2026-10-19-10a',
    payload: {
      current: { class: 'Class 10-A', presentCount: 2, absentCount: 1, sessionType: 'Daily' },
      reason: 'Morning assembly roll call locked.'
    },
    timestamp: '2026-10-19T08:50:00Z'
  },
  {
    id: 'aud-003',
    schoolId: 'sch-001',
    actorId: 'usr-tch-1',
    actorName: 'Shri Vikram Malhotra',
    actorRole: 'CLASS_TEACHER',
    action: 'MARKS_PUBLISHED_AND_LOCKED',
    target: 'MarkRecord:mrk-1',
    payload: {
      current: { student: 'Aarav Gupta', subject: 'Mathematics', marksObtained: 76.5, maxMarks: 80, grade: 'A1' },
      reason: 'Term 1 Mid-Term results approved and locked for report card generation.'
    },
    timestamp: '2026-10-19T14:10:00Z'
  }
];
