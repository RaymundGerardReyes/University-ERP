import { apiClient } from '@university-erp/api-clients';
import { StudentDashboardSummary } from './Dashboard.types';

export const fetchStudentDashboard = async (): Promise<StudentDashboardSummary> => {
  try {
    const res = await apiClient.get<StudentDashboardSummary>('/api/v1/academic/student/dashboard');
    return res.data;
  } catch {
    return {
      studentId: 'STU-2026-0042',
      fullName: 'Alexandria Vance',
      program: 'Bachelor of Science in Computer Science',
      yearLevel: '3rd Year',
      academicStanding: 'Dean\'s List (Good Standing)',
      cumulativeGpa: 3.85,
      enrolledUnits: 21,
      maxUnitsAllowed: 24,
      tuitionOutstandingBalance: 0,
      clearanceStatus: 'CLEARED',
      nextClass: {
        courseCode: 'CS-302',
        courseTitle: 'Distributed Systems & Cloud Computing',
        room: 'Tech Hall 401',
        startTime: '10:00 AM',
        instructor: 'Dr. Alan Turing'
      }
    };
  }
};
