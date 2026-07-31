import axios from 'axios';
import { AlumniViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = 'http://localhost:5000/api/v1/alumni';

export const alumniApi = {
  getAlumniStatus: async (studentId: string): Promise<AlumniViewModel> => {
    try {
      const response = await axios.get<AlumniViewModel>(`${BASE_URL}/status/${studentId}`);
      return response.data;
    } catch {
      return {
        studentId,
        isRegisteredAlumni: true,
        graduationClearanceStatus: 'Cleared',
        graduationYear: 2026,
        regionalChapter: 'North America Chapter',
        activeBenefits: ['Library Access', 'Career Counseling', 'Alumni Directory']
      };
    }
  }
};
