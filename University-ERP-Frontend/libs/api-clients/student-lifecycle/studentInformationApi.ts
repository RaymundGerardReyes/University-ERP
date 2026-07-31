import axios from 'axios';
import { StudentProfileViewModel, CourseEnrollmentViewModel } from '@university-erp/domain-viewmodels';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Setup auth interceptor later when auth-sdk is fully integrated
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mock_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const studentInformationApi = {
  getProfile: async (studentId: string): Promise<StudentProfileViewModel> => {
    const response = await apiClient.get<StudentProfileViewModel>(`/students/${studentId}/profile`);
    return response.data;
  },
  
  getEnrollments: async (studentId: string): Promise<CourseEnrollmentViewModel[]> => {
    const response = await apiClient.get<CourseEnrollmentViewModel[]>(`/students/${studentId}/enrollments`);
    return response.data;
  }
};
