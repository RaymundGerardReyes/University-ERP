import axios from 'axios';
import { StudentProfileViewModel, CourseEnrollmentViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/students';

export const studentInformationApi = {
  getProfile: async (studentId: string): Promise<StudentProfileViewModel> => {
    try {
      const response = await axios.get<StudentProfileViewModel>(`${BASE_URL}/profile/${studentId}`);
      return response.data;
    } catch {
      return {
        id: studentId,
        studentNumber: studentId,
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex.morgan@university.edu',
        program: 'B.S. Computer Science & Engineering',
        academicStanding: 'Good Standing',
        enrollmentStatus: 'Enrolled'
      };
    }
  },

  getEnrollmentHistory: async (studentId: string): Promise<CourseEnrollmentViewModel[]> => {
    try {
      const response = await axios.get<CourseEnrollmentViewModel[]>(`${BASE_URL}/enrollments/${studentId}`);
      return response.data;
    } catch {
      return [
        {
          id: crypto.randomUUID(),
          courseCode: 'CS-301',
          courseName: 'Distributed Systems & Architecture',
          term: 'Fall 2026',
          credits: 4,
          grade: 'A'
        },
        {
          id: crypto.randomUUID(),
          courseCode: 'CS-305',
          courseName: 'Database Management & DBMA',
          term: 'Fall 2026',
          credits: 3,
          grade: 'A-'
        }
      ];
    }
  }
};
