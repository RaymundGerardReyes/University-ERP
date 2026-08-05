import axios from 'axios';
import { StudentProfileViewModel, CourseEnrollmentViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/students';

export const studentInformationApi = {
  getProfile: async (studentId: string): Promise<StudentProfileViewModel> => {
    try {
      const response = await axios.get<StudentProfileViewModel>(`${BASE_URL}/profile/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEnrollmentHistory: async (studentId: string): Promise<CourseEnrollmentViewModel[]> => {
    try {
      const response = await axios.get<CourseEnrollmentViewModel[]>(`${BASE_URL}/enrollments/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
