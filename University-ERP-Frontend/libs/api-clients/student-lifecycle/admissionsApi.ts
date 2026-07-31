import axios from 'axios';
import { ApplicationStatusViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = 'http://localhost:5000/api/v1/admissions';

export const admissionsApi = {
  getApplicationStatus: async (studentId: string): Promise<ApplicationStatusViewModel[]> => {
    try {
      const response = await axios.get<ApplicationStatusViewModel[]>(`${BASE_URL}/status/${studentId}`);
      return response.data;
    } catch {
      // Fallback mock if backend server is not running
      return [
        {
          id: 'APP-2026-0891',
          programName: 'B.S. Computer Science & Engineering',
          status: 'Enrolled',
          submittedDate: '2026-02-15T10:00:00Z',
          missingDocuments: []
        }
      ];
    }
  }
};
