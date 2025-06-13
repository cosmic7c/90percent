export interface Student {
  id: string;
  surname: string;
  firstName: string;
  middleName?: string;
  sex: 'Male' | 'Female';
  status: 'Regular' | 'Irregular';
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  subjectCode: string;
  date: string;
  studentId: string;
  studentName: string;
  status: 'Present' | 'Absent';
  type: string;
  timestamp: string;
}

export interface Schedule {
  id: string;
  date: string;
  type: 'deadline' | 'event' | 'meeting' | 'quiz-exam' | 'presentation-day';
  title: string;
  details?: string;
  timestamp: string;
}

export interface Subject {
  code: string;
  name: string;
}

export interface SubjectClassList {
  subjectCode: string;
  students: string[];
}

export interface Announcement {
  id: string;
  subject: string;
  details: string;
  timestamp: string;
  createdAt: string;
}

export type FilterType = {
  sex: 'All' | 'Male' | 'Female';
  status: 'All' | 'Regular' | 'Irregular';
};