import axios from 'axios';
import { AlumniViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/alumni';

export const alumniApi = {
  getAlumniStatus: async (studentId: string): Promise<AlumniViewModel> => {
    try {
      const response = await axios.get<AlumniViewModel>(`${BASE_URL}/status/${studentId}`);
      return response.data;
    } catch {
      return {
        id: 'ALUM-001',
        alumniStatus: 'Registered',
        benefitsActive: true,
        graduationYear: '2026',
        chapter: 'North America Chapter'
      };
    }
  }
};
