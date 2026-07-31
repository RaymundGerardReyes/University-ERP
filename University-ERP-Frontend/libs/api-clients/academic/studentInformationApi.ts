import axios from 'axios';
import { StudentProfileViewModel, EnrollmentViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = 'http://localhost:5000/api/v1/students';

export const studentInformationApi = {
  getProfile: async (studentId: string): Promise<StudentProfileViewModel> => {
    try {
      const response = await axios.get<StudentProfileViewModel>(`${BASE_URL}/profile/${studentId}`);
      return response.data;
    } catch {
      return {
        id: studentId,
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex.morgan@university.edu',
        programName: 'B.S. Computer Science & Engineering',
        currentSemester: 6,
        cgpa: 3.85,
        totalCreditsEarned: 96,
        enrollmentYear: 2023,
        phoneNumber: '+1 (555) 234-5678'
      };
    }
  },

  getEnrollments: async (studentId: string): Promise<EnrollmentViewModel[]> => {
    try {
      const response = await axios.get<EnrollmentViewModel[]>(`${BASE_URL}/enrollments/${studentId}`);
      return response.data;
    } catch {
      return [
        {
          courseCode: 'CS-301',
          courseName: 'Distributed Systems & Architecture',
          credits: 4,
          status: 'Active',
          grade: 'A'
        },
        {
          courseCode: 'CS-305',
          courseName: 'Database Management & DBMA',
          credits: 3,
          status: 'Active',
          grade: 'A-'
        }
      ];
    }
  }
};
