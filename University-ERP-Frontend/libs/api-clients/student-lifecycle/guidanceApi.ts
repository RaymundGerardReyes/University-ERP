import axios from 'axios';
import { CounselingSessionViewModel } from '@university-erp/domain-viewmodels';

const BASE_URL = '/api/v1/guidance';

export const guidanceApi = {
  getSessions: async (studentId: string): Promise<CounselingSessionViewModel[]> => {
    try {
      const response = await axios.get<CounselingSessionViewModel[]>(`${BASE_URL}/sessions/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
